

# 教程：将 EC2 实例集配置为使用按需型实例作为主容量
<a name="ec2-fleet-on-demand-walkthrough"></a>

该教程使用名为 ABC Online 的虚构公司说明请求 EC2 队列并将按需作为主容量和 Spot 容量（如果可用）的过程。

## 目标
<a name="ec2-fleet-on-demand-walkthrough-objective"></a>

ABC Online 是一家餐饮送货公司，旨在跨 EC2 实例类型和购买选项预置 Amazon EC2 容量，以实现其预期的扩展、性能和成本。

## 规划
<a name="ec2-fleet-on-demand-walkthrough-planning"></a>

ABC Online 需要固定容量以应对高峰时段，但也想要以较低价格从额外容量获益。该公司确定其 EC2 实例集的以下要求：
+ 按需型实例容量 – ABC Online 需要使用 15 个按需型实例，以确保它们可以处理高峰期的流量。
+ 竞价型实例容量：为了以较低的价格提高性能，ABC Online 打算预置 5 个竞价型实例。

## 验证权限
<a name="ec2-fleet-on-demand-walkthrough-permissions"></a>

在创建 EC2 队列之前，ABC Online 验证它是否拥有具备所需权限的 IAM 角色。有关更多信息，请参阅[EC2 实例集先决条件](ec2-fleet-prerequisites.md)。

## 创建启动模板
<a name="ec2-fleet-on-demand-walkthrough-create-launch-template"></a>

接下来，ABC Online 会创建启动模板。启动模板 ID 将在下一个步骤中使用。有关更多信息，请参阅[创建 Amazon EC2 启动模板](create-launch-template.md)。

## 创建 EC2 队列
<a name="ec2-fleet-on-demand-walkthrough-request"></a>

ABC Online 为其 EC2 队列创建一个具有以下配置的文件 (`config.json`)。在以下示例中，将资源标识符替换为您自己的资源标识符。

```
{
    "LaunchTemplateConfigs": [
        {
            "LaunchTemplateSpecification": {
                "LaunchTemplateId": "{{lt-07b3bc7625cdab851}}",
                "Version": "{{2}}"
            }

        }
    ],
    "TargetCapacitySpecification": {
        "TotalTargetCapacity": 20,
        "OnDemandTargetCapacity":15,
        "DefaultTargetCapacityType": "spot"
    }
}
```

ABC Online 使用以下 [create-fleet](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-fleet.html) 命令创建 EC2 队列。

```
aws ec2 create-fleet --cli-input-json file://config.json
```

有关更多信息，请参阅 [创建 EC2 实例集](create-ec2-fleet.md)。

## 执行
<a name="ec2-fleet-on-demand-walkthrough-fulfillment"></a>

分配策略确定按需容量始终得到满足，而目标容量的余额将在具有可用容量的情况下作为竞价型实例容量执行。