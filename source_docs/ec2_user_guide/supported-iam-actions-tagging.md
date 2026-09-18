

# 在创建过程中授予标记 Amazon EC2 资源的权限
<a name="supported-iam-actions-tagging"></a>

某些资源创建 Amazon EC2 API 操作允许您在创建资源时指定标签。您可以使用资源标签来实现基于属性的控制 (ABAC)。有关更多信息，请参阅[标记 资源](Using_Tags.md#tag-resources)和[使用基于属性的访问控制访问权限](iam-policies-for-amazon-ec2.md#control-access-with-tags)。

为使用户能够在创建时为资源添加标签，他们必须具有使用创建该资源的操作（如 `ec2:RunInstances` 或 `ec2:CreateVolume`）的权限。如果在资源创建操作中指定了标签，则 Amazon 会对 `ec2:CreateTags` 操作执行额外的授权，以验证用户是否具备创建标签的权限。因此，用户还必须具有使用 `ec2:CreateTags` 操作的显式权限。

在 `ec2:CreateTags` 操作的 IAM 策略定义中，使用带有 `Condition` 条件键的 `ec2:CreateAction` 元素，为创建资源的操作授予添加标签的权限。

例如，下面的策略允许用户启动实例并在启动期间向实例和卷应用任何标签。用户无权标记任何现有资源（他们无法直接调用 `ec2:CreateTags` 操作）。

```
{
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
         "ec2:RunInstances"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
         "ec2:CreateTags"
      ],
      "Resource": "arn:aws:ec2:us-east-1:111122223333:*/*",
      "Condition": {
         "StringEquals": {
             "ec2:CreateAction" : "RunInstances"
          }
       }
    }
  ]
}
```

同样，下面的策略允许用户创建卷并在创建卷期间向卷应用任何标签。用户无权标记任何现有资源（他们无法直接调用 `ec2:CreateTags` 操作）。

```
{
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
         "ec2:CreateVolume"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
         "ec2:CreateTags"
      ],
      "Resource": "arn:aws:ec2:us-east-1:111122223333:*/*",
      "Condition": {
         "StringEquals": {
             "ec2:CreateAction" : "CreateVolume"
          }
       }
    }
  ]
}
```

仅当用户在资源创建操作中应用了标签时，系统才会评估 `ec2:CreateTags` 操作。因此，如果未在此请求中指定任何标签，则拥有创建资源权限（假定没有标记条件）的用户无需具备使用 `ec2:CreateTags` 操作的权限。但是，如果用户不具备使用 `ec2:CreateTags` 操作的权限而又试图创建带标签的资源，则请求将失败。

如果在启动模板中提供了标签，也会对 `ec2:CreateTags` 操作进行评估。有关策略示例，请参阅[启动模板中的标签](ExamplePolicies_EC2.md#iam-example-tags-launch-template)。

## 控制对特定标签的访问
<a name="control-tagging"></a>

您可以在 IAM 策略的 `Condition` 元素中使用其他条件来控制可应用到资源的标签键和值。

以下条件键可用于上一节中的示例：
+ `aws:RequestTag`：指示请求中必须存在特定的标签键或标签键和值。也可在此请求中指定其他标签。
  + 与 `StringEquals` 条件运算符配合使用，以强制实施特定的标签键和值组合，例如强制实施标签 `cost-center`=`cc123`：

    ```
    "StringEquals": { "aws:RequestTag/cost-center": "cc123" }
    ```
  + 与 `StringLike` 条件运算符配合使用，以在请求中强制实施特定的标签键；如强制实施标签键 `purpose`：

    ```
    "StringLike": { "aws:RequestTag/purpose": "*" }
    ```
+ `aws:TagKeys`：强制实施在请求中使用的标签键。
  + 与 `ForAllValues` 修饰符配合使用，以只强制实施请求中提供的特定标签键（如果在请求中指定了标签，则只允许特定的标签键；不允许任何其他标签）。例如，允许标签键 `environment` 或 `cost-center`：

    ```
    "ForAllValues:StringEquals": { "aws:TagKeys": ["environment","cost-center"] }
    ```
  + 与 `ForAnyValue` 修饰符配合使用，以强制请求中至少存在一个指定的标签键。例如，强制请求中至少存在标签键 `environment` 或 `webserver` 中的一个：

    ```
    "ForAnyValue:StringEquals": { "aws:TagKeys": ["environment","webserver"] }
    ```

上述条件键可应用于支持标记的资源创建操作，以及 `ec2:CreateTags` 和 `ec2:DeleteTags` 操作。要了解 Amazon EC2 API 操作是否支持添加标签，请参阅 [Amazon EC2 的操作、资源和条件建](https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazonec2.html)。

为强制用户指定标签，在创建资源时，您必须使用 `aws:RequestTag` 条件键或 `aws:TagKeys` 条件键，并在资源创建操作中使用修饰符 `ForAnyValue`。如果用户没有为资源创建操作指定标签，则不会对 `ec2:CreateTags` 操作进行评估。

对于条件，条件键不区分大小写，条件值区分大小写。因此，要强制标签键区分大小写，请使用 `aws:TagKeys` 条件键，其中标签键指定为条件中的值。

有关示例 IAM policies，请参阅 [用于控制访问 Amazon EC2 API 的示例策略](ExamplePolicies_EC2.md)。有关更多信息，请参阅《IAM 用户指南》**中的[具有多个上下文键或值的条件](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_condition-logic-multiple-context-keys-or-values.html)。