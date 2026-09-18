

# 选项 3：通过创建安全组，将实例手动连接到 RDS 数据库
<a name="tutorial-ec2-rds-option3"></a>

“选项 3”的目标是学习如何通过手动重现自动连接功能的配置，手动配置 EC2 实例与 RDS 数据库之间的连接。

**Topics**
+ [开始前的准备工作](#option3-before-you-begin)
+ [任务 1：（*可选*）启动 EC2 实例](#option3-task1-launch-ec2-instance)
+ [任务 2：（*可选*）创建 RDS 数据库](#option3-task2-create-rds-database)
+ [任务 3：将 EC2 实例手动连接到 RDS 数据库](#option3-task3-connect-rds-database-to-ec2-instance)
+ [任务 4（*可选*）：清理](#tutorial-ec2-rds-clean-up)

## 开始前的准备工作
<a name="option3-before-you-begin"></a>

完成本教程需要做好以下准备：
+ 与 RDS 数据库位于同一 VPC 中的 EC2 实例。您可以使用现有的 EC2 实例，也可以按照“任务 1”中的步骤创建新实例。
+ 与 EC2 实例位于同一 VPC 中的 RDS 数据库。您可以使用现有的 RDS 数据库，也可以按照“任务 2”中的步骤创建新数据库。
+ 调用以下操作的权限：
  + `ec2:AssociateRouteTable`
  + `ec2:AuthorizeSecurityGroupEgress`
  + `ec2:CreateRouteTable`
  + `ec2:CreateSecurityGroup`
  + `ec2:CreateSubnet`
  + `ec2:DescribeInstances`
  + `ec2:DescribeNetworkInterfaces`
  + `ec2:DescribeRouteTables`
  + `ec2:DescribeSecurityGroups`
  + `ec2:DescribeSubnets`
  + `ec2:ModifyNetworkInterfaceAttribute`
  + `ec2:RevokeSecurityGroupEgress`

## 任务 1：（*可选*）启动 EC2 实例
<a name="option3-task1-launch-ec2-instance"></a>

**注意**  
启动实例不是本教程的重点。如果您已拥有 Amazon EC2 实例并希望在本教程中使用它，则可跳过此任务。

此任务的目标是启动 EC2 实例，以便您可以完成“任务 3”，在该任务中，您将配置 EC2 实例与 Amazon RDS 数据库之间的连接。此任务中的步骤将按以下方式配置 EC2 实例：
+ 实例名称：**tutorial-instance**
+ AMI：Amazon Linux 2
+ 实例类型：`t2.micro`
+ 自动分配公有 IP：已启用 
+ 具有以下三条规则的安全组：
  + 允许来自您的 IP 地址的 SSH
  + 允许来自任何地方的 HTTPS 流量
  + 允许来自任何地方的 HTTP 流量

**重要**  
在生产环境中，您应该配置实例，以满足您的特定需求。

**启动 EC2 实例**

1. 登录 AWS 管理控制台，打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在 **EC2 Dashboard**（EC2 控制面板）上，选择 **Launch instance**（启动实例）。

1. 在 **Name and tags**（名称与标签）下，对于 **Name**（名称），输入名称以标识您的实例。对于本教程，请将该实例命名为 **tutorial-instance-manual-1**。虽然实例名称不是必填项，但该名称将帮助您轻松识别它。

1. 在 **Application and OS Images**（应用程序和操作系统映像）下，选择满足您的 Web 服务器需求的 AMI。本教程使用 **Amazon Linux**。

1. 在 **Instance type**（实例类型）下，对于 **Instance type**（实例类型），选择满足您的 Web 服务器需求的实例类型。本教程使用的是 `t2.micro`。
**注意**  
根据您创建账户的时间，您可能有资格在免费套餐下使用 Amazon EC2。  
如果您在 2025 年 7 月 15 日之前创建 AWS 账户且其使用时间未满 12 个月，您可以通过选择 **t2.micro** 实例类型（或在 **t2.micro** 不可用的区域中选择 **t3.micro** 实例类型）来使用免费套餐下的 Amazon EC2。请注意，在启动 **t3.micro** 实例时，默认会启用[**无限**模式](burstable-performance-instances-unlimited-mode.md)，该模式可能会根据 CPU 使用情况产生额外费用。如果实例类型可在免费套餐下使用，则会标记为**符合免费套餐资格**。  
如果您是在 2025 年 7 月 15 日当天或之后创建的 AWS 账户，则可以使用 **t3.micro**、**t3.small**、**t4g.micro**、**t4g.small**、**c7i-flex.large** 和 **m7i-flex.large** 实例类型，使用期限为 6 个月，或直到您的服务抵扣金用完为止。  
有关更多信息，请参阅 [2025 年 7 月 15 日之前和之后的免费套餐权益](ec2-free-tier-usage.md#ec2-free-tier-comparison)。

1. 在 **Key pair (login)**（密钥对（登录））下，对于 **Key pair name**（密钥对名称），选择您的密钥对。

1. 在 **Network settings**（网络设置）下，执行以下操作：

   1. 对于 **Network**（网络）和 **Subnet**（子网），如果您尚未更改默认 VPC 或子网，则可以保留默认设置。

      如果您对默认 VPC 或子网进行了更改，请检查以下各项：

      1. 实例必须与 RDS 数据库位于同一 VPC 中。默认情况下，您只有一个 VPC。

      1. 您要将实例启动到其中的 VPC 必须连接互联网网关，以便您能从互联网访问您的 Web 服务器。您的默认 VPC 将自动设置互联网网关。

      1. 为了确保您的实例收到公有 IP 地址，对于 **Auto-assign public IP**（自动分配公有 IP），请检查并确保选择 **Enable**（启用）。如果选择 **Disable **（禁用），请选择 **Edit**（编辑）（位于 **Network Settings**（网络设置）右侧），然后对于 **Auto-assign public IP**（自动分配公有 IP），选择 **Enable**（启用）。

   1. 要使用 SSH 连接到您的实例，您需要一条安全组规则，授权来自您计算机的公有 IPv4 地址的 SSH (Linux) 或 RDP (Windows) 流量。默认情况下，当您启动实例时，将使用允许来自任何地方的入站 SSH 流量的规则创建新的安全组。

      要确保只有您的 IP 地址才能连接到您的实例，请在**防火墙（安全组）**下，从**允许入站 SSH 流量**复选框旁边的下拉列表中，选择**我的 IP**。

   1. 要允许流量从互联网流向您的实例，请选中以下复选框：
      + **Allow HTTPs traffic from the internet（允许来自互联网的 HTTPs 流量**
      + **Allow HTTP traffic from the internet（允许来自互联网的 HTTP 流量**

1. 在 **Summary**（摘要）面板中查看实例配置，然后选择 **Launch instance**（启动实例）。

1. 选择**查看所有实例**以关闭确认页面并返回控制台。实例将首先处于 `pending` 状态，然后进入 `running` 状态。

   如果实例无法启动或状态立即转至 `terminated` 而非 `running`，请参阅 [排查 Amazon EC2 实例启动问题](troubleshooting-launch.md)。

有关启动实例的更多信息，请参阅 [使用控制台中的启动实例向导来启动 EC2 实例](ec2-launch-instance-wizard.md)。

### 观看动画：启动 EC2 实例
<a name="option3-launch-ec2-instance-animation"></a>

![在 EC2 控制台中启动 EC2 实例。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/tutorial-launch-instance.gif)


## 任务 2：（*可选*）创建 RDS 数据库
<a name="option3-task2-create-rds-database"></a>

**注意**  
创建 RDS 数据库不是该教程这一部分的重点。如果您已拥有 RDS 数据库并希望将其用于本教程，则可跳过此任务。

此任务的目标是创建 RDS 数据库。在“任务 3”中，当您将此实例连接到 EC2 实例时，您将使用此实例。此任务中的步骤将按以下方式配置 RDS 数据库：


+ 引擎类型：MySQL
+ 模板：免费套餐
+ 数据库实例标识符：**tutorial-database-manual**
+ 数据库实例类：`db.t3.micro`

**重要**  
在生产环境中，您应该配置实例，以满足您的特定需求。

**创建 MySQL 数据库实例**

1. 通过以下网址打开 Amazon RDS 控制台：[https://console.aws.amazon.com/rds/](https://console.aws.amazon.com/rds/)。

1. 从“Region selector”（区域选择器）（位于右上角）中，选择您在其中创建 EC2 实例的 AWS 区域。EC2 实例和数据库实例必须位于同一区域中。

1. 在控制面板中，选择 **Create database**（创建数据库）。

1. 在 **Choose a database creation method**（选择数据库创建方法）下，选择 **Easy create**（轻松创建）。当您选择此选项时，用于自动配置连接的自动连接功能将不可用。

1. 在 **Engine options**（引擎选项）下，对于 **Engine type**（引擎类型），选择 **MySQL**。

1. 对于 **数据库实例大小**，选择 **免费套餐**。

1. 对于 **DB instance identifier**（数据库实例标识符），输入 RDS 数据库的名称。在本教程中，请输入 **tutorial-database-manual**。

1. 对于 **Master username**（主用户名），保留默认名称，即 **admin**。

1. 对于 **Master password**（主密码），输入您在本教程中可以记住的密码，然后对于 **Confirm password**（确认密码），再次输入该密码。

1. 选择**创建数据库**。

   在 **Databases**（数据库）屏幕上，在数据库实例准备就绪可供使用之前，新数据库实例的 **Status**（状态）为 **Creating**（正在创建）。当状态变为 **Available**（可用）时，您便可以连接到该数据库实例。根据数据库实例类和存储量，新实例可能需要等待 20 分钟时间才可用。

### 观看动画：创建数据库实例
<a name="option3-task2-create-rds-database-animation"></a>

![在 RDS 控制台中创建数据库实例。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/tutorial-create-db-step2.gif)


## 任务 3：通过创建安全组并将它们分配给实例，将 EC2 实例手动连接到 RDS 数据库
<a name="option3-task3-connect-rds-database-to-ec2-instance"></a>

此任务的目标是通过手动执行以下操作以重现自动连接功能的连接配置：创建两个新安全组，然后分别向 EC2 实例和 RDS 数据库添加一个安全组。

**创建两个新安全组，然后分别向 EC2 实例和 RDS 数据库分配一个安全组**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 首先创建要添加到 EC2 实例的安全组，如下所示：

   1. 在导航窗格中，选择 **Security Groups**（安全组）。

   1. 选择 **Create security group**（创建安全组）。

   1. 对于 **Security group name**（安全组名称），请输入一个描述性的安全组名称。在本教程中，请输入 **ec2-rds-manual-configuration**。

   1. 对于 **Description**（描述），请输入一段简短描述。在本教程中，请输入 **EC2 instance security group to allow EC2 instance to securely connect to RDS database**。

   1. 选择**创建安全组**。在创建 RDS 数据库安全组后，您将返回此安全组以添加出站规则。

1. 现在，创建要添加到 RDS 数据库的安全组，如下所示：

   1. 在导航窗格中，选择 **Security Groups**（安全组）。

   1. 选择 **Create security group**（创建安全组）。

   1. 对于 **Security group name**（安全组名称），请输入一个描述性的安全组名称。在本教程中，请输入 **rds-ec2-manual-configuration**。

   1. 对于 **Description**（描述），请输入一段简短描述。在本教程中，请输入 **RDS database security group to allow EC2 instance to securely connect to RDS database**。

   1. 在 **Inbound rules**（入站规则）下，选择 **Add rule**（添加规则），然后执行以下操作：

      1. 对于 **Type**（类型），选择 **MYSQL/Aurora**。

      1. 对于 **Source**（来源），选择您在此过程的“步骤 2”中创建的 EC2 实例安全组 **ec2-rds-manual-configuration**。

   1. 选择**创建安全组**。

1. 编辑 EC2 实例安全组以添加出站规则，如下所示：

   1. 在导航窗格中，选择**安全组**。

   1. 选择 EC2 实例安全组（您已将其命名为 **ec2-rds-manual-configuration**），然后选择 **Outbound rules**（出站规则）选项卡。

   1. 选择 **Edit outbound rules**（编辑出站规则）。

   1. 选择 **Add rule**（添加规则），然后执行以下操作：

      1. 对于 **Type**（类型），选择 **MYSQL/Aurora**。

      1. 对于**目标**，选择您在此过程的“步骤 3”中创建的 RDS 数据库安全组 **rds-ec2-manual-configuration**。

      1. 选择**保存规则**。

1. 将 EC2 实例安全组添加到 EC2 实例中，如下所示：

   1. 在导航窗格中，选择 **Instances (实例)**。

   1. 选择您的 EC2 实例，然后依次选择 **Actions**（操作）、**Security**（安全性）和 **Change security groups**（更改安全组）。

   1. 在 **Associated security groups**（关联安全组）下，选择 **Select security groups**（选择安全组）字段，选择您之前创建的 **ec2-rds-manual-configuration**，然后选择 **Add security group**（添加安全组）。

   1. 选择**保存**。

1. 将 RDS 数据库安全组添加到 RDS 数据库，如下所示：

   1. 通过以下网址打开 Amazon RDS 控制台：[https://console.aws.amazon.com/rds/](https://console.aws.amazon.com/rds/)。

   1. 在导航窗格中，选择 **Databases**（数据库），然后选择您的数据库。

   1. 选择 **Modify**(修改)。

   1. 在 **Connectivity**（连接）下，对于 **Security group**（安全组），选择您之前创建的 **rds-ec2-manual-configuration**，然后选择 **Continue**（继续）。

   1. 在 **Scheduling of modifications**（修改计划）下，选择 **Apply immediately**（立即应用）。

   1. 选择**修改数据库实例**。

   现在，您已完成模仿在使用自动连接功能时出现的自动步骤的手动步骤。

您已完成本教程的“选项 3”。如果您已完成“选项 1”、“选项 2”和“选项 3”，并且不再需要在本教程中创建的资源，则应删除这些资源，以防止产生不必要的成本。有关更多信息，请参阅 [任务 4（*可选*）：清理](#tutorial-ec2-rds-clean-up)。

## 任务 4（*可选*）：清理
<a name="tutorial-ec2-rds-clean-up"></a>

**警告**  
**终止实例是永久且不可逆转的。**  
终止一个实例后，您将无法再连接到该实例，而且也无法对其进行恢复操作。被配置为在终止后删除的所有连接的 Amazon EBS 卷也将被永久删除并且无法恢复。实例存储卷中存储的所有数据将永久丢失。有关更多信息，请参阅 [实例终止的工作原理](how-ec2-instance-termination-works.md)。  
在终止实例之前，请务必确保已将需要在终止后保留的所有数据备份到持久存储中。

现在您已完成该教程，最好清理（删除）所有您不再需要使用的资源。清理 AWS 资源可以防止您的账户产生任何进一步的费用。

如果您专门为本教程启动了 EC2 实例，则可以将其终止，以停止产生任何与之相关的费用。

**使用控制台终止实例**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances (实例)**。

1. 选择您为本教程创建的实例，然后依次选择 **Instance state**（实例状态）、**Terminate instance**（终止实例）。

1. 当系统提示您确认时，选择**终止**。

如果您专门为本教程创建了 RDS 数据库，则可以将其删除，以停止产生任何与之相关的费用。

**使用控制台删除 RDS 数据库**

1. 通过以下网址打开 Amazon RDS 控制台：[https://console.aws.amazon.com/rds/](https://console.aws.amazon.com/rds/)。

1. 在导航窗格中，选择 **Databases (数据库)**。

1. 选择您为本教程创建的 RDS 数据库，然后依次选择 **Actions**（操作）、**Delete**（删除）。

1. 在方框中输入 **delete me**，然后选择 **Delete**（删除）。