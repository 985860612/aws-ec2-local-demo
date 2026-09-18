

# 在 Amazon EC2 中使用您的 BYOIP 地址范围
<a name="byoip-working-with"></a>

您可以查看和使用在您的账户中预置的 IPv4 和 IPv6 地址范围。有关更多信息，请参阅 [载入您在 Amazon EC2 中使用的地址范围](byoip-onboard.md)。

## IPv4 地址范围
<a name="byoip-work-with-ipv4"></a>

您可以从 IPv4 地址池中创建弹性 IP 地址，并将其用于您的 AWS 资源，如 EC2 实例、NAT 网关和 Network Load Balancer。

要查看有关在您的账户中预置的 IPv4 地址池的信息，请使用以下 [describe-public-ipv4-pools](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-public-ipv4-pools.html) 命令。

```
aws ec2 describe-public-ipv4-pools --region {{us-east-1}}
```

要从 IPv4 地址池中创建弹性 IP 地址，请使用 [allocate-address](https://docs.aws.amazon.com/cli/latest/reference/ec2/allocate-address.html) 命令。您可以使用 `--public-ipv4-pool` 选项指定 `describe-byoip-cidrs` 返回的地址池的 ID。或者，您可以使用 `--address` 选项从您预置的地址范围中指定一个地址。

## IPv6 地址范围
<a name="byoip-work-with-ipv6"></a>

要查看有关在您的账户中预置的 IPv6 地址池的信息，请使用以下 [describe-ipv6-pools](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-ipv6-pools.html) 命令。

```
aws ec2 describe-ipv6-pools --region {{us-east-1}}
```

要创建 VPC 并从 IPv6 地址池中指定 IPv6 CIDR，请使用以下 [create-vpc](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-vpc.html) 命令。要让 Amazon 从 IPv6 地址池中选择 IPv6 CIDR，请省略 `--ipv6-cidr-block` 选项。

```
aws ec2 create-vpc --cidr-block {{10.0.0.0/16}} --ipv6-cidr-block {{ipv6-cidr}} --ipv6-pool {{pool-id}} --region {{us-east-1}}
```

要将 IPv6 地址池中的 IPv6 CIDR 块与 VPC 关联，请使用以下 [associate-vpc-cidr-block](https://docs.aws.amazon.com/cli/latest/reference/ec2/associate-vpc-cidr-block.html) 命令。要让 Amazon 从 IPv6 地址池中选择 IPv6 CIDR，请省略 `--ipv6-cidr-block` 选项。

```
aws ec2 associate-vpc-cidr-block --vpc-id {{vpc-123456789abc123ab}} --ipv6-cidr-block {{ipv6-cidr}} --ipv6-pool {{pool-id}} --region {{us-east-1}}
```

要查看 VPC 和关联的 IPv6 地址池信息，请使用 [describe-vpcs](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-vpcs.html) 命令。要查看有关特定 IPv6 地址池中的关联 IPv6 CIDR 块的信息，请使用以下 [get-associated-ipv6-pool-cidrs](https://docs.aws.amazon.com/cli/latest/reference/ec2/get-associated-ipv6-pool-cidrs.html) 命令。

```
aws ec2 get-associated-ipv6-pool-cidrs --pool-id {{pool-id}} --region {{us-east-1}}
```

如果将 IPv6 CIDR 块与 VPC 取消关联，则会将其释放回 IPv6 地址池中。