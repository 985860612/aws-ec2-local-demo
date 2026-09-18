

# 为您的 Amazon EC2 资源选择区域
<a name="using-regions-availability-zones-setup"></a>

Amazon EC2 资源取决于所在的 AWS 区域或可用区。创建 Amazon EC2 资源时，您可选择该资源的区域。

**注意事项**
+ 某些 AWS 资源可能并非在所有区域都可用。在区域中开始创建资源之前，确保您可以在区域中创建所需的所有 AWS 资源。
+ 默认情况下，会禁用某些区域。您必须先启用这些区域，然后才能使用。有关更多信息，请参阅 [AWS Regions](https://docs.aws.amazon.com/global-infrastructure/latest/regions/aws-regions.html)。

**使用控制台为资源选择区域**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航栏中，选中 **Regions**（区域）选择器，然后选择区域。  
![查看区域。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/EC2_select_region.png)

1. 区域选择器包括可在您的 AWS 账户中使用的所有资源。选择列表底部附近带下划线的文本，查看您的账户未启用的区域。

**使用 AWS CLI 为资源选择区域**  
您可以将 AWS CLI 配置为使用默认区域。如果您未在命令中指定区域，则使用默认区域。要对特定命令使用不同的区域，请添加以下选项。

```
--region {{us-east-1}}
```

**使用 Tools for PowerShell 为资源选择区域**  
您可以将 Tools for Windows PowerShell 配置为使用默认区域。如果您未在命令中指定区域，则使用默认区域。要对特定命令使用不同的区域，请添加以下参数。

```
-Region {{us-east-1}}
```