

# Wavelength 区中的 容量预留
<a name="capacity-reservations-wavelengthzones"></a>

利用 *AWS Wavelength*，开发人员可以为移动设备和最终用户打造具有超低延迟的应用程序。Wavelength 可以将标准 AWS 计算和存储服务部署到电信运营商的 5G 网络边缘。您可以将 Amazon Virtual Private Cloud (VPC) 扩展到一个或多个 Wavelength 区域。然后，您可以使用 Amazon EC2 实例之类的AWS资源来运行需要超低延迟和连接到该区域中的AWS服务的应用程序。有关更多信息，请参阅 [AWS Wavelength 域](https://aws.amazon.com/wavelength/)。

创建按需 容量预留 时，您可以选择 Wavelength 区域，然后通过指定与 Wavelength 区域关联的子网，将实例启动到 Wavelength 区域内的 容量预留 中。Wavelength 区域由AWS区域代码后跟一个指示位置的标识符表示，例如 `us-east-1-wl1-bos-wlz-1`。

Wavelength 区域并非在每个区域中都可用。有关支持 Wavelength 区域的区域的信息，请参阅 *AWS Wavelength 开发人员指南*中的[可用 Wavelength 区域](https://docs.aws.amazon.com/wavelength/latest/developerguide/wavelength-quotas.html)。

**注意事项**  
您不能在 Wavelength 区中使用 容量预留 组。

**在 Wavelength 区中使用 容量预留**

1. 启用 Wavelength 区域以在您的AWS账户中使用。有关更多信息，请参阅 *AWS Wavelength 开发人员指南*中的 [AWS Wavelength 入门](https://docs.aws.amazon.com/wavelength/latest/developerguide/get-started-wavelength.html)。

1. 在 Wavelength 区中创建 容量预留。对于**可用区**，选择 Wavelength。Wavelength 由AWS区域代码后跟一个指示位置的标识符表示，例如 `us-east-1-wl1-bos-wlz-1`。有关更多信息，请参阅[创建 容量预留](capacity-reservations-create.md)。

1. 在 Wavelength 区中创建子网。对于**可用区**，选择 Wavelength 区。有关更多信息，请参阅《*Amazon VPC 用户指南*》中的[在 VPC 中创建子网](https://docs.aws.amazon.com/vpc/latest/userguide/create-subnets.html)。

1. 启动一个实例。对于**子网**，在 Wavelength 区（例如 `subnet-123abc | us-east-1-wl1-bos-wlz-1`）中选择子网，对于**容量预留**，选择您在 Wavelength 中创建的 容量预留 所需的规格（可以为 `open` 或按 ID 定位）。有关更多信息，请参阅[在现有 容量预留 中启动实例](capacity-reservations-launch.md)。