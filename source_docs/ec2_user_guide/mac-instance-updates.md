

# 更新 Amazon EC2 Mac 实例上的操作系统和软件
<a name="mac-instance-updates"></a>

以下主题说明了如何在 Apple silicon Mac 实例（Mac2、Mac2-m1ultra、Mac2-m2、Mac2-m2pro、Mac-m4 和 Mac-m4pro）和采用 x86 架构的 Mac 实例（Mac1）上更新操作系统和软件。

**警告**  
测试版或预览版 macOS 只能在 Apple silicon Mac 实例上安装。Amazon EC2 不限定 macOS 的测试版或预览版，也不保证实例在更新到预生产版本 macOS 后仍能正常运行。  
在停止或终止实例后，试图在 Amazon EC2 x86 Mac 实例上安装测试版或预览版 macOS 将导致 Amazon EC2 Mac 专属主机性能下降，并且会阻止您开启该主机或在该主机上启动新实例。

**注意**  
如果您在 AWS 发布官方 AMI 之前执行就地 macOS 更新，则更新仅会应用于选定的主机。如果您有其他主机，或者启动了新主机，则还必须在这些主机上执行相同的更新过程。每个 macOS 版本都必须在底层 Apple Mac 硬件上安装最低固件版本才能成功启动。就地更新仅会更新选定主机上的固件，而不会传递到其他现有主机或新主机。要确定哪些 macOS 版本与您的 Amazon EC2 Mac 专属主机兼容，请参阅[查找 Amazon EC2 Mac 专属主机支持的 macOS 版本](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/macos-firmware-visibility.html)。

**Topics**

## 在 Apple silicon Mac 实例上更新软件
<a name="mac2"></a>

### 先决条件
<a name="mac2-ena-update"></a>

由于网络驱动程序配置更新的原因，ENA 驱动程序版本 1.0.2 与 macOS 13.3 及更高版本不兼容。如果要安装任何测试版、预览版或正式版 macOS 13.3 或更高版本，并且尚未安装最新的 ENA 驱动程序，请按照以下步骤安装新版本的驱动程序。

**安装新版本的 ENA 驱动程序**

