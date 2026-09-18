

# 授予使用 EC2 Instance Connect 端点的权限
<a name="permissions-for-ec2-instance-connect-endpoint"></a>

默认情况下，IAM 实体没有创建、描述或修改 EC2 Instance Connect 端点的权限。IAM 管理员必须创建授予所需权限的 IAM 策略，才能对所需资源执行特定的操作。

有关如何创建 IAM 策略 的信息，请参阅 *IAM 用户指南*中的[创建 IAM 策略](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_create.html)。

以下示例策略演示了如何控制用户对 EC2 Instance Connect 端点的权限。

**Topics**
+ [创建、描述、修改和删除 EC2 Instance Connect 端点的权限](#iam-CreateInstanceConnectEndpoint)
+ [使用 EC2 Instance Connect 端点连接到实例的权限](#iam-OpenTunnel)
+ [仅从特定 IP 地址范围进行连接的权限](#iam-sourceip)

## 创建、描述、修改和删除 EC2 Instance Connect 端点的权限
<a name="iam-CreateInstanceConnectEndpoint"></a>

要创建和修改 EC2 Instance Connect Endpoint，用户需要具有执行以下操作的权限：
+ `ec2:CreateInstanceConnectEndpoint`
+ `ec2:CreateNetworkInterface`
+ `ec2:CreateTags`
+ `ec2:ModifyInstanceConnectEndpoint`
+ `iam:CreateServiceLinkedRole`

要描述和删除 EC2 Instance Connect Endpoint，用户需要具有执行以下操作的权限：
+ `ec2:DescribeInstanceConnectEndpoints` 
+ `ec2:DeleteInstanceConnectEndpoint`

您可以创建一个策略，授予在所有子网中创建、描述、修改和删除 EC2 Instance Connect Endpoint 的权限。或者，您只能通过将子网 ARN 指定为允许的 `Resource` 或使用 `ec2:SubnetID` 条件键来限制对指定子网的操作。您还可以使用 `aws:ResourceTag` 条件键明确允许或拒绝使用特定标签创建端点。有关更多信息，请参阅*《IAM 用户指南》*中的 [IAM 中的策略和权限](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html)。

**示例 IAM policy**

在以下示例 IAM 策略中，`Resource` 部分授予在所有子网中创建、修改和删除端点的权限，由星号 (`*`) 指定。`ec2:Describe*` API 操作不支持资源级权限。因此，`Resource` 元素中需要 `*` 通配符。

## 使用 EC2 Instance Connect 端点连接到实例的权限
<a name="iam-OpenTunnel"></a>

`ec2-instance-connect:OpenTunnel` 操作授予建立 TCP 连接到实例的权限，以通过 EC2 Instance Connect Endpoint 进行连接。您可以指定要使用的 EC2 Instance Connect Endpoint。或者，带有星号 (`*`) 的 `Resource` 允许用户使用任何可用的 EC2 Instance Connect Endpoint。您还可以根据是否存在作为条件键的资源标签来限制对实例的访问。

**条件**
+ `ec2-instance-connect:remotePort` - 实例上可用于建立 TCP 连接的端口。使用此条件键时，尝试连接到策略中指定的端口以外的任何其他端口上的实例都会导致失败。
+ `ec2-instance-connect:privateIpAddress` - 与要建立 TCP 连接的实例关联的目标私有 IP 地址。您可以指定单个 IP 地址（例如 `10.0.0.1/32`），也可以通过 CIDR 指定一系列 IP （例如 `10.0.1.0/28`）。使用此条件键时，尝试连接到具有不同私有 IP 地址或 CIDR 范围之外的实例会导致失败。
+ `ec2-instance-connect:maxTunnelDuration` - 已建立的 TCP 连接的最长持续时间。单位是秒，持续时间范围从最小 1 秒到最大 3600 秒（1 小时）。如果未指定条件，则将默认持续时间设置为 3600 秒（1 小时）。尝试连接到实例的时间超过 IAM policy 中指定的持续时间或超过默认最大值会导致失败。在指定的持续时间过后，连接将断开。

  如果在 IAM policy 中指定 `maxTunnelDuration` 且指定的值小于 3600 秒（默认值），则在连接到实例时必须在命令中指定 `--max-tunnel-duration`。有关如何连接到实例的信息，请参阅 [使用 EC2 Instance Connect 端点连接到 Amazon EC2 实例](connect-using-eice.md)。

还可以根据 EC2 Instance Connect 端点上是否存在资源标签来授予用户建立实例连接的权限。有关更多信息，请参阅*《IAM 用户指南》*中的 [IAM 中的策略和权限](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html)。

对于 Linux 实例，`ec2-instance-connect:SendSSHPublicKey` 操作授予将公有密钥推送到实例的权限。`ec2:osuser` 条件指定可以将公有密钥推送到实例的 OS（操作系统）用户的名称。使用用于启动实例的 [AMI 的默认用户名](connection-prereqs-general.md#connection-prereqs-get-info-about-instance)。有关更多信息，请参阅 [为 EC2 Instance Connect 授予 IAM 权限](ec2-instance-connect-configure-IAM-role.md)。

**示例 IAM 策略**

以下示例 IAM 策略允许 IAM 主体仅使用指定的 EC2 Instance Connect Endpoint（由指定的端点 ID `eice-123456789abcdef` 标识）连接到实例。只有满足所有条件，才能成功建立连接。

**注意**  
`ec2:Describe*` API 操作不支持资源级权限。因此，`Resource` 元素中需要 `*` 通配符。

------
#### [ Linux ]

此示例评估与实例的连接是否在端口 22（SSH）上建立，实例的私有 IP 地址是否在 `10.0.1.0/31` 范围内（`10.0.1.0` 与 `10.0.1.1` 之间），并且 `maxTunnelDuration` 小于或等于 `3600` 秒。`3600` 秒（1 小时）后连接断开。

------
#### [ JSON ]

****  

```
{
    "Version":"2012-10-17",		 	 	 
    "Statement": [{
            "Sid": "EC2InstanceConnect",
            "Action": "ec2-instance-connect:OpenTunnel",
            "Effect": "Allow",
            "Resource": "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:instance-connect-endpoint/{{eice-123456789abcdef}}",
            "Condition": {
                "NumericEquals": {
                    "ec2-instance-connect:remotePort": "{{22}}"
                },
                "IpAddress": {
                    "ec2-instance-connect:privateIpAddress": "{{10.0.1.0/31}}"
                },
                "NumericLessThanEquals": {
                    "ec2-instance-connect:maxTunnelDuration": "{{3600}}"
                }
            }
        },
        {
            "Sid": "SSHPublicKey",
            "Effect": "Allow",
            "Action": "ec2-instance-connect:SendSSHPublicKey",
            "Resource": "*",
            "Condition": {
                "StringEquals": {
                    "ec2:osuser": "{{ami-username}}"
                }
            }
        },
        {
            "Sid": "Describe",
            "Action": [
                "ec2:DescribeInstances",
                "ec2:DescribeInstanceConnectEndpoints"
            ],
            "Effect": "Allow",
            "Resource": "*"
        }
    ]
}
```

------

------
#### [ Windows ]

此示例评估与实例的连接是否在端口 3389（RDP）上建立，实例的私有 IP 地址是否在 `10.0.1.0/31` 范围内（`10.0.1.0` 与 `10.0.1.1` 之间），并且 `maxTunnelDuration` 小于或等于 `3600` 秒。`3600` 秒（1 小时）后连接断开。

------
#### [ JSON ]

****  

```
{
    "Version":"2012-10-17",		 	 	 
    "Statement": [{
            "Sid": "EC2InstanceConnect",
            "Action": "ec2-instance-connect:OpenTunnel",
            "Effect": "Allow",
            "Resource": "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:instance-connect-endpoint/{{eice-123456789abcdef}}",
            "Condition": {
                "NumericEquals": {
                    "ec2-instance-connect:remotePort": "{{3389}}"
                },
                "IpAddress": {
                    "ec2-instance-connect:privateIpAddress": "{{10.0.1.0/31}}"
                },
                "NumericLessThanEquals": {
                    "ec2-instance-connect:maxTunnelDuration": "{{3600}}"
                }
            }
        },
        {
            "Sid": "Describe",
            "Action": [
                "ec2:DescribeInstances",
                "ec2:DescribeInstanceConnectEndpoints"
            ],
            "Effect": "Allow",
            "Resource": "*"
        }
    ]
}
```

------

------

## 仅从特定 IP 地址范围进行连接的权限
<a name="iam-sourceip"></a>

以下示例 IAM policy 允许 IAM 主体连接到实例，条件是它们从策略中指定的 IP 地址范围内的 IP 地址进行连接。如果 IAM 主体从不在 `192.0.2.0/24`（本策略中的示例 IP 地址范围）内的 IP 地址调用 `OpenTunnel`，则响应为 `Access Denied`。有关更多信息，请参阅《IAM 用户指南》**中的 [`aws:SourceIp`](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_condition-keys.html#condition-keys-sourceip)。

------
#### [ JSON ]

****  

```
{
    "Version":"2012-10-17",		 	 	 
    "Statement": [{
            "Effect": "Allow",
            "Action": "ec2-instance-connect:OpenTunnel",
            "Resource": "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:instance-connect-endpoint/{{eice-123456789abcdef}}",
            "Condition": {
                "IpAddress": {
                    "aws:SourceIp": "{{192.0.2.0/24}}"
                },
                "NumericEquals": {
                    "ec2-instance-connect:remotePort": "{{22}}"
                }
            }
        },
        {
            "Sid": "SSHPublicKey",
            "Effect": "Allow",
            "Action": "ec2-instance-connect:SendSSHPublicKey",
            "Resource": "*",
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
                "ec2:DescribeInstanceConnectEndpoints"
            ],
            "Resource": "*"
        }
    ]
}
```

------