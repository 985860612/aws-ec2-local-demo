

# 教程：将 EC2 实例集配置为使用实例权重
<a name="ec2-fleet-instance-weighting-walkthrough"></a>

该教程使用名为 Example Corp 的虚构公司说明使用实例权重请求 EC2 队列的过程。

## 目标
<a name="ec2-fleet-instance-weighting-walkthrough-objective"></a>

Example Corp 是一家医药公司，该公司想要使用 Amazon EC2 的计算功能来筛查可能用于对抗癌症的化学成分。

## 规划
<a name="ec2-fleet-instance-weighting-walkthrough-planning"></a>

Example Corp 首先查看[Spot 最佳实践](https://aws.amazon.com/ec2/spot/getting-started/#bestpractices)。然后，Example Corp 确定了他们的 EC2 队列的要求。

**实例类型**  
Example Corp 有一个计算和内存密集型应用程序，该应用程序在至少 60 GB 内存和八个虚拟 CPU (vCPU) 的情况下性能最佳。他们希望以尽可能低的价格为该应用程序提供尽可能多的这些资源。Example Corp 认定以下任意 EC2 实例类型都能满足其需求：


| 实例类型 | 内存 (GiB) | vCPU | 
| --- | --- | --- | 
| r3.2xlarge | 61 | 8 | 
| r3.4xlarge | 122 | 16 | 
| r3.8xlarge | 244 | 32 | 

**以单位数表示的目标容量**  
采用实例权重，目标容量可以等于几个实例 (默认) 或一些因素 (如内核 (vCPU)、内存 (GiB) 和存储 (GB)) 的组合。将其应用程序的基本要求 (60 GB RAM 和八个 vCPU) 作为一个单位，Example Corp 确定，此数量的 20 倍应可满足其需求。因此该公司将其 EC2 实例集请求的目标容量设置为 20 个单位。

**实例权重**  
确定目标容量后，Example Corp 计算了实例权重。为了计算每个实例类型的实例权重，他们按如下所示确定每个实例类型需要多少单位才能达到目标容量：
+ r3.2xlarge (61.0 GB, 8 vCPUs) = 1 个 20 单位
+ r3.4xlarge (122.0 GB, 16 vCPUs) = 2 个 20 单位
+ r3.8xlarge (244.0 GB, 32 vCPUs) = 4 个 20 单位

因此，Example Corp 在其EC2 队列请求中将实例权重 1、2 和 4 分配给相应的启动配置。

**每单位小时价格**  
Example Corp 将每实例小时[按需价格](https://aws.amazon.com/ec2/pricing/)作为其价格的起点。他们也可以使用最近的 Spot 价格或两者的组合。为了计算每单位小时价格，他们将每实例小时起始价格除以权重。例如：


| 实例类型 | 按需价格 | 实例权重 | 每单位小时价格 | 
| --- | --- | --- | --- | 
| r3.2xLarge | 0.7 美元 | 1 | 0.7 美元 | 
| r3.4xLarge | 1.4 美元 | 2 | 0.7 美元 | 
| r3.8xLarge | 2.8 美元 | 4 | 0.7 美元 | 

Example Corp 可能会使用每单位小时全局价格 0.7 美元，这对于所有三种实例类型来说是非常有竞争力的。他们可能还会使用每单位小时全局价格 0.7 USD，并在 `r3.8xlarge` 启动规范中使用特定的每单位小时价格 0.9 USD。

## 验证权限
<a name="ec2-fleet-instance-weighting-walkthrough-permissions"></a>

在创建 EC2 队列请求之前，Example Corp 验证它是否拥有具备所需权限的 IAM 角色。有关更多信息，请参阅[EC2 实例集先决条件](ec2-fleet-prerequisites.md)。

## 创建启动模板
<a name="ec2-fleet-instance-weighting-create-launch-template"></a>

接下来，Example Corp 会创建启动模板。启动模板 ID 将在下一个步骤中使用。有关更多信息，请参阅[创建 Amazon EC2 启动模板](create-launch-template.md)。

## 创建 EC2 队列
<a name="ec2-fleet-instance-weighting-walkthrough-request"></a>

Example Corp 为其 EC2 队列创建一个具有以下配置的文件 (`config.json`)。在以下示例中，将资源标识符替换为您自己的资源标识符。

```
{ 
    "LaunchTemplateConfigs": [
        {
            "LaunchTemplateSpecification": {
                "LaunchTemplateId": "lt-07b3bc7625cdab851", 
                "Version": "1"
            }, 
            "Overrides": [
                {
                    "InstanceType": "r3.2xlarge", 
                    "SubnetId": "subnet-482e4972", 
                    "WeightedCapacity": 1
                },
                {
                    "InstanceType": "r3.4xlarge", 
                    "SubnetId": "subnet-482e4972", 
                    "WeightedCapacity": 2
                },
                {
                    "InstanceType": "r3.8xlarge", 
                    "MaxPrice": "0.90", 
                    "SubnetId": "subnet-482e4972", 
                    "WeightedCapacity": 4
                }
            ]
        }
    ], 
    "TargetCapacitySpecification": {
        "TotalTargetCapacity": 20, 
        "DefaultTargetCapacityType": "spot"
    }
}
```

Example Corp 使用以下 [create-fleet](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-fleet.html) 命令创建 EC2 队列。

```
aws ec2 create-fleet --cli-input-json file://config.json
```

有关更多信息，请参阅 [创建 EC2 实例集](create-ec2-fleet.md)。

## 执行
<a name="ec2-fleet-instance-weighting-walkthrough-fulfillment"></a>

分配策略确定竞价型实例所来自的 Spot 容量池。

使用 `lowest-price` 策略（这是默认策略）时，竞价型实例来自在执行时具有最低每单位价格的池。为了提供 20 个单位的容量，EC2 队列有三种做法：启动 20 个 `r3.2xlarge` 实例（20 除以 1）、10 个 `r3.4xlarge` 实例（20 除以 2）或 5 个 `r3.8xlarge` 实例（20 除以 4）。

如果 Example Corp 使用 `diversified` 策略，则竞价型实例来自所有三个池。EC2 队列会启动 6 个 `r3.2xlarge` 实例（提供 6 个单位）、3 个 `r3.4xlarge` 实例（提供 6 个单位）和 2 个 `r3.8xlarge` 实例（提供 8 个单位），总共 20 个单位。