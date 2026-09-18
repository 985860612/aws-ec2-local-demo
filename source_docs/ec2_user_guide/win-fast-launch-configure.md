

# 为 Amazon EC2 Windows Server AMI 配置 EC2 Fast Launch 设置
<a name="win-fast-launch-configure"></a>

您可以为拥有的 Windows AMI 或通过 AWS 管理控制台、API、开发工具包、CloudFormation 或 AWS Command Line Interface（AWS CLI）与您共享的 AMI 配置 EC2 Fast Launch。在配置 EC2 Fast Launch 之前，请验证您的 AMI 是否满足创建预置快照所需的所有先决条件。有关更多信息，请参阅 [Windows 的 EC2 Fast Launch 先决条件](win-start-fast-launch-prereqs.md)。

为 Windows 实例启用快速启动时，Amazon EC2 会进行检查，确保您拥有从指定 AMI 和启动模板（如果提供）启动实例所需的权限，包括加密 AMI 的权限。为防止实例启动过程中出现错误，该服务会在启用 EC2 Fast Launch 之前验证您的权限。如果您没有所需的权限，则服务会返回错误，并且不会启用 EC2 Fast Launch。

EC2 Fast Launch 与 EC2 Image Builder 集成，可帮助您在启用 EC2 Fast Launch 时创建自定义映像。有关更多信息，请参阅《EC2 Image Builder 用户指南》**中的[在 EC2 快速启动启用时创建 Windows AMI 的分配设置（AWS CLI）](https://docs.aws.amazon.com/imagebuilder/latest/userguide/cr-upd-ami-distribution-settings.html#create-ami-dist-win-fast-launch)。

## 启用 EC2 Fast Launch
<a name="win-start-fast-launch"></a>

要更改这些设置，请确保您的 AMI 和运行所在的区域满足所有 [Windows 的 EC2 Fast Launch 先决条件](win-start-fast-launch-prereqs.md)。

------
#### [ Console ]

**启用 EC2 Fast Launch**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，在**映像**下选择 **AMI**。

1. 通过选择 **Name**（名称）旁边的复选框来选择要更新的 AMI。

1. 从 AMI 列表上方的**操作**菜单中，选择**配置快速启动**。这将打开**配置快速启动**页面，您可以在此页面中配置 EC2 Fast Launch 设置。

1. 要开始使用预置快照以更快地从 Windows AMI 启动实例，请选择**为 Windows 启用快速启动**复选框。

1. 从 **Set anticipated launch frequency**（设置预期的启动频率）下拉列表中，选择一个值以指定为覆盖预期实例启动卷而创建和维护的快照数量。

1. 完成更改后，选择 **Save changes**（保存更改）。

**注意**  
如果需要使用启动模板来指定某个 VPC，或为 IMDSv2 配置元数据设置，请参阅[在设置 EC2 Fast Launch 时使用启动模板](#win-fast-launch-with-template)。

------
#### [ AWS CLI ]

**启用 EC2 Fast Launch**  
使用以下 [enable-fast-launch](https://docs.aws.amazon.com/cli/latest/reference/ec2/enable-fast-launch.html) 命令，为指定的 AMI 启用 EC2 Fast Launch，这会启动六个并行实例来进行预调配。

```
aws ec2 enable-fast-launch \
    --image-id {{ami-0abcdef1234567890}}  \
    --max-parallel-launches {{6}} \
    --resource-type {{snapshot}}
```

下面是示例输出。

```
{
	"ImageId": "ami-0abcdef1234567890",
	"ResourceType": "snapshot",
	"SnapshotConfiguration": {
	    "TargetResourceCount": 10
	},
	"LaunchTemplate": {},
	"MaxParallelLaunches": 6,
	"OwnerId": "0123456789123",
	"State": "enabling",
	"StateTransitionReason": "Client.UserInitiated",
	"StateTransitionTime": "2022-01-27T22:16:03.199000+00:00"
}
```

------
#### [ PowerShell ]

**启用 EC2 Fast Launch**  
使用 [Enable-EC2FastLaunch](https://docs.aws.amazon.com/powershell/latest/reference/items/Enable-EC2FastLaunch.html) cmdlet，为指定的 AMI 启用 EC2 Fast Launch，这会启动六个并行实例来进行预调配。

```
Enable-EC2FastLaunch `
	-ImageId {{ami-0abcdef1234567890}} `
	-MaxParallelLaunch {{6}} `
	-Region {{us-west-2}} `
	-ResourceType {{snapshot}}
```

下面是示例输出。

```
ImageId               : ami-0abcdef1234567890
	LaunchTemplate        : 
	MaxParallelLaunches   : 6
	OwnerId               : 0123456789123
	ResourceType          : snapshot
	SnapshotConfiguration : Amazon.EC2.Model.FastLaunchSnapshotConfigurationResponse
	State                 : enabling
	StateTransitionReason : Client.UserInitiated
	StateTransitionTime   : 2/25/2022 12:24:11 PM
```

------

## 禁用 EC2 Fast Launch
<a name="win-stop-fast-launch"></a>

要更改这些设置，请确保您的 AMI 和运行所在的区域满足所有 [Windows 的 EC2 Fast Launch 先决条件](win-start-fast-launch-prereqs.md)。

------
#### [ Console ]

**禁用 EC2 Fast Launch**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，在**映像**下选择 **AMI**。

1. 通过选择 **Name**（名称）旁边的复选框来选择要更新的 AMI。

1. 从 AMI 列表上方的**操作**菜单中，选择**配置快速启动**。这将打开**配置快速启动**页面，您可以在此页面中配置 EC2 Fast Launch 设置。

1. 清除**为 Windows 启用快速启动**复选框，以禁用 EC2 Fast Launch 并删除预置快照。这将导致 AMI 向前为每个实例使用标准启动流程。
**注意**  
禁用 Windows 镜像优化后，任何现有的预置快照都将自动删除。必须先完成此步骤，然后才能再次开始使用该功能。

1. 完成更改后，选择 **Save changes**（保存更改）。

------
#### [ AWS CLI ]

**禁用 EC2 Fast Launch**  
使用以下 [disable-fast-launch](https://docs.aws.amazon.com/cli/latest/reference/ec2/disable-fast-launch.html) 命令，在指定的 AMI 上禁用 EC2 Fast Launch，并清理现有的预调配快照。

```
aws ec2 disable-fast-launch --image-id ami-01234567890abcedf
```

下面是示例输出。

```
{
    "ImageId": "ami-01234567890abcedf",
    "ResourceType": "snapshot",
    "SnapshotConfiguration": {},
    "LaunchTemplate": {
        "LaunchTemplateId": "lt-01234567890abcedf",
        "LaunchTemplateName": "EC2FastLaunchDefaultResourceCreation-a8c6215d-94e6-441b-9272-dbd1f87b07e2",
        "Version": "1"
    },
    "MaxParallelLaunches": 6,
    "OwnerId": "0123456789123",
    "State": "disabling",
    "StateTransitionReason": "Client.UserInitiated",
    "StateTransitionTime": "2022-01-27T22:47:29.265000+00:00"
}
```

------
#### [ PowerShell ]

**禁用 EC2 Fast Launch**  
使用 [Disable-EC2FastLaunch](https://docs.aws.amazon.com/powershell/latest/reference/items/Disable-EC2FastLaunch.html) cmdlet，在指定的 AMI 上禁用 EC2 Fast Launch，并清理现有的预调配快照。

```
Disable-EC2FastLaunch -ImageId {{ami-0abcdef1234567890}}
```

下面是示例输出。

```
ImageId               : ami-0abcdef1234567890
	LaunchTemplate        : Amazon.EC2.Model.FastLaunchLaunchTemplateSpecificationResponse
	MaxParallelLaunches   : 6
	OwnerId               : 0123456789123
	ResourceType          : snapshot
	SnapshotConfiguration : 
	State                 : disabling
	StateTransitionReason : Client.UserInitiated
	StateTransitionTime   : 2/25/2022 1:10:08 PM
```

------

## 在设置 EC2 Fast Launch 时使用启动模板
<a name="win-fast-launch-with-template"></a>

您可以使用启动模板配置一组启动参数，Amazon EC2 每次从该模板启动实例时都会使用这些参数。您可以指定用于基础映像的 AMI、实例类型、存储、网络设置等内容。

启动模板是可选的，但以下特定情况除外：在配置更快启动时，必须为 Windows AMI 使用启动模板：
+ 您必须使用启动模板为 Windows AMI 指定现有的 VPC。如果您的 AWS 账户使用默认 VPC，则不适用这一要求。
+ 如果账户包含对 Amazon EC2 实例强制实施 IMDSv2 的策略，您必须创建一个启动模板来指定元数据配置以强制实施 IMDSv2。

  使用包含 EC2 控制台的元数据配置的启动模板，或在 AWS CLI 中运行 [enable-fast-launch](https://docs.aws.amazon.com/cli/latest/reference/ec2/enable-fast-launch.html) 命令，或调用 [EnableFastLaunch](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_EnableFastLaunch.html) API 操作。

使用启动模板时，EC2 Fast Launch 不支持以下配置。如果您使用启动模板来设置 EC2 Fast Launch，则不得指定以下任何内容：
+ 用户数据脚本
+ 终止保护
+ 禁用元数据
+ 竞价型选项
+ 终止实例的关闭行为
+ 网络接口、弹性图形或竞价型实例请求的资源标签

### 指定 VPC
<a name="win-fast-launch-specify-vpc"></a>

**步骤 1：创建启动模板**  
创建一个启动模板，指定 Windows 实例的以下详细信息：
+ VPC 子网。
+ 实例类型为 `t3.xlarge`。

有关更多信息，请参阅 [创建 Amazon EC2 启动模板](create-launch-template.md)。

**步骤 2：为 EC2 Fast Launch AMI 指定启动模板**

------
#### [ Console ]

**为 EC2 Fast Launch 指定启动模板**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，在**映像**下选择 **AMI**。

1. 通过选择 **Name**（名称）旁边的复选框来选择要更新的 AMI。

1. 从 AMI 列表上方的**操作**菜单中，选择**配置快速启动**。这将打开**配置快速启动**页面，您可以在此页面中配置 EC2 Fast Launch 设置。

1. **Launch template**（启动模板）框执行筛选搜索，在当前区域的账户中查找与您输入的文本相匹配的启动模板。在框中输入完整的启动模板名称或 ID 或其一部分，以显示匹配的启动模板列表。例如，如果您在框中输入 `fast`，Amazon EC2 会在当前区域中查找您的账户中名称包含“fast”的所有启动模板。

   要创建启动模板，请选择 **Create launch template**（创建启动模板）。

1. 当您选择某个启动模板时，Amazon EC2 会在 **Source template version**（源模板版本）框中显示该模板的默认版本。要指定其他版本，请突出显示要替换的默认版本，然后在框中输入所需的版本号。

1. 完成更改后，选择 **Save changes**（保存更改）。

------
#### [ AWS CLI ]

**为 EC2 Fast Launch 指定启动模板**  
使用 [enable-fast-launch](https://docs.aws.amazon.com/cli/latest/reference/ec2/enable-fast-launch.html) 命令和 `--launch-template` 选项，并指定启动模板的名称或 ID。

```
--launch-template LaunchTemplateName={{my-launch-template}}
```

------
#### [ PowerShell ]

**为 EC2 Fast Launch 指定启动模板**  
使用 [Enable-EC2FastLaunch](https://docs.aws.amazon.com/powershell/latest/reference/items/Enable-EC2FastLaunch.html) cmdlet 以及 `-LaunchTemplate_LaunchTemplateId` 或 `-LaunchTemplate_LaunchTemplateName` 参数。

```
-LaunchTemplate_LaunchTemplateName {{my-launch-template}}
```

------

有关 EC2 启动模板的更多信息，请参阅[在 Amazon EC2 启动模板中存储实例启动参数](ec2-launch-templates.md)。

## EC2 Fast Launch 的权限检查
<a name="win-fast-launch-permissions"></a>

当您使用启动模板启用 EC2 Fast Launch 时，可以指定模板的编号版本。您还可以使用 `$Latest` 或 `$Default` 版本。如果使用其中一个别名，则该别名可以覆盖您要限制的 `ec2:RunInstances` 和 `iam:PassRole` 权限。

启用 EC2 Fast Launch 时，Amazon EC2 会根据当前的启动模板版本检查权限。`$Latest` 和 `$Default` 当时分别解析为一个特定版本。此检查会在 Amazon EC2 启用该功能之前运行。它会验证启动实例所需的权限，例如 `ec2:RunInstances` 和 `iam:PassRole` 权限。为此，EC2 Fast Launch `RunInstances` 会发出一个试运行调用，该调用会在不启动实例的情况下检查权限。如果权限不允许执行所需的操作，则 Amazon EC2 将使请求失败，并返回一个描述缺失权限的错误。Amazon EC2 不启用 EC2 Fast Launch。

此初始检查完成后，EC2 Fast Launch 会在后台创建预置快照。然后，它使用其服务相关角色的权限启动实例。每次启动实例时，它都会使用 `$Latest` 或 `$Default` 当时解析到的版本。即使初始检查后版本已更改，情况也是如此。它不会重新检查您的权限。因此，可以更新启动模板的用户可以将 IAM 角色或实例配置文件传递给实例。即使他们没有该角色的 `iam:PassRole` 权限，也可能会发生这种情况。

要确保 Amazon EC2 始终使用启用该功能时验证的版本，请指定一个带编号的启动模板版本。请勿使用 `$Latest` 或 `$Default`。

如果将 EC2 Fast Launch 配置为使用 `$Latest` 或 `$Default` 启动模板版本，则建议限制谁可以创建和管理启动模板版本。使用 IAM 策略限制对 `ec2:CreateLaunchTemplateVersion` 和 `ec2:ModifyLaunchTemplate` 等操作的访问。