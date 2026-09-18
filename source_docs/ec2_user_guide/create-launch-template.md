

# 创建 Amazon EC2 启动模板
<a name="create-launch-template"></a>

您可以通过为实例配置参数指定自己的值，或者从现有启动模板或 Amazon EC2 实例中获取值来创建 Amazon EC2 启动模板。

您无需为启动模板中的每个参数指定值；只需指定一个实例配置参数即可创建启动模板。要指明您选择不指定的参数，请在使用控制台时选择**不包括在启动模板中**。使用命令行工具时，不包含参数表示您选择不在启动模板中指定这些参数。

如果想在启动模板中指定 AMI，您可以选择一个 AMI，也可以指定一个在实例启动时将指向 AMI 的 Systems Manager 参数。

使用启动模板启动实例时，将使用启动模板中指定的值来配置相应的实例参数。如果启动模板中未指定值，则使用相应实例参数的默认值。

**Topics**
+ [通过指定参数创建启动模板](#create-launch-template-define-parameters)
+ [从现有启动模板创建启动模板](#create-launch-template-from-existing-launch-template)
+ [从实例创建启动模板](#create-launch-template-from-instance)
+ [使用 Systems Manager 参数而非 AMI ID](#use-an-ssm-parameter-instead-of-an-ami-id)

## 通过指定参数创建启动模板
<a name="create-launch-template-define-parameters"></a>

要创建启动模板，您必须指定启动模板名称和至少一个实例配置参数。

有关每个参数的说明，请参阅[Amazon EC2 实例配置参数参考](ec2-instance-launch-parameters.md)。

------
#### [ Console ]

**创建启动模板**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**启动模板**，然后选择**创建启动模板**。

1. 在**启动模板名称和说明**下，执行以下操作：

   1. 对于**设备模板名称**，请为您的启动模板输入描述性名称。

   1. 对于**模板版本说明**，提供此版本的启动模板的简短说明。

   1. 要在创建时[标记](Using_Tags.md)启动模板，请展开**模板标签**，选择**添加新标签**，然后输入标签键值对。为每个要添加的其他标签选择**添加新标签**。
**注意**  
要标记启动实例时创建的资源，必须在 **Resource tags**（资源标签）下面指定标签。有关更多信息，请参阅此过程中的步骤 9。

1. 在**应用程序和操作系统映像（亚马逊机器映像）**下，您可以保持选中**不包括在启动模板中**，也可以选择实例的操作系统（OS），然后选择 AMI。或者，您可以指定 Systems Manager 参数而非指定 AMI。有关更多信息，请参阅 [使用 Systems Manager 参数而非 AMI ID](#use-an-ssm-parameter-instead-of-an-ami-id)。

   AMI 是一个模板，其中包含启动实例所需的操作系统和软件。

1. 在**实例类型**下，您可以保持选中**不包括在启动模板中**，也可以选择一个实例类型，或者指定实例属性并让 Amazon EC2 使用这些属性识别实例类型。
**注意**  
仅当自动扩缩组、EC2 实例集和竞价型实例集使用启动模板来启动实例时，才支持指定实例属性。有关更多信息，请参阅 [使用基于属性的实例类型选择创建一个混合实例组](https://docs.aws.amazon.com/autoscaling/ec2/userguide/create-mixed-instances-group-attribute-based-instance-type-selection.html) 和 [指定 EC2 实例集或竞价型实例集的实例类型选择属性](ec2-fleet-attribute-based-instance-type-selection.md)。  
如果您计划使用[启动实例向导](ec2-launch-instance-wizard.md)中的启动模板，或搭配使用 [RunInstances API](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_RunInstances.html)，则无法指定实例类型属性。

   实例类型决定了用于实例的硬件配置（CPU、内存、存储和网络容量）和主机大小。

   如果不确定要选择哪种实例类型，则可以执行以下操作：
   + 选择**比较实例类型**，通过以下属性比较不同的实例类型：vCPU 数、架构、内存量（GiB）、存储量（GB）、存储类型和网络性能。
   + 选择**获取建议**，从 EC2 实例类型查找器中获取实例类型的指导和建议。有关更多信息，请参阅 [从 EC2 实例类型查找器获取建议](get-ec2-instance-type-recommendations.md)。
**注意**  
根据您创建账户的时间，您可能有资格在免费套餐下使用 Amazon EC2。  
如果您在 2025 年 7 月 15 日之前创建 AWS 账户且其使用时间未满 12 个月，您可以通过选择 **t2.micro** 实例类型（或在 **t2.micro** 不可用的区域中选择 **t3.micro** 实例类型）来使用免费套餐下的 Amazon EC2。请注意，在启动 **t3.micro** 实例时，默认会启用[**无限**模式](burstable-performance-instances-unlimited-mode.md)，该模式可能会根据 CPU 使用情况产生额外费用。如果实例类型可在免费套餐下使用，则会标记为**符合免费套餐资格**。  
如果您是在 2025 年 7 月 15 日当天或之后创建的 AWS 账户，则可以使用 **t3.micro**、**t3.small**、**t4g.micro**、**t4g.small**、**c7i-flex.large** 和 **m7i-flex.large** 实例类型，使用期限为 6 个月，或直到您的服务抵扣金用完为止。  
有关更多信息，请参阅 [2025 年 7 月 15 日之前和之后的免费套餐权益](ec2-free-tier-usage.md#ec2-free-tier-comparison)。

1. 在**密钥对（登录）**下，对于**密钥对名称**，请保持选中**不包括在启动模板中**、选择现有密钥对或创建一个新密钥对。

1. 在**网络设置**下，您可以保持选中**不包括在启动模板中**，也可以为各种网络设置指定值。

1. 在**配置存储**下，如果您在启动模板中指定了 AMI，则 AMI 会包含一个或多个存储卷，包括根卷 [**卷 1（AMI 根）**]。您可以选择指定要附加到实例的其他卷。要添加新卷，请选择 **Add new volume**（添加新卷）。

1. 要**标记**启动实例时创建的资源，在[资源标签](Using_Tags.md)下，选择**添加标签**，然后输入标签键值对。对于 **Resource types**（资源类型），指定创建时要标记的资源。您可以为所有资源指定相同的标签，也可以为不同的资源指定不同的标签。为每个要添加的其它标签选择**添加标签**。

   您可以为使用启动模板时创建的以下资源指定标签：
   + 实例
   + 卷
   + Elastic Graphics
   + 竞价型实例请求
   + 网络接口
**注意**  
要为启动模板本身添加标签，您必须在 **Template tags**（模板标签）下指定标签。有关更多信息，请参阅此过程中的步骤 3。

1. 对于**高级详细信息**，请展开该部分以查看字段并（可选）为实例指定任何其他参数。

1. 使用**摘要**面板查看启动模板配置。您可以通过选择其链接导航到任何部分，然后进行任何必要的更改。

1. 当您准备好创建启动模板时，请选择**创建启动模板**。

------
#### [ AWS CLI ]

**创建启动模板**  
使用 [create-launch-template](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-launch-template.html) 命令。

```
aws ec2 create-launch-template \
    --launch-template-name {{TemplateForWebServer}} \
    --version-description {{WebVersion1}} \
    --tag-specifications 'ResourceType=launch-template,Tags=[{Key={{purpose}},Value={{production}}}]' \
    --launch-template-data file://{{template-data}}.json
```

以下是一个示例 JSON，其指定实例配置的启动模板数据。将 JSON 保存到文件中并将其包含在 `--launch-template-data` 参数中，如示例命令中所示。

```
{
    "NetworkInterfaces": [{
        "AssociatePublicIpAddress": true,
        "DeviceIndex": 0,
        "Ipv6AddressCount": {{1}},
        "SubnetId": "{{subnet-0abcdef1234567890}}"
    }],
    "ImageId": "{{ami-0abcdef1234567890}}",
    "InstanceType": "{{r5.4xlarge}}",
    "TagSpecifications": [{
        "ResourceType": "instance",
        "Tags": [{
            "Key":"{{Name}}",
            "Value":"{{webserver}}"
        }]
    }],
    "CpuOptions": {
        "CoreCount":{{4}},
        "ThreadsPerCore":{{2}}
    }
}
```

下面是示例输出。

```
{
    "LaunchTemplate": {
        "LatestVersionNumber": 1, 
        "LaunchTemplateId": "lt-01238c059e3466abc", 
        "LaunchTemplateName": "TemplateForWebServer", 
        "DefaultVersionNumber": 1, 
        "CreatedBy": "arn:aws:iam::123456789012:root", 
        "CreateTime": "2017-11-27T09:13:24.000Z"
    }
}
```

------
#### [ PowerShell ]

**创建启动模板**  
使用 [New-EC2LaunchTemplate](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2LaunchTemplate.html) cmdlet。

```
$launchTemplateData = [Amazon.EC2.Model.RequestLaunchTemplateData]@{
    ImageId = '{{ami-0abcdef1234567890}}'
    InstanceType = '{{r5.4xlarge}}'
    NetworkInterfaces = @(
        [Amazon.EC2.Model.LaunchTemplateInstanceNetworkInterfaceSpecificationRequest]@{
            AssociatePublicIpAddress = $true
            DeviceIndex = 0
            Ipv6AddressCount = {{1}}
            SubnetId = '{{subnet-0abcdef1234567890}}'
        }
    )
    TagSpecifications = @(
        [Amazon.EC2.Model.LaunchTemplateTagSpecificationRequest]@{
            ResourceType = 'instance'
            Tags = [Amazon.EC2.Model.Tag]@{
                Key = '{{Name}}'
                Value = '{{webserver}}'
            }
        }
    )
    CpuOptions = [Amazon.EC2.Model.LaunchTemplateCpuOptionsRequest]@{
        CoreCount = {{4}}
        ThreadsPerCore = {{2}}
    }
}
$tagSpecificationData = [Amazon.EC2.Model.TagSpecification]@{
    ResourceType = 'launch-template'
    Tags = [Amazon.EC2.Model.Tag]@{
        Key = '{{purpose}}'
        Value = '{{production}}'
    }
}
New-EC2LaunchTemplate -LaunchTemplateName '{{TemplateForWebServer}}' `
    -VersionDescription '{{WebVersion1}}' `
    -LaunchTemplateData $launchTemplateData `
    -TagSpecification $tagSpecificationData
```

下面是示例输出。

```
CreatedBy            : arn:aws:iam::123456789012:root
CreateTime           : 9/19/2023 16:57:55
DefaultVersionNumber : 1
LatestVersionNumber  : 1
LaunchTemplateId     : lt-01238c059eEXAMPLE
LaunchTemplateName   : TemplateForWebServer
Tags                 : {purpose}
```

------

## 从现有启动模板创建启动模板
<a name="create-launch-template-from-existing-launch-template"></a>

您可以克隆现有的启动模板，然后调整参数以创建新的启动模板。但是，您只能在使用 Amazon EC2 控制台时执行此操作。AWS CLI 不支持克隆模板。有关每个参数的说明，请参阅[Amazon EC2 实例配置参数参考](ec2-instance-launch-parameters.md)。

------
#### [ Console ]

**从现有启动模板创建启动模板**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**启动模板**，然后选择**创建启动模板**。

1. 对于**设备模板名称**，请为您的启动模板输入描述性名称。

1. 对于**模板版本说明**，提供此版本的启动模板的简短说明。

1. 要在创建时标记启动模板，请展开**模板标签**，选择**添加新标签**，然后输入标签键值对。

1. 展开**源模板**，对于**启动模板名称**，选择要作为新启动模板基础的启动模板。

1. 对于**源模板版本**，请选择新启动模板版本所基于的启动模板版本。

1. 根据需要，调整任何启动参数，然后选择**Create launch template (创建启动模板)**。

------

## 从实例创建启动模板
<a name="create-launch-template-from-instance"></a>

您可以克隆现有 Amazon EC2 实例的参数，然后调整参数以创建启动模板。有关每个参数的说明，请参阅[Amazon EC2 实例配置参数参考](ec2-instance-launch-parameters.md)。

------
#### [ Console ]

**从实例创建启动模板**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances (实例)**。

1. 选择实例，然后依次选择**操作**、**图像和模板**、**从实例创建模板**。

1. 提供名称、描述和标签，然后根据需要调整启动参数。
**注意**  
通过实例创建启动模板时，该实例的网络接口 ID 和 IP 地址将不包含在模板中。

1. 选择**创建启动模板**。

------
#### [ AWS CLI ]

您可以使用 AWS CLI 从现有实例创建启动模板，方法是先从实例获取启动模板数据，然后使用启动模板数据创建启动模板。

**从实例获取启动模板数据**
+ 使用 [get-launch-template-data](https://docs.aws.amazon.com/cli/latest/reference/ec2/get-launch-template-data.html) 命令，并指定实例 ID。您可以将输出作为基础以创建新的启动模板或启动模板版本。默认情况下，输出包含一个顶级 `LaunchTemplateData` 对象，无法在启动模板数据中指定该对象。请使用 `--query` 选项排除该对象。

  ```
  aws ec2 get-launch-template-data \
      --instance-id {{i-0123d646e8048babc}} \
      --query "LaunchTemplateData"
  ```

  下面是示例输出。

  ```
      {
          "Monitoring": {}, 
          "ImageId": "ami-8c1be5f6", 
          "BlockDeviceMappings": [
              {
                  "DeviceName": "/dev/xvda", 
                  "Ebs": {
                      "DeleteOnTermination": true
                  }
              }
          ], 
          "EbsOptimized": false, 
          "Placement": {
              "Tenancy": "default", 
              "GroupName": "", 
              "AvailabilityZone": "us-east-1a"
          }, 
          "InstanceType": "t2.micro", 
          "NetworkInterfaces": [
              {
                  "Description": "", 
                  "NetworkInterfaceId": "eni-35306abc", 
                  "PrivateIpAddresses": [
                      {
                          "Primary": true, 
                          "PrivateIpAddress": "10.0.0.72"
                      }
                  ], 
                  "SubnetId": "subnet-7b16de0c", 
                  "Groups": [
                      "sg-7c227019"
                  ], 
                  "Ipv6Addresses": [
                      {
                          "Ipv6Address": "2001:db8:1234:1a00::123"
                      }
                  ], 
                  "PrivateIpAddress": "10.0.0.72"
              }
          ]
      }
  ```

  您可以将输出直接写入到一个文件中，例如：

  ```
  aws ec2 get-launch-template-data \
      --instance-id {{i-0123d646e8048babc}} \
      --query "LaunchTemplateData" >> {{instance-data.json}}
  ```

**使用启动模板数据创建启动模板**
+ 使用 [create-launch-template](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-launch-template.html) 命令可以使用上一步骤的输出创建启动模板。有关使用 AWS CLI 创建启动模板的更多信息，请参阅[通过指定参数创建启动模板](#create-launch-template-define-parameters)。

------

## 使用 Systems Manager 参数而非 AMI ID
<a name="use-an-ssm-parameter-instead-of-an-ami-id"></a>

您可以指定 AWS Systems Manager 参数，而不是在启动模板中指定 AMI ID。如果 AMI ID 发生变更，您可以通过更新 Systems Manager Parameter Store 中的 Systems Manager 参数在一个位置更新 AMI ID。参数也可以与其他 AWS 账户 [共享](https://docs.aws.amazon.com/systems-manager/latest/userguide/parameter-store-shared-parameters.html)。您可以在一个账户中集中存储和管理 AMI 参数，并与需要引用这些参数的所有其他账户共享。使用 Systems Manager 参数，只需一次操作即可更新所有启动模板。

Systems Manager 参数是用户定义的键值对，您可以在 [AWS Systems Manager Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html) 中创建该键值对。Parameter Store 提供了一个集中位置来存储应用程序配置值。

在下图中，`golden-ami` 参数首先映射到 Parameter Store 中的原始 AMI `ami-aabbccddeeffgghhi`。在启动模板中，AMI ID 的值为 `golden-ami`。使用此启动模板启动实例时，AMI ID 解析为 `ami-aabbccddeeffgghhi`。之后，AMI 会更新，从而生成新的 AMI ID。在 Parameter Store 中，`golden-ami` 参数将映射到新的 `ami-00112233445566778`。*启动模板保持不变。*使用此启动模板启动实例时，AMI ID 解析为新的 `ami-00112233445566778`。

![使用 Parameter Store 中的 Systems Manager 参数更新启动模板。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/launch-template-ami-alias.png)


### AMI ID 的 Systems Manager 参数格式
<a name="ssm-parameter-format-for-ami-ids"></a>

根据启动模板要求，用户定义的 Systems Manager 参数在替换 AMI ID 时应遵循以下格式：
+ 参数类型：`String`
+ 参数数据类型：`aws:ec2:image` – 确保 Parameter Store 验证您输入的值是否采用 AMI ID 的正确格式。

有关为 AMI ID 创建有效参数的更多信息，请参阅**《AWS Systems Manager 用户指南》中的[创建 Systems Manager 参数](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-paramstore-su-create.html)。

### 启动模板中的 Systems Manager 参数格式
<a name="ssm-parameter-format-in-launch-templates"></a>

要在启动模板中使用 Systems Manager 参数替换 AMI ID，必须在启动模板中指定参数时采用以下格式之一：

要引用公有参数，请执行以下操作：
+ `resolve:ssm:{{public-parameter}}`

要引用存储在同一账户中的参数，请执行以下操作：
+ `resolve:ssm:{{parameter-name}}`
+ `resolve:ssm:{{parameter-name}}:{{version-number}}` – 版本号本身是默认标签
+ `resolve:ssm:{{parameter-name}}:{{label}}`

要引用其他 AWS 账户 共享的参数，请执行以下操作：
+ `resolve:ssm:{{parameter-ARN}}`
+ `resolve:ssm:{{parameter-ARN}}:{{version-number}}`
+ `resolve:ssm:{{parameter-ARN}}:{{label}}`

**参数版本**

Systems Manager 参数是版本控制资源。更新参数时，会创建该参数的连续新版本。Systems Manager 支持[参数标签](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-paramstore-labels.html)，您可以将其映射到参数的特定版本。

例如，`golden-ami` 参数可能有三个版本：`1`、`2` 和 `3`。您可以创建映射到版本 `2` 的参数标签 `beta`，以及映射到版本 `3` 的参数标签 `prod`。

在启动模板中，您可以使用以下任一格式指定 `golden-ami` 参数的版本 3：
+ `resolve:ssm:golden-ami:3`
+ `resolve:ssm:golden-ami:prod`

指定版本或标签是可选的。如果未指定版本或标签，将使用参数的最新版本。

### 在启动模板中指定 Systems Manager 参数
<a name="specify-systems-manager-parameter-in-launch-template"></a>

创建启动模板或其新版本时，可以在启动模板中指定 Systems Manager 参数，而不是 AMI ID。

------
#### [ Console ]

**在启动模板中指定 Systems Manager 参数**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**启动模板**，然后选择**创建启动模板**。

1. 对于**设备模板名称**，请为您的启动模板输入描述性名称。

1. 在**应用程序和操作系统镜像（Amazon 机器映像）**下，选择**浏览其他 AMI**。

1. 选择搜索栏右侧的箭头按钮，然后选择**指定自定义值/Systems Manager 参数**。

1. 在**指定自定义值或 Systems Manager 参数**对话框中，执行以下操作：

   1. 对于 **AMI ID 或 Systems Manager 参数字符串**，使用以下格式之一输入 Systems Manager 参数名称：

      要引用公有参数，请执行以下操作：
      + **resolve:ssm:{{public-parameter}}**

      要引用存储在同一账户中的参数，请执行以下操作：
      + **resolve:ssm:{{parameter-name}}**
      + **resolve:ssm:{{parameter-name}}:{{version-number}}**
      + **resolve:ssm:{{parameter-name}}:{{label}}**

      要引用其他 AWS 账户 共享的参数，请执行以下操作：
      + **resolve:ssm:{{parameter-ARN}}**
      + **resolve:ssm:{{parameter-ARN}}:{{version-number}}**
      + **resolve:ssm:{{parameter-ARN}}:{{label}}**

   1. 选择**保存**。

1. 根据需要指定任何其他启动模板参数，然后选择**创建启动模板**。

有关更多信息，请参阅 [通过指定参数创建启动模板](#create-launch-template-define-parameters)。

------
#### [ AWS CLI ]

**在启动模板中指定 Systems Manager 参数**
+ 使用 [create-launch-template](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-launch-template.html) 命令创建启动模板。要指定要使用的 AMI，请使用以下格式之一输入 Systems Manager 参数名称：

  要引用公有参数，请执行以下操作：
  + **resolve:ssm:{{public-parameter}}**

  要引用存储在同一账户中的参数，请执行以下操作：
  + **resolve:ssm:{{parameter-name}}**
  + **resolve:ssm:{{parameter-name}}:{{version-number}}**
  + **resolve:ssm:{{parameter-name}}:{{label}}**

  要引用其他 AWS 账户 共享的参数，请执行以下操作：
  + **resolve:ssm:{{parameter-ARN}}**
  + **resolve:ssm:{{parameter-ARN}}:{{version-number}}**
  + **resolve:ssm:{{parameter-ARN}}:{{label}}**

  下面的示例创建一个指定以下内容的启动模板：
  + 启动模板的名称（`{{TemplateForWebServer}}`）
  + 启动模板的标签 (`{{purpose}}`=`{{production}}`)
  + 在 JSON 文件中指定的实例配置数据：
    + 要使用的 AMI (`resolve:ssm:{{golden-ami}}`)
    + 要启动的实例类型 (`{{m5.4xlarge}}`)
    + 实例的标签（`{{Name}}`=`{{webserver}}`）

  ```
  aws ec2 create-launch-template \
      --launch-template-name {{TemplateForWebServer}} \
      --tag-specifications 'ResourceType=launch-template,Tags=[{Key={{purpose}},Value={{production}}}]' \
      --launch-template-data file://{{template-data}}.json
  ```

  以下是一个示例 JSON 文件，其中包含实例配置的启动模板数据。`ImageId` 的值是以所需格式 `resolve:ssm:{{golden-ami}}` 输入的 Systems Manager 参数名称。

  ```
  {"LaunchTemplateData": {
      "ImageId": "resolve:ssm:{{golden-ami}}",
      "InstanceType": "{{m5.4xlarge}}",
      "TagSpecifications": [{
          "ResourceType": "instance",
          "Tags": [{
              "Key":"{{Name}}",
              "Value":"{{webserver}}"
          }]
      }]
    }
  }
  ```

------

### 验证启动模板是否获得正确的 AMI ID
<a name="ssm-parameter-verify-ami-id"></a>

**将 Systems Manager 参数解析为实际的 AMI ID**  
使用 [describe-launch-template-versions](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-launch-template-versions.html) 命令并包含 `--resolve-alias` 参数。

```
aws ec2 describe-launch-template-versions \
    --launch-template-name {{my-launch-template}} \
    --versions {{$Default}} \
    --resolve-alias
```

响应包含 `ImageId` 的 AMI ID。在本示例中，使用此启动模板启动实例时，AMI ID 解析为 `ami-0ac394d6a3example`。

```
{
    "LaunchTemplateVersions": [
        {
            "LaunchTemplateId": "lt-089c023a30example",
            "LaunchTemplateName": "my-launch-template",
            "VersionNumber": 1,
            "CreateTime": "2022-12-28T19:52:27.000Z",
            "CreatedBy": "arn:aws:iam::123456789012:user/Bob",
            "DefaultVersion": true,
            "LaunchTemplateData": {
                "ImageId": "ami-0ac394d6a3example",
                "InstanceType": "t3.micro",
            }
        }
    ]
}
```

### 相关资源
<a name="ssm-parameter-related-resources"></a>

有关使用 Systems Manager 参数的更多信息，请参阅 Systems Manager 文档中的以下参考资料。
+ 有关如何查找 Amazon EC2 支持的 AMI 公有参数的信息，请参阅 [Calling AMI public parameters](https://docs.aws.amazon.com/systems-manager/latest/userguide/parameter-store-public-parameters-ami.html)。
+ 有关与其他 AWS 账户共享参数或通过 AWS Organizations 共享参数的信息，请参阅 [Working with shared parameters](https://docs.aws.amazon.com/systems-manager/latest/userguide/parameter-store-shared-parameters.html)。
+ 有关监控参数是否成功创建的信息，请参阅 [Native parameter support for Amazon Machine Image IDs](https://docs.aws.amazon.com/systems-manager/latest/userguide/parameter-store-ec2-aliases.html)。

### 限制
<a name="ssm-parameter-limitations"></a>
+ 只有 `instant` 类型的 EC2 实例集支持使用指定了 Systems Manager 参数而不是 AMI ID 的启动模板。
+ `maintain` 和 `request` 类型的 EC2 实例集以及竞价型实例集不支持使用指定了 Systems Manager 参数而不是 AMI ID 的启动模板。对于 `maintain` 和 `request` 类型的 EC2 实例集以及竞价型实例集，如果您在启动模板中指定 AMI，则必须指定 AMI ID。
+ 如果在 EC2 实例集中使用[基于属性的实例选择](ec2-fleet-attribute-based-instance-type-selection.md)，则无法指定 Systems Manager 参数来代替 AMI ID。如果基于属性的实例选择，则必须指定 AMI ID。
+ Amazon EC2 Auto Scaling 提供其他限制。有关更多信息，请参阅《Amazon EC2 Auto Scaling 用户指南**》中的[在启动模板中使用 AWS Systems Manager 参数代替 AMI ID](https://docs.aws.amazon.com/autoscaling/ec2/userguide/using-systems-manager-parameters.html)。