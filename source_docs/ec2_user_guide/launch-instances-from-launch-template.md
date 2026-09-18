

# 使用启动模板来启动 EC2 实例
<a name="launch-instances-from-launch-template"></a>

Amazon EC2 启动模板可存储实例启动参数，以便无需在每次启动实例时都指定这些参数。

一些实例启动服务在启动实例时可以选择使用启动模板，而对于其他服务，如 EC2 实例集，除非使用启动模板，否则无法启动实例。本主题介绍如何在使用 EC2 启动实例向导、Amazon EC2 Auto Scaling、EC2 实例集和竞价型实例集启动实例时，使用启动模板。

有关启动模板的更多信息，包括如何创建启动模板，请参阅[在 Amazon EC2 启动模板中存储实例启动参数](ec2-launch-templates.md)。

**Topics**
+ [使用启动模板启动 Amazon EC2 实例](#launch-instance-from-launch-template)
+ [使用启动模板在 Amazon EC2 Auto Scaling 组中启动实例](#launch-templates-as)
+ [使用启动模板启动 EC2 实例集](#launch-templates-ec2-fleet)
+ [使用启动模板启动竞价型实例集](#launch-templates-spot-fleet)

## 使用启动模板启动 Amazon EC2 实例
<a name="launch-instance-from-launch-template"></a>

您可以使用启动模板中包含的参数启动 Amazon EC2 实例。选择启动模板后，但在启动实例之前，您可以修改启动参数。

将自动为使用启动模板启动的实例分配两个具有 `aws:ec2launchtemplate:id` 和 `aws:ec2launchtemplate:version` 键的标签。您无法删除或编辑这些标签。

------
#### [ Console ]

**使用启动模板启动实例**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 使用以下选项之一选择启动模板：
   + 从 Amazon EC2 控制台的控制面板中，选择**启动实例**旁边的向下箭头，选择**从模板启动实例**，然后对**源模板**选择启动模板。
   + 在导航窗格中，选择**启动模板**，选择该启动模板，然后选择**操作**、**从模板启动实例**。

1. 对于 **Source template version (源模板版本)**，选择要使用的启动模板版本。

1. （可选）您可以修改任何启动参数的值。如果您未修改值，则使用启动模板定义的值。如果启动模板中未指定任何值，则使用该参数的默认值。

1. 在**摘要**面板中，对于**实例数**，输入要启动的实例数量。

1. 选择**启动实例**。

   如果实例无法启动或状态立即转至 `terminated` 而非 `running`，请参阅 [排查 Amazon EC2 实例启动问题](troubleshooting-launch.md)。

------
#### [ AWS CLI ]

**通过启动模板启动实例**
+ 使用 [run-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/run-instances.html) 命令并指定 `--launch-template` 参数。可以选择指定要使用的启动模板版本。如果未指定版本，则使用默认版本。

  ```
  aws ec2 run-instances \
      --launch-template LaunchTemplateId={{lt-0abcd290751193123}},Version={{1}}
  ```
+ 要覆盖启动模板参数，请在 [run-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/run-instances.html) 命令中指定该参数。以下示例覆盖在启动模板 (如果有) 中指定的实例类型。

  ```
  aws ec2 run-instances \
      --launch-template LaunchTemplateId={{lt-0abcd290751193123}} \
      --instance-type {{t2.small}}
  ```
+ 如果指定复杂结构包含的嵌套参数，则使用启动模板中指定的复杂结构以及您指定的任何其他嵌套参数启动实例。

  在以下示例中，将使用标签 `{{Owner}}={{TeamA}}` 以及在启动模板中指定的任何其他标签启动实例。如果启动模板包含具有 `{{Owner}}` 键的现有标签，该值将替换为 `{{TeamA}}`。

  ```
  aws ec2 run-instances \
      --launch-template LaunchTemplateId={{lt-0abcd290751193123}} \
      --tag-specifications "ResourceType=instance,Tags=[{Key={{Owner}},Value={{TeamA}}}]"
  ```

  在以下示例中，将使用具有设备名称 {{`/dev/xvdb`}} 的卷以及在启动模板中指定的任何其他块设备映射启动实例。如果启动模板为 {{`/dev/xvdb`}} 定义了一个现有卷，则其值将替换为指定的值。

  ```
  aws ec2 run-instances \
      --launch-template LaunchTemplateId={{lt-0abcd290751193123}} \
      --block-device-mappings "DeviceName={{/dev/xvdb}},Ebs={VolumeSize={{20}},VolumeType={{gp2}}}"
  ```

如果实例无法启动或状态立即转至 `terminated` 而非 `running`，请参阅 [排查 Amazon EC2 实例启动问题](troubleshooting-launch.md)。

------
#### [ PowerShell ]

**使用 AWS Tools for PowerShell 通过启动模板启动实例**
+ 使用 [New-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/Index.html) 命令并指定 `-LaunchTemplate` 参数。可以选择指定要使用的启动模板版本。如果未指定版本，则使用默认版本。

  ```
  Import-Module AWS.Tools.EC2
  New-EC2Instance `
      -LaunchTemplate ( 
          New-Object -TypeName Amazon.EC2.Model.LaunchTemplateSpecification -Property @{ 
              LaunchTemplateId = '{{lt-0abcd290751193123}}'; 
              Version          = '{{4}}' 
      } 
  )
  ```
+ 要覆盖启动模板参数，请在 [New-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/Index.html) 命令中指定该参数。以下示例覆盖在启动模板 (如果有) 中指定的实例类型。

  ```
  Import-Module AWS.Tools.EC2
  New-EC2Instance `
      -InstanceType {{t4g.small}} `
      -LaunchTemplate (
          New-Object -TypeName Amazon.EC2.Model.LaunchTemplateSpecification -Property @{ 
              LaunchTemplateId = '{{lt-0abcd290751193123}}'; 
              Version          = '{{4}}' 
      } 
  )
  ```
+ 如果指定复杂结构包含的嵌套参数，则使用启动模板中指定的复杂结构以及您指定的任何其他嵌套参数启动实例。

  在以下示例中，将使用标签 `{{Owner}}={{TeamA}}` 以及在启动模板中指定的任何其他标签启动实例。如果启动模板包含具有 `{{Owner}}` 键的现有标签，该值将替换为 `{{TeamA}}`。

  ```
  Import-Module AWS.Tools.EC2
  New-EC2Instance `
      -InstanceType {{t4g.small}}  `
      -LaunchTemplate ( 
          New-Object -TypeName Amazon.EC2.Model.LaunchTemplateSpecification -Property @{ 
              LaunchTemplateId = '{{lt-0abcd290751193123}}'; 
              Version          = '{{4}}' 
          } 
  ) `
      -TagSpecification ( 
          New-Object -TypeName Amazon.EC2.Model.TagSpecification -Property @{ 
              ResourceType = 'instance'; 
              Tags         = @( 
                  @{key = "{{Owner}}"; value = "{{TeamA}}" }, 
                  @{key = "{{Department}}"; value = "{{Operations}}" } 
              ) 
          } 
  )
  ```

  在以下示例中，将使用具有设备名称 {{`/dev/xvdb`}} 的卷以及在启动模板中指定的任何其他块设备映射启动实例。如果启动模板为 {{`/dev/xvdb`}} 定义了一个现有卷，则其值将替换为指定的值。

  ```
  Import-Module AWS.Tools.EC2
  New-EC2Instance `
      -InstanceType {{t4g.small}}  `
      -LaunchTemplate ( 
          New-Object -TypeName Amazon.EC2.Model.LaunchTemplateSpecification -Property @{ 
              LaunchTemplateId = '{{lt-0abcd290751193123}}'; 
              Version          = '{{4}}' 
      } 
  ) `
      -BlockDeviceMapping  ( 
          New-Object -TypeName Amazon.EC2.Model.BlockDeviceMapping -Property @{ 
              DeviceName = '{{/dev/xvdb}}'; 
              EBS        = ( 
                  New-Object -TypeName Amazon.EC2.Model.EbsBlockDevice -Property @{ 
                      VolumeSize = {{25}}; 
                      VolumeType = '{{gp3}}' 
                  } 
              ) 
          } 
  )
  ```

如果实例无法启动或状态立即转至 `terminated` 而非 `running`，请参阅 [排查 Amazon EC2 实例启动问题](troubleshooting-launch.md)。

------

## 使用启动模板在 Amazon EC2 Auto Scaling 组中启动实例
<a name="launch-templates-as"></a>

您可以创建一个 Auto Scaling 组，并指定一个用于该组的启动模板。在 Amazon EC2 Auto Scaling 启动 Auto Scaling 组中的实例时，它使用关联的启动模板中定义的启动参数。

在可以使用启动模板创建自动扩缩组之前，您必须先创建启动模板，其中包括启动自动扩缩组中的实例所需的参数。有些参数是必需的，例如 AMI 的 ID，有些参数不可用于自动扩缩组。控制台提供指导，以帮助您创建可与 Amazon EC2 Auto Scaling 结合使用的模板。

**使用控制台通过启动模板创建自动扩缩组**
+ 有关更多信息，请参阅《Amazon EC2 Auto Scaling User Guide》**中的 [Create an Auto Scaling group using a launch template]()。

**使用 AWS CLI 通过启动模板创建或更新自动扩缩组**
+ 使用 [create-auto-scaling-group](https://docs.aws.amazon.com/cli/latest/reference/autoscaling/create-auto-scaling-group.html) 或 [update-auto-scaling-group](https://docs.aws.amazon.com/cli/latest/reference/autoscaling/update-auto-scaling-group.html) 命令，并指定 `--launch-template` 参数。

有关更多信息，请参阅《Amazon EC2 Auto Scaling User Guide》**中的以下主题：
+ [为自动扩缩组创建启动模板](https://docs.aws.amazon.com/autoscaling/ec2/userguide/create-launch-template.html)
+ [使用高级设置创建启动模板](https://docs.aws.amazon.com/autoscaling/ec2/userguide/advanced-settings-for-your-launch-template.html)
+ [Examples for creating and managing launch templates with the AWS Command Line Interface（AWS CLI）](https://docs.aws.amazon.com/autoscaling/ec2/userguide/examples-launch-templates-aws-cli.html)：提供展示如何使用各种参数组合创建启动模板的示例。
+ [使用启动模板创建自动扩缩组](https://docs.aws.amazon.com/autoscaling/ec2/userguide/create-auto-scaling-groups-launch-template.html)
+ [更新自动扩缩组](https://docs.aws.amazon.com/autoscaling/ec2/userguide/update-auto-scaling-group.html)

## 使用启动模板启动 EC2 实例集
<a name="launch-templates-ec2-fleet"></a>

创建 EC2 实例集请求时，启动模板是必需的。在 Amazon EC2 完成 EC2 队列 请求时，它使用关联的启动模板中定义的启动参数。您可以覆盖启动模板中指定的某些参数。有关更多信息，请参阅[创建 EC2 实例集](create-ec2-fleet.md)。

**使用 AWS CLI 通过启动模板创建 EC2 实例集**
+ 使用 [create-fleet](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-fleet.html) 命令。请使用 `--launch-template-configs` 参数指定启动模板，并为启动模板指定任何覆盖值。

## 使用启动模板启动竞价型实例集
<a name="launch-templates-spot-fleet"></a>

**重要**  
竞价型实例集仍在使用旧版 API，且暂无相关投资计划。建议改用 EC2 实例集或自动扩缩组。有关更多信息，请参阅 [哪种是实例集最佳使用方法？](which-fleet-method-to-use.md)。

创建竞价型实例集请求时，启动模板是可选。如果您未使用启动模板，则可以手动指定启动参数。如果使用启动模板，则在 Amazon EC2 完成竞价型实例集请求时，它会使用关联的启动模板中定义的启动参数。您可以覆盖启动模板中指定的某些参数。有关更多信息，请参阅 [创建竞价型实例集](create-spot-fleet.md)。

**使用启动模板创建竞价型实例集请求**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，请选择 **Spot Requests**。

1. 选择**请求 Spot 实例**。

1. 在 **Launch parameters**（启动参数）下，选择 **Use a launch template**（使用启动模板）。

1. 对于 **Launch template**（启动模板），选择一个启动模板，然后从右侧字段中选择启动模板版本。

1. 在此屏幕上选择不同的选项来配置竞价型实例集。有关选项的更多信息，请参阅[使用已定义的参数创建竞价型实例集请求](create-spot-fleet.md#create-spot-fleet-advanced)。

1. 准备好创建竞价型实例集后，请选择 **Launch**（启动）。

**使用启动模板创建竞价型实例集请求**
+ 使用 [request-spot-fleet](https://docs.aws.amazon.com/cli/latest/reference/ec2/request-spot-fleet.html) 命令。请使用 `LaunchTemplateConfigs` 参数指定启动模板，并为启动模板指定任何覆盖值。