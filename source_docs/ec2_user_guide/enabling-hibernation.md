

# 为 Amazon EC2 实例启用休眠
<a name="enabling-hibernation"></a>

要使实例休眠，您必须在启动实例时先为其启用休眠。

**重要**  
启动实例后，无法为实例启用或禁用休眠。

**Topics**
+ [为按需型实例启用休眠](#enable-hibernation-for-on-demand-instances)
+ [为竞价型实例启用休眠](#enable-hibernation-for-spot-instances)
+ [查看实例是否已启用休眠](#view-if-instance-is-enabled-for-hibernation)

## 为按需型实例启用休眠
<a name="enable-hibernation-for-on-demand-instances"></a>

您可以为按需型实例启用休眠。

------
#### [ Console ]

**要为按需型实例启用休眠**

1. 按照步骤[启动实例](ec2-launch-instance-wizard.md)，但请在完成以下步骤以启用休眠之后再启动实例。

1. 若要启用休眠，请在启动实例向导中配置以下字段：

   1. 在**应用程序和操作系统映像（Amazon 机器映像）**下，选择支持休眠的 AMI。有关更多信息，请参阅 [AMI](hibernating-prerequisites.md#hibernation-prereqs-supported-amis)。

   1. 在 **Instance type**（实例类型）下，选择一个受支持的实例类型。有关更多信息，请参阅 [实例系列](hibernating-prerequisites.md#hibernation-prereqs-supported-instance-families)。

   1. 在 **Configure storage**（配置存储）下，选择右侧的 **Advanced**（高级），并为根卷指定以下信息：
      + 在**大小 (GiB)** 中，输入 EBS 根卷大小。卷必须足够大，以存储 RAM 内容并满足您的预期使用量。
      + 对于 **Volume Type**（卷类型），选择支持的 EBS 卷类型：通用型 SSD（`gp2` 和 `gp3`）或预调配 IOPS SSD（`io1` 和 `io2`）。
      + 对于 **Encrypted**（已加密），选择 **Yes**（是）。如果您在此 AWS 区域中启用了默认加密，则系统会选择 **Yes**（是）。
      + 对于 **KMS key**（KMS 密钥），请选择卷的加密密钥。如果您在此 AWS 区域中启用了默认加密，则会选择默认加密密钥。

      有关根卷先决条件的更多信息，请参阅[EC2 实例休眠的先决条件](hibernating-prerequisites.md)。

   1. 展开 **Advanced details**（高级详细信息），找到 **Stop - Hibernate behavior**（停止 – 休眠行为），然后选择 **Enable**（启用）。

1. 在 **Summary**（摘要）面板中查看实例配置，然后选择 **Launch instance**（启动实例）。有关更多信息，请参阅 [使用控制台中的启动实例向导来启动 EC2 实例](ec2-launch-instance-wizard.md)。

------
#### [ AWS CLI ]

**要为按需型实例启用休眠**  
使用 [run-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/run-instances.html) 命令启动实例。使用 `--block-device-mappings file://mapping.json` 参数指定 EBS 根卷参数，并使用 `--hibernation-options Configured=true` 参数启用休眠。

```
aws ec2 run-instances \
    --image-id {{ami-0abcdef1234567890}} \
    --instance-type {{m5.large}} \
    --block-device-mappings file://{{mapping}}.json \
    --hibernation-options Configured=true \
    --count {{1}} \
    --key-name {{MyKeyPair}}
```

在 `mapping.json` 中指定以下内容。

```
[
    {
        "DeviceName": "{{/dev/xvda}}",
        "Ebs": {
            "VolumeSize": {{30}},
            "VolumeType": "{{gp2}}",
            "Encrypted": true
        }
    }
]
```

`DeviceName` 的值必须匹配与 AMI 关联的根设备名称。要查找根设备名称，请使用 [describe-images](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-images.html) 命令。

```
aws ec2 describe-images --image-id ami-{{0abcdef1234567890}}
```

如果您在此 AWS 区域中启用了默认加密，则可以省略 `"Encrypted": true`。

------
#### [ PowerShell ]

**要为按需型实例启用休眠**  
使用 [New-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2Instance.html) 命令启动实例。通过首先定义块设备映射，然后使用 `-BlockDeviceMappings` 参数将其添加到命令来指定 EBS 根卷。使用 `-HibernationOptions_Configured $true` 参数启用休眠。

```
$ebs_encrypt = New-Object Amazon.EC2.Model.BlockDeviceMapping
$ebs_encrypt.DeviceName = "{{/dev/xvda}}"
$ebs_encrypt.Ebs = New-Object Amazon.EC2.Model.EbsBlockDevice
$ebs_encrypt.Ebs.VolumeSize = {{30}}
$ebs_encrypt.Ebs.VolumeType = "{{gp2}}"
$ebs_encrypt.Ebs.Encrypted = $true

New-EC2Instance `
    -ImageId {{ami-0abcdef1234567890}} `
    -InstanceType {{m5.large}} `
    -BlockDeviceMappings $ebs_encrypt `
    -HibernationOptions_Configured $true `
    -MinCount {{1}} `
    -MaxCount {{1}} `
    -KeyName {{MyKeyPair}}
```

`DeviceName` 的值必须匹配与 AMI 关联的根设备名称。要查找根设备名称，请使用 [Get-EC2Image](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2Image.html) 命令。

```
Get-EC2Image -ImageId {{ami-0abcdef1234567890}}
```

如果您在此 AWS 区域中启用了默认加密，则可以在块设备映射中省略 `Encrypted = $true`。

------

## 为竞价型实例启用休眠
<a name="enable-hibernation-for-spot-instances"></a>

您可以为竞价型实例启用休眠。有关在中断时休眠竞价型实例的更多信息，请参阅 [竞价型实例中断](spot-interruptions.md)。

------
#### [ Console ]

**要为竞价型实例启用休眠**

1. 请遵循[使用启动实例向导请求竞价型实例](using-spot-instances-request.md)的过程操作，但请在完成以下步骤启用休眠之后再启动实例。

1. 若要启用休眠，请在启动实例向导中配置以下字段：

   1. 在**应用程序和操作系统映像（Amazon 机器映像）**下，选择支持休眠的 AMI。有关更多信息，请参阅 [AMI](hibernating-prerequisites.md#hibernation-prereqs-supported-amis)。

   1. 在 **Instance type**（实例类型）下，选择一个受支持的实例类型。有关更多信息，请参阅 [实例系列](hibernating-prerequisites.md#hibernation-prereqs-supported-instance-families)。

   1. 在 **Configure storage**（配置存储）下，选择右侧的 **Advanced**（高级），并为根卷指定以下信息：
      + 在**大小 (GiB)** 中，输入 EBS 根卷大小。卷必须足够大，以存储 RAM 内容并满足您的预期使用量。
      + 对于 **Volume Type**（卷类型），选择支持的 EBS 卷类型：通用型 SSD（`gp2` 和 `gp3`）或预调配 IOPS SSD（`io1` 和 `io2`）。
      + 对于 **Encrypted**（已加密），选择 **Yes**（是）。如果您在此 AWS 区域中启用了默认加密，则系统会选择 **Yes**（是）。
      + 对于 **KMS key**（KMS 密钥），请选择卷的加密密钥。如果您在此 AWS 区域中启用了默认加密，则会选择默认加密密钥。

      有关根卷先决条件的更多信息，请参阅[EC2 实例休眠的先决条件](hibernating-prerequisites.md)。

   1. 展开**高级详细信息**，除了用于配置竞价型实例的字段外，还要执行以下操作：

      1. 对于**请求类型**，选择**持续**。

      1. 对于**中断行为**，选择**休眠**。或者，对于**停止 - 休眠行为**，选择**启用**。这两个字段都可以在竞价型实例上启用休眠。您只需要配置其中一个。

1. 在 **Summary**（摘要）面板中查看实例配置，然后选择 **Launch instance**（启动实例）。有关更多信息，请参阅 [使用控制台中的启动实例向导来启动 EC2 实例](ec2-launch-instance-wizard.md)。

------
#### [ AWS CLI ]

**要为竞价型实例启用休眠**  
使用 [run-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/run-instances.html) 命令请求竞价型实例。使用 `--block-device-mappings file://mapping.json` 参数指定 EBS 根卷参数，并使用 `--hibernation-options Configured=true` 参数启用休眠。竞价型实例请求类型（`SpotInstanceType`）必须为 `persistent`。

```
aws ec2 run-instances \
    --image-id {{ami-0abcdef1234567890}} \
    --instance-type {{c4.xlarge}} \
    --block-device-mappings file://{{mapping}}.json \
    --hibernation-options Configured=true \
    --count {{1}} \
    --key-name {{MyKeyPair}}
    --instance-market-options
        {
           "MarketType":"spot",
           "SpotOptions":{
              "MaxPrice":"{{1}}",
              "SpotInstanceType":"persistent"
            }
        }
```

按如下方式在 `mapping.json` 中指定 EBS 根卷参数。

```
[
    {
        "DeviceName": "{{/dev/xvda}}",
        "Ebs": {
            "VolumeSize": {{30}},
            "VolumeType": "{{gp2}}",
            "Encrypted": true
        }
    }
]
```

`DeviceName` 的值必须匹配与 AMI 关联的根设备名称。要查找根设备名称，请使用 [describe-images](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-images.html) 命令。

```
aws ec2 describe-images --image-id ami-{{0abcdef1234567890}}
```

如果您在此 AWS 区域中启用了默认加密，则可以省略 `"Encrypted": true`。

------
#### [ PowerShell ]

**要为竞价型实例启用休眠**  
使用 [New-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2Instance.html) 命令请求竞价型实例。通过首先定义块设备映射，然后使用 `-BlockDeviceMappings` 参数将其添加到命令来指定 EBS 根卷。使用 `-HibernationOptions_Configured $true` 参数启用休眠。

```
$ebs_encrypt = New-Object Amazon.EC2.Model.BlockDeviceMapping
$ebs_encrypt.DeviceName = "{{/dev/xvda}}"
$ebs_encrypt.Ebs = New-Object Amazon.EC2.Model.EbsBlockDevice
$ebs_encrypt.Ebs.VolumeSize = {{30}}
$ebs_encrypt.Ebs.VolumeType = "{{gp2}}"
$ebs_encrypt.Ebs.Encrypted = $true

New-EC2Instance `
    -ImageId {{ami-0abcdef1234567890}} `
    -InstanceType {{m5.large}} `
    -BlockDeviceMappings $ebs_encrypt `
    -HibernationOptions_Configured $true `
    -MinCount {{1}} `
    -MaxCount {{1}} `
    -KeyName {{MyKeyPair}} `
    -InstanceMarketOption @(
        MarketType = spot;
        SpotOptions @{
        MaxPrice = {{1}};
        SpotInstanceType = persistent}
    )
```

`DeviceName` 的值必须匹配与 AMI 关联的根设备名称。要查找根设备名称，请使用 [Get-EC2Image](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2Image.html) 命令。

```
Get-EC2Image -ImageId {{ami-0abcdef1234567890}}
```

如果您在此 AWS 区域中启用了默认加密，则可以在块设备映射中省略 `Encrypted = $true`。

------

## 查看实例是否已启用休眠
<a name="view-if-instance-is-enabled-for-hibernation"></a>

您可以检查实例是否已启用休眠。

------
#### [ Console ]

**查看实例是否启用休眠**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**实例**。

1. 选择所需实例，然后在**详细信息**选项卡上的**实例详细信息**部分中检查**停止 – 休眠操作**。**已启用** 表明已为实例启用休眠。

------
#### [ AWS CLI ]

**查看实例是否启用休眠**  
使用 [describe-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instances.html) 命令并指定 `--filters "Name=hibernation-options.configured,Values=true"` 参数以筛选启用了休眠的实例。

```
aws ec2 describe-instances \
    --filters "Name=hibernation-options.configured,Values=true"
```

输出中的以下字段指示实例已启用了休眠。

```
"HibernationOptions": {
    "Configured": true
}
```

------
#### [ PowerShell ]

**查看实例是否启用休眠**  
使用 [Get-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2Instance.html) cmdlet 并筛选启用了休眠的实例。

```
(Get-EC2Instance `
    -Filter @{Name="hibernation-options.configured"; Values="true"}).Instances
```

------