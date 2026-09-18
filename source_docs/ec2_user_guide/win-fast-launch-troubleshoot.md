

# 排查 Windows EC2 Fast Launch 问题
<a name="win-fast-launch-troubleshoot"></a>

## 故障排除场景
<a name="ts-fast-launch-scenarios"></a>

以下场景有助于诊断和解决在尝试启用 EC2 Fast Launch 时可能遇到的常见问题。

### 无法停止实例以创建快照
<a name="ts-fast-launch-sc-stop-instance"></a>

#### 说明
<a name="ts-fast-launch-sc-stop-instance-descr"></a>

启用 EC2 Fast Launch 后，该服务会启动一组实例，以用于创建预调配的快照。每个实例有 30 分钟的时间来完成此过程。如果任何实例成功完成，则该服务会将 AMI 的 Fast Launch 状态设置为 `Enabled`。但如果某个实例未能在分配的时间内完成该过程，并且所有其他实例均未完成该过程，则该服务将终止所有实例，将 AMI 的 Fast Launch 状态设置为 `enabling_failed`，并将 Fast Launch 状态原因设置为以下内容：

```
Unable to stop instance ID={{i-1234567890abcdef0}} for snapshot creation.
```

#### 原因
<a name="ts-fast-launch-sc-stop-instance-cause"></a>

发生这种情况时，最常见的原因是尝试启用 EC2 Fast Launch 的 Windows AMI 是从正在运行的实例创建的，或尝试启用 EC2 Fast Launch 的 AMI 不满足所有 [EC2 Fast Launch 先决条件](win-start-fast-launch-prereqs.md)。

#### 解决方案
<a name="ts-fast-launch-sc-stop-instance-solution"></a>

确保您使用的 AMI 满足所有 [EC2 Fast Launch 先决条件](win-start-fast-launch-prereqs.md)。

要为 AMI 配置 EC2 Fast Launch，您必须使用 **Sysprep** 和关机选项创建该 AMI。有关更多信息，请参阅 [使用 Windows Sysprep 创建 Amazon EC2 AMI](ami-create-win-sysprep.md)。

### 您已达到 VPC 限制
<a name="ts-fast-launch-sc-vpc-limit"></a>

#### 说明
<a name="ts-fast-launch-sc-vpc-limit-descr"></a>

如果您既未使用启动模板来指定现有 VPC，也没有为账户定义默认 VPC，则该服务会自动创建一个包含 VPC 和其他资源的 CloudFormation 堆栈，如 [EC2 Fast Launch 先决条件](win-start-fast-launch-prereqs.md)中所述。

#### 原因
<a name="ts-fast-launch-sc-vpc-limit-cause"></a>

您的 AWS 账户已达到该区域允许的最大 VPC 数量，并且您尚未指定将某个现有 VPC 用于 EC2 Fast Launch。这会导致进程失败。

#### 解决方案
<a name="ts-fast-launch-sc-vpc-limit-solution"></a>

您可以使用以下任一选项来解决此问题：
+ 您可以请求提高配额
+ 您可以提供一个指定了现有 VPC 的启动模板

要请求增加账户可为每个区域定义的 VPC 数量，请按照以下步骤操作：

1. 访问 [https://console.aws.amazon.com/servicequotas/](https://console.aws.amazon.com/servicequotas/)，打开服务配额控制台。

1. 在**服务控制台控制面板**中，选择 **Amazon Virtual Private Cloud（Amazon VPC）**。这将会打开 VPC 服务配额。

1. 筛选 `VPCs per Region` 即可直接进入该配额。

1. 选择**每个区域的 VPC 数量**，然后选择**请求在账户级别增加**。

 如果需要紧急请求增加配额，或者增加配额的请求被拒绝，请联系 Support 寻求帮助。有关更多信息，请参阅《服务限额用户指南》**中的[请求增加限额](https://docs.aws.amazon.com/servicequotas/latest/userguide/request-quota-increase.html)。

### 启用 EC2 Fast Launch 的权限不足
<a name="ts-fast-launch-sc-insufficient-perms"></a>

#### 说明
<a name="ts-fast-launch-sc-insufficient-perms-descr"></a>

在未指定启动模板的情况下首次启用 EC2 Fast Launch 时，EC2 Fast Launch 会创建一个由服务拥有的 CloudFormation 堆栈，其中包含服务默认资源。但如果您的 IAM 主体（角色或用户）缺少必要的权限，CloudFormation 模板将无法完成部署。

日志消息可能如以下所示：

```
Can't enable EC2 Fast Launch. The IAM credentials that you are using do not have sufficient permissions. Attach EC2FastLaunchFullAccess in the IAM console.
```

#### 原因
<a name="ts-fast-launch-sc-insufficient-perms-cause"></a>

您的 IAM 用户或角色缺少启用 EC2 Fast Launch 的必要权限。

#### 解决方案
<a name="ts-fast-launch-sc-insufficient-perms-solution"></a>

验证启用 EC2 Fast Launch 的 IAM 主体（用户或角色）是否附加了 `EC2FastLaunchFullAccess` 策略。此 AWS 托管式策略会授予对所有 EC2 Fast Launch 资源的完全访问权限。要查看此策略的权限，请参阅《AWS 托管式策略参考》中的 [EC2FastLaunchFullAccess](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/EC2FastLaunchFullAccess.html) 策略**。