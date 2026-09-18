

# 查找满足您的 EC2 实例要求的 AMI
<a name="finding-an-ami"></a>

AMI 包括启动实例所需的组件和应用程序，例如操作系统和根卷的类型。要启动实例，必须找到满足您需求的 AMI。

选择 AMI 时，对于要启动的实例，可能需要考虑以下要求：
+ AMI 的 AWS 区域，因为 AMI ID 在每个区域中都是唯一的。
+ 操作系统（例如，Linux 或 Windows）。
+ 架构（例如，32 位、64 位或 64 位 ARM）。
+ 根卷类型（例如，Amazon EBS 或实例存储）。
+ 提供商（例如，亚马逊云科技）。
+ 其他软件（例如，SQL Server）。

------
#### [ Console ]

您可以在使用启动实例向导时从 AMI 列表中进行选择，也可以使用**映像**页面在所有可用的 AMI 中进行搜索。

**使用启动实例向导查找快速启动 AMI**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 从导航栏，选择您在其中启动实例的区域。您可以选择向您提供的任何区域，无需理会您身处的位置。AMI ID 在每个 AWS 区域中都是唯一的。

1. 从控制台控制面板中，选择**启动实例**。

1. 在**应用程序和操作系统映像（亚马逊机器映像）**下，选择**快速启动**，选择适用于实例的操作系统 (OS)，然后在**亚马逊机器映像（AMI）**中，从列表中选择一个常用的 AMI。如果您没有看到想要使用的 AMI，请选择 **Browser more AMIs**（浏览更多 AMI）以浏览完整的 AMI 目录。有关更多信息，请参阅 [应用程序和操作系统映像（亚马逊机器映像）](ec2-instance-launch-parameters.md#liw-ami)。

**使用 AMI 页面查找 AMI**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 从导航栏，选择您在其中启动实例的区域。您可以选择向您提供的任何区域，无需理会您身处的位置。AMI ID 在每个 AWS 区域中都是唯一的。

1. 在导航窗格中，选择 **AMI**。

1. （可选）使用筛选条件和搜索选项，将显示的 AMI 列表范围限定为仅能查看符合您的标准的 AMI。

   例如，要列出 AWS 提供的所有 AMI，请选择**公有映像**。然后使用搜索选项进一步缩小显示的 AMI 列表的范围。选择 **Search**（搜索）栏，然后从菜单中选择 **Owner alias**（拥有者别名），然后选择 **=** 运算符，最后选择值 **amazon**。要查找与特定平台（例如 Linux 或 Windows）匹配的 AMI，请再次选择**搜索**栏以选择**平台**，然后选择 **=** 运算符，从提供的列表中选择操作系统。

1. （可选）选择**首选项**图标，以选择要显示的映像属性，例如根卷类型。或者，可以从列表中选择 AMI，然后在 **Details**（详细信息）选项卡中查看其属性。

1. 选择 AMI 之前，请确认它是由实例存储支持还是由 Amazon EBS 支持并了解此差异的影响，这十分重要。有关更多信息，请参阅 [根卷类型](ComponentsAMIs.md#storage-for-the-root-device)。

1. 要从此 AMI 启动一个实例，请选择此实例，然后选择**从映像启动实例**。有关使用控制台启动实例的更多信息，请参阅 [使用控制台中的启动实例向导来启动 EC2 实例](ec2-launch-instance-wizard.md)。如果您没有准备好立即启动实例，请记下 AMI ID 以供将来使用。

------
#### [ AWS CLI ]

使用 [describe-images](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-images.html) 命令查找符合要求的 AMI。默认情况下，此命令会返回所有公有 AMI、由您拥有的 AMI 以及与您共享的 AMI。

**查找由 Amazon 拥有的 AMI**  
使用 [describe-images](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-images.html) 命令和 `--owners` 选项。

```
aws ec2 describe-images --owners amazon
```

**查找 Windows AMI**  
添加以下筛选条件，从而仅显示 Windows AMI。

```
--filters "Name=platform,Values=windows"
```

**查找 EBS-backed AMI**  
添加以下筛选条件，从而仅显示 Amazon EBS-backed AMI。

```
--filters "Name=root-device-type,Values=ebs"
```

------
#### [ PowerShell ]

使用 [Get-EC2Image](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2Image.html) cmdlet 查找符合要求的 AMI。默认情况下，此 cmdlet 会返回所有公有 AMI、由您拥有的 AMI 或与您共享的 AMI。

**查找由 Amazon 拥有的 AMI**  
使用 [Get-EC2Image](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2Image.html) 命令和 `-Owner` 参数。

```
Get-EC2Image -Owner amazon
```

**查找 Windows AMI**  
添加以下筛选条件，从而仅显示 Windows AMI。

```
-Filter @{Name="platform"; Values="windows"}
```

有关更多示例，请参阅《AWS Tools for PowerShell 用户指南》中的 [Find an Amazon Machine Image Using Windows PowerShell](https://docs.aws.amazon.com/powershell/latest/userguide/pstools-ec2-get-amis.html)**。

------

**相关资源**

有关特定操作系统的 AMI 的更多信息，请参阅以下内容：
+ Amazon Linux 2023 –《*Amazon Linux 2023 用户指南*》中的 [AL2023 on Amazon EC2](https://docs.aws.amazon.com/linux/al2023/ug/ec2.html)
+ Ubuntu – *Canonical Ubuntu 网站*上的 [Amazon EC2 AMI Locator](https://cloud-images.ubuntu.com/locator/ec2/)
+ RHEL – Red Hat 网站上的 [Red Hat Enterprise Linux Images (AMI) Available on Amazon Web Services (AWS)](https://access.redhat.com/solutions/15356)
+ Windows 服务器：[AWS Windows AMI 参考](https://docs.aws.amazon.com/ec2/latest/windows-ami-reference/windows-amis.html)

有关您可以在 AWS Marketplace 上订阅的 AMI 的信息，请参阅 [AWS Marketplace 中适用于 Amazon EC2 实例的付费 AMI](paid-amis.md)。

有关使用 Systems Manager 帮助用户找到启动实例时应使用的最新 AMI 的信息，请参阅以下内容：
+ [使用 Systems Manager 参数引用 AMI](using-systems-manager-parameter-to-find-AMI.md)
+ [使用 Systems Manager 公共参数引用最新的 AMI](finding-an-ami-parameter-store.md)