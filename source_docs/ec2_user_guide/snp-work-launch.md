

# 为 EC2 实例启用 AMD SEV-SNP
<a name="snp-work-launch"></a>

您可以在启用了 AMD SEV-SNP 的情况下启动实例。启动实例后便无法启用 AMD SEV-SNP。

**Topics**
+ [分配使用 AMD SEV-SNP 的专属主机](#snp-allocate-dh)
+ [在 AMD SEV-SNP 专属主机上启动实例](#snp-launch-instance)
+ [更新 AMD SEV-SNP 专属主机上的固件](#snp-firmware)
+ [在共享租赁上启动配备 AMD SEV-SNP 的实例](#snp-shared-tenancy)
+ [检查 EC2 实例是否启用了 AMD SEV-SNP](#snp-work-check)

## 分配使用 AMD SEV-SNP 的专属主机
<a name="snp-allocate-dh"></a>

在专属主机上启动带有 AMD SEV-SNP 的实例之前，必须分配一台启用了 AMD SEV-SNP 支持的专属主机。您可以按实例系列（例如 m6a、r6a 或 c6a）分配专属主机，然后可以在主机上运行该系列中任何支持的实例类型。在任何广告 AWS 区域 中，您都可以分配带有 AMD SEV-SNP 的专属主机。

------
#### [ Console ]

**分配已启用 AMD SEV-SNP 的专属主机**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**专属主机**。

1. 选择**分配专属主机**

1. 对于 **AMD SEV-SNP**，**选择启用**。

1. 根据需要配置其他主机设置，然后选择**分配**。

------
#### [ AWS CLI ]

**分配已启用 AMD SEV-SNP 的专属主机**  
将 [allocate-hosts](https://docs.aws.amazon.com/cli/latest/reference/ec2/allocate-hosts.html) 命令与 `--instance-type` 和 `--cpu-options` 参数一起使用。

```
aws ec2 allocate-hosts \
    --instance-type "{{m6a.large}}" \
    --availability-zone "{{us-east-1a}}" \
    --auto-placement "off" \
    --cpu-options AmdSevSnp=enabled \
    --quantity 1
```

下面是示例输出。

```
{
    "HostIds": [
        "h-0123456789abcdef0"
    ]
}
```

------

**注意**  
当您分配启用了 AMD SEV-SNP 的专属主机时，主机将在 AWS 应用最新固件时进入 `configuring` 状态。这可能需要几分钟至 2 个小时。您需要在 `configuring` 状态期间支付费用。

## 在 AMD SEV-SNP 专属主机上启动实例
<a name="snp-launch-instance"></a>

配置专属主机后，您可以在启用 AMD SEV-SNP 的情况下启动实例。

**注意**  
您还可以在分配给 AMD SEV-SNP 的专属主机上启动未启用 AMD SEV-SNP 的实例。AMD SEV-SNP 和非 AMD SEV-SNP 实例都可以在同一台主机上并排运行。

------
#### [ AWS CLI ]

**在专属主机上启动使用 AMD SEV-SNP 的实例**  
使用 `--cpu-options` 和 `--placement` 选项运行 [run-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/run-instances.html) 命令。将 {{h-0123456789abcdef0}} 替换为您分配的专属主机的 ID。

```
aws ec2 run-instances \
    --instance-type {{m6a.xlarge}} \
    --image-id {{ami-0123456789example}} \
    --cpu-options AmdSevSnp=enabled \
    --placement HostId={{h-0123456789abcdef0}}
```

------
#### [ PowerShell ]

**在专属主机上启动使用 AMD SEV-SNP 的实例**  
将 [New-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2Instance.html) cmdlet 与 `-CpuOption` 和 `-Placement_HostId` 参数结合使用。

```
New-EC2Instance `
    -InstanceType {{m6a.xlarge}} `
    -ImageId {{ami-0123456789example}} `
    -CpuOption @{AmdSevSnp="enabled"} `
    -Placement_HostId {{h-0123456789abcdef0}}
```

------

## 更新 AMD SEV-SNP 专属主机上的固件
<a name="snp-firmware"></a>

当您分配已启用 AMD SEV-SNP 的专属主机时，AWS 会将最新的可用固件应用于该主机。固件更新可能包括 AMD 提供的安全补丁和功能改进。

要应用固件更新，请分配一台新主机（接收最新固件），将您的实例移至新主机，然后释放旧主机。

1. 分配已启用 AMD SEV-SNP 的新专属主机。新主机将收到最新的可用固件。有关更多信息，请参阅 [分配使用 AMD SEV-SNP 的专属主机](#snp-allocate-dh)。

1. 停止旧专属主机上正在运行的实例。

   ```
   aws ec2 stop-instances \
       --instance-ids {{i-0123456789example}}
   ```

1. 修改实例放置位置以定位新的专属主机。使用 [modify-instance-placement](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-instance-placement.html) 命令。

   ```
   aws ec2 modify-instance-placement \
       --instance-id {{i-0123456789example}} \
       --host-id {{h-09876543210abcdef}}
   ```

1. 在新专属主机上启动实例。

   ```
   aws ec2 start-instances \
       --instance-ids {{i-0123456789example}}
   ```

1. 释放旧的专属主机 使用 [release-hosts](https://docs.aws.amazon.com/cli/latest/reference/ec2/release-hosts.html) 命令。

   ```
   aws ec2 release-hosts \
       --host-ids {{h-0123456789abcdef0}}
   ```

**注意**  
您接收专属主机的维护通知的方式，与其他专属主机维护事件的接收方式相同。收到通知后，请按照上述步骤移至固件已更新的新主机。

## 在共享租赁上启动配备 AMD SEV-SNP 的实例
<a name="snp-shared-tenancy"></a>

您可以在美国东部（俄亥俄州）和欧洲地区（爱尔兰）使用共享租赁启动实例。

------
#### [ AWS CLI ]

**在共享租赁上启动配备 AMD SEV-SNP 的实例**  
使用带 `--cpu-options` 选项的 [run-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/run-instances.html) 命令。

```
aws ec2 run-instances \
    --instance-type {{m6a.xlarge}} \
    --image-id {{ami-0123456789example}} \
    --cpu-options AmdSevSnp=enabled
```

------
#### [ PowerShell ]

**在共享租赁上启动配备 AMD SEV-SNP 的实例**  
将 [New-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2Instance.html) cmdlet 与 `-CpuOption` 参数结合使用。

```
New-EC2Instance `
    -InstanceType {{m6a.xlarge}} `
    -ImageId {{ami-0123456789example}} `
    -CpuOption @{AmdSevSnp="enabled"}
```

------

## 检查 EC2 实例是否启用了 AMD SEV-SNP
<a name="snp-work-check"></a>

您可以查找已启用 AMD SEV-SNP 的实例。Amazon EC2 控制台不显示此信息。

------
#### [ AWS CLI ]

**检查实例是否启用了 AMD SEV-SNP。**  
使用 [describe-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instances.html) 命令。

```
aws ec2 describe-instances \
    --instance-ids {{i-1234567890abcdef0}} \
    --query Reservations[].Instances[].CpuOptions
```

下面是示例输出。如果 `AmdSevSnp` 中不存在 `CpuOptions`，则禁用 AMD SEV-SNP。

```
[
    {
        "AmdSevSnp": "enabled",
        "CoreCount": 1,
        "ThreadsPerCore": 2
    }
]
```

------
#### [ PowerShell ]

**检查实例是否启用了 AMD SEV-SNP。**  
使用 [Get-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2Instance.html) cmdlet。

```
(Get-EC2Instance `
    -InstanceId {{i-1234567890abcdef0}}).Instances.CpuOptions
```

下面是示例输出。如果不存在的 `AmdSevSnp` 值，则会禁用 AMD SEV-SNP。

```
AmdSevSnp CoreCount ThreadsPerCore
--------- --------- --------------
enabled   1         2
```

------
#### [ AWS CloudTrail ]

实例启动请求出现 AWS CloudTrail 事件时，以下属性将指示该实例已启用 AMD SEV-SNP。

```
"cpuOptions": {"AmdSevSnp": "enabled"}
```

------