

# Amazon EC2 启动模板所需的 IAM 权限
<a name="permissions-for-launch-templates"></a>

您可以使用 IAM 权限来控制用户是否可以列出、查看、创建或删除启动模板或启动模板版本。

**重要**  
您不能使用资源级权限来限制用户在创建启动模板或启动模板版本时可以在启动模板中指定的资源。因此，请确保仅授予受信任的管理员创建启动模板和启动模板版本的权限。

您必须向将使用启动模板的任何人授予创建和访问启动模板中所指定资源所需的权限。例如：
+ 要从共享的私有亚马逊机器映像（AMI）启动实例，启动模板用户必须拥有该 AMI 的启动权限。
+ 要使用现有快照中的标签创建 EBS 卷，启动模板用户必须具有这些快照的读取权限，以及创建卷和为卷添加标签的权限。

**Topics**
+ [ec2:CreateLaunchTemplate](#permissions-for-launch-templates-create)
+ [ec2:DescribeLaunchTemplates](#permissions-for-launch-templates-view)
+ [ec2:DescribeLaunchTemplateVersions](#permissions-for-launch-template-versions-view)
+ [ec2:DeleteLaunchTemplate](#permissions-for-launch-templates-delete)
+ [控制版本控制权限](#permissions-for-launch-template-versions)
+ [控制对启动模板上标签的访问权限](#permissions-for-launch-templates-tags)

## ec2:CreateLaunchTemplate
<a name="permissions-for-launch-templates-create"></a>

要在控制台中或使用 API 创建启动模板，主体必须具有 IAM policy 中的 `ec2:CreateLaunchTemplate` 权限。尽可能使用标签来帮助您控制对账户中启动模板的访问权限。

例如，以下 IAM policy 声明仅在模板使用指定标签（{{`purpose`}}={{`testing`}}）时才向主体授予创建启动模板的权限。

```
{
    "Sid": "IAMPolicyForCreatingTaggedLaunchTemplates",
    "Action": "ec2:CreateLaunchTemplate",
    "Effect": "Allow",
    "Resource": "*",
    "Condition": {
        "StringEquals": {
            "aws:ResourceTag/{{purpose}}": "{{testing}}"
        }
    }
}
```

创建启动模板的主体可能需要一些相关权限，例如：
+ **ec2:CreateTags** – 要在 `CreateLaunchTemplate` 操作期间将标签添加到启动模板，`CreateLaunchTemplate` 调用者必须具有 IAM policy 中的 `ec2:CreateTags` 权限。
+ **ec2:RunInstances** – 要从其创建的启动模板启动 EC2 实例，主体还必须具有 IAM policy 中的 `ec2:RunInstances` 权限。

对于应用标签的资源创建操作，用户必须具有 `ec2:CreateTags` 权限。以下 IAM policy 语句使用 `ec2:CreateAction` 条件键，只允许用户在 `CreateLaunchTemplate` 上下文中创建标签。用户无法标记现有启动模板或任何其他资源。有关更多信息，请参阅 [在创建过程中授予标记 Amazon EC2 资源的权限](supported-iam-actions-tagging.md)。

```
{
    "Sid": "IAMPolicyForTaggingLaunchTemplatesOnCreation",
    "Action": "ec2:CreateTags",
    "Effect": "Allow",
    "Resource": "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:launch-template/*",
    "Condition": {
        "StringEquals": {
            "ec2:CreateAction": "CreateLaunchTemplate"
        }
    }
}
```

创建启动模板的 IAM 用户不会自动获得使用其创建的启动模板的权限。与任何其他主体一样，启动模板创建者需要通过 IAM policy 获得权限。如果 IAM 用户想要从启动模板启动 EC2 实例，则他们必须拥有 `ec2:RunInstances` 权限。在授予这些权限时，您可以指定用户只能使用带有特定标签或特定 ID 的启动模板。您还可以通过指定 `RunInstances` 调用的资源级权限，控制 AMI 和使用启动模板的任何人都可以在启动实例时引用和使用的其他资源。有关示例策略，请参阅 [启动模板](ExamplePolicies_EC2.md#iam-example-runinstances-launch-templates)。

## ec2:DescribeLaunchTemplates
<a name="permissions-for-launch-templates-view"></a>

要列出和查看账户中的启动模板，主体必须在 IAM 策略中具有 `ec2:DescribeLaunchTemplates` 权限。由于 `Describe` 操作不支持资源级权限，因此必须无条件地指定这些权限，并且策略中资源元素的值必须为 `"*"`。

例如，以下 IAM 策略语句授予主体列出和查看账户中所有启动模板的权限。

```
{
    "Sid": "IAMPolicyForDescribingLaunchTemplates",
    "Action": "ec2:DescribeLaunchTemplates",
    "Effect": "Allow",
    "Resource": "*"
}
```

## ec2:DescribeLaunchTemplateVersions
<a name="permissions-for-launch-template-versions-view"></a>

列出和查看启动模板的主体还应具有 `ec2:DescribeLaunchTemplateVersions` 权限以检索构成启动模板的整组属性。

要列出和查看账户中的启动模板版本，主体必须在 IAM 策略中具有 `ec2:DescribeLaunchTemplateVersions` 权限。由于 `Describe` 操作不支持资源级权限，因此必须无条件地指定这些权限，并且策略中资源元素的值必须为 `"*"`。

例如，以下 IAM 策略语句授予主体列出和查看账户中所有启动模板版本的权限。

```
{
    "Sid": "IAMPolicyForDescribingLaunchTemplateVersions",
    "Effect": "Allow",
    "Action": "ec2:DescribeLaunchTemplateVersions",
    "Resource": "*"
}
```

## ec2:DeleteLaunchTemplate
<a name="permissions-for-launch-templates-delete"></a>

**重要**  
在授予主体删除资源的权限时请谨慎操作。删除启动模板可能会导致依赖该启动模板的 AWS 资源出现故障。

要删除启动模板，主体必须在 IAM policy 中具有 `ec2:DeleteLaunchTemplate` 权限。在可能的情况下，使用基于标签的条件键来限制权限。

例如，以下 IAM 策略语句仅在模板具有指定标签（{{`purpose`}}={{`testing`}}）时才向主体授予删除启动模板的权限。

```
{
    "Sid": "IAMPolicyForDeletingLaunchTemplates",
    "Action": "ec2:DeleteLaunchTemplate",
    "Effect": "Allow",
    "Resource": "*",
    "Condition": {
        "StringEquals": {
            "aws:ResourceTag/{{purpose}}": "{{testing}}"
        }
    }
}
```

或者，您可以使用 ARN 来识别 IAM policy 适用的启动模板。

启动模板具有以下 ARN。

```
"Resource": "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:launch-template/{{lt-09477bcd97b0d310e}}"
```

您可以通过将多个 ARN 括在列表中来指定它们，也可以指定 `Resource` 值 `"*"`（不带 `Condition` 元素），以允许主体删除账户中的任何启动模板。

## 控制版本控制权限
<a name="permissions-for-launch-template-versions"></a>

对于受信任的管理员，您可以使用类似于以下示例的 IAM policy，授予创建和删除启动模板版本以及更改启动模板默认版本的访问权限。

**重要**  
授予主体创建启动模板版本或修改启动模板的权限时，请谨慎行事。  
创建启动模板版本时，会影响允许 Amazon EC2 代表您使用 `Latest` 版本启动实例的任何 AWS 资源。
修改启动模板版本时，可以更改哪个版本为 `Default`，并会因此影响允许 Amazon EC2 代表您使用此修改后的版本启动实例的任何 AWS 资源。
您还需要谨慎处理与 `Latest` 或 `Default` 启动模板版本交互的 AWS 资源，例如 EC2 实例集和竞价型实例集。将不同的启动模板版本用于 `Latest` 或 `Default` 时，Amazon EC2 不会在启动新实例以满足实例集的目标容量时重新检查要完成的操作的权限，因为没有用户与 AWS 资源交互。向用户授予调用 `CreateLaunchTemplateVersion` 和 `ModifyLaunchTemplate` API 的权限，即是同时授予用户将实例集指向包含实例配置文件（IAM 角色的容器）的不同启动模板版本的 `iam:PassRole` 权限。这意味着即使用户没有 `iam:PassRole` 权限，也可以更新启动模板以将 IAM 角色传递给实例。您可以通过谨慎授予创建和管理启动模板版本的权限来管理这种风险。

### ec2:CreateLaunchTemplateVersion
<a name="permissions-for-launch-template-versions-create"></a>

要创建启动模板的新版本，主体必须具有 IAM policy 中启动模板的 `ec2:CreateLaunchTemplateVersion` 权限。

例如，以下 IAM policy 声明仅在版本使用指定标签（{{`environment`}}={{`production`}}）时才向主体授予创建启动模板版本的权限。或者，您可以指定一个或多个启动模板 ARN，也可以指定 `Resource` 的值为 `"*"`（不带 `Condition` 元素），以允许主体创建账户中任何启动模板的版本。

```
{
    "Sid": "IAMPolicyForCreatingLaunchTemplateVersions",
    "Action": "ec2:CreateLaunchTemplateVersion",
    "Effect": "Allow",
    "Resource": "*",
    "Condition": {
        "StringEquals": {
            "aws:ResourceTag/{{environment}}": "{{production}}"
        }
    }
}
```

### ec2:DeleteLaunchTemplateVersion
<a name="permissions-for-launch-template-versions-delete"></a>

**重要**  
与往常一样，在授予委托人删除资源的权限时，您应该谨慎操作。删除启动模板版本可能会导致依赖该启动模板版本的 AWS 资源出现故障。

要删除启动模板版本，主体必须具有 IAM policy 中启动模板的 `ec2:DeleteLaunchTemplateVersion` 权限。

例如，以下 IAM policy 声明仅在版本使用指定标签（{{`environment`}}={{`production`}}）时才向主体授予删除启动模板版本的权限。或者，您可以指定一个或多个启动模板 ARN，也可以指定 `Resource` 的值为 `"*"`（不带 `Condition` 元素），以允许主体删除账户中任何启动模板的版本。

```
{
    "Sid": "IAMPolicyForDeletingLaunchTemplateVersions",
    "Action": "ec2:DeleteLaunchTemplateVersion",
    "Effect": "Allow",
    "Resource": "*",
    "Condition": {
        "StringEquals": {
            "aws:ResourceTag/{{environment}}": "{{production}}"
        }
    }
}
```

### ec2:ModifyLaunchTemplate
<a name="permissions-for-launch-templates-update"></a>

要更改与启动模板关联的 `Default` 版本，主体必须具有 IAM policy 中启动模板的 `ec2:ModifyLaunchTemplate` 权限。

例如，以下 IAM policy 声明仅在启动模板使用指定标签（{{`environment`}}={{`production`}}）时才向主体授予修改启动模板的权限。或者，您可以指定一个或多个启动模板 ARN，也可以指定 `Resource` 的值为 `"*"`（不带 `Condition` 元素），以允许主体修改账户中的任何启动模板。

```
{
    "Sid": "IAMPolicyForModifyingLaunchTemplates",
    "Action": "ec2:ModifyLaunchTemplate",
    "Effect": "Allow",
    "Resource": "*",
    "Condition": {
        "StringEquals": {
            "aws:ResourceTag/{{environment}}": "{{production}}"
        }
    }
}
```

## 控制对启动模板上标签的访问权限
<a name="permissions-for-launch-templates-tags"></a>

当资源为启动模板时，您可以使用条件键限制标记权限。例如，以下 IAM policy 允许仅从指定账户和区域的启动模板中移除带有 `{{temporary}}` 键的标签。

```
{
    "Sid": "IAMPolicyForDeletingTagsOnLaunchTemplates",
    "Action": "ec2:DeleteTags",
    "Effect": "Allow",
    "Resource": "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:launch-template/*",
    "Condition": {
        "ForAllValues:StringEquals": {
            "aws:TagKeys": ["{{temporary}}"]
        }
    }
}
```

有关可用于控制可应用于 Amazon EC2 资源的标签键和值的条件键的更多信息，请参阅 [控制对特定标签的访问](supported-iam-actions-tagging.md#control-tagging)。