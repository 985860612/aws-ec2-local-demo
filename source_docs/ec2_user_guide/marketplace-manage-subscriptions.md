

# 管理您的 AWS Marketplace 订阅
<a name="marketplace-manage-subscriptions"></a>

在 AWS Marketplace 网站上，您可以检查订阅详细信息，查看供应商的使用说明，管理订阅等。

## 查看 订阅详细信息
<a name="check-sub-details"></a>

**检查订阅详细信息**

1.  登录 [AWS Marketplace](https://aws.amazon.com/marketplace)。

1. 选择 **Your Marketplace Account**。

1. 选择 **Manage your software subscriptions**。

1. 会列出当前所有订阅。选择**使用说明**以查看使用产品的特定说明，例如，用于连接到运行中的实例的用户名。

## 取消订阅
<a name="cancel-sub"></a>

**注意**  
取消订阅不会终止使用该 AMI 启动的实例。我们将继续对您正在运行的实例计费，直至其被终止。您必须终止使用该 AMI 启动的所有实例才能停止对该订阅付费。
取消了订阅之后，您无法再从该 AMI 启动任何实例。要再次使用该 AMI，您需要在 AWS Marketplace 网站上或通过 Amazon EC2 控制台中的启动向导重新订阅它。

**取消 AWS Marketplace 订阅**

1. 要停止对订阅计费，请确保您已终止从该订阅运行的所有实例。
**警告**  
**终止实例是永久且不可逆转的。**  
终止一个实例后，您将无法再连接到该实例，而且也无法对其进行恢复操作。被配置为在终止后删除的所有连接的 Amazon EBS 卷也将被永久删除并且无法恢复。实例存储卷中存储的所有数据将永久丢失。有关更多信息，请参阅 [实例终止的工作原理](how-ec2-instance-termination-works.md)。  
在终止实例之前，请务必确保已将需要在终止后保留的所有数据备份到持久存储中。

   1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

   1. 在导航窗格中，选择 **Instances (实例)**。

   1. 选择相应实例，然后依次选择**实例状态**、**终止（删除）实例**。

   1. 当系统提示您确认时，选择**终止（删除）**。

1. 登录到 [AWS Marketplace](https://aws.amazon.com/marketplace)，选择 **Your Marketplace Account（您的 Marketplace 账户）**，然后选择 **Manage your software subscriptions（管理您的软件订阅）**。

1. 选择 **Cancel subscription**。会提示您确认取消。