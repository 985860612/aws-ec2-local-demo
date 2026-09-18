

# 使用 Windows Sysprep 和 EC2Launch 创建 AMI
<a name="ec2launch-sysprep"></a>

当您从安装了 EC2Launch 代理的实例创建映像时，EC2Launch 会在准备映像时执行特定的任务。这包括使用 Windows Sysprep。有关更多信息，请参阅 [Windows Sysprep 阶段](ami-create-win-sysprep.md#sysprep-phases)。

EC2Launch 为 Windows Sysprep 提供一个默认应答文件和批处理文件，来自动执行并保护 AMI 上的映像准备过程。您可以选择性地修改这些文件。这些文件默认位于以下目录：`C:\ProgramData\Amazon\EC2-Windows\Launch\Sysprep`。

**重要**  
不要使用 Windows Sysprep 创建实例备份。Windows Sysprep 会删除系统特定的信息。如果您删除此信息，可能会给实例备份带来意想不到的后果。

**Topics**
+ [用于 Windows Sysprep 的 EC2Launch 应答文件和批处理文件](#ec2launch-sysprep-answer-batch)
+ [使用 EC2Launch 运行 Windows Sysprep](#ec2launch-sysprep-running)
+ [在启动自定义 AMI 时更新 Server 2016 及更高版本的元数据/KMS 路由](#update-metadata-KMS)

## 用于 Windows Sysprep 的 EC2Launch 应答文件和批处理文件
<a name="ec2launch-sysprep-answer-batch"></a>

用于 Windows Sysprep 的 EC2Launch 应答文件和批处理文件包括：

`Unattend.xml`  
这是默认应答文件。如果您运行 `SysprepInstance.ps1` 或者在用户界面中选择 **ShutdownWithSysprep**，系统会从该文件中读取设置。

`BeforeSysprep.cmd`  
自定义此批处理文件，以便在 EC2Launch 运行 Windows Sysprep 前执行命令。

`SysprepSpecialize.cmd`  
自定义此批处理文件，以便在 Windows Sysprep 专门化阶段期间运行命令。

## 使用 EC2Launch 运行 Windows Sysprep
<a name="ec2launch-sysprep-running"></a>

在 Windows Server 2016 及更高版本的完整安装（带有桌面体验）上，可以通过手动方式使用 EC2Launch 运行 Windows Sysprep，也可以通过 **EC2Launch Settings** 应用程序运行 Windows Sysprep。

**使用 EC2Launch Settings 应用程序运行 Windows Sysprep**

1. 在 Amazon EC2 控制台中，找到或创建 Windows Server 2016 或更高版本 AMI。

1. 从该 AMI 中启动 Windows 实例。

1. 连接到您的 Windows 实例并对其进行自定义。

1. 搜索并运行 **EC2LaunchSettings** 应用程序。默认情况下它位于以下内容：`C:\ProgramData\Amazon\EC2-Windows\Launch\Settings`。  
![EC2 Launch Settings 应用程序。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/ec2launch-sysprep.png)

1. 根据需要选中或清除选项。这些设置存储在 `LaunchConfig.json` 文件中。

1. 对于 **Administrator Password**，请执行以下操作之一：
   + 选择 **Random**。EC2Launch 生成一个密码并使用用户的密钥对其进行加密。系统会在实例启动后禁用此设置，以便在重新启动或停止再启动实例后该密码仍然存在。
   + 选择 **Specify** 并键入一个符合系统要求的密码。该密码以明文方式存储在 `LaunchConfig.json` 文件中，并且在 Windows Sysprep 设置管理员密码时会被删除。如果现在就关闭，则会立即设置密码。EC2Launch 使用用户的密钥对密码进行加密。
   + 选择 **DoNothing** 并在 `unattend.xml` 文件中指定密码。如果未在 `unattend.xml` 中指定密码，管理员账户会被禁用。

1. 选择 **Shutdown with Sysprep (使用 Sysprep 关闭)**。

**使用 EC2Launch 手动运行 Windows Sysprep**

1. 在 Amazon EC2 控制台中找到或创建您要复制的 Windows Server 2016 或更高版本数据中心版 AMI。

1. 启动并连接到您的 Windows 实例。

1. 自定义实例。

1. 在 `LaunchConfig.json` 文件中指定设置。默认情况下，该文件位于 `C:\ProgramData\Amazon\EC2-Windows\Launch\Config` 目录中。

   对于 `adminPasswordType`，请指定下列值之一：  
`Random`  
EC2Launch 生成一个密码并使用用户的密钥对其进行加密。系统会在实例启动后禁用此设置，以便在重新启动或停止再启动实例后该密码仍然存在。  
`Specify`  
EC2Launch 使用您在 `adminPassword` 中指定的密码。如果密码不满足系统要求，EC2Launch 会生成随机密码。该密码以明文方式存储在 `LaunchConfig.json` 文件中，并且在 Windows Sysprep 设置管理员密码时会被删除。EC2Launch 使用用户的密钥对密码进行加密。  
`DoNothing`  
EC2Launch 使用您在 `unattend.xml` 文件中指定的密码。如果未在 `unattend.xml` 中指定密码，管理员账户会被禁用。

1. (可选) 在 `unattend.xml` 和其他配置文件中指定设置。如果您计划参与安装，则无需在这些文件中进行更改。这些文件默认位于以下目录：`C:\ProgramData\Amazon\EC2-Windows\Launch\Sysprep`。

1. 在 Windows PowerShell 中，运行 `./InitializeInstance.ps1 -Schedule`。默认情况下，该脚本位于以下目录中：`C:\ProgramData\Amazon\EC2-Windows\Launch\Scripts`。该脚本安排实例在下次启动期间初始化。您必须先运行此脚本，然后再在下一个步骤中运行 `SysprepInstance.ps1` 脚本。

1. 在 Windows PowerShell 中，运行 `./SysprepInstance.ps1`。默认情况下，该脚本位于以下目录中：`C:\ProgramData\Amazon\EC2-Windows\Launch\Scripts`。

您会退出实例并且实例会关闭。如果您在 Amazon EC2 控制台中查看**实例**页面，实例状态会从 `Running` 变为 `Stopping`，然后变为 `Stopped`。此时，从该实例创建 AMI 是安全的。

## 在启动自定义 AMI 时更新 Server 2016 及更高版本的元数据/KMS 路由
<a name="update-metadata-KMS"></a>

要在启动自定义 AMI 时更新 Server 2016 及更高版本的元数据/KMS 路由，请执行下列操作之一：
+ 运行 EC2LaunchSettings GUI (C:\\ProgramData\\Amazon\\EC2-Windows\\Launch\\Settings\\Ec2LaunchSettings.exe)，并选择相应选项以便在使用 Windows Sysprep 的情况下关闭。
+ 在创建 AMI 之前，运行 EC2LaunchSettings，并在未使用 Windows Sysprep 的情况下关闭。这会将 EC2 启动初始化任务设置为在下次引导时运行，从而根据实例的子网设置路由。
+ 在从 [PowerShell](ec2launch-config.md#ec2launch-inittasks) 创建 AMI 之前，手动重新计划 EC2 启动初始化任务。
**重要**  
在重新计划任务之间记录默认的密码重置行为。
+ 要在发生 Windows 激活失败或与实例元数据通信失败的正在运行的实例上更新路由，请参阅[“无法激活 Windows”](common-messages.md#activate-windows)。