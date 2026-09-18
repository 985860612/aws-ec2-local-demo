

# 获取组织或组织单位的 ARN
<a name="get-org-ou-ARN"></a>

企业和企业部门 ARN 包含 12 位数的管理账号。如果您不知道管理账号，您可以描述企业或企业部门以获取每个账号的 ARN。在以下示例中，`123456789012` 是管理账户的账户 ID。

**所需的权限**  
在获得 ARN 之前，您必须拥有描述企业和企业部门的权限。以下示例策略提供了必要权限。

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
                "organizations:Describe*"
            ],
            "Resource": "*"
        }
    ]
}
```

------

------
#### [ AWS CLI ]

**获取企业的 ARN**  
使用 [describe-organization](https://docs.aws.amazon.com/cli/latest/reference/organizations/describe-organization.html) 命令。添加 `--query` 选项将仅返回组织 ARN。

```
aws organizations describe-organization --query 'Organization.Arn'
```

下面是示例输出。

```
"arn:aws:organizations::123456789012:organization/o-1234567abc"
```

**获取企业部门的 ARN**  
使用 [describe-organizational-unit](https://docs.aws.amazon.com/cli/latest/reference/organizations/describe-organizational-unit.html) 命令。使用 `--query` 参数将仅返回组织单元 ARN。

```
aws organizations describe-organizational-unit \
    --organizational-unit-id {{ou-a123-b4567890}} \
    --query 'OrganizationalUnit.Arn'
```

下面是示例输出。

```
"arn:aws:organizations::123456789012:ou/o-1234567abc/ou-a123-b4567890"
```

------
#### [ PowerShell ]

**获取企业的 ARN**  
使用 [Get-ORGOrganization](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-ORGOrganization.html) cmdlet。

```
(Get-ORGOrganization).Arn
```

下面是示例输出。

```
arn:aws:organizations::123456789012:organization/o-1234567abc
```

**获取企业部门的 ARN**  
使用 [Get-ORGOrganizationalUnit](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-ORGOrganizationalUnit.html) cmdlet。

```
(Get-ORGOrganizationalUnit -OrganizationalUnitId "ou-a123-b4567890").Arn
```

下面是示例输出。

```
arn:aws:organizations::123456789012:ou/o-1234567abc/ou-a123-b4567890
```

------