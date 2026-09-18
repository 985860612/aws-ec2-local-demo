

# EC2Launch v2 启动任务的任务定义
<a name="ec2launch-v2-task-definitions"></a>

EC2Launch v2 在启动期间运行的每个任务都有自己的一组属性和要求。任务详细信息包括任务运行频率的设置（一次或始终）、运行代理启动过程的哪个阶段、语法和 YAML 文档示例。有关更多信息，请查看本参考中显示的任务详细信息。

**Topics**
+ [activateWindows](#ec2launch-v2-activatewindows)
+ [enableJumboFrames](#ec2launch-v2-enablejumboframes)
+ [enableOpenSsh](#ec2launch-v2-enableopenssh)
+ [executeProgram](#ec2launch-v2-executeprogram)
+ [executeScript](#ec2launch-v2-executescript)
+ [extendRootPartition](#ec2launch-v2-extendrootpartition)
+ [initializeVolume](#ec2launch-v2-initializevolume)
+ [optimizeEna](#ec2launch-v2-optimizeena)
+ [setAdminAccount](#ec2launch-v2-setadminaccount)
+ [setDnsSuffix](#ec2launch-v2-setdnssuffix)
+ [setHostName](#ec2launch-v2-sethostname)
+ [setWallpaper](#ec2launch-v2-setwallpaper)
+ [startSsm](#ec2launch-v2-startssm)
+ [sysprep](#ec2launch-v2-task-sysprep)
+ [writeFile](#ec2-launch-v2-writefile)

## activateWindows
<a name="ec2launch-v2-activatewindows"></a>

针对一组 AWS KMS 服务器激活 Windows。如果实例被检测为自带许可（BYOL），则会跳过激活过程。

*Frequency* – 一次

*AllowedStages* – `[PreReady]`

*输入* – 

`activation`：（映射）

`type`：（字符串）使用的激活类型，设置为 `amazon`

*示例*

```
task: activateWindows
  inputs:
    activation:
    type: amazon
```

## enableJumboFrames
<a name="ec2launch-v2-enablejumboframes"></a>

启用巨型帧，这会增加网络适配器的最大传输单位 (MTU)。有关更多信息，请参阅[巨型帧 (9001 MTU)](network_mtu.md#jumbo_frame_instances)。

*Frequency* – 始终

*AllowedStages* – `[PostReady, UserData]`

*Inputs* – 无

*示例*

```
task: enableJumboFrames
```

## enableOpenSsh
<a name="ec2launch-v2-enableopenssh"></a>

启用 Windows OpenSSH 并将实例的公有密钥添加到授权密钥文件夹中。

*Frequency* – 一次

*AllowedStages* – `[PreReady, UserData]`

*Inputs* – 无

*示例*

以下示例说明如何在实例上启用 OpenSSH，以及如何将实例的公有密钥添加到授权的密钥文件夹中。此配置仅适用于运行 Windows Server 2019 及更高版本的实例。

```
task: enableOpenSsh
```

## executeProgram
<a name="ec2launch-v2-executeprogram"></a>

使用可选参数并以指定的频率运行程序。

**阶段：**您可以在 `PreReady`、`PostReady` 和 `UserData` 阶段运行 `executeProgram` 任务。

**频率：**可配置，参见*输入*。

**输入**  
本节包含一个或多个供 **executeProgram** 任务运行的程序（输入）。每个输入可能包括以下可配置设置：    
**频率（字符串）**  
（必填）确切指定以下默认值中的一项：  
+ `once`
+ `always`  
**路径（字符串）**  
（必填）要运行的可执行文件的路径。  
**参数（字符串列表）**  
（可选）以逗号分隔的参数列表，作为输入提供给程序。  
**运行为（字符串）**  
（必填）必须设置为 `localSystem`

**Output**  
所有任务都会将日志文件条目写入 `agent.log` 文件。`executeProgram` 任务的其他输出会单独存储在一个动态命名的文件夹中，如下所示：  
`%LocalAppData%\Temp\{{EC2Launch#########}}\{{outputfilename.tmp}}`  
输出文件的确切路径包含在 `agent.log` 文件中，例如：  

```
Program file is created at: C:\Windows\system32\config\systemprofile\AppData\Local\Temp\EC2Launch123456789\ExecuteProgramInputs.tmp
Output file is created at: C:\Windows\system32\config\systemprofile\AppData\Local\Temp\EC2Launch123456789\Output.tmp
Error file is created at: C:\Windows\system32\config\systemprofile\AppData\Local\Temp\EC2Launch123456789\Err.tmp
```
**`executeProgram` 任务的输出文件**    
`ExecuteProgramInputs.tmp`  
包含可执行文件的路径以及 `executeProgram` 任务将在运行时传递给该可执行文件的所有输入参数。  
`Output.tmp`  
包含 `executeProgram` 任务运行的程序的运行时系统输出。  
`Err.tmp`  
包含 `executeProgram` 任务运行的程序的运行时系统错误消息。

**示例**  
以下示例演示了如何使用 `executeProgram` 任务从实例的本地目录运行可执行文件。  
**示例 1：带有一个参数的安装程序可执行文件**  
此示例演示了一个在静默模式下运行安装程序可执行文件的 `executeProgram` 任务。

```
task: executeProgram
  inputs:
    - frequency: always
      path: C:\Users\Administrator\Desktop\setup.exe
      arguments: ['-quiet']
```
**示例 2：带有两个参数的 VLC 可执行文件**  
此示例演示了一个运行具有两个参数的 VLC 可执行文件的 `executeProgram` 任务，该任务将这两个参数作为输入参数传递。

```
task: executeProgram
  inputs:
    - frequency: always
      path: C:\vlc-3.0.11-win64.exe 
      arguments: ['/L=1033','/S']
      runAs: localSystem
```

## executeScript
<a name="ec2launch-v2-executescript"></a>

使用可选参数和指定的频率运行脚本。脚本行为取决于代理在哪种模式下运行脚本：内联或分离。

内联（默认）  
EC2Launch v2 代理一次只能运行一个脚本（`detach: false`）。这是默认设置。  
当您的内联脚本发出 **reset** 或 **sysprep** 命令时，它会立即运行并重置代理。当前任务完成，然后代理在不运行任何其他任务的情况下关闭。  
例如，如果发出命令的任务之后会有 `startSsm` 任务（默认情况下在用户数据运行后包括在内），则该任务不会运行，Systems Manager 服务也不会启动。

已分离  
EC2Launch v2 代理与其他任务同时运行脚本（`detach: true`）。  
当分离的脚本发出 **reset** 或 **sysprep** 命令时，这些命令会等待代理完成后再运行。executeScript 之后的任务仍将运行。

**阶段：**您可以在 `PreReady`、`PostReady` 和 `UserData` 阶段运行 `executeScript` 任务。

**频率：**可配置，参见*输入*。

**输入**  
本节包含一个或多个供 **executeScript** 任务运行的脚本（输入）。每个输入可能包括以下可配置设置：    
**频率（字符串）**  
（必填）确切指定以下默认值中的一项：  
+ `once`
+ `always`  
**类型（字符串）**  
（必填）确切指定以下默认值中的一项：  
+ `batch`
+ `powershell`  
**参数（字符串列表）**  
（可选）要传递给 Shell（但不是 PowerShell 脚本）的字符串参数的列表。`type: batch` 不支持此参数。如果未传递任何参数，则默认情况下，EC2Launch v2 会添加以下参数：`-ExecutionPolicy Unrestricted`。  
**内容（字符串）**  
（必填）脚本内容。  
**运行为（字符串）**  
（必填）确切指定以下默认值中的一项：  
+ `admin`
+ `localSystem`  
**分离（布尔值）**  
（可选）EC2Launch v2 代理默认每次运行一个脚本（`detach: false`）。要与其他任务同时运行脚本，请将此值设置为 `true` (`detach: true`)。  
如果将 `detach` 设置为 `true`，则脚本退出代码（包括 `3010`）不产生作用。

**Output**  
所有任务都会将日志文件条目写入 `agent.log` 文件。`executeScript` 任务运行的脚本的其他输出会单独存储在一个动态命名的文件夹中，如下所示：  
`%LocalAppData%\Temp\{{EC2Launch#########}}\{{outputfilename.ext}}`  
输出文件的确切路径包含在 `agent.log` 文件中，例如：  

```
Program file is created at: C:\Windows\system32\config\systemprofile\AppData\Local\Temp\EC2Launch123456789\UserScript.ps1
Output file is created at: C:\Windows\system32\config\systemprofile\AppData\Local\Temp\EC2Launch123456789\Output.tmp
Error file is created at: C:\Windows\system32\config\systemprofile\AppData\Local\Temp\EC2Launch123456789\Err.tmp
```
**`executeScript` 任务的输出文件**    
`UserScript.{{ext}}`  
包含 `executeScript` 任务运行的脚本。文件扩展名取决于您在 `executeScript` 任务的 `type` 参数中指定的脚本类型，如下所示：  
+ 如果类型为 `batch`，则文件扩展名为 `.bat`。
+ 如果类型为 `powershell`，则文件扩展名为 `.ps1`。  
`Output.tmp`  
包含 `executeScript` 任务运行的脚本的运行时系统输出。  
`Err.tmp`  
包含 `executeScript` 任务运行的脚本的运行时系统错误消息。

**示例**  
以下示例演示了如何使用 `executeScript` 任务运行内联脚本。  
**示例 1：Hello world 输出文本文件**  
此示例演示了一个运行 PowerShell 脚本，以在 `C:` 驱动器上创建一个“Hello world”文本文件的 `executeScript` 任务。

```
task: executeScript
  inputs:
    - frequency: always
      type: powershell
      runAs: admin
      content: |-
        New-Item -Path 'C:\PowerShellTest.txt' -ItemType File
        Set-Content 'C:\PowerShellTest.txt' "Hello world"
```
**示例 2：运行两个脚本**  
此示例说明了 `executeScript` 任务可以运行多个脚本，并且脚本类型不必一致。
第一个脚本 (`type: powershell`) 会将当前在实例上运行的进程的摘要写入 `C:` 驱动器上的一个文本文件。  
第二个脚本 (`batch`) 会将系统信息写入 `Output.tmp` 文件。  

```
task: executeScript
  inputs:
    - frequency: always
      type: powershell
      runAs: localSystem
      content: |
        Get-Process | Out-File -FilePath C:\Process.txt
    - frequency: always
      type: batch
      runAs: localSystem
      content: |
        systeminfo
```
**示例 3：重启后的幂等系统配置**  
此示例显示了一个运行一个幂等脚本来执行以下系统配置，并在每个步骤之间重新启动的 `executeScript` 任务：
+ 将计算机重命名。
+ 将计算机加入到域中。
+ 启用 Telnet。
该脚本会确保每个操作仅运行一次，从而防止循环重启并确保脚本的幂等性。  

```
task: executeScript
  inputs:
    - frequency: always
      type: powershell
      runAs: localSystem
      content: |-
        $name = $env:ComputerName
        if ($name -ne $desiredName) {
          Rename-Computer -NewName $desiredName
          exit 3010
        }
        $domain = Get-ADDomain
        if ($domain -ne $desiredDomain) 
        {
          Add-Computer -DomainName $desiredDomain
          exit 3010
        }
        $telnet = Get-WindowsFeature -Name Telnet-Client
        if (-not $telnet.Installed)
        {
          Install-WindowsFeature -Name "Telnet-Client"
          exit 3010 
        }
```

## extendRootPartition
<a name="ec2launch-v2-extendrootpartition"></a>

扩展根卷以使用磁盘上的所有可用空间。

*Frequency* – 一次

*AllowedStages* – `[Boot]`

*Inputs* – 无

*示例* 

```
task: extendRootPartition
```

## initializeVolume
<a name="ec2launch-v2-initializevolume"></a>

初始化附加到实例的空卷，以便对它们进行激活和分区。如果启动代理检测到卷不是空卷，则会跳过初始化。如果卷的前 4KiB 为空，或者卷没有 [Windows 可识别的驱动器布局](https://learn.microsoft.com/en-us/windows/win32/api/winioctl/ns-winioctl-drive_layout_information_ex)，则该卷被视为空卷。

无论驱动器是否已初始化，此任务运行时始终应用 `letter` 输入参数。

`initializeVolume` 任务执行以下操作。
+ 将磁盘属性 `offline` 和 `readonly` 设置为 false。
+ 创建分区。如果在 `partition` 输入参数中未指定分区类型，则应用以下默认值：
  + 如果磁盘大小小于 2TB，则将分区类型设置为 `mbr`。
  + 如果磁盘大小为 2TB 或更大，则将分区类型设置为 `gpt`。
+ 将卷格式设置为 NTFS。
+ 按如下方式设置卷标：
  + 使用 `name` 输入参数的值（如已指定）。
  + 如果卷是临时卷，并且未指定名称，请将卷标设置为 `Temporary Storage Z`。
+ 如果卷是临时卷（SSD 或 HDD，而不是 Amazon EBS），请在卷的根目录下创建一个包含以下内容的 `Important.txt` 文件：

  ```
  This is an 'Instance Store' disk and is provided at no additional charge.
  
  *This disk offers increased performance since it is local to the host
  *The number of Instance Store disks available to an instance vary by instance type
  *DATA ON THIS DRIVE WILL BE LOST IN CASES OF IMPAIRMENT OR STOPPING THE INSTANCE. PLEASE ENSURE THAT ANY IMPORTANT DATA IS BACKED UP FREQUENTLY
  
  For more information, please refer to: 适用于 EC2 实例的实例存储临时块存储.
  ```
+ 将驱动器号设置为 `letter` 输入参数中指定的值。

**阶段：**您可以在 `PostReady` 和 `UserData` 阶段运行 `initializeVolume` 任务。

**频率：**始终。

**输入**  
您可将运行时系统参数配置如下：    
**设备（映射列表）**  
（如有条件）启动代理初始化的每个设备的配置。当 `initialize` 输入参数设置为 `devices` 时，则为必需。  
+ **设备（字符串，必需）**- 在创建实例期间标识设备。例如，`xvdb`、`xvdf` 或 `\dev\nvme0n1`。
+ **字母（字符串，可选）**- 一个字符。要分配的驱动器号。
+ **名称（字符串，可选）**- 要分配的卷名称。
+ **分区（字符串，可选）**- 为要创建的分区类型指定以下值之一，或者让启动代理根据卷大小进行默认设置：
  + mbr
  + gpt  
**初始化（字符串）**  
（必填）确切指定以下默认值中的一项：  
+ `all`
+ `devices`

**示例**  
以下示例显示了 `initializeVolume` 任务的示例输入配置。  
**示例 1：在一个实例上初始化两个卷**  
此示例显示了一个在实例上初始化两个辅助卷的 `initializeVolume` 任务。示例中名为 `DataVolume2` 的设备是临时的。

```
task: initializeVolume
inputs:
  initialize: devices
  devices:
  - device: xvdb
    name: DataVolume1
    letter: D
    partition: mbr
  - device: /dev/nvme0n1
    name: DataVolume2
    letter: E
    partition: gpt
```

**示例 2：初始化附加到实例的 EBS 卷**  
此示例显示了一个对附加到实例的所有空 EBS 卷进行初始化的 `initializeVolume` 任务。

```
task: initializeVolume
inputs:
  initialize: all
```

## optimizeEna
<a name="ec2launch-v2-optimizeena"></a>

根据当前实例类型优化 ENA 设置；可能会重新引导实例。

*Frequency* – 始终

*AllowedStages* – `[PostReady, UserData]`

*Inputs* – 无

*示例* 

```
task: optimizeEna
```

## setAdminAccount
<a name="ec2launch-v2-setadminaccount"></a>

为在本地计算机上创建的管理员账户设置默认属性。

*Frequency* – 一次

*AllowedStages* – `[PreReady]`

*输入* – 

`name`：（字符串）管理员账户的名称

`password`：（映射）

`type`：（字符串）用于设置密码的策略，可为 `static`、`random` 或 `doNothing`

`data`：（字符串）存储数据，如果 `type` 字段为 static

*示例*

```
task: setAdminAccount
inputs:
  name: Administrator
  password:
  type: random
```

## setDnsSuffix
<a name="ec2launch-v2-setdnssuffix"></a>

将 DNS 后缀添加到搜索后缀列表中。只有尚不存在的后缀才会添加到列表中。有关启动代理如何设置 DNS 后缀的更多信息，请参阅 [为 EC2 Windows 启动代理配置 DNS 后缀](launch-agents-set-dns.md)。

*Frequency* – 始终

*AllowedStages* – `[PreReady]`

*输入* – 

`suffixes`：（字符串列表）一个或多个有效 DNS 后缀的列表；有效替换变量是 `$REGION` 和 `$AZ`

*示例*

```
task: setDnsSuffix
inputs:
  suffixes:
  - $REGION.ec2-utilities.amazonaws.com
```

## setHostName
<a name="ec2launch-v2-sethostname"></a>

将计算机的主机名设置为自定义字符串，如果未指定 `hostName`，则该值为私有 IPv4 地址。

*Frequency* – 始终

*AllowedStages* – `[PostReady, UserData]`

*输入* – 

`hostName`：（字符串）可选主机名，必须采用如下格式。
+ 必须为 15 个字符或更少
+ 必须仅包含字母数字字符（a-z、A-Z、0-9）和连字符 (-)。
+ 不能完全由数字字符组成。

`reboot`：（布尔值）表示在更改主机名时是否允许重新引导

*示例*

```
task: setHostName
inputs:
  reboot: true
```

## setWallpaper
<a name="ec2launch-v2-setwallpaper"></a>

在每个现有用户的启动文件夹中创建 `setwallpaper.lnk` 快捷方式文件，但 `Default User` 除外。当用户在实例启动后首次登录时，此快捷方式文件就会运行。使用显示实例属性的自定义壁纸设置实例。

快捷方式文件路径是：

```
$env:SystemDrive/Users/<user>/AppData/Roaming/Microsoft/Windows/Start Menu/Programs/Startup/setwallpaper.lnk
```

**注意**  
删除 `setWallpaper` 任务不会删除此快捷方式文件。有关更多信息，请参阅 [`setWallpaper` 任务未启用，但壁纸会在重新启动时重置](ec2launchv2-troubleshooting.md#ec2launchv2-troubleshooting-wallpaper-resets)。

**阶段：**您可以在 `PreReady` 和 `UserData` 阶段配置墙纸。

**频率：**`always`

**墙纸配置**  
您可以使用以下设置配置墙纸。

**输入**  
您提供的输入参数以及可设置以配置墙纸的属性：    
**路径（字符串）**  
（必需）用于墙纸图像的本地 .jpg 格式图像文件的文件名路径。  
**属性（字符串列表）**  
（可选）您可以向墙纸添加以下一项或多项属性：  
+ `architecture`
+ `availabilityZone`
+ `hostName`
+ `instanceId`
+ `instanceSize`
+ `privateIpAddress`
+ `publicIpAddress`
+ `ipv6Address`  
**InstanceTags**  
（可选）您可以仅使用以下选项之一进行此设置。  
+ **AllTags**（字符串）– 将所有实例标签添加到墙纸。

  ```
  instanceTags: AllTags
  ```
+ **InstanceTags**（字符串列表）– 指定要添加到墙纸的实例标签名称列表。例如：

  ```
  instanceTags:
    - Tag 1
    - Tag 2
  ```

**示例**  
以下示例显示墙纸配置输入（可设置墙纸背景图像文件路径）、名为 `Tag 1` 和 `Tag 2` 的实例标签，以及实例的主机名、实例 ID 及私有和公有 IP 地址等属性。

```
task: setWallpaper
inputs:
  path: C:\ProgramData\Amazon\EC2Launch\wallpaper\Ec2Wallpaper.jpg
  attributes:
  - hostName
  - instanceId
  - privateIpAddress
  - publicIpAddress
  instanceTags:
  - Tag 1
  - Tag 2
```

**注意**  
必须启用元数据中的标签，才能在墙纸上显示标签。有关实例标签和元数据的更多信息，请参阅 [使用实例元数据来查看 EC2 实例的标签](work-with-tags-in-IMDS.md)。

## startSsm
<a name="ec2launch-v2-startssm"></a>

在 Sysprep 之后启动 Systems Manager (SSM) 服务。

*Frequency* – 始终

*AllowedStages* – `[PostReady, UserData]`

*Inputs* – 无

*示例*

```
task: startSsm
```

## sysprep
<a name="ec2launch-v2-task-sysprep"></a>

重置服务状态、更新 `unattend.xml`、禁用 RDP 并运行 Sysprep。此任务仅在所有其他任务完成后才会运行。

*Frequency* – 一次

*AllowedStages* – `[UserData]`

*输入* – 

`clean`：（布尔值）在运行 Sysprep 之前清理实例日志

`shutdown`：（布尔值）在运行 Sysprep 后关闭实例

*示例*

```
task: sysprep
inputs:
clean: true
shutdown: true
```

## writeFile
<a name="ec2-launch-v2-writefile"></a>

将文件写入目标。

*Frequency* – 请参阅 *Inputs*

*AllowedStages* – `[PostReady, UserData]`

*输入* – 

`frequency`：（字符串）`once` 或 `always` 之一

`destination`：（字符串）写入内容的路径

`content`：（字符串）要写入目标的文本

*示例*

```
task: writeFile
inputs:
  - frequency: once
  destination: C:\Users\Administrator\Desktop\booted.txt
  content: Windows Has Booted
```