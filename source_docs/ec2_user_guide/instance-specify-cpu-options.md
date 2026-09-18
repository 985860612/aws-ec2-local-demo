

# 为 Amazon EC2 实例指定 CPU 选项
<a name="instance-specify-cpu-options"></a>

在实例启动过程中以及之后都可以指定 CPU 选项。

**Topics**
+ [禁用同步多线程](#cpu-options-disable-simultaneous-multithreading)
+ [在启动时指定自定义 vCPU 数](#cpu-options-customize-vCPUs-launch)
+ [在启动模板中指定自定义 vCPU 数](#cpu-options-customize-vCPUs-launch-template)
+ [更改 EC2 实例的 CPU 选项](#change-vCPUs-after-launch)

## 禁用同步多线程
<a name="cpu-options-disable-simultaneous-multithreading"></a>

要禁用同步多线程（SMT）（也称为超线程），请为每个核心指定 1 个线程。

------
#### [ Console ]

**在启动实例期间禁用 SMT**

1. 按照 [使用控制台中的启动实例向导来启动 EC2 实例](ec2-launch-instance-wizard.md) 程序进行操作并根据需要配置实例。

1. 展开**高级详细信息**，然后选中**指定 CPU 选项**复选框。

1. 对于 **Core count (内核数)**，选择所需的 CPU 内核数量。在此示例中，要为 `r5.4xlarge` 实例指定默认 CPU 内核数，请选择 `8`。

1. 要禁用 SMT，请为**每核心线程数**选择 **1**。

1. 在 **Summary**（摘要）面板中查看实例配置，然后选择 **Launch instance**（启动实例）。有关更多信息，请参阅 [使用控制台中的启动实例向导来启动 EC2 实例](ec2-launch-instance-wizard.md)。

------
#### [ AWS CLI ]

**在启动实例期间禁用 SMT**  
使用 [run-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/run-instances.html) AWS CLI 命令，并将 `1` 参数的 `ThreadsPerCore` 值指定为 `--cpu-options`。对于 `CoreCount`，请指定 CPU 内核的数量。在此示例中，要为 `r7i.4xlarge` 实例指定默认 CPU 内核数，请指定值 `8`。

```
aws ec2 run-instances \
    --image-id {{ami-0abcdef1234567890}} \
    --instance-type {{r7i.4xlarge}} \
    --cpu-options "CoreCount={{8}},ThreadsPerCore={{1}}" \
    --key-name {{my-key-pair}}
```

------
#### [ PowerShell ]

**在启动实例期间禁用 SMT**  
使用 [New-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2Instance.html) 命令，并将 `-CpuOptions` 参数的 `ThreadsPerCore` 值指定为 `1`。对于 `CoreCount`，请指定 CPU 内核的数量。在此示例中，要为 `r7i.4xlarge` 实例指定默认 CPU 内核数，请指定值 `8`。

```
New-EC2Instance `
    -ImageId '{{ami-0abcdef1234567890}}' `
    -InstanceType '{{r7i.4xlarge}}' `
    -CpuOptions @{CoreCount={{8}}; ThreadsPerCore={{1}}} `
    -KeyName '{{my-key-pair}}'
```

------

**注意**  
要为现有实例禁用 SMT，请按照[更改 EC2 实例的 CPU 选项](#change-vCPUs-after-launch)中所示的流程操作，并将每个核心运行的线程数更改为 `1`。

## 在启动时指定自定义 vCPU 数
<a name="cpu-options-customize-vCPUs-launch"></a>

您可以在启动实例时，通过 EC2 控制台或 AWS CLI 自定义 CPU 核心数和每核心线程数。本节中的示例使用的是 `r5.4xlarge` 实例类型，该实例类型的默认设置如下：
+ CPU 核心数：8
+ 每核心线程数：2

默认情况下，实例会使用该实例类型可用的最大 vCPU 数量启动。对于这种实例类型，则共有 16 个 vCPU（8 个核心，每个核心运行 2 个线程）。有关此实例类型的更多信息，请参阅 [内存优化型实例](cpu-options-supported-instances-values.md#cpu-options-mem-optimized)。

以下示例启动一个具有 4 个 vCPU 的 `r5.4xlarge` 实例。

------
#### [ Console ]

**在实例启动期间指定自定义 vCPU 数量**

1. 按照 [使用控制台中的启动实例向导来启动 EC2 实例](ec2-launch-instance-wizard.md) 程序进行操作并根据需要配置实例。

1. 展开**高级详细信息**，然后选中**指定 CPU 选项**复选框。

1. 要获得 4 个 vCPU，请指定 2 个 CPU 内核并为每个内核指定 2 个线程，如下所示：
   + 对于**内核数**，选择 **2**。
   + 对于 **Threads per core (每内核线程数)**，选择 **2**。

1. 在 **Summary**（摘要）面板中查看实例配置，然后选择 **Launch instance**（启动实例）。有关更多信息，请参阅 [使用控制台中的启动实例向导来启动 EC2 实例](ec2-launch-instance-wizard.md)。

------
#### [ AWS CLI ]

**在实例启动期间指定自定义 vCPU 数量**  
使用 [run-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/run-instances.html) AWS CLI 命令，并在 `--cpu-options` 参数中指定 CPU 内核数和线程数。可以指定 2 个 CPU 核心并为每个核心指定 2 个线程，从而获得 4 个 vCPU。

```
aws ec2 run-instances \
    --image-id {{ami-0abcdef1234567890}} \
    --instance-type {{r7i.4xlarge}} \
    --cpu-options "CoreCount={{2}},ThreadsPerCore={{2}}" \
    --key-name {{my-key-pair}}
```

或者，也可以通过指定 4 个 CPU 核心并为每个核心指定 1 个线程（禁用 SMT）来获得 4 个 vCPU：

```
aws ec2 run-instances \
    --image-id {{ami-0abcdef1234567890}} \
    --instance-type {{r7i.4xlarge}} \
    --cpu-options "CoreCount={{4}},ThreadsPerCore={{1}}" \
    --key-name {{my-key-pair}}
```

------
#### [ PowerShell ]

**在实例启动期间指定自定义 vCPU 数量**  
使用 [New-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2Instance.html) 命令，并在 `-CpuOptions` 参数中指定 CPU 核心数和线程数。可以指定 2 个 CPU 核心并为每个核心指定 2 个线程，从而获得 4 个 vCPU。

```
New-EC2Instance `
    -ImageId '{{ami-0abcdef1234567890}}' `
    -InstanceType '{{r7i.4xlarge}}' `
    -CpuOptions @{CoreCount={{2}}; ThreadsPerCore={{2}}} `
    -KeyName '{{my-key-pair}}'
```

或者，也可以通过指定 4 个 CPU 核心并为每个核心指定 1 个线程（禁用 SMT）来获得 4 个 vCPU：

```
New-EC2Instance `
    -ImageId '{{ami-0abcdef1234567890}}' `
    -InstanceType '{{r7i.4xlarge}}' `
    -CpuOptions @{CoreCount={{4}}; ThreadsPerCore={{1}}} `
    -KeyName '{{my-key-pair}}'
```

------

## 在启动模板中指定自定义 vCPU 数
<a name="cpu-options-customize-vCPUs-launch-template"></a>

您可以在启动模板中自定义实例的 CPU 核心数和每个核心的线程数。本节中的示例使用的是 `r5.4xlarge` 实例类型，该实例类型的默认设置如下：
+ CPU 核心数：8
+ 每核心线程数：2

默认情况下，实例会使用该实例类型可用的最大 vCPU 数量启动。对于这种实例类型，则共有 16 个 vCPU（8 个核心，每个核心运行 2 个线程）。有关此实例类型的更多信息，请参阅 [内存优化型实例](cpu-options-supported-instances-values.md#cpu-options-mem-optimized)。

以下示例创建了一个启动模板，该模板指定具有 4 个 vCPU 的 `r5.4xlarge` 实例的配置。

------
#### [ Console ]

**要在启动模板中指定自定义 vCPU 数**

1. 按照 [通过指定参数创建启动模板](create-launch-template.md#create-launch-template-define-parameters) 程序进行操作并根据需要配置启动模板。

1. 展开**高级详细信息**，然后选中**指定 CPU 选项**复选框。

1. 要获得 4 个 vCPU，请指定 2 个 CPU 内核并为每个内核指定 2 个线程，如下所示：
   + 对于**内核数**，选择 **2**。
   + 对于 **Threads per core (每内核线程数)**，选择 **2**。

1. 在**摘要**面板中查看实例配置，然后选择**创建启动模板**。有关更多信息，请参阅 [在 Amazon EC2 启动模板中存储实例启动参数](ec2-launch-templates.md)。

------
#### [ AWS CLI ]

**要在启动模板中指定自定义 vCPU 数**  
使用 [create-launch-template](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-launch-template.html) AWS CLI 命令，并在 `CpuOptions` 参数中指定 CPU 核心数和线程数。可以指定 2 个 CPU 核心并为每个核心指定 2 个线程，从而获得 4 个 vCPU。

```
aws ec2 create-launch-template \
    --launch-template-name {{TemplateForCPUOptions}} \
    --version-description {{CPUOptionsVersion1}} \
    --launch-template-data file://{{template-data}}.json
```

下面是一个示例 JSON 文件，其中包含启动模板数据，包括本示例的实例配置的 CPU 选项。

```
{
    "NetworkInterfaces": [{
        "AssociatePublicIpAddress": true,
        "DeviceIndex": 0,
        "Ipv6AddressCount": 1,
        "SubnetId": "{{subnet-0abcdef1234567890}}"
    }],
    "ImageId": "{{ami-0abcdef1234567890}}",
    "InstanceType": "{{r5.4xlarge}}",
    "TagSpecifications": [{
        "ResourceType": "instance",
        "Tags": [{
            "Key":"{{Name}}",
            "Value":"{{webserver}}"
        }]
    }],
    "CpuOptions": {
        "CoreCount":{{2}},
        "ThreadsPerCore":{{2}}
    }
}
```

或者，也可以通过指定 4 个 CPU 核心并为每个核心指定 1 个线程（禁用 SMT）来获得 4 个 vCPU：

```
{
    "NetworkInterfaces": [{
        "AssociatePublicIpAddress": true,
        "DeviceIndex": 0,
        "Ipv6AddressCount": 1,
        "SubnetId": "{{subnet-0abcdef1234567890}}"
    }],
    "ImageId": "{{ami-0abcdef1234567890}}",
    "InstanceType": "{{r5.4xlarge}}",
    "TagSpecifications": [{
        "ResourceType": "instance",
        "Tags": [{
            "Key":"{{Name}}",
            "Value":"{{webserver}}"
        }]
    }],
    "CpuOptions": {
        "CoreCount":{{4}},
        "ThreadsPerCore":{{1}}
    }
}
```

------
#### [ PowerShell ]

**要在启动模板中指定自定义 vCPU 数**  
使用 [New-EC2LaunchTemplate](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2LaunchTemplate.html)。

```
New-EC2LaunchTemplate `
    -LaunchTemplateName '{{TemplateForCPUOptions}}' `
    -VersionDescription '{{CPUOptionsVersion1}}' `
    -LaunchTemplateData (Get-Content -Path '{{template-data.json}}' | ConvertFrom-Json)
```

------

## 更改 EC2 实例的 CPU 选项
<a name="change-vCPUs-after-launch"></a>

随着需求的逐渐变化，您可能需要更改现有实例的 CPU 选项配置。实例上运行的每个线程都称为一个虚拟 CPU（vCPU）。您可以通过 Amazon EC2 控制台、AWS CLI、API 或 SDK 更改现有实例中运行的 vCPU 数量。实例状态必须为 `Stopped`，然后才能进行此更改。

要查看控制台或命令行步骤，请选择与环境相匹配的选项卡。有关 API 请求和响应信息，请参阅《Amazon EC2 API 参考》中的 [ModifyInstanceCpuOptions](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_ModifyInstanceCpuOptions.html)**。

------
#### [ Console ]

按照以下过程操作，通过 AWS 管理控制台更改实例的活动 vCPU 数量。

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在左侧导航窗格中，选择 **Instances (实例)**。这将打开为当前 AWS 区域定义的实例列表。

1. 从**实例**列表中选择实例。您也可以通过选择实例链接来打开实例详细信息页面。

1. 如果实例正在运行，则必须首先停止实例，然后才能继续操作。从**实例状态**菜单中，选择**停止实例**。

1. 要更改 vCPU 配置，请从**操作**菜单的**实例设置**中，选择**更改 CPU 选项**。这将打开**更改 CPU 选项**页面。

1. 选择以下 CPU 选项之一来更改实例的配置。  
**使用默认的 CPU 选项**  
此选项会将实例重置为实例类型的默认 vCPU 数量。默认情况下会运行所有 CPU 核心的所有线程。  
**指定 CPU 选项**  
借助此选项可以配置实例上运行的 vCPU 数量。

1. 如果选择**指定 CPU 选项**，则会显示**活动 vCPU** 字段。
   + 使用第一个选择器来配置每个 CPU 核心的线程数。要禁用同步多线程，请选择 `1`。
   + 使用第二个选择器来配置在实例上运行的 CPU 数量。

   当您更改 CPU 选项选择器时，以下字段会动态更新。
   + **活动 vCPU**：CPU 核心数乘以每核心线程数，具体取决于您的选择。例如，假设您选择了 2 个线程和 4 个核心，则该值为 8 个 vCPU。
   + **总 vCPU 数**：该实例类型的最大 vCPU 数。例如，对于 `m6i.4xlarge` 实例类型，这将为 16 个 vCPU（8 个核心，每个核心运行 2 个线程）。

1. 要应用更新，请选择**更改**。

------
#### [ AWS CLI ]

按照以下过程操作，通过 AWS CLI更改实例的活动 vCPU 数量。

使用 [modify-instance-cpu-options](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/ec2/modify-instance-cpu-options.html) 命令，然后在 `--core-count` 参数中指定运行的 CPU 核心数，并在 `--threads-per-core` 参数中指定每个核心运行的线程数。

以下示例演示了对于 `m6i.4xlarge` 实例类型，用于在指定实例上运行 8 个 vCPU 的两种可能配置。这种实例类型默认为 16 个 vCPU（8 个核心，每个核心运行 2 个线程）。

**示例 1：**运行 4 个 CPU 核心，每个核心 2 个线程，总计 8 个 vCPU。

```
aws ec2 modify-instance-cpu-options \
    --instance-id {{i-1234567890abcdef0}} \

    --core-count={{4}} \
    --threads-per-core={{2}}
```

**示例 2：**通过将每个核心运行的线程数更改为 `1` 来禁用同步多线程。得出的配置同样总计运行 8 个 vCPU（8 个 CPU 核心，每个核心 1 个线程）。

```
aws ec2 modify-instance-cpu-options \
    --instance-id {{1234567890abcdef0}} \
    --core-count={{8}} \
    --threads-per-core={{1}}
```

------
#### [ PowerShell ]

**更改实例的活动 vCPU 数量**  
使用 [Edit-EC2InstanceCpuOption](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2InstanceCpuOption.html) cmdlet，在 `-CoreCount` 参数中指定运行的 CPU 核心数，并且在 `ThreadsPerCore` 参数中指定每个核心运行的线程数。

**示例 1：**运行 4 个 CPU 核心，每个核心 2 个线程，总计 8 个 vCPU。

```
Edit-EC2InstanceCpuOption `
    -InstanceId '{{i-1234567890abcdef0}}' `
    -CoreCount 4 `
    -ThreadsPerCore 2
```

**示例 2：**通过将每个核心运行的线程数更改为 `1` 来禁用同步多线程。得出的配置同样总计运行 8 个 vCPU（8 个 CPU 核心，每个核心 1 个线程）。

```
Edit-EC2InstanceCpuOption `
    -InstanceId '{{i-1234567890abcdef0}}' `
    -CoreCount 8 `
    -ThreadsPerCore 1
```

------