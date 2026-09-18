

# 修改 EC2 实例集
<a name="modify-ec2-fleet"></a>

您可以修改 EC2 实例集的总目标容量、竞价型容量和按需型容量。您还可以修改，如果新的总目标容量减少到实例集当前大小以下，是否应终止正在运行的实例。

## 注意事项
<a name="modify-ec2-fleet-considerations"></a>

修改 EC2 实例集时请考虑以下几点：
+ **实例集类型** – 您只能修改 `maintain` 类型的 EC2 实例集，不能修改 `request` 或 `instant` 类型的 EC2 实例集。
+ **实例集参数** – 您可以修改 EC2 实例集的以下参数：
  + `target-capacity-specification` – 增加或减少以下目标容量：
    + `TotalTargetCapacity`
    + `OnDemandTargetCapacity`
    + `SpotTargetCapacity`
  + `excess-capacity-termination-policy`：当 EC2 实例集的总目标容量降到实例集的当前大小以下时是否应终止正在运行的实例。有效值为：
    + `no-termination`
    + `termination`
+ **增加总目标容量时的实例集行为** – 在增加总目标容量时，EC2 实例集会根据为 `DefaultTargetCapacityType` 指定的实例购买选项（按需型实例或竞价型实例）和指定的[分配策略](ec2-fleet-allocation-strategy.md)，启动额外的实例。
+ **减少竞价型目标容量时的实例集行为** – 在减少竞价型目标容量时，EC2 实例集会删除超过新目标容量的任何打开的请求。您可以请求实例集终止竞价型实例，直到实例集的大小达到新目标容量。当 EC2 实例集因目标容量下降而终止某个竞价型实例时，该实例将收到一条竞价型实例中断通知。

  根据分配策略选择要终止的实例：
  + `capacity-optimized`：终止可用容量最少的池中的实例。
  + `price-capacity-optimized`：使用价格和可用容量的组合：终止可用容量最少且价格最高的池中的实例。
  + `diversified`：终止所有池中的实例。
  + `lowest-price`：终止价格最高的池中的实例。

  您也可以请求 EC2 实例集保持实例集的当前大小，而不替换任何已中断的竞价型实例或者手动终止的实例。
+ **实例集状态** – 您可以修改处于 `submitted` 或 `active` 状态的 EC2 实例集。当您修改实例集时，它会进入 `modifying` 状态。

## 修改 EC2 实例集的命令
<a name="modify-ec2-fleet-commands"></a>

------
#### [ AWS CLI ]

**修改 EC2 实例集的总目标容量**  
使用 [modify-fleet](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-fleet.html) 命令。

```
aws ec2 modify-fleet \
    --fleet-id {{fleet-73fbd2ce-aa30-494c-8788-1cee4EXAMPLE}} \
    --target-capacity-specification TotalTargetCapacity={{20}}
```

如果要减少目标容量，但希望保持实例集的当前大小，可按如下方式修改上一个示例。

```
aws ec2 modify-fleet \
    --fleet-id {{fleet-73fbd2ce-aa30-494c-8788-1cee4EXAMPLE}} \
    --target-capacity-specification TotalTargetCapacity={{10}} \
    --excess-capacity-termination-policy no-termination
```

------
#### [ PowerShell ]

**修改 EC2 实例集的总目标容量**  
使用 [Edit-EC2Fleet](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2Fleet.html) cmdlet。

```
Edit-EC2Fleet `
    -FleetId "{{fleet-73fbd2ce-aa30-494c-8788-1cee4EXAMPLE}}" `
    -TargetCapacitySpecification_TotalTargetCapacity {{20}}
```

如果要减少目标容量，但希望保持实例集的当前大小，可按如下方式修改上一个示例。

```
Edit-EC2Fleet `
    -FleetId "{{fleet-73fbd2ce-aa30-494c-8788-1cee4EXAMPLE}}" `
    -TargetCapacitySpecification_TotalTargetCapacity {{20}} `
    -ExcessCapacityTerminationPolicy "NoTermination"
```

------