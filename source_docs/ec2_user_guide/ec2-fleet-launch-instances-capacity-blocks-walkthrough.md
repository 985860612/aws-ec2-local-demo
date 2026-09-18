

# 教程：将 EC2 实例集配置为将实例启动到容量块中
<a name="ec2-fleet-launch-instances-capacity-blocks-walkthrough"></a>

本教程将指导您完成必须执行的步骤，以便 EC2 实例集在容量块中启动实例。

在大多数情况下，EC2 实例集请求的目标容量应小于或等于您所定位的容量块预留的可用容量。无法满足超过容量块预留限制的目标容量请求。如果目标容量请求超过容量块预留的限制，则对于超出容量块预留限制的容量，您将收到 `Insufficient Capacity Exception`。

**注意**  
对于容量块，EC2 实例集将不会回退到为剩余的所需目标容量启动按需型实例。

如果 EC2 实例集无法满足可用容量块预留中请求的目标容量，EC2 Fleet 将尽可能多地满足容量，并返回其能够启动的实例。您可以再次调用 EC2 实例集，直到所有实例都已预调配。

配置 EC2 实例集请求后，您必须等到容量块预留的开始日期。如果您请求 EC2 实例集启动到尚未启动的容量块中，您将收到 `Insufficient Capacity Error`。

在容量块预留变为活动状态后，您可以调用 EC2 实例集 API，并根据您选择的参数将实例预调配到您的容量块中。在容量块中运行的实例将继续运行，直到您手动停止或终止这些实例，或者直到 Amazon EC2 在容量块预留结束时终止这些实例。

有关容量块的更多信息，请参阅 [ML 容量块](ec2-capacity-blocks.md)。

**注意事项**
+ 只有类型为 `instant` EC2 实例集请求才支持将实例启动到容量块中。有关更多信息，请参阅 [配置 instant 类型的 EC2 实例集](instant-fleet.md)。
+ 不支持在同一 EC2 实例集请求中有多个容量块。
+ 不支持在使用 `OnDemandTargetCapacity` 或 `SpotTargetCapacity` 的同时将 `capacity-block` 设置为 `DefaultTargetCapacity`。
+ 如果将 `DefaultTargetCapacityType` 设置为 `capacity-block`，则无法提供 `OnDemandOptions::CapacityReservationOptions`。将会出现异常。

**配置 EC2 实例集以将实例启动到容量块中**

1. **创建启动模板。**

   在启动模板中，执行以下操作：
   + 对于 `InstanceMarketOptionsRequest`，将 `MarketType` 设置为 `capacity-block`。
   + 要确定容量块预留目标，对于 `CapacityReservationID`，指定容量块预留 ID。

   记下启动模板的名称和版本。您在下一步中将使用此信息。

   有关创建启动模板的更多信息，请参阅[创建 Amazon EC2 启动模板](create-launch-template.md)。

1. **配置 EC2 实例集。**

   为您的 EC2 实例集创建一个具有以下配置的文件，文件名为 `config.json`。在以下示例中，将资源标识符替换为您自己的资源标识符。

   有关配置 EC2 实例集的更多信息，请参阅[创建 EC2 实例集](create-ec2-fleet.md)。

   ```
   { 
       "LaunchTemplateConfigs": [
           {
               "LaunchTemplateSpecification": {
                   "LaunchTemplateName": "{{CBR-launch-template}}", 
                   "Version": "{{1}}"
               }, 
               "Overrides": [
                   {
                       "InstanceType": "{{p5.48xlarge}}", 
                       "AvailabilityZone": "{{us-east-1a}}"   
                   },
               ]
           }
       ], 
       "TargetCapacitySpecification": {
           "TotalTargetCapacity": {{10}}, 
           "DefaultTargetCapacityType": "capacity-block"
       },
       "Type": "instant"
   }
   ```

1. **启动实例集。**

   使用以下 [create-fleet](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-fleet.html) 命令。

   ```
   aws ec2 create-fleet --cli-input-json file://config.json
   ```

   有关更多信息，请参阅 [创建 EC2 实例集](create-ec2-fleet.md#create-ec2-fleet-procedure)。