

# 使用 SSH 或 GUI 连接到 Mac 实例
<a name="connect-to-mac-instance"></a>

您可以使用 SSH 或图形用户界面（GUI）连接到 Mac 实例。

多个用户可以同时访问操作系统。由于端口 5900 上有内置的屏幕共享服务，通常会出现 1:1 的 user:GUI 会话。在 macOS 中使用 SSH 支持多个会话，上限为 `sshd_config` 文件中规定的“最大会话数”限制。

## 使用 SSH 连接到您的实例。
<a name="mac-instance-ssh"></a>

默认情况下，Amazon EC2 Mac 实例不允许远程根 SSH。ec2-user 账户已配置为使用 SSH 远程登录。ec2-user 账户也具有 **sudo** 权限。连接到实例后，您可以添加其他用户。

要支持使用 SSH 连接到您的实例，请使用密钥对和允许 SSH 访问的安全组启动实例，并确保实例具有互联网连接。连接到实例时，您可以提供密钥对的 `.pem` 文件。

通过以下过程使用 SSH 客户端连接到您的 Mac 实例。如果您在尝试连接到实例时收到错误，请参阅 [排查 Amazon EC2 Linux 实例的连接问题](TroubleshootingInstancesConnecting.md)。

**使用 SSH 连接到您的实例**

1. 通过在命令行输入 **ssh**，验证您的本地计算机是否安装了 SSH 客户端。如果您的计算机无法识别该命令，请为操作系统搜索 SSH 客户端并进行安装。

1. 获得实例的公有 DNS 名称。使用 Amazon EC2 控制台，您可以在 **Details (详细信息)** 和 **Networking (联网)** 选项卡上找到公有 DNS 名称。通过使用 [ cribe-instances ](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instances.html) 命令 AWS CLI，您可以找到公有 DNS 名称。

1. 找到您在启动实例时指定的密钥对的 `.pem` 文件。

1. 使用以下 **ssh** 命令连接到您的实例，请指定实例和 `.pem` 文件的公有 DNS 名称。

   ```
   ssh -i {{/path/key-pair-name}}.pem ec2-user@{{instance-public-dns-name}}
   ```

密码验证已禁用，以防止强力 (brute-force) 密码攻击。在更改 SSH 配置之前，请打开 `/usr/local/aws/ec2-macos-init/init.toml` 并将 `secureSSHDConfig` 设置为 `false`。

## 连接到您实例的图形用户界面（GUI）
<a name="mac-instance-vnc"></a>

按照以下程序，使用 VNC、Apple Remote Desktop（ARD）或 Apple Screen Sharing 应用程序（macOS 中附带）连接到您实例的 GUI。

**注意**  
macOS 10.14 及更高版本仅允许控制是否通过[系统首选项](https://support.apple.com/guide/remote-desktop/enable-remote-management-apd8b1c65bd/mac)启用屏幕共享。

**使用 ARD 客户端或 VNC 客户端连接到实例**

1. 验证本地计算机是否安装了 ARD 客户端或支持 ARD 的 VNC 客户端。在 macOS 上，您可以利用内置的屏幕共享应用程序。否则，请搜索适用于您的操作系统的 ARD，然后进行安装。

1. 从本地计算机上，[使用 SSH 连接到实例](#mac-instance-ssh)。

1. 使用 **passwd** 命令为 ec2-user 账户设置密码，如下所示。

   ```
   [ec2-user ~]$ sudo passwd ec2-user
   ```

1. 使用以下命令安装并启动 macOS 屏幕共享。

   ```
   [ec2-user ~]$ sudo launchctl enable system/com.apple.screensharing
   sudo launchctl load -w /System/Library/LaunchDaemons/com.apple.screensharing.plist
   ```

1. 键入 **exit**，然后按下回车键，从而将实例断开连接。

1. 在计算机上，使用以下 **ssh** 命令连接到您的实例。除了上一部分中显示的选项外，还可以使用 **-L** 选项启用端口转发并将本地端口 5900 上的所有流量转发到实例上的 ARD 服务器。

   ```
   ssh -L 5900:localhost:5900 -i {{/path/key-pair-name}}.pem ec2-user@{{instance-public-dns-name}}
   ```

1. 从本地计算机上，使用 ARD 客户端或支持 ARD 的 VNC 客户端连接到 `localhost:5900`。例如，在 macOS 上使用屏幕共享应用程序，如下所示：

   1. 打开**查找器**并选择**前往**。

   1. 选择**连接到服务器**。

   1. 在**服务器地址**字段中，输入 `vnc://localhost:5900`。

   1. 根据提示登录，将 **ec2-user** 用作为 ec2-user 账户创建的用户名和密码。

## 在 Mac 实例上修改 macOS 屏幕分辨率
<a name="mac-screen-resolution"></a>

使用 ARD 或支持此 ARD 的 VNC 客户端连接到 EC2 Mac 实例后，您可以使用任何公开提供的 macOS 工具或实用程序（例如 [displayplacer](https://github.com/jakehilborn/displayplacer)）修改 macOS 环境的屏幕分辨率。

**使用 displayplacer 修改屏幕分辨率**

1. 安装 displayplacer。

   ```
   [ec2-user ~]$ brew tap jakehilborn/jakehilborn && brew install displayplacer
   ```

1. 显示当前屏幕信息和可能的屏幕分辨率。

   ```
   [ec2-user ~]$ displayplacer list
   ```

1. 应用所需的屏幕分辨率。

   ```
   [ec2-user ~]$ displayplacer "id:<screenID> res:<width>x<height> origin:(0,0) degree:0"
   ```

   例如：

   ```
   RES="2560x1600"
   displayplacer "id:69784AF1-CD7D-B79B-E5D4-60D937407F68 res:${RES} scaling:off origin:(0,0) degree:0"
   ```