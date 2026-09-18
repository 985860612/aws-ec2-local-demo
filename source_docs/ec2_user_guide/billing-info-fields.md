

# AMI 账单信息字段
<a name="billing-info-fields"></a>

以下字段提供与 AMI 关联的账单信息：

平台详细信息  
 与 AMI 的账单代码关联的平台详细信息。例如：`Red Hat Enterprise Linux`。

使用情况操作  
Amazon EC2 实例的操作以及与 AMI 关联的账单代码。例如：`RunInstances:0010`。**Usage operation** (使用情况操作) 对应于 AWS 成本和使用情况报告 (CUR) 和 [AWS 价目表 API](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/price-changes.html) 中的 [lineitem/Operation](https://docs.aws.amazon.com/cur/latest/userguide/Lineitem-columns.html#Lineitem-details-O-Operation) 列。

您可以在 Amazon EC2 控制台的**实例**或 **AMI** 页面上查看这些字段，或者在 [describe-images](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-images.html) 或 [Get-EC2Image](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2Image.html) 命令返回的响应中查看这些字段。

## 示例数据：按平台划分的使用情况操作
<a name="billing-info"></a>

下表列出了一些平台详细信息和使用情况操作值，这些信息显示在 Amazon EC2 控制台的**实例**或 **AMI** 页面上，或者显示在由 [describe-images](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-images.html) 或 [Get-EC2Image](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2Image.html) 命令返回的响应中。


| 平台详细信息 | 使用情况操作 2 | 
| --- | --- | 
| Linux/UNIX | RunInstances | 
| Red Hat BYOL Linux | RunInstances:00g0 3 | 
| Red Hat Enterprise Linux | RunInstances:0010 | 
| Red Hat Enterprise Linux with HA | RunInstances:1010 | 
| Red Hat Enterprise Linux with SQL Server Standard and HA | RunInstances:1014 | 
| Red Hat Enterprise Linux with SQL Server Enterprise and HA | RunInstances:1110 | 
| Red Hat Enterprise Linux with SQL Server Standard | RunInstances:0014 | 
| Red Hat Enterprise Linux with SQL Server Web | RunInstances:0210 | 
| Red Hat Enterprise Linux with SQL Server Enterprise | RunInstances:0110 | 
| SQL Server Enterprise | RunInstances:0100 | 
| SQL Server Standard | RunInstances:0004 | 
| SQL Server Web | RunInstances:0200 | 
| SUSE Linux | RunInstances:000g | 
| Ubuntu Pro | RunInstances:0g00 | 
| Windows | RunInstances:0002 | 
| Windows BYOL | RunInstances:0800 | 
| Windows with SQL Server Enterprise 1 | RunInstances:0102 | 
| Windows with SQL Server Standard 1 | RunInstances:0006 | 
| Windows with SQL Server Web 1 | RunInstances:0202 | 

1 如果两个软件许可证与 AMI 关联，则**平台详细信息**字段将显示两者。

2 如果您正在运行竞价型实例，则 AWS 成本和使用情况报告上的 [lineitem/Operation](https://docs.aws.amazon.com/cur/latest/userguide/Lineitem-columns.html#Lineitem-details-O-Operation) 可能与此处列出的**使用情况操作**值不同。例如，如果 `[lineitem/Operation](https://docs.aws.amazon.com/cur/latest/userguide/Lineitem-columns.html#Lineitem-details-O-Operation)` 显示 `RunInstances:0010:SV006`，则表示 Amazon EC2 正在区域 6 中的美国东部（弗吉尼亚州北部）运行 Red Hat Enterprise Linux 竞价型实例小时。

3 这在使用情况报告中显示为 RunInstances (Linux/UNIX)。