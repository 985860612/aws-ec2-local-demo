

# 监控 EC2 Fast Launch
<a name="win-fast-launch-monitor"></a>

本节介绍如何监控账户中已启用 EC2 Fast Launch 的 Amazon EC2 Windows Server AMI。

## 使用 EventBridge 监控 EC2 Fast Launch 的状态更改
<a name="win-monitor-fast-launch-events"></a>

如果启用 EC2 Fast Launch 的 Windows AMI 状态发生更改，Amazon EC2 就会生成 `EC2 Fast Launch State-change Notification` 事件。然后，Amazon EC2 会将状态更改事件发送到 Amazon EventBridge（以前称为 Amazon CloudWatch Events）。

您可以创建 EventBridge 规则来触发一个或多个操作以响应状态更改事件。例如，您可以创建 EventBridge 规则，检测何时启用了 EC2 Fast Launch，并执行以下操作：
+ 将消息发送到 Amazon SNS 主题以通知订阅者。
+ 调用执行某些操作的 Lambda 函数。
+ 将状态更改数据发送到 Amazon Data Firehose 以进行分析。

有关更多信息，请参阅《Amazon EventBridge 用户指南》**中的[创建对事件作出反应的 Amazon EventBridge 规则](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-create-rule.html)。

**状态更改事件**  
EC2 Fast Launch 功能会尽力发出 JSON 格式的状态更改事件。Amazon EC2 会近乎实时地将事件发送到 EventBridge。本部分介绍了事件字段并显示了事件格式的示例。

**`EC2 Fast Launch State-change Notification`**

**imageId**  
识别 EC2 Fast Launch 状态发生更改的 AMI。

**resourceType**  
用于预调配资源类型。支持的值为：`snapshot`。默认值为 `snapshot`。

**状态**  
指定 AMI 的 EC2 Fast Launch 功能的当前状态。有效值包括：  
+ **正在启用** – 您已为该 AMI 启用了 EC2 Fast Launch 功能，并且 Amazon EC2 已开始为预置过程创建快照。
+ **启用失败** – 首次为 AMI 启用 EC2 Fast Launch 功能时出现错误，导致预置过程失败。这种情况可能在预调配过程中随时发生。
+ **已启用** – EC2 Fast Launch 功能已启用。Amazon EC2 为新启用的 EC2 Fast Launch AMI 创建首张预置快照后，状态会立即变为 `enabled`。如果 AMI 已启用并再次执行预调配过程，状态会立即更改。
+ **启用失败** – 仅当 EC2 Fast Launch AMI 并非首次经历预置过程时，才适用此状态。如果禁用 EC2 Fast Launch 功能后重新启用，或者在首次完成预置后发生配置更改或出现其他错误，就可能会出现这种情况。
+ **正在禁用** – AMI 所有者已为该 AMI 关闭 EC2 Fast Launch 功能，并且 Amazon EC2 已开始执行清理过程。
+ **已禁用** – EC2 Fast Launch 功能已禁用。Amazon EC2 完成清除过程后，状态会更改为 `disabled`。
+ **禁用失败** – 出现错误，导致清除过程失败。这意味着某些预调配快照可能仍保留在账户中。

**stateTransitionReason**  
EC2 Fast Launch AMI 的状态发生更改的原因。

**注意**  
此事件消息中的所有字段均为必填字段。

以下示例演示了一个新启用的 EC2 Fast Launch AMI，其已启动首个实例来启动预置过程。此时，状态为 `enabling`。Amazon EC2 创建首个预调配快照后，状态更改为 `enabled`。

```
{
	"version": "0",
	"id": "01234567-0123-0123-0123-012345678901",
	"detail-type": "EC2 Fast Launch State-change Notification",
	"source": "aws.ec2",
	"account": "123456789012",
	"time": "2022-08-31T20:30:12Z",
	"region": "us-east-1",
	"resources": [
		"arn:aws:ec2:us-east-1:123456789012:image/ami-123456789012"
	],
	"detail": {
		"imageId": "ami-123456789012",
		"resourceType": "snapshot",
		"state": "enabling",
		"stateTransitionReason": "Client.UserInitiated"
	}
}
```

## 使用 CloudWatch 监控 EC2 Fast Launch 指标
<a name="win-monitor-fast-launch-metrics"></a>

启用了 EC2 Fast Launch 的 Amazon EC2 AMI 会向 Amazon CloudWatch 发送指标。可使用 AWS 管理控制台、AWS CLI 或 API 列出 EC2 Fast Launch 发送到 CloudWatch 的指标。`AWS/EC2` 命名空间包括以下 EC2 Fast Launch 指标：


| 指标 | 描述 | 
| --- | --- | 
| NumberOfAvailableFastLaunchSnapshots | 每个启用 EC2 Fast Launch 的 AMI 可用的预置快照数量。 | 
| NumberOfInstancesFastLaunched | 每个启用 EC2 Fast Launch 的 AMI 从预置快照启动的实例数。 | 
| NumberOfInstancesNotFastLaunched | 由于启动时缺乏可用预置快照而导致冷启动的每个启用 EC2 Fast Launch 的 AMI 实例数量。 | 
| FastLaunchSnapshotUsedToRefillStartTime | 为了在使用现有快照后创建另一个快照，Amazon EC2 从启用了 EC2 Fast Launch 的 AMI 中启动新映像的时间戳。 | 
| FastLaunchSnapshotCreationTime | 测量 Amazon EC2 启动实例并为启用了 EC2 Fast Launch 的 AMI 创建快照所花费的时间。 | 