

# 标记新的或现有的竞价型实例集请求及其启动的实例和卷
<a name="tag-spot-fleet"></a>

**重要**  
竞价型实例集仍在使用旧版 API，且暂无相关投资计划。建议改用 EC2 实例集或自动扩缩组。有关更多信息，请参阅 [哪种是实例集最佳使用方法？](which-fleet-method-to-use.md)。

要对竞价型实例集请求及其启动的实例和卷进行分类与管理，可以使用自定义元数据标记它们。您可以在创建竞价型实例集请求时或之后为其分配标签。同理，可以在实例集启动实例和卷之时或之后为实例和卷分配标签。

在标记实例集请求时，不会自动标记实例集启动的实例和卷。您需要明确标记实例集启动的实例和卷。您可以选择仅将标签分配给实例集请求，仅分配给实例集启动的实例，仅分配给附加到实例集启动的实例的卷，或者分配给所有这三种内容。

**注意**  
您只能标记附加到按需型实例的卷。您无法标记附加到竞价型实例的卷。

您可以使用 Amazon EC2 控制台或命令行工具分配标签。

有关标签的工作原理的更多信息，请参阅[标记 Amazon EC2 资源](Using_Tags.md)。

**Topics**
+ [先决条件](#tag-spot-fleet-prereqs)
+ [标记新的竞价型实例集及其启动的实例和卷](#tag-new-spot-fleet-and-resources)
+ [标记现有的竞价型实例集](#tag-existing-spot-fleet)
+ [查看竞价型实例集请求标签](#view-spot-fleet-tags)

## 先决条件
<a name="tag-spot-fleet-prereqs"></a>

授予用户标记资源的权限。有关更多信息，请参阅 [示例：标记资源](ExamplePolicies_EC2.md#iam-example-taggingresources)。

**授予用户标记资源的权限**  
创建包含以下内容的 IAM policy：
+ `ec2:CreateTags` 操作。这将授予用户创建标签的权限。
+ `ec2:RequestSpotFleet` 操作。这将授予用户创建竞价型实例集请求的权限。
+ 对于 `Resource`，您必须指定 `"*"`。这允许用户标记所有资源类型。

------
#### [ JSON ]

****  

```
{
    "Version":"2012-10-17",		 	 	 
    "Statement": [
        {
            "Sid": "TagSpotFleetRequest",
            "Effect": "Allow",
            "Action": [
                "ec2:CreateTags",
                "ec2:RequestSpotFleet"
            ],
            "Resource": "*"
        }
    ]
}
```

------

**重要**  
`spot-fleet-request` 资源目前不支持资源级权限。如果您指定 `spot-fleet-request` 以作为资源，在您尝试标记实例集时，将会发生未经授权异常。以下示例说明如何*不* 设置策略。  

```
{
    "Effect": "Allow",
    "Action": [
        "ec2:CreateTags",
        "ec2:RequestSpotFleet"
    ],
    "Resource": "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:spot-fleet-request/*"
}
```

要提供访问权限，请为您的用户、组或角色添加权限：
+ AWS IAM Identity Center 中的用户和群组：

  创建权限集合。按照《AWS IAM Identity Center 用户指南》**中[创建权限集](https://docs.aws.amazon.com/singlesignon/latest/userguide/howtocreatepermissionset.html)的说明进行操作。
+ 通过身份提供者在 IAM 中托管的用户：

  创建适用于身份联合验证的角色。按照《IAM 用户指南》**中[针对第三方身份提供者创建角色（联合身份验证）](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-idp.html)的说明进行操作。
+ IAM 用户：
  + 创建您的用户可以担任的角色。按照《IAM 用户指南》**中[为 IAM 用户创建角色](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user.html)的说明进行操作。
  + （不推荐使用）将策略直接附加到用户或将用户添加到用户组。按照《*IAM 用户指南*》中[向用户添加权限（控制台）](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_change-permissions.html#users_change_permissions-add-console)中的说明进行操作。

## 标记新的竞价型实例集及其启动的实例和卷
<a name="tag-new-spot-fleet-and-resources"></a>

**使用控制台标记新的竞价型实例集请求及其启动的实例和卷**

1. 按照[使用已定义的参数创建竞价型实例集请求](create-spot-fleet.md#create-spot-fleet-advanced)过程操作。

1. 添加标签的方式取决于您是手动配置实例集还是使用启动模板。
   + 如果手动配置了实例集，请执行以下操作：

     要添加标签，请展开**其他启动参数**，选择**创建标签**，然后输入标签的键和值。对每个标签重复此操作。

     对于每个标签，您可以使用相同标签标记竞价型实例集请求和实例。要对两者进行标记，请确保同时选择**实例**和**实例集**。要仅标记竞价型实例集请求，请清除 **Instance**（实例）。要仅标记由实例集启动的实例，请清除**实例集**。
**注意**  
手动配置实例集时，无法选择标记卷。仅附加到按需型实例的卷支持卷标签。手动配置实例集时，您无法指定按需型实例。
   + 如果使用启动模板，请执行以下操作：

     要向实例集请求添加标签，请在**标签**下，选择**创建标签**，然后输入该标签的键和值。对每个标签重复此操作。

     要标记实例集中的资源，您必须在[启动模板](create-launch-template.md)中指定标签。

**标记新的竞价型实例集请求及其使用 AWS CLI 启动的实例和卷**  
要在创建竞价型实例集请求时标记该请求，并在实例集启动实例和卷时标记它们，请按以下方式配置竞价型实例集请求配置：

**竞价型实例集请求标签：**
+ 在 `SpotFleetRequestConfig` 中指定竞价型实例集请求的标签。
+ 对于 `ResourceType`，请指定 `spot-fleet-request`。如果指定其他值，实例集请求将失败。
+ 对于 `Tags`，请指定键值对。您可以指定多个键值对。

**实例标签：**
+ 为 `LaunchSpecifications` 中的实例指定标签。
+ 对于 `ResourceType`，请指定 `instance`。如果指定其他值，实例集请求将失败。
+ 对于 `Tags`，请指定键值对。您可以指定多个键值对。

  或者，您可以在竞价型实例集请求中引用的[启动模板](create-launch-template.md)中为实例指定标签。

**卷标签：**
+ 在竞价型实例集请求中引用的[启动模板](create-launch-template.md)中为卷指定标签。不支持 `LaunchSpecifications` 中的卷标记。

在以下示例中，使用两个标签来标记竞价型实例集请求：键=环境，值=生产；键=成本中心，值=123。由实例集启动的实例使用一个标签（与竞价型实例集请求的其中一个标签相同）进行标记：键=成本中心，值=123。

```
{
    "SpotFleetRequestConfig": {
        "AllocationStrategy": "priceCapacityOptimized",
        "ExcessCapacityTerminationPolicy": "default",
        "IamFleetRole": "arn:aws:iam::111122223333:role/aws-ec2-spot-fleet-tagging-role",
        "LaunchSpecifications": [
            {
                "ImageId": "ami-0123456789EXAMPLE",
                "InstanceType": "c4.large",
                "TagSpecifications": [
                    {
                        "ResourceType": "instance",
                        "Tags": [
                            {
                                "Key": "{{Cost-Center}}",
                                "Value": "{{123}}"
                            }
                        ]
                    }
                ]
            }
        ],
        "SpotPrice": "5",
        "TargetCapacity": 2,
        "TerminateInstancesWithExpiration": true,
        "Type": "maintain",
        "ReplaceUnhealthyInstances": true,
        "InstanceInterruptionBehavior": "terminate",
        "InstancePoolsToUseCount": 1,
        "TagSpecifications": [
            {
                "ResourceType": "spot-fleet-request",
                "Tags": [
                    {
                        "Key": "{{Environment}}",
                        "Value":"{{Production}}"
                    },
                    {
                        "Key": "{{Cost-Center}}",
                        "Value":"{{123}}"
                    }
                ]
            }
        ]
    }
}
```

**使用 AWS CLI 标记由竞价型实例集启动的实例**  
要在实例集启动实例时标记实例，您可以在竞价型实例集请求中引用的[启动模板](create-launch-template.md)中指定标记，也可以在竞价型实例集请求配置中指定标记，如下所示：
+ 为 `LaunchSpecifications` 中的实例指定标签。
+ 对于 `ResourceType`，请指定 `instance`。如果指定其他值，实例集请求将失败。
+ 对于 `Tags`，请指定键值对。您可以指定多个键值对。

在以下示例中，由实例集启动的实例使用一个标签进行标记：键=成本中心，值=123。

```
{
    "SpotFleetRequestConfig": {
        "AllocationStrategy": "priceCapacityOptimized",
        "ExcessCapacityTerminationPolicy": "default",
        "IamFleetRole": "arn:aws:iam::111122223333:role/aws-ec2-spot-fleet-tagging-role",
        "LaunchSpecifications": [
            {
                "ImageId": "ami-0123456789EXAMPLE",
                "InstanceType": "c4.large",
                "TagSpecifications": [
                    {
                        "ResourceType": "instance",
                        "Tags": [
                            {
                                "Key": "{{Cost-Center}}",
                                "Value": "{{123}}"
                            }
                        ]
                    }
                ]
            }
        ],
        "SpotPrice": "5",
        "TargetCapacity": 2,
        "TerminateInstancesWithExpiration": true,
        "Type": "maintain",
        "ReplaceUnhealthyInstances": true,
        "InstanceInterruptionBehavior": "terminate",
        "InstancePoolsToUseCount": 1
    }
}
```

**使用 AWS CLI 标记挂载至由竞价型实例集启动的按需型实例的卷**  
要在实例集创建卷时标记这些卷，您必须在竞价型实例集请求中引用的[启动模板](create-launch-template.md)中指定标签。

**注意**  
仅附加到按需型实例的卷支持卷标签。您无法标记附加到竞价型实例的卷。  
不支持 `LaunchSpecifications` 中的卷标记。

## 标记现有的竞价型实例集
<a name="tag-existing-spot-fleet"></a>

**使用控制台标记现有竞价型实例集请求**

创建竞价型实例集请求后，您可以使用控制台向实例集请求添加标签。

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，请选择 **Spot Requests**。

1. 选择竞价型实例集请求。

1. 选择 **Tags (标签)** 选项卡，然后选择 **Create Tag (创建标签)**。

**使用 AWS CLI 标记现有竞价型实例集请求**  
可以使用 [create-tags](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-tags.html) 命令标记现有的资源。在以下示例中，使用以下标签标记现有竞价型实例集请求：键=目的，值=测试。

```
aws ec2 create-tags \
    --resources {{sfr-11112222-3333-4444-5555-66666EXAMPLE}} \
    --tags Key={{purpose}},Value={{test}}
```

## 查看竞价型实例集请求标签
<a name="view-spot-fleet-tags"></a>

**使用控制台查看竞价型实例集请求标签**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，请选择 **Spot Requests**。

1. 选择您的竞价型实例集请求并选择**标签**选项卡。

**描述竞价型实例集请求标签**  
使用 [describe-tags](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-tags.html) 命令可查看指定资源的标签。在以下示例中，您将描述指定竞价型实例集请求的标签。

```
aws ec2 describe-tags \
    --filters "Name=resource-id,Values={{sfr-11112222-3333-4444-5555-66666EXAMPLE}}"
```

```
{
    "Tags": [
        {
            "Key": "Environment",
            "ResourceId": "sfr-11112222-3333-4444-5555-66666EXAMPLE",
            "ResourceType": "spot-fleet-request",
            "Value": "Production"
        },
        {
            "Key": "Another key",
            "ResourceId": "sfr-11112222-3333-4444-5555-66666EXAMPLE",
            "ResourceType": "spot-fleet-request",
            "Value": "Another value"
        }
    ]
}
```

您还可以通过描述竞价型实例集请求来查看竞价型实例集请求的标签。

使用 [describe-spot-fleet-requests](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-spot-fleet-requests.html) 命令可查看指定的竞价型实例集请求的配置，其中包括为实例集请求指定的任何标签。

```
aws ec2 describe-spot-fleet-requests \
    --spot-fleet-request-ids {{sfr-11112222-3333-4444-5555-66666EXAMPLE}}
```

```
{
    "SpotFleetRequestConfigs": [
        {
            "ActivityStatus": "fulfilled",
            "CreateTime": "2020-02-13T02:49:19.709Z",
            "SpotFleetRequestConfig": {
                "AllocationStrategy": "capacityOptimized",
                "OnDemandAllocationStrategy": "lowestPrice",
                "ExcessCapacityTerminationPolicy": "Default",
                "FulfilledCapacity": 2.0,
                "OnDemandFulfilledCapacity": 0.0,
                "IamFleetRole": "arn:aws:iam::111122223333:role/aws-ec2-spot-fleet-tagging-role",
                "LaunchSpecifications": [
                    {
                        "ImageId": "ami-0123456789EXAMPLE",
                        "InstanceType": "c4.large"
                    }
                ],
                "TargetCapacity": 2,
                "OnDemandTargetCapacity": 0,
                "Type": "maintain",
                "ReplaceUnhealthyInstances": false,
                "InstanceInterruptionBehavior": "terminate"
            },
            "SpotFleetRequestId": "sfr-11112222-3333-4444-5555-66666EXAMPLE",
            "SpotFleetRequestState": "active",
            "Tags": [
                {
                    "Key": "Environment",
                    "Value": "Production"
                },
                {
                    "Key": "Another key",
                    "Value": "Another value"
                }
            ]
        }
    ]
}
```