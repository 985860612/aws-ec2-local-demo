

# 容量预留实例集配置示例
<a name="crfleet-example-configs"></a>

以下示例创建了使用两种实例类型的容量预留实例集：`m5.4xlarge` 和 `m5.12xlarge`。

它基于指定实例类型提供的 vCPU 数量使用权重系统。总目标容量是 `480` 个 vCPU。`m5.4xlarge` 提供 16 个 vCPU 并获取 `16` 的权重，`m5.12xlarge` 提供 48 个 vCPU 并获取 `48` 的权重。此权重系统对容量预留实例集进行了配置，为 30 个 `m5.4xlarge` 实例 (480/16=30) 或 10 个 `m5.12xlarge` 实例 (480/48=10) 预留容量。

实例集被配置为确定 `m5.12xlarge` 容量的优先级并获得优先级 `1`，而 `m5.4xlarge` 则会获得较低的优先级 `2`。这意味着实例集首先将尝试预留 `m5.12xlarge` 容量，并在 Amazon EC2 的 `m5.12xlarge` 容量不足时仅尝试预留 `m5.4xlarge` 容量。

实例集为 `Windows` 实例预留容量，且预留在 `October 31, 2021` 的 `23:59:59` UTC 时会自动过期。

```
aws ec2 create-capacity-reservation-fleet \
    --total-target-capacity 480 \
    --allocation-strategy prioritized \
    --instance-match-criteria open \
    --tenancy default \
    --end-date 2021-10-31T23:59:59.000Z \
    --instance-type-specifications file://instanceTypeSpecification.json
```

下面是 `instanceTypeSpecification.json` 的内容。

```
[
    {             
        "InstanceType": "m5.4xlarge",                        
        "InstancePlatform":"Windows",            
        "Weight": 16,
        "AvailabilityZone":"us-east-1a",        
        "EbsOptimized": true,            
        "Priority" : 2
    },
    {             
        "InstanceType": "m5.12xlarge",                        
        "InstancePlatform":"Windows",            
        "Weight": 48,
        "AvailabilityZone":"us-east-1a",        
        "EbsOptimized": true,            
        "Priority" : 1
    }
]
```