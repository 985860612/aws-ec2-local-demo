

# 授予将 IAM 角色附加到实例的权限
<a name="permission-to-pass-iam-roles"></a>

您的 AWS 账户中的身份（例如 IAM 用户）必须具有特定权限才能使用 IAM 角色启动 Amazon EC2 实例、将 IAM 角色附加到实例、替换实例的 IAM 角色或从实例分离 IAM 角色。您必须根据需要授予使用以下 API 操作的权限：
+ `iam:PassRole`
+ `ec2:AssociateIamInstanceProfile`
+ `ec2:DisassociateIamInstanceProfile`
+ `ec2:ReplaceIamInstanceProfileAssociation`

**注意**  
如果您将 `iam:PassRole` 的资源指定为 `*`，这将授予将任何 IAM 角色传递给实例的访问权限。要遵循[最低权限](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html#grant-least-privilege)的最佳实践，请使用 `iam:PassRole` 指定特定 IAM 角色的 ARN，如以下示例策略所示。

**编程访问策略示例**  
以下 IAM 策略授予使用 IAM 角色启动实例、将 IAM 角色附加到实例或者使用 AWS CLI 或 Amazon EC2 API 替换实例的 IAM 角色的权限。

------
#### [ JSON ]

****  

```
{
  "Version":"2012-10-17",		 	 	 
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
         "ec2:RunInstances",
         "ec2:AssociateIamInstanceProfile",
         "ec2:DisassociateIamInstanceProfile",
         "ec2:ReplaceIamInstanceProfileAssociation"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": "iam:PassRole",
      "Resource": "arn:aws:iam::{{123456789012}}:role/{{DevTeam}}*"
    }
  ]
}
```

------

**控制台访问权限的其他要求**  
要授予使用 Amazon EC2 控制台完成相同任务的权限，您还必须包含 `iam:ListInstanceProfiles` API 操作。