

# 查看 AMI 使用情况
<a name="your-ec2-ami-usage"></a>

如果与其他 AWS 账户共享 Amazon 系统映像 (AMI)（无论是与特定 AWS 账户、组织、组织单元 (OU) 还是公开），可以通过创建 AMI 使用情况报告来了解这些 AMI 的使用情况。这些报告可让您了解以下内容：
+ 哪些 AWS 账户正在 EC2 实例或启动模板中使用您的 AMI
+ 引用每个 AMI 的 EC2 实例或启动模板数量

AMI 使用情况报告可帮助您更有效地管理 AMI，方式如下：
+ 识别引用 AMI 的 AWS 账户和资源类型，以便您可以安全地取消注册或禁用 AMI。
+ 识别未使用的 AMI 以取消注册，从而降低存储成本。
+ 识别最常用的 AMI。

**Topics**
+ [AMI 使用情况报告的工作原理](#how-ami-usage-reports-work)
+ [创建 AMI 使用情况报告](#create-ami-usage-reports)
+ [查看 AMI 使用情况报告](#view-ami-usage-reports)
+ [删除 AMI 使用情况报告](#delete-ami-usage-reports)
+ [报告配额](#ami-usage-report-quotas)

## AMI 使用情况报告的工作原理
<a name="how-ami-usage-reports-work"></a>

在创建 AMI 使用情况报告时，可以指定：
+ 要报告的 AMI。
+ 要检查的 AWS 账户（特定账户或所有账户）。
+ 要检查的资源类型（EC2 实例、启动模板或两者）。
+ 对于启动模板，要检查的版本数（默认为最新 20 个版本）。

Amazon EC2 为每个 AMI 创建一份单独的报告。每份报告都提供：
+ 使用 AMI 的 AWS 账户列表。
+ 按每个账户的资源类型划分的引用 AMI 的资源计数。请注意，对于启动模板，如果在启动模板的多个版本中引用了某个 AMI，则计数仅为 1。

**重要**  
当您生成 AMI 使用情况报告时，它可能不包含最新的活动。过去 24 小时的实例活动和过去几天的启动模板活动可能不会出现在报告中。

Amazon EC2 会在报告创建 30 天后自动删除该报告。您可以从 EC2 控制台下载报告以在本地保留。

## 创建 AMI 使用情况报告
<a name="create-ami-usage-reports"></a>

要查看 AMI 的使用情况，您必须首先创建 AMI 使用情况报告，指定要报告的账户和资源类型。报告创建完成后，您可以查看报告的内容。您也可以从 EC2 控制台下载报告。

------
#### [ Console ]

**创建 AMI 使用情况报告**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **AMI**。

1. 选择一个 AMI，然后选择**操作**、**AMI 使用情况**、**查看我的 AMI 使用情况**。

1. 在**创建我的 AMI 使用情况报告**页面上，执行下列操作：

   1. 对于**资源类型**，选择一个或多个要报告的资源类型。

   1. 对于**账户 ID**，执行下列操作之一：
      + 选择**指定账户 ID**，然后为要报告的每个账户选择**添加账户 ID**。
      + 选择**包括所有帐户**以报告所有帐户。

   1. 选择**创建我的 AMI 使用情况报告**。

1. 在 AMI 页面上，选择**我的 AMI 使用情况**选项卡。

1. 选择一个报告 ID 来查看其详细信息。

------
#### [ AWS CLI ]

**为账户列表创建 AMI 使用情况报告**  
使用带以下必需参数的 [create-image-usage-report](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-image-usage-report.html) 命令：
+ `--image-id` – 要报告的 AMI 的 ID。
+ `--resource-types` – 要检查的资源类型。在下面的示例中，要检查的资源类型是 EC2 实例和启动模板。此外，还指定要检查的启动模板版本的数量 (`version-depth={{100}}`)。

 要报告特定账户，请使用 `--account-ids` 参数指定要报告的每个账户的 ID。

```
aws ec2 create-image-usage-report \
    --image-id {{ami-0abcdef1234567890}} \
    --account-ids {{111122223333 444455556666 123456789012}} \
    --resource-types ResourceType=ec2:Instance \
      'ResourceType=ec2:LaunchTemplate,ResourceTypeOptions=[{OptionName=version-depth,OptionValues={{100}}}]'
```

**创建所有账户的 AMI 使用情况报告**  
要使用指定 AMI 报告所有账户，请使用相同的命令，但省略 `--account-ids` 参数。

```
aws ec2 create-image-usage-report \
    --image-id {{ami-0abcdef1234567890}} \
    --resource-types ResourceType=ec2:Instance \
      'ResourceType=ec2:LaunchTemplate,ResourceTypeOptions=[{OptionName=version-depth,OptionValues={{100}}}]'
```

下面是示例输出。

```
{
    "ReportId": "amiur-00b877d192f6b02d0"
}
```

**监控报告创建状态**  
使用 [describe-image-usage-reports](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-image-usage-reports.html) 命令并指定报告 ID。

```
aws ec2 describe-image-usage-reports --report-ids {{amiur-00b877d192f6b02d0}}
```

下面是示例输出。`State` 字段的初始值为 `pending`。为了能够查看报告条目，状态必须为 `available`。

```
{
    "ImageUsageReports": [
        {
            "ImageId": "ami-0e9ae3dc21c2b3a64",
            "ReportId": "amiur-abcae3dc21c2b3999",
            "ResourceTypes": [
                {"ResourceType": "ec2:Instance"}
            ],
            "State": "pending",
            "CreationTime": "2025-09-29T13:27:12.322000+00:00",
            "ExpirationTime": "2025-10-28T13:27:12.322000+00:00"
        }
    ]
}
```

------
#### [ PowerShell ]

**为账户列表创建 AMI 使用情况报告**  
使用带以下必需参数的 [New-EC2ImageUsageReport](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2ImageUsageReport.html) cmdlet：
+ `-ImageId` – 要报告的 AMI 的 ID。
+ `-ResourceType` – 要检查的资源类型。在下面的示例中，要检查的资源类型是 EC2 实例和启动模板。此外，还指定要检查的启动模板版本的数量 (`'version-depth' = {{100}}`)。

 要报告特定账户，请使用 `-AccountId` 参数指定要报告的每个账户的 ID。

```
New-EC2ImageUsageReport `
    -ImageId {{ami-0abcdef1234567890}} `
    -AccountId {{111122223333 444455556666 123456789012}} `
    -ResourceType @(
        @{ResourceType = 'ec2:Instance'},
        @{ResourceType = 'ec2:LaunchTemplate'ResourceTypeOptions = @{'version-depth' = 100}
        })
```

**创建所有账户的 AMI 使用情况报告**  
要使用指定 AMI 报告所有账户，请使用相同的命令，但省略 `-AccountId` 参数。

```
New-EC2ImageUsageReport `
    -ImageId {{ami-0abcdef1234567890}} `
    -ResourceType @(
        @{ResourceType = 'ec2:Instance'},
        @{ResourceType = 'ec2:LaunchTemplate'ResourceTypeOptions = @{'version-depth' = 100}
        })
```

下面是示例输出。

```
ReportId
--------
amiur-00b877d192f6b02d0
```

**监控报告创建状态**  
使用 [Get-EC2ImageUsageReport](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2ImageUsageReport.html) 命令并指定报告 ID。

```
Get-EC2ImageUsageReport -ReportId {{amiur-00b877d192f6b02d0}}
```

下面是示例输出。`State` 字段的初始值为 `pending`。为了能够查看报告条目，状态必须为 `available`。

```
ImageUsageReports
-----------------
{@{ImageId=ami-0e9ae3dc21c2b3a64; ReportId=amiur-abcae3dc21c2b3999; ResourceTypes=System.Object[]; State=pending; CreationTime=2025-09-29; ExpirationTime=2025-10-28}}
```

------

## 查看 AMI 使用情况报告
<a name="view-ami-usage-reports"></a>

可以查看过去 30 天内为 AMI 创建的所有使用情况报告。Amazon EC2 会在报告创建 30 天后自动删除该报告。

对于每个报告，您可以查看正在使用 AMI 的 AWS 账户，并且对于每个帐户，可以按资源类型查看引用 AMI 的资源计数。您还可以查看启动报告创建的时间。仅当报告处于**完成**（控制台）或 `available` (AWS CLI) 状态时，此信息才可用。

**重要**  
当您生成 AMI 使用情况报告时，它可能不包含最新的活动。过去 24 小时的实例活动和过去几天的启动模板活动可能不会出现在报告中。

------
#### [ Console ]

**查看 AMI 使用情况报告**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **AMI**。

1. 选择 AMI。

1. 选择**我的使用情况报告**选项卡。

   报告列表显示：
   + 过去 30 天内为选定 AMI 生成的所有报告。
   + 对于每个报告，**报告启动时间**列显示创建报告的日期。

1. 选择报告的 ID 以查看其内容。

1. 要返回 AMI 详细信息页面上的**我的使用情况报告**选项卡，请选择**查看此 AMI 的所有报告**。

------
#### [ AWS CLI ]

**列出指定 AMI 的所有 AMI 使用情况报告**  
使用 [describe-image-usage-reports](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-image-usage-reports.html) 命令并指定 AMI 的 ID 以获取其报告列表。

```
aws ec2 describe-image-usage-reports --image-ids {{ami-0abcdef1234567890}}
```

下面是示例输出。每个报告 ID 都与扫描的资源类型以及报告创建和到期日期一起列出。您可以使用此信息来识别您想要查看其条目的报告。

```
{
  "ImageUsageReports": [
    {
      "ImageId": "ami-0abcdef1234567890",
      "ReportId": "amiur-1111111111111111",
      "ResourceTypes": [
        {
          "ResourceType": "ec2:Instance"
        }
      ],
      "State": "available",
      "CreationTime": "2025-09-29T13:27:12.322000+00:00",
      "ExpirationTime": "2025-10-28T13:27:12.322000+00:00",
      "Tags": []
    },
    {
      "ImageId": "ami-0abcdef1234567890",
      "ReportId": "amiur-22222222222222222",
      "ResourceTypes": [
        {
          "ResourceType": "ec2:Instance"
        },
        {
          "ResourceType": "ec2:LaunchTemplate"
        }
      ],
      "State": "available",
      "CreationTime": "2025-10-01T13:27:12.322000+00:00",
      "ExpirationTime": "2025-10-30T13:27:12.322000+00:00",
      "Tags": []
    }
  ],
  "NextToken": "opaque"
}
```

**查看指定 AMI 的 AMI 使用情况报告的内容**  
使用 [describe-image-usage-report-entries](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-image-usage-report-entries.html) 命令并指定 AMI 的 ID。响应会返回指定 AMI 的所有报告，显示使用过 AMI 的账户及其资源计数。

```
aws ec2 describe-image-usage-report-entries --image-ids {{ami-0abcdef1234567890}}
```

下面是示例输出。

```
{
  "ImageUsageReportEntries": [
    {
      "ImageId": "ami-0abcdef1234567890",
      "ResourceType": "ec2:Instance",
      "AccountId": "123412341234",
      "UsageCount": 15,
      "ReportCreationTime": "2025-09-29T13:27:12.322000+00:00",
      "ReportId": "amiur-1111111111111111"
    },
    {
      "ImageId": "ami-0abcdef1234567890",
      "ResourceType": "ec2:Instance",
      "AccountId": "123412341234",
      "UsageCount": 2,
      "ReportCreationTime": "2025-10-01T13:27:12.322000+00:00",
      "ReportId": "amiur-22222222222222222"
    },
    {
      "ImageId": "ami-0abcdef1234567890",
      "ResourceType": "ec2:Instance",
      "AccountId": "001100110011",
      "UsageCount": 39,
      "ReportCreationTime": "2025-10-01T13:27:12.322000+00:00",
      "ReportId": "amiur-22222222222222222"
    }
  ],
  "NextToken": "opaque"
}
```

**查看指定报告的 AMI 使用情况报告的内容**  
使用 [describe-image-usage-report-entries](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-image-usage-report-entries.html) 命令并指定报告的 ID。响应会返回指定报告的所有条目，显示使用过 AMI 的账户及其资源计数。

```
aws ec2 describe-image-usage-report-entries --report-ids {{amiur-11111111111111111}}
```

下面是示例输出。

```
{
  "ImageUsageReportEntries": [
    {
      "ImageId": "ami-0abcdef1234567890",
      "ResourceType": "ec2:Instance",
      "AccountId": "123412341234",
      "UsageCount": 15,
      "ReportCreationTime": "2025-09-29T13:27:12.322000+00:00",
      "ReportId": "amiur-11111111111111111"
    },
    {
      "ImageId": "ami-0abcdef1234567890",
      "ResourceType": "ec2:LaunchTemplate",
      "AccountId": "123412341234",
      "UsageCount": 4,
      "ReportCreationTime": "2025-09-29T13:27:12.322000+00:00",
      "ReportId": "amiur-11111111111111111"
    },
    {
      "ImageId": "ami-0abcdef1234567890",
      "ResourceType": "ec2:LaunchTemplate",
      "AccountId": "001100110011",
      "UsageCount": 2,
      "ReportCreationTime": "2025-09-29T13:27:12.322000+00:00",
      "ReportId": "amiur-11111111111111111"
    }
  ],
  "NextToken": "opaque"
}
```

------
#### [ PowerShell ]

**列出指定 AMI 的所有 AMI 使用情况报告**  
使用 [Get-EC2ImageUsageReport](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2ImageUsageReport.html) cmdlet 并指定 AMI 的 ID 以获取其报告列表。

```
Get-EC2ImageUsageReport -ImageId {{ami-0abcdef1234567890}}
```

下面是示例输出。每个报告 ID 都与扫描的资源类型以及报告创建和到期日期一起列出。您可以使用此信息来识别您想要查看其条目的报告。

```
@{
    ImageUsageReports = @(
        @{
            ImageId = "ami-0abcdef1234567890"
            ReportId = "amiur-1111111111111111"
            ResourceTypes = @(
                @{
                    ResourceType = "ec2:Instance"
                }
            )
            State = "available"
            CreationTime = "2025-09-29T13:27:12.322000+00:00"
            ExpirationTime = "2025-10-28T13:27:12.322000+00:00"
        },
        @{
            ImageId = "ami-0abcdef1234567890"
            ReportId = "amiur-22222222222222222"
            ResourceTypes = @(
                @{
                    ResourceType = "ec2:Instance"
                }
            )
            State = "available"
            CreationTime = "2025-09-30T13:27:12.322000+00:00"
            ExpirationTime = "2025-10-29T13:27:12.322000+00:00"
        },
        @{
            ImageId = "ami-0abcdef1234567890"
            ReportId = "amiur-33333333333333333"
            ResourceTypes = @(
                @{
                    ResourceType = "ec2:Instance"
                }
            )
            State = "available"
            CreationTime = "2025-10-01T13:27:12.322000+00:00"
            ExpirationTime = "2025-10-30T13:27:12.322000+00:00"
        }
    )
    NextToken = "opaque"
}
```

**查看指定 AMI 的 AMI 使用情况报告的内容**  
使用 [Get-EC2ImageUsageReportEntry](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2ImageUsageReportEntry.html) cmdlet 并指定 AMI 的 ID。响应会返回指定 AMI 的所有报告，显示使用过 AMI 的账户及其资源计数。

```
Get-EC2ImageUsageReportEntry -ImageId {{ami-0abcdef1234567890}}
```

下面是示例输出。

```
ImageUsageReportEntries : {@{
    ImageId = "ami-0abcdef1234567890"
    ResourceType = "ec2:Instance"
    AccountId = "123412341234"
    UsageCount = 15
    ReportCreationTime = "2025-09-29T13:27:12.322000+00:00"
    ReportId = "amiur-1111111111111111"
    }, @{
    ImageId = "ami-0abcdef1234567890"
    ResourceType = "ec2:Instance"
    AccountId = "123412341234"
    UsageCount = 7
    ReportCreationTime = "2025-09-30T13:27:12.322000+00:00"
    ReportId = "amiur-22222222222222222"
    }...}
NextToken : opaque
```

**查看指定报告的 AMI 使用情况报告的内容**  
使用 [Get-EC2ImageUsageReportEntry](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2ImageUsageReportEntry.html) cmdlet 并指定报告的 ID。响应会返回指定报告的所有条目，显示使用过 AMI 的账户及其资源计数。

```
Get-EC2ImageUsageReportEntry -ReportId {{amiur-11111111111111111}}
```

下面是示例输出。

```
ImageUsageReportEntries : {@{
    ImageId = "ami-0abcdef1234567890"
    ResourceType = "ec2:Instance"
    AccountId = "123412341234"
    UsageCount = 15
    ReportCreationTime = "2025-09-29T13:27:12.322000+00:00"
    ReportId = "amiur-11111111111111111"
    }, @{
    ImageId = "ami-0abcdef1234567890"
    ResourceType = "ec2:LaunchTemplate"
    AccountId = "123412341234"
    UsageCount = 4
    ReportCreationTime = "2025-09-29T13:27:12.322000+00:00"
    ReportId = "amiur-11111111111111111"
    }, @{
    ImageId = "ami-0abcdef1234567890"
    ResourceType = "ec2:LaunchTemplate"
    AccountId = "************"
    UsageCount = 2
    ReportCreationTime = "2025-09-29T13:27:12.322000+00:00"
    ReportId = "amiur-11111111111111111"
    }}
NextToken : opaque
```

------

## 删除 AMI 使用情况报告
<a name="delete-ami-usage-reports"></a>

Amazon EC2 会在报告创建 30 天后自动删除该报告。您可以在此之前手动将其删除。

------
#### [ Console ]

**删除 AMI 使用情况报告**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **AMI**。

1. 选择 AMI。

1. 选择**我的 AMI 使用情况**选项卡。

1. 选择要删除的报告旁边的选项按钮，然后选择**删除**。

------
#### [ AWS CLI ]

**删除 AMI 使用情况报告**  
使用 [delete-image-usage-report](https://docs.aws.amazon.com/cli/latest/reference/ec2/delete-image-usage-report.html) 命令并指定报告的 ID。

```
aws ec2 delete-image-usage-report --report-id {{amiur-0123456789abcdefg}}
```

------
#### [ PowerShell ]

**删除 AMI 使用情况报告**  
使用 [Remove-EC2ImageUsageReport](https://docs.aws.amazon.com/powershell/latest/reference/items/Remove-EC2ImageUsageReport.html) cmdlet 并指定报告的 ID。

```
Remove-EC2ImageUsageReport -ReportId {{amiur-0123456789abcdefg}}
```

------

## 报告配额
<a name="ami-usage-report-quotas"></a>

以下配额适用于创建 AMI 使用情况报告。限额按 AWS 区域应用。


| 说明 | 配额 | 
| --- | --- | 
| 每个 AWS 账户正在进行 (pending) 的 AMI 使用情况报告 | 2000 | 
| 每个 AMI 正在进行 (pending) 的 AMI 使用情况报告 | 1 | 