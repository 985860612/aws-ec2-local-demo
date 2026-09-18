

# 为 UEFI 安全启动创建 AWS 二进制 blob
<a name="aws-binary-blob-creation"></a>

您可以使用以下步骤在 AMI 创建期间自定义 UEFI 安全启动变量。这些步骤中使用的 KEK 截止到 2021 年 9 月。如果 Microsoft 更新 KEK，您必须使用最新的 KEK。

**要创建 AWS 二进制 blob**

1. 创建一个空的 PK 签名列表。

   ```
   touch empty_key.crt
   cert-to-efi-sig-list empty_key.crt PK.esl
   ```

1. 下载 KEK 证书。

   ```
   https://go.microsoft.com/fwlink/?LinkId=321185
   ```

1. 将 KEK 证书包装在 UEFI 签名列表中（`siglist`）。

   ```
   sbsiglist --owner 77fa9abd-0359-4d32-bd60-28f4e78f784b --type x509 --output MS_Win_KEK.esl MicCorKEKCA2011_2011-06-24.crt 
   ```

1. 下载 Microsoft 的 db 证书。

   ```
   https://www.microsoft.com/pkiops/certs/MicWinProPCA2011_2011-10-19.crt
   https://www.microsoft.com/pkiops/certs/MicCorUEFCA2011_2011-06-27.crt
   ```

1. 生成 db 签名列表。

   ```
   sbsiglist --owner 77fa9abd-0359-4d32-bd60-28f4e78f784b --type x509 --output MS_Win_db.esl MicWinProPCA2011_2011-10-19.crt
   sbsiglist --owner 77fa9abd-0359-4d32-bd60-28f4e78f784b --type x509 --output MS_UEFI_db.esl MicCorUEFCA2011_2011-06-27.crt
   cat MS_Win_db.esl MS_UEFI_db.esl > MS_db.esl
   ```

1. Unified Extensible Firmware Interface Forum 不再提供 DBX 文件。这些文件现在由 Microsoft 在 GitHub 上提供。请从 Microsoft 安全启动更新存储库下载最新的 DBX 更新，网址为 [https://github.com/microsoft/secureboot\_objects](https://github.com/microsoft/secureboot_objects)。

1. 解压已签名的更新二进制文件。

   使用下面的脚本内容创建 `SplitDbxContent.ps1`。或者，也可以使用 `Install-Script -Name SplitDbxContent` 从 [PowerShell Gallery](https://www.powershellgallery.com/packages/SplitDbxContent/1.0) 安装脚本。

   ```
   <#PSScriptInfo
    
   .VERSION 1.0
    
   .GUID ec45a3fc-5e87-4d90-b55e-bdea083f732d
    
   .AUTHOR Microsoft Secure Boot Team
    
   .COMPANYNAME Microsoft
    
   .COPYRIGHT Microsoft
    
   .TAGS Windows Security
    
   .LICENSEURI
    
   .PROJECTURI
    
   .ICONURI
    
   .EXTERNALMODULEDEPENDENCIES
    
   .REQUIREDSCRIPTS
    
   .EXTERNALSCRIPTDEPENDENCIES
    
   .RELEASENOTES
   Version 1.0: Original published version.
    
   #>
   
   <#
   .DESCRIPTION
    Splits a DBX update package into the new DBX variable contents and the signature authorizing the change.
    To apply an update using the output files of this script, try:
    Set-SecureBootUefi -Name dbx -ContentFilePath .\content.bin -SignedFilePath .\signature.p7 -Time 2010-03-06T19:17:21Z -AppendWrite'
   .EXAMPLE
   .\SplitDbxAuthInfo.ps1 DbxUpdate_x64.bin
   #>
   
   
   # Get file from script input
   $file  = Get-Content -Encoding Byte $args[0]
   
   # Identify file signature
   $chop = $file[40..($file.Length - 1)]
   if (($chop[0] -ne 0x30) -or ($chop[1] -ne 0x82 )) {
       Write-Error "Cannot find signature"
       exit 1
   }
   
   # Signature is known to be ASN size plus header of 4 bytes
   $sig_length = ($chop[2] * 256) + $chop[3] + 4
   $sig = $chop[0..($sig_length - 1)]
   
   if ($sig_length -gt ($file.Length + 40)) {
       Write-Error "Signature longer than file size!"
       exit 1
   }
   
   # Content is everything else
   $content = $file[0..39] + $chop[$sig_length..($chop.Length - 1)]
   
   # Write signature and content to files
   Set-Content -Encoding Byte signature.p7 $sig
   Set-Content -Encoding Byte content.bin $content
   ```

   使用该脚本解压缩已签名的 DBX 文件。

   ```
   PS C:\Windows\system32> SplitDbxContent.ps1 .\dbx.bin
   ```

   这会生成两个文件：`signature.p7` 和 `content.bin`。在下一步中使用 `content.bin`。

1. 使用 `uefivars.py` 脚本构建 UEFI 变量存储。

   ```
   ./uefivars.py -i none -o aws -O uefiblob-microsoft-keys-empty-pk.bin -P ~/PK.esl -K ~/MS_Win_KEK.esl --db ~/MS_db.esl  --dbx ~/content.bin 
   ```

1. 检查二进制 blob 和 UEFI 变量存储。

   ```
   ./uefivars.py -i aws -I uefiblob-microsoft-keys-empty-pk.bin -o json | less
   ```

1. 您可以通过再次将 blob 传递给同一个工具来更新它。

   ```
   ./uefivars.py -i aws -I uefiblob-microsoft-keys-empty-pk.bin -o aws -O uefiblob-microsoft-keys-empty-pk.bin -P ~/PK.esl -K ~/MS_Win_KEK.esl --db ~/MS_db.esl  --dbx ~/content.bin
   ```

   预期输出

   ```
   Replacing PK
   Replacing KEK
   Replacing db
   Replacing dbx
   ```