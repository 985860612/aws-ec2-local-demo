

# 允许企业和 OU 使用 KMS 密钥
<a name="allow-org-ou-to-use-key"></a>

如果共享由加密快照支持的 AMI，则还须允许组织或组织单位（OU）使用用于加密快照的 KMS 密钥。

**注意**  
加密快照必须使用*客户管理型*密钥加密。您无法共享由使用默认 AWS 托管式密钥加密的快照支持的 AMI。

要控制对 KMS 密钥的访问，可以在[密钥策略](https://docs.aws.amazon.com/kms/latest/developerguide/key-policies.html)中使用 [`aws:PrincipalOrgID`](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_condition-keys.html#condition-keys-principalorgid) 和 [`aws:PrincipalOrgPaths`](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_condition-keys.html#condition-keys-principalorgpaths) 条件键来仅允许特定主体执行指定操作。主体可以是用户、IAM 角色、联合用户或 AWS 账户根用户。

条件键的使用方式如下：
+ `aws:PrincipalOrgID`：允许属于由指定 ID 表示的组织的任何主体。
+ `aws:PrincipalOrgPaths`：允许属于由指定路径表示的组织单位的任何主体。

要向组织（包括属于该组织的组织单位和账户）授予使用 KMS 密钥的权限，请向密钥策略添加以下语句。

```
{
    "Sid": "Allow access for organization root",
    "Effect": "Allow",
    "Principal": "*",
    "Action": [
        "kms:Describe*",
        "kms:List*",
        "kms:Get*",
        "kms:Encrypt",
        "kms:Decrypt",
        "kms:ReEncrypt*",
        "kms:GenerateDataKey*",
        "kms:CreateGrant"
    ],
    "Resource": "*",
    "Condition": {
        "StringEquals": {
            "aws:PrincipalOrgID": "{{o-123example}}"
        }
    }
}
```

要向特定组织单位（和属于该组织单位的账户）授予使用 KMS 密钥的权限，您可以使用类似于下列示例的策略。

```
{
        "Sid": "Allow access for specific OUs and their descendants",
        "Effect": "Allow",
        "Principal": "*",
        "Action": [
            "kms:Describe*",
            "kms:List*",
            "kms:Get*",
            "kms:Encrypt",
            "kms:Decrypt",
            "kms:ReEncrypt*",
            "kms:GenerateDataKey*",
            "kms:CreateGrant"
        ],
        "Resource": "*",
        "Condition": {
            "StringEquals": {
                "aws:PrincipalOrgID": "{{o-123example}}"
            },
            "ForAnyValue:StringLike": {
                "aws:PrincipalOrgPaths": [
                    "{{o-123example/r-ab12/ou-ab12-33333333/*}}",
                    "{{o-123example/r-ab12/ou-ab12-22222222/*}}"
                ]
            }
        }
}
```

有关更多示例条件语句，请参阅《IAM 用户指南》[https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_condition-keys.html#condition-keys-principalorgid](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_condition-keys.html#condition-keys-principalorgid)中的 [aws:PrincipalOrgID](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_condition-keys.html#condition-keys-principalorgpaths) 和 *aws:PrincipalOrgPaths*。

有关跨账户访问的更多信息，请参阅《AWS Key Management Service Developer Guide》**中的 [Allowing users in other accounts to use a KMS key](https://docs.aws.amazon.com/kms/latest/developerguide/key-policy-modifying-external-accounts.html)。