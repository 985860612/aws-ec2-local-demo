

# 启动 Amazon EC2 实例
<a name="LaunchingAndUsingInstances"></a>

实例是 AWS 云中的虚拟服务器。您可以从亚马逊机器映像（AMI）中启动实例。AMI 为实例提供操作系统、应用程序服务器和应用程序。

创建 AWS 账户 后，您可以通过 [AWS Free Tier](https://aws.amazon.com/free/)开始免费使用 Amazon EC2。您的免费套餐权益取决于您创建 AWS 账户的时间。如果您是在 2025 年 7 月 15 日之前创建的 AWS 账户且其使用时间未满 12 个月，则可以使用免费套餐免费启动和使用 `t2.micro` 实例（在 `t2.micro` 不可用的区域，您可以在免费套餐下使用 `t3.micro` 实例）。在实例运行期间，即使该实例处于闲置状态，您也需为其付费，或使用量将计入免费套餐限制。有关更多信息，请参阅 [Amazon EC2 定价](https://aws.amazon.com/ec2/pricing/)。如果您是在 2025 年 7 月 15 日当天或之后创建的 AWS 账户，则可以使用 `t3.micro`、`t3.small`、`t4g.micro`、`t4g.small`、`c7i-flex.large` 和 `m7i-flex.large` 实例类型 6 个月，或直到您的服务抵扣金用完为止。有关更多信息，请参阅 [2025 年 7 月 15 日之前和之后的免费套餐权益](ec2-free-tier-usage.md#ec2-free-tier-comparison)。

当您启动实例时，可以在与以下一项资源关联的子网中启动实例：
+ 可用区：此选项为默认选项。
+ 本地区：要在本地区中启动实例，您必须选择加入本地区，然后在该区域中创建子网。有关更多信息，请参阅 [Get started with Local Zones](https://docs.aws.amazon.com/local-zones/latest/ug/getting-started.html)。
+ Wavelength 区：要在 Wavelength 区中启动实例，您必须选择加入 Wavelength 区，然后在该区域中创建子网。有关如何在 Wavelength 区域中启动实例的信息，请参阅 [Get started with AWS Wavelength](https://docs.aws.amazon.com/wavelength/latest/developerguide/get-started-wavelength.html)。
+ Outpost：要在 Outpost 中启动实例，您必须创建 Outpost。有关如何创建 Outpost 的信息，请参阅 [Get started with AWS Outposts](https://docs.aws.amazon.com/outposts/latest/userguide/get-started-outposts.html)。

启动实例之后，您可以连接并使用该实例。开始时，实例的状态为 `pending`。当实例状态为 `running` 时，实例已经开始启动。可能要过一小段时间才能连接到实例。请注意，裸机实例类型可能需要更长时间才能启动。

您可能需要在启动实例时进行某些配置，具体取决于您计划用于连接实例的方式。这些配置可能包括为某些流量指定入站安全组规则或关联实例配置文件角色。要详细了解可用于连接的连接方法及其要求，请参阅[连接到您的 EC2 实例](connect.md)。

实例将获得一个公有 DNS 名称，您可使用此名称通过 Internet 与实例通信。实例还会获得一个私有 DNS 名称，相同 VPC 网络内的其他实例可以用其与该实例通信。

当您完成实例时，为避免产生不必要的成本，请确保终止该实例。有关更多信息，请参阅 [终止 Amazon EC2 实例](terminating-instances.md)。

如果您需要启动大量实例、使用多种实例类型或使用多种购买选项（例如按需型实例、预留实例和竞价型实例），请考虑使用 EC2 实例集。有关更多信息，请参阅 [EC2 实例集和竞价型实例集](Fleets.md)。

如果您希望实现实例生命周期自动化，包括自动扩展、运行状况检查和替换运行状况不佳的实例，请考虑使用 [Amazon EC2 Auto Scaling](https://docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html)。

以下方法是可以启动实例的一些方式。


| 方法 | Tool | 文档 | 
| --- | --- | --- | 
| 使用启动实例向导指定启动参数。 | Amazon EC2 控制台 | [使用控制台中的启动实例向导来启动 EC2 实例](ec2-launch-instance-wizard.md) | 
| 创建启动模板并通过启动模板启动实例。 | Amazon EC2 控制台 | [使用启动模板来启动 EC2 实例](launch-instances-from-launch-template.md) | 
| 将现有实例作为基础。 | Amazon EC2 控制台 | [使用现有实例的详细信息来启动 EC2 实例](launch-more-like-this.md) | 
| 使用从 AWS Marketplace 购买的 AMI。 | Amazon EC2 控制台 | [从 AWS Marketplace AMI 中启动 Amazon EC2 实例](launch-marketplace-console.md) | 
| 使用您指定的 AMI。 | AWS CLI | [在 AWS CLI 中启动、列出和删除 Amazon EC2 实例](https://docs.aws.amazon.com/cli/latest/userguide/cli-services-ec2-instances.html) | 
| 使用您指定的 AMI。 | AWS Tools for Windows PowerShell | [使用 Windows PowerShell 启动 Amazon EC2 实例](https://docs.aws.amazon.com/powershell/latest/userguide/pstools-ec2-launch.html) | 
| 使用 EC2 实例集跨不同的 EC2 实例类型和可用区以及跨按需型实例、预留实例和竞价型实例购买选项预置容量。 | AWS CLI | [EC2 实例集和竞价型实例集](Fleets.md) | 
| 使用 CloudFormation 模板指定实例。 | AWS CloudFormation | *AWS CloudFormation 用户指南*中的 [AWS::EC2::Instance](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-instance.html) | 
| 使用特定于语言的 AWS SDK 启动实例。 | AWS SDK | [AWS SDK for .NET](https://docs.aws.amazon.com/goto/DotNetSDKV3/ec2-2016-11-15/RunInstances)<br />[适用于 C\+\+ 的 AWS SDK](https://docs.aws.amazon.com/goto/SdkForCpp/ec2-2016-11-15/RunInstances)<br />[适用于 Go 的 AWS SDK](https://docs.aws.amazon.com/goto/SdkForGoV1/ec2-2016-11-15/RunInstances)<br />[AWS SDK for Java](https://docs.aws.amazon.com/goto/SdkForJava/ec2-2016-11-15/RunInstances)<br />[适用于 JavaScript 的 AWS SDK](https://docs.aws.amazon.com/goto/AWSJavaScriptSDK/ec2-2016-11-15/RunInstances)<br />[适用于 PHP V3 的 AWS SDK](https://docs.aws.amazon.com/goto/SdkForPHPV3/ec2-2016-11-15/RunInstances)<br />[AWS SDK for Python](https://docs.aws.amazon.com/goto/boto3/ec2-2016-11-15/RunInstances)<br />[适用于 Ruby V3 的 AWS SDK](https://docs.aws.amazon.com/goto/SdkForRubyV3/ec2-2016-11-15/RunInstances) | 