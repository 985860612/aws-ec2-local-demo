

# 通用连接先决条件
<a name="connection-prereqs-general"></a>

连接到实例时需要满足的通用先决条件如下。请注意，可能存在与所选连接选项相关的特定先决条件。

**一般先决条**
+ 检查您的实例是否通过了状态检查。可能需要花几分钟时间，实例才能准备好接受连接请求。有关更多信息，请参阅 [查看状态检查](viewing_status.md)。
+ [获取所需的实例详细信息](#connection-prereqs-get-info-about-instance).
+ [查找私有密钥并设置权限](#connection-prereqs-private-key).
+ [（可选）获取实例指纹](#connection-prereqs-fingerprint).

## 获取所需的实例详细信息
<a name="connection-prereqs-get-info-about-instance"></a>

要做好连接到实例的准备工作，请通过 Amazon EC2 控制台或使用命令行来获取以下信息。

![Amazon EC2 控制台的实例窗格。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/connection-prereqs-console2.png)

+ **获取实例的公有 DNS 名称。**

  您可以从 Amazon EC2 控制台获取实例的公有 DNS。查看**实例**窗格的**公有 IPv4 DNS** 列。如果此列已隐藏，请选择屏幕右上角的设置图标（![The gear icon.](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/settings-icon.png)），然后选择**公有 IPv4 DNS**。您也可以在**实例**窗格的实例信息部分找到公有 DNS。在 Amazon EC2 控制台的**实例**窗格中选择实例时，有关该实例的信息将显示在页面的下半部分。在**详细信息**选项卡下，查找**公有 IPv4 DNS**。

  如果您愿意，也可以使用 [describe-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instances.html)（AWS CLI）或 [Get-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2Instance.html)（AWS Tools for Windows PowerShell）命令。

  如果未显示**公有 IPv4 DNS**，请验证**实例状态**是否**正在运行**，并确保您没有在私有子网中启动实例。如果您使用[启动实例向导](ec2-launch-instance-wizard.md)来启动实例，则可能已编辑**网络设置**下的**自动分配公有 IP** 字段，并且已将值更改为**禁用**。如果您禁用**自动分配公有 IP** 选项，则启动实例后不会为其分配公有 IP 地址。
+ **（仅适用于 IPv6）获取实例的 IPv6 地址。**

  如果您已为实例分配 IPv6 地址，则可以选择使用 IPv6 地址代替公有 IPv4 地址或公有 IPv4 DNS 主机名，以连接到实例。您的本地计算机必须拥有 IPv6 地址，且必须配置为使用 IPv6。您可以从 Amazon EC2 控制台获取实例的 IPv6 地址。请查看**实例**窗格的 **IPv6 IP** 列。或者，您可以在实例信息部分找到 IPv6 地址。在 Amazon EC2 控制台的**实例**窗格中选择实例时，有关该实例的信息将显示在页面的下半部分。在**详细信息**选项卡下，查找 **IPv6 地址**。

  如果您愿意，也可以使用 [describe-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instances.html)（AWS CLI）或 [Get-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2Instance.html)（AWS Tools for Windows PowerShell）命令。有关 IPv6 的更多信息，请参阅 [IPv6 地址](using-instance-addressing.md#ipv6-addressing)。
+ **（Linux 实例）获取实例的用户名。**

  您可以使用用户账户的用户名或用于启动实例的 AMI 的默认用户名连接到实例。
  + **获取用户账户的用户名。**

    有关如何创建用户账户的更多信息，请参阅[管理 Amazon EC2 Linux 实例上的系统用户](managing-users.md)。
  + **获取用于启动实例的 AMI 的默认用户名。**
    + **Amazon Linux** – `ec2-user`
    + **CentOS** – `centos` 或 `ec2-user`
    + **Debian** – `admin`
    + **Fedora** – `fedora` 或 `ec2-user`
    + **FreeBSD** – `ec2-user`
    + **RHEL** – `ec2-user` 或 `root`
    + **SUSE** – `ec2-user` 或 `root`
    + **Ubuntu** – `ubuntu`
    + **Oracle** – `ec2-user`
    + **Bitnami** – `bitnami`
    + **Rocky Linux** – `rocky`
    + **Other** – 检查 AMI 提供程序

## 查找私有密钥并设置权限
<a name="connection-prereqs-private-key"></a>

必须清楚私有密钥文件的位置，才能使用 SSH 建立与 Linux 实例的初始连接，或者使用 RDP 建立与 Windows 实例的初始连接。对于 SSH 连接，必须设置文件权限，确保只有您可以读取私有密钥。

有关使用 Amazon EC2 时密钥对工作原理的信息，请参阅 [Amazon EC2 密钥对和 Amazon EC2 实例](ec2-key-pairs.md)。
+ **查找私有密钥。**

  获取适用于启用实例时所指定密钥对的 `.pem` 文件在电脑上的全限定路径。有关更多信息，请参阅 [确定启动时指定的公有密钥](describe-keys.md#identify-key-pair-specified-at-launch)。

  如果无法找到私有密钥文件，则请参阅 [我丢失了私有密钥。如何连接到我的实例？](TroubleshootingInstancesConnecting.md#replacing-lost-key-pair)

  （Linux 实例）如果您使用 PuTTY 连接到实例并且需要将 `.pem` 文件转换为 `.ppk`，请参阅[使用 PuTTYgen 转换私有密钥](connect-linux-inst-from-windows.md#putty-private-key)。
+ **（Linux 实例）设置私有密钥的权限，确保只有您可以读取该密钥。**
  + **从 macOS 或 Linux 进行连接**

    如果您计划在 macOS 或 Linux 计算机上使用 SSH 客户端连接到 Linux 实例，请使用以下命令设置私有密钥文件的权限，以确保只有您可以读取该文件。

    ```
    chmod 400 {{key-pair-name}}.pem
    ```

    如果不设置这些权限，则无法使用此密钥对连接到实例。有关更多信息，请参阅 [错误：未保护的私有密钥文件](TroubleshootingInstancesConnecting.md#troubleshoot-unprotected-key)。
  + **从 Windows 进行连接**

    打开文件资源管理器，然后打开 `.pem` 文件的上下文（右键单击）菜单。依次选择**属性** > **安全选项卡**，然后选择**高级**。选择**禁用继承**。删除对所有用户（当前用户除外）的访问权限。

## （可选）获取实例指纹
<a name="connection-prereqs-fingerprint"></a>

若要保护自己免遭中间人攻击，您可以通过验证显示的指纹，确认将要连接的实例的真实性。如果您从第三方提供的公有 AMI 启动实例，验证指纹将很有用。

**任务概述**  
首先，从实例获取实例指纹。然后，当您连接到实例并收到验证指纹的提示时，请将在此过程中获取的指纹与显示的指纹进行比较。如果指纹不匹配，则表示有人可能在试图实施中间人攻击。如果二者匹配，则您可以放心地连接到您的实例。

**获取实例指纹的先决条件**
+ 实例不能处于 `pending` 状态。只有在第一次引导实例完成后，才能使用指纹。
+ 您必须为实例拥有者，才能获取控制台输出。
+ 可以采用多种方法获取实例指纹。如果要使用 AWS CLI，则必须将其安装在本地计算机上。有关安装 AWS CLI 的信息，请参阅《AWS Command Line Interface 用户指南》**中的[开始使用 AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html)。

**获取实例指纹**

在步骤 1 中，您将获得控制台输出，其中包括实例指纹。在步骤 2 中，您可以在控制台输出中找到实例指纹。

1. 使用以下方法之一获取控制台输出。

------
#### [ Console ]

   1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

   1. 从左侧导航窗格中选择**实例**。

   1. 选择实例，然后依次选择**操作**、**监控和故障排除**、**获取系统日志**、

------
#### [ AWS CLI ]

   在本地计算机上（而不是正在连接的实例上），使用 [get-console-output](https://docs.aws.amazon.com/cli/latest/reference/ec2/get-console-output.html) 命令。如果输出过大，[可将输出通过管道传输到文本文件](https://docs.aws.amazon.com/cli/latest/userguide/cli-usage-output-format.html)，文本形式可能更易于阅读。

   ```
   aws ec2 get-console-output \
       --instance-id {{i-1234567890abcdef0}} \
       --query Output \
       --output text > {{temp.txt}}
   ```

------
#### [ PowerShell ]

   在本地计算机上使用以下 [Get-EC2ConsoleOutput](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2ConsoleOutput.html) cmdlet。

   ```
   $encodedOutput = (Get-EC2ConsoleOutput -InstanceId {{i-1234567890abcdef0}}).Output
   [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($encodedOutput))
   ```

------

1. 在控制台输出中，找到位于 `BEGIN SSH HOST KEY FINGERPRINTS` 下方的实例（主机）指纹。可能有多个实例指纹。当您连接到实例时，它将仅显示其中一个指纹。

   确切的输出可能因操作系统、AMI 版本以及是否是由 AWS 创建密钥对而异。下面是示例输出。

   ```
   ec2:#############################################################
   ec2: -----BEGIN SSH HOST KEY FINGERPRINTS-----
   ec2: 256 SHA256:l4UB/neBad9tvkgJf1QZWxheQmR59WgrgzEimCG6kZY no comment (ECDSA)
   ec2: 256 SHA256:kpEa+rw/Uq3zxaYZN8KT501iBtJOIdHG52dFi66EEfQ no comment (ED25519)
   ec2: 2048 SHA256:L8l6pepcA7iqW/jBecQjVZClUrKY+o2cHLI0iHerbVc no comment (RSA)
   ec2: -----END SSH HOST KEY FINGERPRINTS-----
   ec2: #############################################################
   ```
**注意**  
连接到实例时，您将引用此指纹。