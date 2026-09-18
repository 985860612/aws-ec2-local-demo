

# 取消与您的 AWS 账户 共享 AMI
<a name="cancel-sharing-an-AMI"></a>

通过将账户添加到 AMI 的启动权限，可以[与特定 AWS 账户 共享](sharingamis-explicit.md)亚马逊机器映像（AMI）。如果已与您的 AWS 账户 共享 AMI，而您不想再与您的账户共享该 AMI，则可以将您的账户从 AMI 的启动权限中移除。您可以通过运行 `cancel-image-launch-permission` AWS CLI 命令进行这项操作。在运行此命令时，将从指定 AMI 的启动权限中移除您的 AWS 账户。若要查找与 AWS 账户 共享的 AMI，请参阅 [查找用于 Amazon EC2 实例的共享 AMI](usingsharedamis-finding.md)。

例如，您可以取消与您的账户共享 AMI，以降低使用已与您共享的未使用或已弃用的 AMI 启动实例的可能性。当您取消与您的账户共享 AMI 时，它将不再出现在 EC2 控制台的任何 AMI 列表中，也不会出现在 [describe-images](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-images.html) 的输出中。

**Topics**
+ [限制](#cancel-sharing-an-AMI-limitations)
+ [取消与您的账户共享 AMI](#cancel-image-launch-permission)

## 限制
<a name="cancel-sharing-an-AMI-limitations"></a>
+ 您可将您的账户从仅与 AWS 账户 共享的 AMI 的启动权限中移除。您不能使用 `cancel-image-launch-permission` 从 [与组织或组织单位（OU）共享的 AMI](share-amis-with-organizations-and-OUs.md) 的启动权限中移除您的账户，也不能将其用于移除对公共 AMI 的访问权限。
+ 您不能从 AMI 的启动权限中永久移除您的账户。AMI 拥有者可以再次与您的账户共享 AMI。
+ AMI 是一种区域性资源。在运行 `cancel-image-launch-permission` 时，必须指定 AMI 所在的区域。可在命令中指定区域，或者使用 AWS\_DEFAULT\_REGION [环境变量](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-envvars.html)。
+ 只有 AWS CLI 和 SDK 支持从 AMI 的启动权限中移除您的账户。EC2 控制台目前不支持此操作。

## 取消与您的账户共享 AMI
<a name="cancel-image-launch-permission"></a>

**注意**  
在您取消与您的账户共享 AMI 后，您将无法撤消该操作。要重新获得对 AMI 的访问权限，AMI 拥有者必须将其与您的账户共享。

------
#### [ AWS CLI ]

**取消与账户共享 AMI**  
使用 [cancel-image-launch-permission](https://docs.aws.amazon.com/cli/latest/reference/ec2/cancel-image-launch-permission.html) 命令。

```
aws ec2 cancel-image-launch-permission \
    --image-id {{ami-0abcdef1234567890}} \
    --region {{us-east-1}}
```

------
#### [ PowerShell ]

**取消与账户共享 AMI**  
使用 [Stop-EC2ImageLaunchPermission](https://docs.aws.amazon.com/powershell/latest/reference/index.html) cmdlet。

```
Stop-EC2ImageLaunchPermission `
    -ImageId {{ami-0abcdef1234567890}} `
    -Region {{us-east-1}}
```

------