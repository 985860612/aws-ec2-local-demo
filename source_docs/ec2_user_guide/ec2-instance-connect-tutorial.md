

# 教程：完成使用 EC2 Instance Connect 连接到实例所需的配置
<a name="ec2-instance-connect-tutorial"></a>

要在 Amazon EC2 控制台中使用 EC2 Instance Connect 连接到实例，首先需要完成让您能够成功连接到实例的先决条件配置。本教程旨在引导您完成各项任务以完成先决条件配置。

**教程概述**

在本教程中，您将完成以下四项任务：
+ [任务 1：授予使用 EC2 Instance Connect 所需的权限](#eic-tut1-task1)

  首先，您将创建一个 IAM 策略，其中包含允许您将公有密钥推送到实例元数据的 IAM 权限。您将此策略附加到您的 IAM 身份（用户、用户组或角色），以便您的 IAM 身份能够获得这些权限。
+ [任务 2：允许从 EC2 Instance Connect 服务到实例的入站流量](#eic-tut1-task2)

  然后，您将创建一个安全组，以允许从 EC2 Instance Connect 服务到实例的流量。当您在 Amazon EC2 控制台中使用 EC2 Instance Connect 连接到实例时，将需要此安全组。
+ [任务 3：启动实例](#eic-tut1-task3)

  然后，您将使用预装了 EC2 Instance Connect 的 AMI 启动一个 EC2 实例，然后添加上一步中创建的安全组。
+ [任务 4：连接到实例](#eic-tut1-task4)

  最后，您将在 Amazon EC2 控制台中使用 EC2 Instance Connect 连接到您的实例。如果可以连接，则可以确定在任务 1、2 和 3 中完成的先决条件配置已经成功。

## 任务 1：授予使用 EC2 Instance Connect 所需的权限
<a name="eic-tut1-task1"></a>

在使用 EC2 Instance Connect 连接到实例时，EC2 Instance Connect API 会将一个 SSH 公有密钥推送到[实例元数据](ec2-instance-metadata.md)并在其中保留 60 秒。您需要将一个 IAM 策略附加到您的 IAM 身份（用户、用户组或角色），以授予您将公有密钥推送到实例元数据的必要权限。

**任务目标**

您要创建 IAM 策略来授予将公有密钥推送到实例的权限。要允许的具体操作是 `ec2-instance-connect:SendSSHPublicKey`。您还必须允许 `ec2:DescribeInstances` 操作，以确保您能够在 Amazon EC2 控制台中查看和选择您的实例。

创建好策略后，将此策略附加到 IAM 身份（用户、用户组或角色），以便 IAM 身份能够获得相关权限。

您将创建一个配置如下的策略：

------
#### [ JSON ]

****  

```
{
    "Version":"2012-10-17",		 	 	 
    "Statement": [{
            "Effect": "Allow",
            "Action": "ec2-instance-connect:SendSSHPublicKey",
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": "ec2:DescribeInstances",
            "Resource": "*"
        }
    ]
}
```

------

**重要**  
本教程中创建的 IAM 策略是一个权限十分宽松的策略；它允许您使用任何 AMI 用户名连接到任何实例。本教程使用这种高度宽松的策略，以保持教程的简洁性，并专注于本教程所讲授的具体配置。但在生产环境中，我们建议您将 IAM 策略配置为提供[最低权限](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html#grant-least-privilege)。有关示例 IAM 策略，请参阅 [为 EC2 Instance Connect 授予 IAM 权限](ec2-instance-connect-configure-IAM-role.md)。

**创建并附加一个允许您使用 EC2 Instance Connect 连接到实例的 IAM 策略**

1. **首先创建 IAM 策略**

   1. 打开 IAM 控制台：[https://console.aws.amazon.com/iam/](https://console.aws.amazon.com/iam/)。

   1. 在导航窗格中，选择**策略**。

   1. 选择**创建策略**。

   1. 在**指定权限**页面中，请执行以下操作：

      1. 对于**服务**，选择 **EC2 Instance Connect**。

      1. 在**允许的操作**下，在搜索字段中开始键入 **send** 以显示相关操作，然后选择 **SendSSHPublicKey**。

      1. 在**资源**下，选择**全部**。对于生产环境，我们建议用 ARN 来指定实例，但在本教程中，您会允许所有实例。

      1. 选择**添加更多权限**。

      1. 对于**服务**，选择 **EC2**。

      1. 在**允许的操作**下，在搜索字段中开始键入 **describein** 以显示相关操作，然后选择 **DescribeInstances**。

      1. 选择**下一步**。

   1. 在**查看和创建**页面中，请执行以下操作：

      1. 对于 **Policy name**（策略名称），输入此策略的名称。

      1. 选择**创建策略**。

1. **然后将该策略附加到您的身份**

   1. 在 IAM 控制台的导航窗格中，选择 **Policies**（策略）。

   1. 在策略列表中，选中要附加的策略名称旁边的选项按钮。您可以使用搜索框筛选策略列表。

   1. 依次选择**操作**、**附加**。

   1. 在 **IAM 实体**下，选择您的身份（用户、用户组或角色）旁的复选框。您可以使用搜索框筛选实体列表。

   1. 选择 **Attach policy**（附加策略）。

### 观看动画：创建 IAM 策略
<a name="eic-tut1-task1-animation1"></a>

![在 IAM 控制台中创建 IAM 策略。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/eic-tut1-task1-create-iam-policy.gif)


### 观看动画：附加 IAM 策略
<a name="eic-tut1-task1-animation2"></a>

![将 IAM 策略附加到 IAM 身份。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/eic-tut1-task1-attach-iam-policy.gif)


## 任务 2：允许从 EC2 Instance Connect 服务到实例的入站流量
<a name="eic-tut1-task2"></a>

在 Amazon EC2 控制台中使用 EC2 Instance Connect 连接到实例时，必须允许来自 EC2 Instance Connect 服务的流量到达实例。这与从本地计算机连接到实例不同；对于后者，您必须允许从本地计算机到实例的流量。要允许来自 EC2 Instance Connect 服务的流量，您必须创建一个安全组，以允许来自 EC2 Instance Connect 服务的 IP 地址范围的入站 SSH 流量。

AWS 使用前缀列表来管理 IP 地址范围。EC2 Instance Connect 前缀列表的名称如下，请将 {{region}} 替换为区域代码：
+ IPv4 前缀列表名称：`com.amazonaws.{{region}}.ec2-instance-connect`
+ IPv6 前缀列表名称：`com.amazonaws.{{region}}.ipv6.ec2-instance-connect`

**任务目标**

您将创建一个安全组，以允许来自实例所在区域的 IPv4 前缀列表的入站 SSH 流量通过端口 22。

**创建一个安全组，以允许从 EC2 Instance Connect 服务到实例的入站流量**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Security Groups (安全组)**。

1. 选择**创建安全组**。

1. 在**基本详细信息**下面，执行以下操作：

   1. 对于**安全组名称**，为您的安全组输入一个有意义的名称。

   1. 对于**描述**，为您的安全组输入一个有意义的描述。

1. 在**入站规则**下，执行以下操作：

   1. 选择**添加规则**。

   1. 对于 **Type**，选择 **SSH**。

   1. 对于**源**，请保留**自定义**。

   1. 在**来源**旁的字段中，选择 EC2 Instance Connect 的前缀列表。

      例如，假设实例位于美国东部（弗吉尼亚州北部）(`us-east-1`) 区域，并且用户将连接到其公有 IPv4 地址，则选择以下前缀列表：**com.amazonaws.us-east-1.ec2-instance-connect**

1. 选择**创建安全组**。

### 观看动画：创建安全组
<a name="eic-tut1-task2-animation"></a>

![为 EIC 端点配置安全组。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/tut1-task2-eic-security-group.gif)


## 任务 3：启动实例
<a name="eic-tut1-task3"></a>

启动实例时，必须指定包含启动实例所需信息的 AMI。您可以选择启动已预装或未预装 EC2 Instance Connect 的实例。在本任务中，您将指定一个预装了 EC2 Instance Connect 的 AMI。

如果您启动未预装 EC2 Instance Connect 的实例，同时又需要使用 EC2 Instance Connect 连接到实例，则需要执行额外的配置步骤。这些步骤不在本教程的介绍范围之内。

**任务目标**

您要使用预装了 EC2 Instance Connect 的 Amazon Linux 2023 AMI 来启动实例。您还需要指定之前创建的安全组，以便能够在 Amazon EC2 控制台中使用 EC2 Instance Connect 连接到实例。由于您将使用 EC2 Instance Connect 连接到实例，这会将一个公有密钥推送到实例元数据中，因此在启动实例时无需指定 SSH 密钥。

**启动可以在 Amazon EC2 控制台中使用 EC2 Instance Connect 进行连接的实例**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 屏幕顶部的导航栏中会显示当前所在 AWS 区域（例如，**爱尔兰**）。选择要在其中启动实例的区域。这一选择十分重要，因为您创建了一个允许特定区域流量的安全组，因此必须选择在同一区域启动实例。

1. 从 Amazon EC2 控制台控制面板中，选择**启动实例**。

1. （可选）在 **Name and tags**（名称与标签）下，为 **Name**（名称）输入实例的描述性名称。

1. 在**应用程序和操作系统映像（亚马逊机器映像）**下，选择**快速启动**。默认会选择 **Amazon Linux**。在**亚马逊机器映像（AMI）**下，已默认选择了 **Amazon Linux 2023 AMI**。对于此任务，请保留默认选择。

1. 对于**实例类型**下的**实例类型**，请保留默认选择，也可选择其他实例类型。

1. 在**密钥对（登录）**下的**密钥对名称**，请选择**继续操作但不提供密钥对（不推荐）**。使用 EC2 Instance Connect 连接到实例时，EC2 Instance Connect 会将一个密钥对推送到该实例的元数据，该密钥正是要用于连接的密钥对。

1. 在 **Network settings**（网络设置）下，执行以下操作：

   1. 对于**自动分配公有 IP**，请保留**启用**。
**注意**  
要在 Amazon EC2 控制台中使用 EC2 Instance Connect 连接到实例，实例必须具有一个公有 IPv4 或 IPv6 地址。

   1. 对于**防火墙（安全组）**，请选择**选择现有安全组**。

   1. 在**常用安全组**下，选择您之前创建的安全组。

1. 在 **Summary**（摘要）面板中，选择 **Launch instance**（启动实例）。

### 观看动画：启动实例
<a name="eic-tut1-task3-animation"></a>

![启动预装了 EC2 Instance Connect 的实例。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/tut1-task3-launch-an-instance.gif)


## 任务 4：连接到实例
<a name="eic-tut1-task4"></a>

在使用 EC2 Instance Connect 连接到实例时，EC2 Instance Connect API 会将一个 SSH 公有密钥推送到[实例元数据](ec2-instance-metadata.md)并在其中保留 60 秒。SSH 进程守护程序使用 `AuthorizedKeysCommand` 和 `AuthorizedKeysCommandUser` 来查找实例元数据的公有密钥以用于身份验证，然后将您连接到实例。

**任务目标**

在此任务中，您将在 Amazon EC2 控制台中使用 EC2 Instance Connect 连接到实例。如果您完成了前提任务 1、2 和 3，则连接应该会成功。

**连接到实例的步骤**

使用以下步骤连接到实例。要观看这些步骤的动画，请参阅 [观看动画：连接到实例](#eic-tut1-task4-animation)。

**在 Amazon EC2 控制台中使用 EC2 Instance Connect 连接实例**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 屏幕顶部的导航栏中会显示当前所在 AWS 区域（例如，**爱尔兰**）。选择实例所在的区域。

1. 在导航窗格中，选择 **Instances (实例)**。

1. 选择您的实例，然后选择**连接**。

1. 选择 **EC2 Instance Connect** 选项卡。

1. 选择**使用公有 IP 连接**。

1. 选择**连接**。

   这时将在浏览器中打开一个终端窗口，并且您已连接到实例。

### 观看动画：连接到实例
<a name="eic-tut1-task4-animation"></a>

![使用 EC2 Instance Connect 连接到实例。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/eic-tut1-task4-connect.gif)