1. 在终端窗口中，使用 [SSH](connect-to-mac-instance.md#mac-instance-ssh) 连接到 Apple silicon Mac 实例。

1. 使用下面的命令更新 Homebrew 并将 ENA 应用程序下载到 `Applications` 文件中。

   ```
   [ec2-user ~]$ brew update
   ```

   ```
   [ec2-user ~]$ brew install amazon-ena-ethernet-dext
   ```

1. 键入 **exit**，然后按下回车键，从而将实例断开连接。

1. 使用 VNC 客户端激活 ENA 应用程序。

   1. 使用 [连接到您实例的图形用户界面（GUI）](connect-to-mac-instance.md#mac-instance-vnc) 设置 VNC 客户端。

   1. 使用屏幕共享应用程序连接到实例后，请转到 **Applications** 文件夹并打开 ENA 应用程序。

   1. 选择**激活**。

   1. 要确认已正确激活驱动程序，请在终端窗口中运行以下命令。命令的输出将显示旧驱动程序处于正在终止状态，而新驱动程序处于已激活状态。

      ```
      systemextensionsctl list;
      ```

   1. 重启实例后，将仅出现新驱动程序。

### 执行软件更新
<a name="mac2-software-update"></a>

在 Apple silicon Mac 实例上，您必须完成几个步骤才能执行就地操作系统更新。这包括将 Amazon EBS 根卷的所有权委托给 EBS 根卷管理员用户。您可以选择使用 Amazon EC2 API 来自动执行此操作，也可以通过在实例上运行命令手动执行此操作。

------
#### [ Automated volume ownership delegation (Recommended) ]

**注意事项**
+ 完成卷所有权委托任务可能需要 30 到 90 分钟时间。在此期间，该实例将无法访问。
+ 支持以下 macOS 版本：
  + **Mac2 \| Mac2-m1ultra** – macOS Ventura（版本 13.0 或更高版本）
  + **Mac2-m2 \| Mac2-m2pro** – macOS Ventura（版本 13.2 或更高版本）
  + **Mac-m4 \| Mac-m4pro**：macOS Sequoia（版本 15.6 或更高版本）
+ 实例必须只有一个可引导卷，并且每个挂载卷只能有一个额外的管理员用户。

**第 1 步：为 EBS 根卷管理员用户设置密码并启用安全令牌**

您必须为 Amazon EBS 根卷管理员用户 (`ec2-user`) 设置密码并启用安全令牌。
**注意**  
密码和安全令牌将在您首次使用 GUI 连接到 Apple silicon Mac 实例时设置。如果您之前[使用 GUI 连接到实例](connect-to-mac-instance.md#mac-instance-vnc)，则**无需**执行这些步骤。

1. [使用 SSH 连接到实例](connect-to-mac-instance.md#mac-instance-ssh)。

1. 为 `ec2-user` 用户设置密码。

   ```
   $ sudo /usr/bin/dscl . -passwd /Users/ec2-user
   ```

1. 为 `ec2-user` 用户启用安全令牌。对于 `-oldPassword`，请指定与上一步中相同的密码。对于 `-newPassword`，请指定一个不同的密码。以下命令假定您已将旧密码和新密码保存在 `.txt` 文件中。

   ```
   $ sysadminctl -oldPassword `cat old_password.txt` -newPassword `cat new_password.txt`
   ```

1. 确认已启用安全令牌。

   ```
   $ sysadminctl -secureTokenStatus ec2-user
   ```

**第 2 步：将 Amazon EBS 根卷的所有权委托给 EBS 根卷管理员用户**

必须创建卷所有权委托任务后才能委托所有权。

1. 请使用 [create-delegate-mac-volume-ownership-task](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-delegate-mac-volume-ownership-task.html) 命令创建此任务。对于 `--instance-id`，请指定实例 ID。对于 `--mac-credentials`，请指定以下凭证：
   + **内部磁盘管理员用户**
     + **用户名**：仅支持默认管理员用户 (`aws-managed-user`)，并且默认使用该用户。不能指定其他管理员用户。
     + **密码**：如果没有更改 `aws-managed-user` 的默认密码，请指定默认密码，即*空*。否则请指定您的密码。
   + **Amazon EBS 根卷管理员用户**
     + **用户名**：如果未更改默认管理员用户，请指定 `ec2-user`。否则指定您的管理员用户的用户名。
     + **密码**：指定您在上文第 1 步中为根卷管理员用户设置的密码。

   ```
   aws ec2 create-delegate-mac-volume-ownership-task \
   --instance-id {{i-1234567890abcdef0}} \
   --mac-credentials file://mac-credentials.json
   ```

   以下为上文示例中所引用 `mac-credentials.json` 文件的内容。

   ```
   {
     "internalDiskPassword":"internal-disk-admin_password",
     "rootVolumeUsername":"root-volume-admin_username",
     "rootVolumePassword":"root-volume-admin_password"
   }
   ```

1. 请等待卷所有权委托任务完成并且实例回到正常运行状态。使用 [describe-mac-modification-tasks](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-mac-modification-tasks.html) 命令。对于 `--mac-modification-task-id`，请指定从上一步中获取的卷所有权委托任务的 ID。

   ```
   aws ec2 describe-mac-modification-tasks \
   --mac-modification-task-id {{task-id}}
   ```

1. 卷所有权委托任务完成后，继续执行第 3 步。

**第 3 步：更新软件**  
委托 Amazon EBS 根卷所有权后，按照（下文）[在 x86 Mac 实例上更新软件](#x86-mac1) 中描述的步骤更新软件。

------
#### [ Manual volume ownership delegation ]

完成此过程后，您将创建两个密码。其中一个密码用于 Amazon EBS 根卷管理员用户 (`ec2-user`)，另一个密码用于内部磁盘管理员用户 (`aws-managed-user`)。请记住这些密码，因为您将在完成该过程后使用它们。

**注意**  
在 macOS Big Sur 上执行该过程后，只能进行次要更新，例如从 macOS Big Sur 11.7.3 更新到 macOS Big Sur 11.7.4。对于 macOS Monterey 或更高版本，可以执行主要软件更新。

**访问内部磁盘**

1. 在本地计算机上的终端中，使用以下命令通过 SSH 连接到 Apple silicon Mac 实例。有关更多信息，请参阅 [使用 SSH 连接到您的实例。](connect-to-mac-instance.md#mac-instance-ssh)。

   ```
   ssh -i {{/path/key-pair-name}}.pem ec2-user@{{instance-public-dns-name}}
   ```

1. 使用以下命令安装并启动 macOS 屏幕共享。

   ```
   [ec2-user ~]$ sudo launchctl enable system/com.apple.screensharing
   sudo launchctl load -w /System/Library/LaunchDaemons/com.apple.screensharing.plist
   ```

1. 使用以下命令设置 `ec2-user` 的密码。请记住该密码，因为您稍后会用到它。

   ```
   [ec2-user ~]$ sudo /usr/bin/dscl . -passwd /Users/ec2-user
   ```

1. 键入 **exit** 并按 return，与实例断开连接。

1. 在本地计算机上的终端中，使用以下命令，通过通往 VNC 端口的 SSH 隧道重新连接到实例。

   ```
   ssh -i {{/path/key-pair-name}}.pem -L 5900:localhost:5900 ec2-user@{{instance-public-dns-name}}
   ```
**注意**  
在完成以下 VNC 连接和 GUI 步骤之前，请勿退出该 SSH 会话。实例重启后，连接会自动关闭。

1. 在本地计算机上，使用以下步骤连接到 `localhost:5900`：

   1. 打开**查找器**并选择**前往**。

   1. 选择**连接到服务器**。

   1. 在**服务器地址**字段中，输入 `vnc://localhost:5900`。

1. 在 macOS 窗口中，使用您在[步骤 3](#passwd-step) 中创建的密码，以 `ec2-user` 身份连接到 Apple silicon Mac 实例的远程会话。

1. 使用以下选项之一访问名为 **InternalDisk** 的内部磁盘。

   1. 对于 macOS Ventura 或更高版本：打开**系统设置**，在左侧窗格中选择**常规**，然后选择窗格右下角的**启动磁盘**。

   1. 对于 macOS Monterey 或更低版本：打开**系统偏好设置**，选择**启动磁盘**，然后选择窗口左下角的锁定图标以解锁窗格。
**故障排除技巧**  
如需安装内部磁盘，请在终端中运行以下命令。  

   ```
   APFSVolumeName="InternalDisk" ; SSDContainer=$(diskutil list | grep "Physical Store disk0" -B 3 | grep "/dev/disk" | awk {'print $1'} ) ; diskutil apfs addVolume $SSDContainer APFS $APFSVolumeName
   ```

1. 选择名为 **InternalDisk** 的内部磁盘，然后选择**重新启动**。出现系统提示时，再次选择**重新启动**。
**重要**  
如果内部磁盘名为 **Macintosh HD** 而不是 **InternalDisk**，则需要停止实例然后重新启动，才能更新专属主机。有关更多信息，请参阅 [停止或终止 Amazon EC2 Mac 实例](mac-instance-stop.md)。

按照以下步骤操作可将所有权委派给管理用户。通过 SSH 重新连接到实例后，可使用特殊管理用户 (`aws-managed-user`) 从内部磁盘启动实例。`aws-managed-user` 的初始密码为空，因此您需要在首次连接时将其覆盖。然后，由于启动卷已更改，您需要重复安装和启动 macOS 屏幕共享的步骤。

**将 Amazon EBS 卷的所有权委派给管理员**

1. 在本地计算机上的终端中，使用以下命令连接到 Apple silicon Mac 实例。

   ```
   ssh -i {{/path/key-pair-name}}.pem aws-managed-user@{{instance-public-dns-name}}
   ```

1. 收到警告 `WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!` 后，使用以下命令之一解决该问题。

   1. 使用以下命令清除已知主机。然后重复上一步。

      ```
      rm ~/.ssh/known_hosts
      ```

   1. 将以下内容添加到上一个步中的 SSH 命令。

      ```
      -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no
      ```

1. 使用以下命令设置 `aws-managed-user` 的密码。`aws-managed-user` 的初始密码为空，因此您需要在首次连接时将其覆盖。

   1. 

      ```
      [aws-managed-user ~]$ sudo /usr/bin/dscl . -passwd /Users/aws-managed-user {{password}}
      ```

   1. 收到提示 `Permission denied. Please enter user's old password:` 时，请按 Enter。
**故障排除技巧**  
如您遇到 `passwd: DS error: eDSAuthFailed` 错误，请使用以下命令。  

      ```
      [aws-managed-user ~]$ sudo passwd aws-managed-user
      ```

1. 使用以下命令安装并启动 macOS 屏幕共享。

   ```
   [aws-managed-user ~]$ sudo launchctl enable system/com.apple.screensharing
   sudo launchctl load -w /System/Library/LaunchDaemons/com.apple.screensharing.plist
   ```

1. 键入 **exit** 并按 return，与实例断开连接。

1. 在本地计算机上的终端中，使用以下命令，通过通往 VNC 端口的 SSH 隧道重新连接到实例。

   ```
   ssh -i {{/path/key-pair-name}}.pem -L 5900:localhost:5900 aws-managed-user@{{instance-public-dns-name}}
   ```

1. 在本地计算机上，使用以下步骤连接到 `localhost:5900`：

   1. 打开**查找器**并选择**前往**。

   1. 选择**连接到服务器**。

   1. 在**服务器地址**字段中，输入 `vnc://localhost:5900`。

1.  在 macOS 窗口中，使用您在[步骤 3](#amu-passwd) 中创建的密码，以 `aws-managed-user` 身份连接到 Apple silicon Mac 实例的远程会话。
**注意**  
当提示使用 Apple ID 登录时，选择**稍后设置**。

1. 使用以下选项之一访问 Amazon EBS 卷。

   1. 对于 macOS Ventura 或更高版本：打开**系统设置**，在左侧窗格中选择**常规**，然后选择窗格右下角的**启动磁盘**。

   1. 对于 macOS Monterey 或更低版本：打开**系统偏好设置**，选择**启动磁盘**，然后选择窗口左下角的锁定图标以解锁窗格。
**注意**  
重启之前，当系统提示输入管理员密码时，请使用上述为 `aws-managed-user` 设置的密码。此密码可能不同于您为 `ec2-user` 或实例上的默认管理员账户设置的密码。以下说明指定了何时使用实例的管理员密码。

1. 选择 Amazon EBS 卷（**启动磁盘**窗口中未命名为 **internalDisk** 的卷），然后选择**重新启动**。
**注意**  
如果 Apple silicon Mac 实例上附加了多个可启动的 Amazon EBS 卷，则必须为每个卷使用唯一的名称。

1. 确认重新启动，然后在出现系统提示时选择**授权用户**。

1. 在**在该卷上授权用户**窗格中，确认是否已选择管理用户（默认为 `ec2-user`），然后选择**授权**。

1. 输入您在上一过程[步骤 3](#passwd-step) 中创建的 `ec2-user` 密码，然后选择**继续**。

1. 出现系统提示时，输入特殊管理用户 (`aws-managed-user`) 的密码。

1. 在本地计算机上的终端中，通过 SSH 和用户名 `ec2-user` 重新连接到实例。
**故障排除技巧**  
如果收到警告 `WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!`，请运行以下命令并通过 SSH 重新连接到实例。  

   ```
   rm ~/.ssh/known_hosts
   ```

1. 要执行软件更新，请使用 [在 x86 Mac 实例上更新软件](#x86-mac1) 下方的命令。

------

## 在 x86 Mac 实例上更新软件
<a name="x86-mac1"></a>

在 x86 Mac 实例上，您可以使用 `softwareupdate` 命令从 Apple 安装操作系统更新。

**要在 x86 Mac 实例上从 Apple 安装操作系统更新**

1. 使用以下命令列出包含可用更新的软件包。

   ```
   [ec2-user ~]$ softwareupdate --list
   ```

1. 安装所有更新或仅安装特定更新。要安装特定更新，请使用以下命令。

   ```
   [ec2-user ~]$ sudo softwareupdate --install {{label}}
   ```

   要改为安装所有更新，请使用以下命令。

   ```
   [ec2-user ~]$ sudo softwareupdate --install --all --restart
   ```

系统管理员可以使用 AWS Systems Manager 在 x86 Mac 实例上推出预先批准的操作系统更新。有关更多信息，请参阅[《AWS Systems Manager 用户指南》](https://docs.aws.amazon.com/systems-manager/latest/userguide/)。

您可以使用 Homebrew 在 EC2 macOS AMI 中安装软件包的更新，以便在实例上拥有这些软件包的最新版本。您还可以使用 Homebrew 在 Amazon EC2 macOS 上安装和运行常见 macOS 应用程序。有关详细信息，请参阅 [Homebrew 文档 ](https://docs.brew.sh/)。

**使用 Homebrew 安装更新**

1. 使用以下命令更新 Homebrew。

   ```
   [ec2-user ~]$ brew update
   ```

1. 使用以下命令列出包含可用更新的软件包。

   ```
   [ec2-user ~]$ brew outdated
   ```

1. 安装所有更新或仅安装特定更新。要安装特定更新，请使用以下命令。

   ```
   [ec2-user ~]$ brew upgrade {{package name}}
   ```

   要改为安装所有更新，请使用以下命令。

   ```
   [ec2-user ~]$ brew upgrade
   ```