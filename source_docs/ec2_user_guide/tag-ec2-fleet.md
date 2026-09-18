

# 标记新的或现有的 EC2 实例集请求及其启动的实例和卷
<a name="tag-ec2-fleet"></a>

要对 EC2 实例集请求及其启动的实例和卷进行分类与管理，可以使用自定义元数据标记它们。您可以在创建 EC2 实例集请求之时或之后为其分配标签。同理，可以在实例集启动实例和卷之时或之后为实例和卷分配标签。

在标记实例集请求时，不会自动标记实例集启动的实例和卷。您需要明确标记实例集启动的实例和卷。您可以选择仅将标签分配给实例集请求，仅分配给实例集启动的实例，仅分配给附加到实例集启动的实例的卷，或仅分配给实例集创建的网络接口，或分配给以上全部资源。

**注意**  
对于 `instant` 实例集类型，您可以标记附加到按需型实例和竞价型实例的卷。您还可以为 `instant` 实例集类型标记网络接口。对于 `request` 或 `maintain` 实例集类型，您只能标记附加到按需型实例的卷。

有关标签的工作原理的更多信息，请参阅[标记 Amazon EC2 资源](Using_Tags.md)。

**先决条件**

授予用户标记资源的权限。有关更多信息，请参阅 [示例：标记资源](ExamplePolicies_EC2.md#iam-example-taggingresources)。

**授予用户标记资源的权限**  
创建包含以下内容的 IAM policy：
+ `ec2:CreateTags` 操作。这将授予用户创建标签的权限。
+ `ec2:CreateFleet` 操作。这将授予用户创建 EC2 实例集请求的权限。
+ 对于 `Resource`，我们建议您指定 `"*"`。这允许用户标记所有资源类型。

要提供访问权限，请为您的用户、组或角色添加权限：
+ AWS IAM Identity Center 中的用户和群组：

  创建权限集合。按照《AWS IAM Identity Center 用户指南》**中[创建权限集](https://docs.aws.amazon.com/singlesignon/latest/userguide/howtocreatepermissionset.html)的说明进行操作。
+ 通过身份提供者在 IAM 中托管的用户：

  创建适用于身份联合验证的角色。按照《IAM 用户指南》**中[针对第三方身份提供者创建角色（联合身份验证）](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-idp.html)的说明进行操作。
+ IAM 用户：
  + 创建您的用户可以担任的角色。按照《IAM 用户指南》**中[为 IAM 用户创建角色](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user.html)的说明进行操作。
  + （不推荐使用）将策略直接附加到用户或将用户添加到用户组。按照《IAM 用户指南》**中[向用户添加权限（控制台）](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_change-permissions.html#users_change_permissions-add-console)中的说明进行操作。

**标记新的 EC2 实例集请求**  
要在创建时标记 EC2 实例集请求，请在用于创建该实例集的 [JSON 文件](create-ec2-fleet.md#ec2-fleet-cli-skeleton)中指定键值对。`ResourceType` 的值必须为 `fleet`。如果指定其他值，实例集请求失败。

**标记 EC2 实例集启动的实例和卷**  
要在实例集启动实例和卷时标记它们，请在 EC2 实例集请求中引用的[启动模板](create-launch-template.md)中指定标签。

**注意**  
您无法标记附加到 `request` 或 `maintain` 实例集类型启动的竞价型实例的卷。

**标记现有的 EC2 实例集请求、实例和卷**  
使用 [create-tags](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-tags.html) 命令标记现有的资源。

```
aws ec2 create-tags \
    --resources {{fleet-12a34b55-67cd-8ef9-ba9b-9208dEXAMPLE}} {{i-1234567890abcdef0}} {{vol-1234567890EXAMPLE}} \
    --tags Key={{purpose}},Value={{test}}
```