

# 为您的 Amazon EC2 实例创建密钥对
<a name="create-key-pairs"></a>

您可以使用 Amazon EC2 创建密钥对，或者可以使用第三方工具创建密钥对，然后将它们导入 Amazon EC2。

Amazon EC2 支持适用于 Linux 和 Windows 实例的 2048 位 SSH-2 RSA 密钥。Amazon EC2 还支持 Linux 实例的 ED25519 密钥。

有关在创建密钥对后如何连接到实例的说明，请参阅[使用 SSH 连接到 Linux 实例](connect-to-linux-instance.md)和[使用 RDP 连接到 Windows 实例](connecting_to_windows_instance.md)。

**Topics**
+ [使用 Amazon EC2 创建密钥对](#having-ec2-create-your-key-pair)
+ [使用 AWS CloudFormation 创建密钥对](#create-key-pair-cloudformation)
+ [使用第三方工具创建密钥对，并将公有密钥导入 Amazon EC2](#how-to-generate-your-own-key-and-import-it-to-aws)

## 使用 Amazon EC2 创建密钥对
<a name="having-ec2-create-your-key-pair"></a>

当您使用 Amazon EC2 创建密钥对时，公有密钥将存储在 Amazon EC2 中，您需要存储私有密钥。

您最多可以为每个区域创建 5000 个密钥对。要申请增加，请创建支持案例。有关更多信息，请参阅 *支持 用户指南*中的[创建支持案例](https://docs.aws.amazon.com/awssupport/latest/user/case-management.html#creating-a-support-case)。

------
#### [ Console ]

**要使用 Amazon EC2 创建密钥对**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中的 **Network & Security** 下，选择 **Key Pairs**。

1. 选择 **Create key pair (创建密钥对)**。

1. 对于 **Name (名称)**，为模板输入一个描述性名称。Amazon EC2 将公有密钥与您指定的密钥名称相关联。密钥名称最多可包含 255 个 ASCII 字符。它不能包含前导空格或尾随空格。

1. 选择适合您操作系统的密钥对类型：

   （Linux 实例）对于**密钥对类型**，选择 **RSA** 或者 **ED25519**。

   （Windows 实例）对于**密钥对类型**，请选择 **RSA**。Windows 实例不支持 **ED25519** 密钥。

1. 对于 **Private key file format**（私有密钥文件格式），选择要保存私有密钥的格式。要以可与 OpenSSH 一起使用的格式保存私有密钥，请选择 **pem**。要以可与 PuTTY 一起使用的格式保存私有密钥，请选择 **ppk**。

1. 要添加标签到公有密钥，请选择 **Add tag**（添加标签），然后输入标签的键和值。对每个标签重复此操作。

1. 选择 **Create key pair (创建密钥对)**。

1. 您的浏览器会自动下载私有密钥文件。基本文件名是指定为密钥对名称的名称，文件扩展名由您选择的文件格式确定。将私有密钥文件保存在安全位置。
**重要**  
这是您保存私有密钥文件的唯一机会。

1. 如果您计划在 macOS 或 Linux 计算机上使用 SSH 客户端连接到 Linux 实例，请使用以下命令设置私有密钥文件的权限，以确保只有您可以读取该文件。

   ```
   chmod 400 {{key-pair-name}}.pem
   ```

   如果不设置这些权限，则无法使用此密钥对连接到实例。有关更多信息，请参阅 [错误：未保护的私有密钥文件](TroubleshootingInstancesConnecting.md#troubleshoot-unprotected-key)。

------
#### [ AWS CLI ]

**要使用 Amazon EC2 创建密钥对**

1. 按如下方式使用 [create-key-pair](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-key-pair.html) 命令生成密钥对，并将私有密钥保存到 `.pem` 文件中。`--query` 选项会将私有密钥材料打印到输出中。`--output` 选项会将私有密钥材料保存到指定的文件中。扩展名应为 `.pem` 或 `.ppk`，具体取决于密钥格式。私有密钥名称可以与公有密钥名称不同，但为方便起见，建议使用相同的名称。

   ```
   aws ec2 create-key-pair \
       --key-name {{my-key-pair}} \
       --key-type {{rsa}} \
       --key-format {{pem}} \
       --query "KeyMaterial" \
       --output text > {{my-key-pair.pem}}
   ```

1. 如果您计划在 macOS 或 Linux 计算机上使用 SSH 客户端连接到 Linux 实例，请使用以下命令设置私有密钥文件的权限，以确保只有您可以读取该文件。

   ```
   chmod 400 {{key-pair-name}}.pem
   ```

   如果不设置这些权限，则无法使用此密钥对连接到实例。有关更多信息，请参阅 [错误：未保护的私有密钥文件](TroubleshootingInstancesConnecting.md#troubleshoot-unprotected-key)。

------
#### [ PowerShell ]

**要使用 Amazon EC2 创建密钥对**  
按如下所示使用 [New-EC2KeyPair](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2KeyPair.html) cmdlet 生成密钥，并将其保存到 `.pem` 或 `.ppk` 文件中。**Out-File** cmdlet 会将私有密钥材料保存到具有指定扩展名的文件中。扩展名应为 `.pem` 或 `.ppk`，具体取决于密钥格式。私有密钥名称可以与公有密钥名称不同，但为方便起见，建议使用相同的名称。

```
(New-EC2KeyPair `
    -KeyName "{{my-key-pair}}" `
    -KeyType "{{rsa}}" `
    -KeyFormat "{{pem}}").KeyMaterial | Out-File -Encoding ascii -FilePath {{C:\path\my-key-pair}}.pem
```

------

## 使用 AWS CloudFormation 创建密钥对
<a name="create-key-pair-cloudformation"></a>

当您使用 CloudFormation 创建新的密钥对时，私有密钥会保存到 AWS Systems Manager Parameter Store。参数名称有以下形式：

```
/ec2/keypair/{{key_pair_id}}
```

有关更多信息，请参阅《AWS Systems Manager 用户指南》**中的 [AWS Systems Manager Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html)。

**使用 CloudFormation 创建密钥对**

1. 在您的模板中指定 [AWS::EC2::KeyPair](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-keypair.html) 资源。

   ```
   Resources:
     NewKeyPair:
       Type: 'AWS::EC2::KeyPair'
       Properties: 
         KeyName: new-key-pair
   ```

1. 按如下方式使用 [describe-key-pairs](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-key-pairs.html) 命令获取密钥对的 ID。

   ```
   aws ec2 describe-key-pairs --filters Name=key-name,Values={{new-key-pair}} --query KeyPairs[*].KeyPairId --output text
   ```

   下面是示例输出。

   ```
   key-05abb699beEXAMPLE
   ```

1. 按如下方式使用 [get-parameter](https://docs.aws.amazon.com/cli/latest/reference/ssm/get-parameter.html) 命令获取密钥的参数，并将密钥材料保存在 `.pem` 文件中。

   ```
   aws ssm get-parameter --name /ec2/keypair/{{key-05abb699beEXAMPLE}} --with-decryption --query Parameter.Value --output text > {{new-key-pair.pem}}
   ```

**所需的 IAM 权限**

要启用 CloudFormation 以代表您管理 Parameter Store 参数，由 CloudFormation 或您用户担任的 IAM 角色必须拥有以下权限：
+ `ssm:PutParameter` – 授予权限以创建私有密钥材料的参数。
+ `ssm:DeleteParameter` – 授予权限以删除存储私有密钥材料的参数。无论密钥对是由 CloudFormation 导入还是创建的，都需要此权限。

当 CloudFormation 删除由堆栈创建或导入的密钥对时，它会执行权限检查，以确定您是否有权删除参数，即使 CloudFormation 仅在创建密钥对而非导入密钥对时才创建参数。CloudFormation 使用与您账户中的任何参数都不匹配的虚构参数名称测试所需的权限。因此，您可能会在 `AccessDeniedException` 错误消息中看到虚构的参数名称。

## 使用第三方工具创建密钥对，并将公有密钥导入 Amazon EC2
<a name="how-to-generate-your-own-key-and-import-it-to-aws"></a>

如果不使用 Amazon EC2 创建密钥对，则可以使用第三方工具创建一个 RSA 或 ED25519 密钥对，然后将公有密钥导入 Amazon EC2。

**密钥对的要求**
+ 支持的类型：
  + （Linux 和 Windows）RSA
  + （仅限 Linux）ED25519
**注意**  
Windows 实例不支持 ED25519 密钥。
  + Amazon EC2 不接受 DSA 密钥。
+ 支持的格式：
  + OpenSSH 公有密钥格式（对于 Linux，格式为 `~/.ssh/authorized_keys`）。
  + （仅限 Linux）如果您在使用 EC2 Instance Connect API 时使用 SSH 进行连接，则也支持 SSH2 格式。
  + SSH 私有密钥文件格式必须为 PEM 或 PPK
  + （仅 RSA）Base64 编码的 DER 格式
  + （仅 RSA）SSH 公有密钥文件格式如 [RFC 4716](https://www.ietf.org/rfc/rfc4716.txt) 所指定
+ 支持的长度：
  + 1024、2048 和 4096。
  + （仅限 Linux）如果您在使用 EC2 Instance Connect API 时使用 SSH 进行连接，则支持的长度为 2048 和 4096。

**要使用第三方工具创建密钥对**

1. 使用您选择的第三方工具生成密钥对。例如，您可以使用 **ssh-keygen**（通过标准 OpenSSH 安装提供的工具）。也可以使用 Java、Ruby、Python 以及多种其他提供标准库的编程语言来创建密钥对。
**重要**  
私有密钥必须采用 PEM 或 PPK 格式。例如，使用 `ssh-keygen -m PEM` 生成 PEM 格式的 OpenSSH 密钥。

1. 将公有密钥保存至本地文件。例如，`~/.ssh/my-key-pair.pub`（Linux、macOS）或 `C:\keys\my-key-pair.pub`（Windows）。此文件的文件扩展名并不重要。

1. 将私有密钥保存至扩展名为 `.pem` 或 `.ppk` 的本地文件。例如，`~/.ssh/my-key-pair.pem` 或 `~/.ssh/my-key-pair.ppk`（Linux、macOS）或 `C:\keys\my-key-pair.pem` 或 `C:\keys\my-key-pair.ppk`（Windows）。文件扩展名很重要，因为根据您用来连接实例的工具不同，您将需要特定的文件格式。OpenSSH 需要一个 `.pem` 文件，而 PuTTY 需要一个 `.ppk` 文件。
**重要**  
将私有密钥文件保存在安全位置。当您启动实例时，您将需要提供公有密钥的名称；当您每次连接到实例时，您将需要提供相应的私有密钥。

创建密钥对后，使用以下方法之一将公有密钥导入到 Amazon EC2。

------
#### [ Console ]

**要将公有密钥导入至 Amazon EC2**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Key Pairs (密钥对)**。

1. 选择 **Import key pair (导入密钥对)**。

1. 对于 **Name**（名称），为公有密钥输入一个描述性名称。该名称最多可包含 255 个 ASCII 字符。它不能包含前导空格或尾随空格。
**注意**  
当您从 EC2 控制台连接到实例时，控制台会建议使用此名称作为私有密钥文件的名称。

1. 选择 **Browse (浏览)** 以导航到您的公有密钥并选择它，或者将公有密钥的内容粘贴到 **Public key contents (公有密钥内容)** 字段中。

1. 选择 **Import key pair (导入密钥对)**。

1. 验证您导入的公有密钥是否显示在密钥对列表中。

------
#### [ AWS CLI ]

**要将公有密钥导入至 Amazon EC2**  
使用 [import-key-pair](https://docs.aws.amazon.com/cli/latest/reference/ec2/import-key-pair.html) 命令。

```
aws ec2 import-key-pair \
    --key-name {{my-key-pair}} \
    --public-key-material fileb://{{path}}/{{my-key-pair.pub}}
```

**验证密钥对是否已成功导入**  
使用 [describe-key-pairs](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-key-pairs.html) 命令。

```
aws ec2 describe-key-pairs --key-names {{my-key-pair}}
```

------
#### [ PowerShell ]

**要将公有密钥导入至 Amazon EC2**  
使用 [Import-EC2KeyPair](https://docs.aws.amazon.com/powershell/latest/reference/items/Import-EC2KeyPair.html) cmdlet。

```
$publickey=[Io.File]::ReadAllText("C:\Users\TestUser\.ssh\id_rsa.pub")
Import-EC2KeyPair `
    -KeyName {{my-key-pair}} `
    -PublicKey $publickey
```

**验证密钥对是否已成功导入**  
使用 [Get-EC2KeyPair](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2KeyPair.html) cmdlet。

```
Get-EC2KeyPair -KeyName {{my-key-pair}}
```

------