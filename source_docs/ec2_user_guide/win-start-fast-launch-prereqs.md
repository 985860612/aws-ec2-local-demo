

# Windows 的 EC2 Fast Launch 先决条件
<a name="win-start-fast-launch-prereqs"></a>

在设置 EC2 Fast Launch 之前，请确认您已满足在 AWS 账户 中为 AMI 创建快照所需的以下先决条件：
+ 如果在配置 EC2 Fast Launch 时提供了自定义启动模板，则该服务将使用您在启动模板中定义的 VPC 和其他配置设置。有关更多信息，请参阅 [在设置 EC2 Fast Launch 时使用启动模板](win-fast-launch-configure.md#win-fast-launch-with-template)。
+ 如果不使用自定义启动模板来配置设置，则在启用 EC2 Fast Launch 之前，必须将 [EC2FastLaunchFullAccess](security-iam-awsmanpol.md#security-iam-awsmanpol-EC2FastLaunchFullAccess) 策略附加到当前 IAM 角色。然后，该服务会自动创建一个 CloudFormation 堆栈，其中包含您的 AWS 账户中的以下资源。
  + 虚拟私有云（VPC）
  + 跨多个可用区的若干私有子网
  + 一个使用实例元数据服务版本 2（IMDSv2）配置的启动模板
  + 一个没有任何入站或出站规则的安全组
+ 专用 EC2 Fast Launch AMI 必须支持执行用户数据脚本。
+ 要为 AMI 配置 EC2 Fast Launch，您必须使用 **Sysprep** 和关机选项创建该 AMI。EC2 Fast Launch 功能目前不支持从正在运行的实例创建的 AMI。

  要使用 **Sysprep** 创建 AMI，请参阅 [使用 Windows Sysprep 创建 Amazon EC2 AMI](ami-create-win-sysprep.md)。
+ 要为使用客户自主管理型密钥进行加密的[加密 AMI](AMIEncryption.md) 启用 EC2 Fast Launch，您必须授予 EC2 Fast Launch 的服务相关角色使用 CMK 的权限。有关更多信息，请参阅 [访问客户自主管理型密钥](slr-windows-fast-launch.md#win-faster-launching-slr-access-to-cust-keys)。
+ 涵盖 AWS 账户 中所有 AMI 的**最大并行启动数**默认配额为每个区域 40 次。您可以请求增加账户的服务限额，方法如下。

  1. 访问 [https://console.aws.amazon.com/servicequotas/](https://console.aws.amazon.com/servicequotas/)，打开服务配额控制台。

  1. 在导航窗格中，请选择 AWS 服务。

  1. 在搜索栏中，输入 **EC2 Fast Launch**，然后选择结果。

  1. 选择**并行实例启动**的链接以打开服务配额详细信息页面。

  1. 选择**请求增加账户配额**。

  有关更多信息，请参阅《Service Quotas 用户指南》**中的[请求增加配额](https://docs.aws.amazon.com/servicequotas/latest/userguide/request-quota-increase.html)。