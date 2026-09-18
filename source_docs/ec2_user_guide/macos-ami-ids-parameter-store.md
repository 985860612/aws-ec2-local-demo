

# 使用 AWS Systems Manager 参数存储 API 检索 macOS AMI ID
<a name="macos-ami-ids-parameter-store"></a>

在启动实例时，您必须指定 (AMI)。AMI 特定于 AWS 区域、操作系统和处理器架构。您可以查看 AWS 区域 中的所有 macOS AMI，并通过查询 AWS Systems Manager 参数存储 API 来检索最新的 macOS AMI。通过使用这些公共参数，您无需手动查找 macOS AMI ID。公共参数可用于 x86 和 ARM64 macOS AMI，并且可以与现有 AWS CloudFormation 模板集成。

**所需的权限**  
要执行此操作，[IAM 主体](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html#id_roles_terms-and-concepts)必须拥有调用 `ssm:GetParameter` API 操作的权限。

**要使用 AWS CLI 查看当前 AWS 区域 中的所有 macOS AMI 的列表**  
使用以下 [get-parameters-by-path](https://docs.aws.amazon.com/cli/latest/reference/ssm/get-parameters-by-path.html) 命令查看当前区域中所有 macOS AMI 的列表。

```
aws ssm get-parameters-by-path --path /aws/service/ec2-macos --recursive --query "Parameters[].Name"
```

**要使用 AWS CLI 检索最新主要 macOS AMI 的 AMI ID**  
使用以下带有子参数 `image_id` 的 [get-parameter](https://docs.aws.amazon.com/cli/latest/reference/ssm/get-parameter.html) 命令。在以下示例中，将 `sonoma` 替换为 macOS 支持的主要版本，将 `x86_64_mac` 替换为处理器，以及将 `region-code` 替换为需要其最新 macOS AMI ID 的受支持 AWS 区域。

```
aws ssm get-parameter --name /aws/service/ec2-macos/{{sonoma}}/{{x86_64_mac}}/latest/image_id --region {{region-code}}
```

有关更多信息，请参阅《AWS Systems Manager 用户指南》**中的[调用适用于 macOS 的 AMI 公共参数](https://docs.aws.amazon.com/systems-manager/latest/userguide/parameter-store-public-parameters-ami.html#public-parameters-ami-macos)。