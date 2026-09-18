

# 为 EC2 Instance Connect 授予 IAM 权限
<a name="ec2-instance-connect-configure-IAM-role"></a>

要使用 EC2 Instance Connect 连接到实例，您必须创建 IAM policy，从而向您的用户授予以下操作和条件的权限：
+ `ec2-instance-connect:SendSSHPublicKey` 操作 - 授予将公有密钥推送到实例的权限。
+ `ec2:osuser` 条件 - 指定可以将公有密钥推送到实例的操作系统用户的名称。使用用于启动实例的 AMI 的默认用户名。对于 AL2023 和 Amazon Linux 2，默认用户名为 `ec2-user`；对于 Ubuntu 则为 `ubuntu`。
+ `ec2:DescribeInstances` 操作 - 使用 EC2 控制台时是必需的，因为包装程序会调用此操作。用户可能已经拥有从另一个策略调用此操作的权限。
+ `ec2:DescribeVpcs` 操作 – 连接到 IPv6 地址时为必填项。

考虑限制对特定 EC2 实例的访问。否则，具有适用于 `ec2-instance-connect:SendSSHPublicKey` 操作的权限的所有 IAM 主体可以连接到所有 EC2 实例。您可以通过指定资源 ARN 或使用资源标签作为[条件键](https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazonec2instanceconnect.html#amazonec2instanceconnect-policy-keys)来限制访问。

有关更多信息，请参阅 [Amazon EC2 Instance Connect 的操作、资源和条件键](https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazonec2instanceconnect.html)。

有关如何创建 IAM policy 的信息，请参阅 *IAM 用户指南*中的[创建 IAM policy](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_create.html)。

## 允许用户连接到特定实例
<a name="eic-permissions-allow-users-to-connect-to-specific-instances"></a>

以下 IAM policy 授予连接到特定实例的权限，这些实例由其资源 ARN 标识。

在以下示例 IAM policy 中，指定了以下操作和条件：
+ `ec2-instance-connect:SendSSHPublicKey` 操作向用户授予连接到两个实例的权限，这两个实例由资源 ARN 指定。要向用户授予连接到*所有* EC2 实例的权限，请将资源 ARN 替换为 `*` 通配符。
+ 只有在连接时指定 {{ami-username}} 时，`ec2:osuser` 条件才会授予连接到实例的权限。
+ 指定 `ec2:DescribeInstances` 操作向使用控制台连接到您的实例的用户授予权限。如果您的用户仅使用 SSH 客户端连接到您的实例，可以省略 `ec2:DescribeInstances`。注意，`ec2:Describe*` API 操作不支持资源级权限。因此，`Resource` 元素中需要 `*` 通配符。
+ 指定 `ec2:DescribeVpcs` 操作向使用 IPv6 地址从控制台连接到实例的用户授予权限。如果用户仅使用公有 IPv4 地址，则可以忽略 `ec2:DescribeVpcs`。注意，`ec2:Describe*` API 操作不支持资源级权限。因此，`Resource` 元素中需要 `*` 通配符。

------
#### [ JSON ]

****  

```
{
    "Version":"2012-10-17",		 	 	 
    "Statement": [{
            "Effect": "Allow",
            "Action": "ec2-instance-connect:SendSSHPublicKey",
            "Resource": [
                "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:instance/{{i-1234567890abcdef0}}",
                "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:instance/{{i-0598c7d356eba48d7}}"
            ],
            "Condition": {
                "StringEquals": {
                    "ec2:osuser": "{{ami-username}}"
                }
            }
        },
        {
            "Effect": "Allow",
            "Action": [
                "ec2:DescribeInstances",
                "ec2:DescribeVpcs"
            ],
            "Resource": "*"
        }
    ]
}
```

------

## 允许用户连接到具有特定标签的实例
<a name="eic-permissions-allow-users-to-connect-to-instances-with-specific-tags"></a>

基于属性的访问权限控制（ABAC）是一种授权策略，该策略根据可附加到用户和 AWS 资源的标签来定义权限。您可以使用资源标签来控制对实例的访问。有关使用标签控制对AWS资源的访问的更多信息，请参阅 *IAM 用户指南*中的[控制对AWS资源的访问](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_tags.html#access_tags_control-resources)。

在以下示例 IAM policy 中，`ec2-instance-connect:SendSSHPublicKey` 操作向用户授予连接到任何实例的权限（由资源 ARN 中的 `*` 通配符指示），条件是该实例的资源标签带有 key=`tag-key` 和 value=`tag-value`。

指定 `ec2:DescribeInstances` 操作向使用控制台连接到您的实例的用户授予权限。如果用户仅使用 SSH 客户端连接到实例，可以省略 `ec2:DescribeInstances`。注意，`ec2:Describe*` API 操作不支持资源级权限。因此，`Resource` 元素中需要 `*` 通配符。

指定 `ec2:DescribeVpcs` 操作向使用 IPv6 地址从控制台连接到实例的用户授予权限。如果用户仅使用公有 IPv4 地址，则可以忽略 `ec2:DescribeVpcs`。注意，`ec2:Describe*` API 操作不支持资源级权限。因此，`Resource` 元素中需要 `*` 通配符。

------
#### [ JSON ]

****  

```
{
    "Version":"2012-10-17",		 	 	 
    "Statement": [{
            "Effect": "Allow",
            "Action": "ec2-instance-connect:SendSSHPublicKey", 
            "Resource": "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:instance/*",
            "Condition": {
                "StringEquals": {
                    "aws:ResourceTag/{{tag-key}}": "{{tag-value}}"
                }
            }
        },
        {
            "Effect": "Allow",
            "Action": [
                "ec2:DescribeInstances",
                "ec2:DescribeVpcs"
            ],
            "Resource": "*"
        }
    ]
}
```

------