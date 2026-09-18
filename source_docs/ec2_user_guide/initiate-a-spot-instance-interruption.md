

# 启动竞价型实例中断
<a name="initiate-a-spot-instance-interruption"></a>

您可以在 Amazon EC2 控制台中选择一个竞价型实例请求或竞价型实例集请求并启动竞价型实例中断，从而测试竞价型实例上的应用程序将如何处理中断。当您启动竞价型实例中断时，Amazon EC2 会向您发送通知，提示您的竞价型实例将在两分钟后中断，然后将在两分钟后中断该实例。

执行竞价型实例中断的底层服务是 AWS Fault Injection Service（AWS FIS）。有关 AWS FIS 的信息，请参阅。[AWS Fault Injection Service](https://aws.amazon.com/fis/)

**注意**  
中断行为包括 `terminate`、`stop` 和 `hibernate`。如果您将中断行为设置为 `hibernate`，则当您启动竞价型实例中断时，将会立即开始休眠过程。

除亚太地区（雅加达）、亚太地区（大阪）、中国（北京）、中国（宁夏）和中东地区（阿联酋）外，所有 AWS 区域均支持启动竞价型实例中断。

**Topics**
+ [启动竞价型实例中断](#initiate-interruption)
+ [验证竞价型实例中断](#spot-interruptions-verify-result)
+ [配额](#fis-quota-for-spot-instance-interruption)

## 启动竞价型实例中断
<a name="initiate-interruption"></a>

您可以使用 EC2 控制台快速启动竞价型实例中断。选择竞价型实例请求时，您可以启动一个竞价型实例的中断。选择竞价型实例集请求时，您可以同时启动多个竞价型实例的中断。

要进行更高级的实验来测试竞价型实例中断情况，您可以使用 AWS FIS 控制台创建自己的实验。

**使用 EC2 控制台启动竞价型实例请求中一个竞价型实例的中断**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，请选择 **Spot Requests**（竞价型实例请求）。

1. 选择一个竞价型实例请求，然后依次选择 **Actions**（操作）、**Initiate interruption**（启动中断）。不能选择多个竞价型实例请求来启动中断。

1. 在 **Initiate Spot Instance interruption**（启动竞价型实例中断）对话框的 **Service access**（服务访问权限）下，您可以使用默认角色，也可以选择一个现有的角色。要选择现有角色，请选择**使用现有的服务角色**，然后对于 **IAM 角色**，选择要使用的角色。

1. 准备好启动竞价型实例中断后，选择 **Initiate interruption**（启动中断）。

**使用 EC2 控制台启动竞价型实例集请求中的一个或多个竞价型实例的中断**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，请选择 **Spot Requests**（竞价型实例请求）。

1. 选择一个竞价型实例集请求，然后依次选择**操作**、**启动中断**。您不能选择多个竞价型实例集请求来启动中断。

1. 在**指定竞价型实例数量**对话框中，对于**要中断的实例数**，输入要中断的竞价型实例数量，然后选择**确认**。
**注意**  
该数量不能超过实例集中竞价型实例的数量或每个实验 AWS FIS 可以中断的竞价型实例数量的[配额](#fis-quota-for-spot-instance-interruption)。

1. 在 **Initiate Spot Instance interruption**（启动竞价型实例中断）对话框的 **Service access**（服务访问权限）下，您可以使用默认角色，也可以选择一个现有的角色。要选择现有角色，请选择**使用现有的服务角色**，然后对于 **IAM 角色**，选择要使用的角色。

1. 准备好启动竞价型实例中断后，选择 **Initiate interruption**（启动中断）。

**使用 AWS FIS 控制台创建更高级的实验来测试竞价型实例中断**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，请选择 **Spot Requests**（竞价型实例请求）。

1. 依次选择 **Actions**（操作）、**Create advanced experiments**（创建高级实验）。

   AWS FIS 控制台将打开。有关更多信息，请参阅《AWS Fault Injection Service User Guide》**中的 [Tutorial: Test Spot Instance interruptions using AWS FIS](https://docs.aws.amazon.com/fis/latest/userguide/fis-tutorial-spot-interruptions.html)。

## 验证竞价型实例中断
<a name="spot-interruptions-verify-result"></a>

启动中断后，将会发生以下情况：
+ 竞价型实例收到一个 [实例再平衡建议](rebalance-recommendations.md)。
+ 在 AWS FIS 中断实例之前两分钟发出[竞价型实例中断通知](spot-instance-termination-notices.md)。
+ 两分钟后，竞价型实例将会中断。
+ 已被 AWS FIS 停止的竞价型实例将在您将其重新启动之前一直处于停止状态。

**验证实例在您启动中断后是否已中断**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 从导航窗格中，在单独的浏览器选项卡或窗口中打开 **Spot Requests**（竞价型实例请求）和 **Instances**（实例）。

1. 对于**竞价型请求**，请选择竞价型实例请求或竞价型实例集请求。初始状态为 `fulfilled`。实例中断后，状态会根据中断行为出现以下变化：
   + `terminate` – 状态变为 `instance-terminated-by-experiment`。
   + `stop` – 实例的状态首先变为 `marked-for-stop-by-experiment`，然后变为 `instance-stopped-by-experiment`。

1. 对于 **Instances**（实例），选择该竞价型实例。初始状态为 `Running`。在收到竞价型实例中断通知后两分钟，状态会根据中断行为出现以下变化：
   + `stop` – 实例的状态首先变为 `Stopping`，然后变为 `Stopped`。
   + `terminate` – 实例的状态首先变为 `Shutting-down`，然后变为 `Terminated`。

## 配额
<a name="fis-quota-for-spot-instance-interruption"></a>

对于每个实验 AWS FIS 可以中断的竞价型实例数量，您的 AWS 账户 具有如下默认配额。


| 名称 | 默认值 | 可调整 | 说明 | 
| --- | --- | --- | --- | 
| aws:ec2:send-spot-instance-interruptions 的目标竞价型实例 | 每个受支持的区域：5 个 | 是 | 在每个实验中，当您使用标签标识目标时 aws:ec2:send-spot-instance-interruptions 可以确定为目标的最大竞价型实例数量。 | 

您可以请求提高配额。有关更多信息，请参阅《服务配额用户指南》**中的[请求增加配额](https://docs.aws.amazon.com/servicequotas/latest/userguide/request-quota-increase.html)。

要查看 AWS FIS 的所有限额，请打开[服务限额控制台](https://console.aws.amazon.com/servicequotas/home)。在导航窗格中，选择 **AWS services**（ 服务），然后选择 **AWS Fault Injection Service**。您还可以在*AWS Fault Injection Service用户指南AWS Fault Injection Service*中查看的所有[配额](https://docs.aws.amazon.com/fis/latest/userguide/fis-quotas.html)。