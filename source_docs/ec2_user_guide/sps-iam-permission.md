

# Spot 置放分数所需的权限
<a name="sps-iam-permission"></a>

默认情况下，IAM 身份（用户、角色或组）不具备使用 [竞价放置分数](spot-placement-score.md)的权限。要允许 IAM 身份使用 Spot 置放分数，则您必须创建一个 IAM 策略，以授予其使用 `ec2:GetSpotPlacementScores` EC2 API 操作的权限。然后，将策略附加到需要此权限的 IAM 身份。

以下为授予使用 `ec2:GetSpotPlacementScores` EC2 API 操作权限的 IAM policy 的示例。

------
#### [ JSON ]

****  

```
{
    "Version":"2012-10-17",		 	 	 
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "ec2:GetSpotPlacementScores",
            "Resource": "*"
        }
    ]
}
```

------

有关编辑 IAM policy 的信息，请参阅 *IAM 用户指南*中的[编辑 IAM policy](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_manage-edit.html)。

要提供访问权限，请为您的用户、组或角色添加权限：
+ AWS IAM Identity Center 中的用户和群组：

  创建权限集合。按照《AWS IAM Identity Center 用户指南》**中[创建权限集](https://docs.aws.amazon.com/singlesignon/latest/userguide/howtocreatepermissionset.html)的说明进行操作。
+ 通过身份提供者在 IAM 中托管的用户：

  创建适用于身份联合验证的角色。按照《IAM 用户指南》**中[针对第三方身份提供者创建角色（联合身份验证）](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-idp.html)的说明进行操作。
+ IAM 用户：
  + 创建您的用户可以担任的角色。按照《IAM 用户指南》**中[为 IAM 用户创建角色](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user.html)的说明进行操作。
  + （不推荐使用）将策略直接附加到用户或将用户添加到用户组。按照《IAM 用户指南》**中[向用户添加权限（控制台）](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_change-permissions.html#users_change_permissions-add-console)中的说明进行操作。