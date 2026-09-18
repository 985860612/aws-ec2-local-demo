

# 排查 Amazon EC2 实例启动问题
<a name="troubleshooting-launch"></a>

以下问题排查技巧有助于解决启动 Amazon EC2 实例时出现的问题。

**Topics**
+ [设备名称无效](#troubleshooting-launch-devicename)
+ [超出实例限制](#troubleshooting-launch-limit)
+ [实例容量不足](#troubleshooting-launch-capacity)
+ [当前不支持请求的配置。请查看文档以了解支持的配置。](#troubleshooting-instance-configuration)
+ [实例立即终止](#troubleshooting-launch-internal)
+ [权限不足](#troubleshooting-launch-permissions)
+ [Windows 启动后，CPU 使用率短时增高（仅限 Windows 实例）](#high-cpu-issue)
+ [启动启用 IMDSv1 的实例时失败](#launching-an-imdsv1-enabled-instance-fails)

## 设备名称无效
<a name="troubleshooting-launch-devicename"></a>

### 说明
<a name="troubleshooting-launch-devicename-description"></a>

在尝试启动新实例时，您将收到 `Invalid device name {{device_name}}` 错误。

### 原因
<a name="troubleshooting-launch-devicename-cause"></a>

如果您在尝试启动实例时遇到此错误，则请求中为一个或多个卷指定的设备名称无效。可能的原因包括：
+ 所选 AMI 目前可能在使用该设备名称。
+ 该设备名称可能是为根卷保留的。
+ 该设备名称可能用于请求中的另一个卷。
+ 该设备名称可能对操作系统无效。

### 解决方案
<a name="troubleshooting-launch-devicename-solution"></a>

要解决问题，请执行以下操作：
+ 确保所选 AMI 未使用该设备名称。运行以下命令，查看 AMI 使用的设备名称。

  ```
  aws ec2 describe-images --image-id {{ami-0abcdef1234567890}} --query 'Images[*].BlockDeviceMappings[].DeviceName'
  ```
+ 确保没有使用为根卷保留的设备名称。有关更多信息，请参阅 [可用设备名称](device_naming.md#available-ec2-device-names)。
+ 确保在请求中指定的每个卷都有唯一的设备名称。
+ 确保指定的设备名称采用正确格式。有关更多信息，请参阅 [可用设备名称](device_naming.md#available-ec2-device-names)。

## 超出实例限制
<a name="troubleshooting-launch-limit"></a>

### 说明
<a name="troubleshooting-launch-limit-description"></a>

在尝试启动新实例或重新启动已停止的实例时，您将收到 `InstanceLimitExceeded` 错误。

### 原因
<a name="troubleshooting-launch-limit-cause"></a>

在尝试启动新实例或重新启动已停止的实例时，如果您已达到可在区域中启动的实例的数目限制，则将收到 `InstanceLimitExceeded` 错误。在创建 AWS 账户时，我们根据区域设置可运行的实例数的默认限制。

### 解决方案
<a name="troubleshooting-launch-limit-solution"></a>

您可以根据区域请求提高实例限制。有关更多信息，请参阅 [Amazon EC2 Service Quotas](ec2-resource-limits.md)。

## 实例容量不足
<a name="troubleshooting-launch-capacity"></a>

### 说明
<a name="troubleshooting-launch-capacity-description"></a>

在尝试启动新实例或重新启动已停止的实例时，您将收到 `InsufficientInstanceCapacity` 错误。

### 原因
<a name="troubleshooting-launch-capacity-description"></a>

如果您在尝试启动实例或重新启动已停止的实例时收到此错误，则表示 AWS 当前没有足够的可用按需容量来服务您的请求。

### 解决方案
<a name="troubleshooting-launch-capacity-description"></a>

要解决该问题，请尝试以下操作：
+ 等待几分钟，然后再次提交您的请求；容量可能经常转移。
+ 提交减少了实例数的新请求。例如，如果您要提交 1 个启动包含 15 个实例的请求，请改为尝试提交 3 个包含 5 个实例的请求或 15 个包含 1 个实例的请求。
+ 如果您要启动实例，请提交新请求，无需指定可用区。
+ 如果您要启动实例，请使用其他实例类型 (可在后期调整大小) 提交新请求。有关更多信息，请参阅 [Amazon EC2 实例类型更改](ec2-instance-resize.md)。
+ 如果您将实例启动到集群置放群组中，则会获得容量不足错误。

## 当前不支持请求的配置。请查看文档以了解支持的配置。
<a name="troubleshooting-instance-configuration"></a>

### 说明
<a name="troubleshooting-instance-configuration-description"></a>

当您尝试启动新实例时会出现 `Unsupported` 错误，因为不支持实例配置。

### 原因
<a name="troubleshooting-instance-configuration-cause"></a>

错误消息提供了更多详细信息。例如，指定的区域或可用区可能不支持实例类型或实例购买选项。

### 解决方案
<a name="troubleshooting-instance-configuration-solution"></a>

尝试其他实例配置。要搜索符合您要求的实例类型，请参阅 [查找 Amazon EC2 实例类型](instance-discovery.md)。

## 实例立即终止
<a name="troubleshooting-launch-internal"></a>

### 说明
<a name="troubleshooting-launch-internal-description"></a>

您的实例会从 `pending` 状态变为 `terminated` 状态。

### 原因
<a name="troubleshooting-launch-internal-cause"></a>

下面是实例可能立即终止的一些原因：
+ 您已超出 EBS 卷限制。有关更多信息，请参阅 [Amazon EC2 实例的 Amazon EBS 卷限制](volume_limits.md)。
+ EBS 快照损坏。
+ 根 EBS 卷已加密，但您无权访问用于解密的 KMS 密钥。
+ 在块储存设备映射中为 AMI 指定的快照已加密，但您无权访问用于解密的 KMS 密钥，或者您无权访问 KMS 密钥 来加密还原的卷。
+ 您用来启动实例的由 Amazon S3 支持的 AMI 缺少必需部分（一个 image.part.*xx* 文件）

有关更多信息，请通过以下某种方法了解终止原因。

**使用 Amazon EC2 控制台了解终止原因**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances**，然后选择实例。

1. 在第一个选项卡上，在**状态转换原因**旁边查看原因。

**使用 AWS CLI 控制台了解终止原因**

1. 使用 [describe-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instances.html) 命令并指定实例 ID。

   ```
   aws ec2 describe-instances --instance-id {{i-1234567890abcdef0}}
   ```

1. 检查命令返回的 JSON 响应，并记下 `StateReason` 响应元素中的值。

   下面的代码块显示了 `StateReason` 响应元素的示例。

   ```
   "StateReason": {
     "Message": "Client.VolumeLimitExceeded: Volume limit exceeded", 
     "Code": "Server.InternalError"
   },
   ```

**使用 AWS CloudTrail 了解终止原因**  
有关更多信息，请参阅 *AWS CloudTrail 用户指南*中的[使用 CloudTrail 事件历史记录查看事件](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/view-cloudtrail-events.html)。

### 解决方案
<a name="troubleshooting-launch-internal-solution"></a>

根据找到的终止原因，执行以下某项操作：
+ **`Client.VolumeLimitExceeded: Volume limit exceeded`** - 删除未使用的卷。您可以[提交请求](https://console.aws.amazon.com/support/home#/case/create?issueType=service-limit-increase&limitType=service-code-ebs)，要求提高卷限制。
+ **`Client.InternalError: Client error on launch`** – 确保您具有访问用于解密和加密卷的 AWS KMS keys 所需的权限。有关更多信息，请参阅 *AWS Key Management Service 开发人员指南*中的[在 AWS KMS 中使用密钥策略](https://docs.aws.amazon.com/kms/latest/developerguide/key-policies.html)。

## 权限不足
<a name="troubleshooting-launch-permissions"></a>

### 说明
<a name="troubleshooting-launch-permissions-description"></a>

在尝试启动新实例时出现 `"{{errorMessage}}": "You are not authorized to perform this operation."` 错误，并且启动失败。

### 原因
<a name="troubleshooting-launch-permissions-cause"></a>

如果您在尝试启动实例时出现此错误，则说明您没有启动该实例所需的 IAM 权限。

可能缺少以下权限：
+ `ec2:RunInstances`
+ `iam:PassRole`

也可能缺少其他权限。有关启动实例所需的权限列表，请参阅 [示例：使用 EC2 启动实例向导](iam-policies-ec2-console.md#ex-launch-wizard) 和 [启动实例 (RunInstances)](ExamplePolicies_EC2.md#iam-example-runinstances) 下的示例 IAM policy。

### 解决方案
<a name="troubleshooting-launch-permissions-solution"></a>

要解决问题，请执行以下操作：
+ 如果您以 IAM 用户身份发出请求，请验证您拥有以下权限：
  + `ec2:RunInstances`对通配符资源 ("\*") 执行 操作的许可
  + `iam:PassRole` 对匹配角色 ARN (例如 ) 的资源执行操作的权限。`arn:aws:iam::999999999999:role/ExampleRoleName`
+ 如果您没有上述权限，请[编辑与 IAM 角色或用户关联的 IAM policy](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_manage-edit.html) 以添加缺少的必需权限。

如果问题并未解决且仍然出现启动失败错误，您可以解码错误中包含的授权失败消息。解码后的消息包含 IAM policy 中缺少的权限。有关更多消息，请参阅[在 EC2 实例启动期间收到“UnauthorizedOperation”错误消息后，如何解码授权失败消息？](https://repost.aws/knowledge-center/ec2-not-auth-launch)

## Windows 启动后，CPU 使用率短时增高（仅限 Windows 实例）
<a name="high-cpu-issue"></a>

**注意**  
此故障排除技巧仅适用于 Windows 实例。

如果将 Windows Update 设置为 **Check for updates but let me choose whether to download and install them (检查更新，但允许我选择是否下载并安装它们)**（默认实例设置），则此检查可能会在实例上消耗 50 - 99% 的 CPU。如果此 CPU 消耗会导致您的应用程序出现问题，您可手动在 **Control Panel** 中更改 Windows Update 设置或者使用 Amazon EC2 用户数据字段中的以下脚本：

```
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\WindowsUpdate\Auto Update" /v AUOptions /t REG_DWORD /d {{3}} /f net stop wuauserv net start wuauserv
```

运行此脚本时，为 /d 指定一个值。默认值为 3。可能的值包括：

1. 从未检查更新

1. 检查更新，但允许我选择是否下载并安装它们

1. 下载更新，但允许我选择是否安装它们

1. 自动安装更新

在为您的实例修改用户数据后，可运行它。有关更多信息，请参阅[启动时在 Windows 实例上运行命令](user-data.md)。

## 启动启用 IMDSv1 的实例时失败
<a name="launching-an-imdsv1-enabled-instance-fails"></a>

### 说明
<a name="launching-an-imdsv1-enabled-instance-fails-description"></a>

您会获得 `UnsupportedOperation` 异常并收到以下消息：

`You can't launch instances with IMDSv1 because httpTokensEnforced is enabled for this account. Either launch the instance with httpTokens=required or contact your account owner to disable httpTokensEnforced using the ModifyInstanceMetadataDefaults API or the account settings in the EC2 console.`

### 原因
<a name="launching-an-imdsv1-enabled-instance-fails-cause"></a>

在 EC2 账户设置或 AWS 组织声明性策略强制使用 IMDSv2 (`httpTokensEnforced = enabled`) 的账户中，尝试启动新实例并启用 IMDSv1 (`httpTokens = optional`) 时，将会引发此错误。

### 解决方案
<a name="launching-an-imdsv1-enabled-instance-fails-solution"></a>

如果您已准备好仅使用 IMDSv2，请在禁用 IMDSv1 的情况下启动实例 (`httpTokens = required`)。要检查准备就绪，请参阅[转换为使用 实例元数据服务版本 2](instance-metadata-transition-to-version-2.md)。

如果仍需要在新实例或现有实例上支持 IMDSv1，则需要在该区域为该账户禁用 IMDSv2 强制使用。要禁用 IMDSv2 强制使用，请将 `HttpTokensEnforced` 设置为 `disabled`。有关更多信息，请参阅《Amazon EC2 API 参考》中的 [ModifyInstanceMetadataDefaults](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_ModifyInstanceMetadataDefaults.html)。如果您更喜欢使用控制台来配置此设置，请参阅[在账户级别强制使用 IMDSv2](configuring-IMDS-new-instances.md#enforce-imdsv2-at-the-account-level)。

 