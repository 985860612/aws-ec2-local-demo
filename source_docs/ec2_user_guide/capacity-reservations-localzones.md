

# Local Zones 中的容量预留
<a name="capacity-reservations-localzones"></a>

本地区域是在地理位置上靠近用户的AWS区域的扩展。在本地区域中创建的资源可以通过非常低延迟的通信为本地用户提供服务。有关更多信息，请参阅 [AWS Local Zones](https://aws.amazon.com/about-aws/global-infrastructure/localzones/)。

您可以通过在本地区域中创建新的子网，将 VPC 从其父AWS区域扩展到该本地区域。当您在本地扩展区中创建子网时，VPC 也会扩展到该本地扩展区。本地区域中的子网与 VPC 中其他子网的运行相同。

通过使用 Local Zones，您可以将容量预留放在更靠近用户的多个位置。您可以按照在常规可用区中创建和使用容量预留的方法，在 Local Zones 中创建和使用容量预留。相同的功能和实例匹配行为适用。有关在 Local Zones 中支持的定价模式的更多信息，请参阅 [AWS Local Zones 常见问题解答](https://aws.amazon.com/about-aws/global-infrastructure/localzones/faqs/)。

**注意事项**  
您不能在本地区域中使用容量预留组。

**在本地区域中使用容量预留**

1. 启用本地区域以在您的AWS账户中使用。有关更多信息，请参阅《AWS Local Zones User Guide》**中的 [Getting started with AWS Local Zones](https://docs.aws.amazon.com/local-zones/latest/ug/getting-started.html)。

1. 在本地区域中创建容量预留。对于 **Availability Zone (可用区)**，选择本地区域。本地区域由AWS区域代码后跟一个指示位置的标识符表示，例如 `us-west-2-lax-1a`。有关更多信息，请参阅[创建 容量预留](capacity-reservations-create.md)。

1. 在本地扩展区中创建子网。对于 **Availability Zone (可用区)**，选择本地区域。有关更多信息，请参阅《*Amazon VPC 用户指南*》中的[在 VPC 中创建子网](https://docs.aws.amazon.com/vpc/latest/userguide/create-subnets.html)。

1. 启动一个实例。对于 **Subnet (子网)**，在本地区域（例如 `subnet-123abc | us-west-2-lax-1a`）中选择子网，对于 **Capacity Reservation (容量预留)**，选择您在本地区域中创建的容量预留所需的规格（可以为 `open` 或按 ID 定位）。有关更多信息，请参阅[在现有 容量预留 中启动实例](capacity-reservations-launch.md)。