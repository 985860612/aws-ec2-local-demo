

# 使用 AWS Config 跟踪 Amazon EC2 专属主机配置更改
<a name="dedicated-hosts-aws-config"></a>

您可以使用 AWS Config 记录专属主机的配置更改，以及记录在主机上启动、停止或终止的实例的配置更改。然后，您可以将由 AWS Config 捕获的信息用作许可证报告的数据来源。

AWS Config 分别记录专属主机和实例的配置信息，并通过关系将这些信息配对。具有三种报告条件：
+ **AWS Config 记录状态** – 当其状态为**开启**时，AWS Config 将记录一个或多个 AWS 资源类型，其中可包含专属主机和专用实例。要捕获许可证报告所需的信息，请使用以下字段验证是否记录了主机和实例。
+ **主机记录状态** — 当其状态为**启用**时，将记录专属主机的配置信息。
+ **实例记录状态** — 当其状态为**启用**时，将记录专用实例的配置信息。

如果禁用了这三个条件中的任一个，则 **Edit Config Recording** 按钮中的图标为红色。要发挥此工具的所有优点，请确保这三种记录方法都已启用。当这三种方法全部启用时，图标为绿色。要编辑设置，请选择 **Edit Config Recording**。您将被定向到 AWS Config 控制台中的 **Set up AWS Config** 页面，在该页面中，您可以设置 AWS Config 并启动对您的主机、实例和其他支持的资源类型的记录。有关更多信息，请参阅 *AWS Config 开发人员指南* 中的[使用控制台设置 AWS Config](https://docs.aws.amazon.com/config/latest/developerguide/resource-config-reference.html)。

**注意**  
AWS Config 将在发现您的资源后记录它们，此过程可能需要几分钟。

在 AWS Config 开始记录对您的主机和实例的配置更改后，您可以获取已分配或已释放的任何主机以及已启动、已停止或已终止的任何实例的配置历史记录。例如，在专属主机的配置历史记录中的任何时间点上，您均可以查看在该主机上启动的实例的数量以及该主机上的套接字和内核的数量。对于其中的任何实例，您还可以查找其亚马逊机器映像（AMI）的 ID。您可以使用此信息来报告您拥有的服务器端绑定软件 (按插槽或按内核授予许可) 的许可。

您可以使用以下任一方式查看配置历史记录：
+ 通过使用 AWS Config 控制台。对于每个已记录的资源，您可以查看一个时间线页面，该页面提供了配置详细信息的历史记录。要查看此页面，请选择**专属主机**页面的**配置时间线**列中的灰色图标。有关更多信息，请参阅 *AWS Config 开发人员指南* 中的[在 AWS Config 控制台中查看配置详细信息](https://docs.aws.amazon.com/config/latest/developerguide/view-manage-resource-console.html)。
+ 通过运行 AWS CLI 命令。首先，您可以使用 [list-discovered-resources](https://docs.aws.amazon.com/cli/latest/reference/configservice/list-discovered-resources.html) 命令获取一个包含所有主机和实例的列表。然后，您可以使用 [get-resource-config-history](https://docs.aws.amazon.com/cli/latest/reference/configservice/get-resource-config-history.html#get-resource-config-history) 命令获取特定时间间隔内某个主机或实例的配置详细信息。
+ 通过在您的应用程序中使用 AWS Config API。首先，您可以使用 [ListDiscoveredResources](https://docs.aws.amazon.com/config/latest/APIReference/API_ListDiscoveredResources.html) 操作获取一个包含所有主机和实例的列表。然后，您可以使用 [GetResourceConfigHistory](https://docs.aws.amazon.com/config/latest/APIReference/API_GetResourceConfigHistory.html) 操作获取特定时间间隔内某个主机或实例的配置详细信息。

例如，要从 AWS Config 中获取所有专属主机的列表，请运行 CLI 命令，如下所示。

```
aws configservice list-discovered-resources --resource-type AWS::EC2::Host
```

要从 AWS Config 中获取专属主机的配置历史记录，请运行 CLI 命令，如下所示。

```
aws configservice get-resource-config-history \
    --resource-type AWS::EC2::Instance \
    --resource-id {{i-1234567890abcdef0}}
```

**使用控制台管理 AWS Config 设置**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在**专属主机**页面上，选择**编辑配置记录**。

1. 在 AWS Config 控制台中，按照提供的步骤来启用记录。有关更多信息，请参阅[使用控制台设置 AWS Config](https://docs.aws.amazon.com/config/latest/developerguide/gs-console.html)。

有关更多信息，请参阅[在 AWS Config 控制台中查看配置详细信息](https://docs.aws.amazon.com/config/latest/developerguide/view-manage-resource-console.html)。

**使用命令行或 API 激活 AWS Config**
+ AWS CLI：*AWS CLI 开发人员指南* 中的[查看配置详细信息 (AWS Config)](https://docs.aws.amazon.com/config/latest/developerguide/view-manage-resource-console.html#view-config-details-cli)。
+ Amazon EC2 API：[GetResourceConfigHistory](https://docs.aws.amazon.com/config/latest/APIReference/API_GetResourceConfigHistory.html)。