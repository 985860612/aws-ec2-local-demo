

# Amazon EC2 中的 AMI 配额
<a name="ami-quotas"></a>

以下限额适用于创建和共享 AMI。限额按 AWS 区域应用。



| 限额名称 | 描述 | 每个区域的默认限额 | 
| --- | --- | --- | 
| AMI | 每个区域允许的最大公有和私有 AMI 数量。这包括可用、待处理和已禁用的 AMI 以及回收站中的 AMI。 | 50000 | 
| 公有 AMI | 每个区域允许的最大公有 AMI 数量，包括回收站中的公有 AMI。 | 5 | 
| AMI 共享 | 某一区域内可以共享 AMI 的最大实体（组织、组织部门 (OU) 和账户）数量。请注意，如果您与某个组织或 OU 共享一个 AMI，则该组织或 OU 中的账户数量不计入该限额。 | 1000 | 

如果您超出限额，但想创建或共享更多 AMI，可以执行以下操作：
+ 如果您超出总 AMI 或公有 AMI 限额，请考虑取消注册未使用的映像。
+ 如果您超出公有 AMI 限额，请考虑将一个或多个公有 AMI 设为私有。
+ 如果您超出 AMI 共享限额，请考虑与某个组织或 OU（而不是单独的账户）共享您的 AMI。
+ 请求增加 AMI 的限额。

## 请求增加 AMI 的限额
<a name="request-ami-quota-increase"></a>

如果您需要的 AMI 超出其默认限额，您可以请求增加限额。

**请求增加 AMI 的限额**

1. 访问 [https://console.aws.amazon.com/servicequotas/](https://console.aws.amazon.com/servicequotas/)，打开服务限额控制台。

1. 在导航窗格中，选择 **AWS 服务**。

1. 从列表中选择 **Amazon Elastic Compute Cloud (Amazon EC2)**，或在搜索框中键入服务的名称。

1. 选择 AMI 限额以请求增加限额。您可以选择的 AMI 限额包括：
   + AMI
   + 公有 AMI
   + AMI 共享

1. 选择**请求增加限额**。

1. 对于 **Change quota value**（更改限额值），输入新的限额值，然后选择 **Request**（请求）。

要查看任何待处理或最近解决的请求，请从导航窗格选择 **Dashboard (控制面板)**。对于待处理的请求，请选择请求状态以打开收到的请求。请求的初始状态为 **Pending**（待处理）。状态更改为 **Quota requested**（已请求限额）后，您将在 **Support Center case number**（支持中心案例编号）下看到案例编号。选择案例编号以打开请求服务单。

解决请求后，配额的 **Applied quota value (应用的配额值)** 设置为新值。

有关更多信息，请参阅 [Service Quotas 用户指南](https://docs.aws.amazon.com/servicequotas/latest/userguide/request-quota-increase.html)。