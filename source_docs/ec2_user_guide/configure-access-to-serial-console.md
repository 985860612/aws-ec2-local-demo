

# 配置对 EC2 Serial Console 的访问
<a name="configure-access-to-serial-console"></a>

要配置对串行控制台的访问权限，您必须在账户级别授予串行控制台访问权限，然后配置 IAM policy 以向用户授予访问权限。对于 Linux 实例，您还必须在每个实例上配置基于密码的用户，以使您的用户能够使用串行控制台进行问题排查。

EC2 Serial Console 使用虚拟串行端口连接与实例进行交互。此连接独立于实例 VPC，因此即使出现引导故障或网络配置问题，您仍可以使用实例操作系统和运行故障排除工具。由于此连接在 VPC 网络之外，因此 EC2 Serial Console 不使用实例安全组或子网网络 ACL 来授权实例的流量。

**开始前的准备工作**  
验证是否满足[先决条件](ec2-serial-console-prerequisites.md)。

**Topics**
+ [EC2 Serial Console 的访问级别](#serial-console-access-levels)
+ [管理账户对 EC2 Serial Console 的访问权限](#serial-console-account-access)
+ [为 EC2 Serial Console 访问配置 IAM policy](#serial-console-iam)
+ [在 Linux 实例上设置操作系统用户密码](#set-user-password)

## EC2 Serial Console 的访问级别
<a name="serial-console-access-levels"></a>

默认情况下，在账户级别无法访问串行控制台。您需要在账户级别明确授予对串行控制台的访问权限。有关更多信息，请参阅[管理账户对 EC2 Serial Console 的访问权限](#serial-console-account-access)。

您可以使用服务控制策略 (SCP) 来允许在组织内访问串行控制台。然后，您可以使用 IAM policy 控制访问，从而在用户级别实现精确的访问控制。通过使用 SCP 和 IAM policy 的组合，您可以对串行控制台进行不同级别的访问控制。

**组织级别**  
您可以使用服务控制策略 (SCP) 来允许组织内的成员账户访问串行控制台。有关 SCP 的更多信息，请参阅 *AWS Organizations 用户指南*中的[服务控制策略](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html)。

**实例级别**  
您可以通过使用 IAM PrincipalTag 和 ResourceTag 构造以及通过其 ID 指定实例，来配置串行控制台访问策略。有关更多信息，请参阅 [为 EC2 Serial Console 访问配置 IAM policy](#serial-console-iam)。

**用户级别**  
您可以通过配置 IAM policy 以允许或拒绝指定用户将 SSH 公钥推送到特定实例的串行控制台服务的权限，来配置用户级别的访问权限。有关更多信息，请参阅 [为 EC2 Serial Console 访问配置 IAM policy](#serial-console-iam)。

**操作系统级别**（仅限 Linux 实例）  
您可以在访客操作系统级别设置用户密码。这为某些使用案例提供了对串行控制台的访问权限。但是，要监控日志，您不需要基于密码的用户。有关更多信息，请参阅[在 Linux 实例上设置操作系统用户密码](#set-user-password)。

## 管理账户对 EC2 Serial Console 的访问权限
<a name="serial-console-account-access"></a>

默认情况下，在账户级别无法访问串行控制台。您需要在账户级别明确授予对串行控制台的访问权限。

此设置是在账户级别配置，可以直接在账户中配置，也可以使用声明性策略进行配置。必须在要授予串行控制台访问权限的每个 AWS 区域中配置该设置。使用声明性策略可同时将设置应用于多个区域，也可以同时应用于多个账户。当使用声明性策略时，您无法直接在账户中修改设置。本主题介绍如何直接在账户中配置设置。有关使用声明性策略的信息，请参阅《AWS Organizations 用户指南》**中的[声明性策略](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_declarative.html)。

**Contents**
+ [授予用户账户访问管理权限](#sc-account-access-permissions)
+ [查看账户对串行控制台的访问权限状态](#sc-view-account-access)
+ [授予账户访问串行控制台的权限。](#sc-grant-account-access)
+ [拒绝账户访问串行控制台](#sc-deny-account-access)

### 授予用户账户访问管理权限
<a name="sc-account-access-permissions"></a>

要允许用户管理对 EC2 Serial Console 的账户访问权限，您需要授予其所需的 IAM 权限。

以下策略授予查看账户状态以及允许和阻止账户访问 EC2 Serial Console 的权限。

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
                "ec2:GetSerialConsoleAccessStatus",
                "ec2:EnableSerialConsoleAccess",
                "ec2:DisableSerialConsoleAccess"
            ],
            "Resource": "*"
        }
    ]
}
```

------

有关更多信息，请参阅 *IAM 用户指南* 中的[创建 IAM 策略](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_create.html)。

### 查看账户对串行控制台的访问权限状态
<a name="sc-view-account-access"></a>

------
#### [ Console ]

**查看账户对串行控制台的访问权限**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**控制面板**。

1. 在**账户属性**卡的**设置**下，选择 **EC2 Serial Console**。

1. 在 **EC2 Serial Console** 选项卡上，**EC2 Serial Console 访问权限**的值为**已允许**或**已阻止**。

------
#### [ AWS CLI ]

**查看账户对串行控制台的访问权限**  
使用 [get-serial-console-access-status](https://docs.aws.amazon.com/cli/latest/reference/ec2/get-serial-console-access-status.html) 命令。

```
aws ec2 get-serial-console-access-status
```

下面是示例输出。值为 `true` 表示允许该账户访问串行控制台。

```
{
    "SerialConsoleAccessEnabled": true,
    "ManagedBy": "account"
}
```

`ManagedBy` 字段表示配置了该设置的实体。可能的值是 `account`（直接配置）或 `declarative-policy`。有关更多信息，请参阅《AWS Organizations User Guide》**中的 [Declarative policies](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_declarative.html)。

------
#### [ PowerShell ]

**查看账户对串行控制台的访问权限**  
使用 [Get-EC2SerialConsoleAccessStatus](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2SerialConsoleAccessStatus.html) cmdlet。

```
Get-EC2SerialConsoleAccessStatus -Select *
```

下面是示例输出。值为 `True` 表示允许该账户访问串行控制台。

```
ManagedBy SerialConsoleAccessEnabled
--------- --------------------------
account   True
```

`ManagedBy` 字段表示配置了该设置的实体。可能的值是 `account`（直接配置）或 `declarative-policy`。有关更多信息，请参阅《AWS Organizations User Guide》**中的 [Declarative policies](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_declarative.html)。

------

### 授予账户访问串行控制台的权限。
<a name="sc-grant-account-access"></a>

------
#### [ Console ]

**授予账户对串行控制台的访问权限**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**控制面板**。

1. 在**账户属性**卡的**设置**下，选择 **EC2 Serial Console**。

1. 选择**管理**。

1. 要允许访问账户中所有实例的 EC2 Serial Console，请选中**允许**复选框。

1. 选择**更新**。

------
#### [ AWS CLI ]

**授予账户对串行控制台的访问权限**  
使用 [enable-serial-console-access](https://docs.aws.amazon.com/cli/latest/reference/ec2/enable-serial-console-access.html) 命令。

```
aws ec2 enable-serial-console-access
```

下面是示例输出。

```
{
    "SerialConsoleAccessEnabled": true
}
```

------
#### [ PowerShell ]

**授予账户对串行控制台的访问权限**  
使用 [Enable-EC2SerialConsoleAccess](https://docs.aws.amazon.com/powershell/latest/reference/items/Enable-EC2SerialConsoleAccess.html) cmdlet。

```
Enable-EC2SerialConsoleAccess
```

下面是示例输出。

```
True
```

------

### 拒绝账户访问串行控制台
<a name="sc-deny-account-access"></a>

------
#### [ Console ]

**拒绝账户访问串行控制台**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**控制面板**。

1. 在**账户属性**卡的**设置**下，选择 **EC2 Serial Console**。

1. 选择**管理**。

1. 要阻止访问账户中所有实例的 EC2 Serial Console，请清除**允许**复选框。

1. 选择**更新**。

------
#### [ AWS CLI ]

**拒绝账户访问串行控制台**  
使用 [disable-serial-console-access](https://docs.aws.amazon.com/cli/latest/reference/ec2/disable-serial-console-access.html) 命令。

```
aws ec2 disable-serial-console-access
```

下面是示例输出。

```
{
    "SerialConsoleAccessEnabled": false
}
```

------
#### [ PowerShell ]

**拒绝账户访问串行控制台**  
使用 [Disable-EC2SerialConsoleAccess](https://docs.aws.amazon.com/powershell/latest/reference/items/Disable-EC2SerialConsoleAccess.html) cmdlet。

```
Disable-EC2SerialConsoleAccess
```

下面是示例输出。

```
False
```

------

## 为 EC2 Serial Console 访问配置 IAM policy
<a name="serial-console-iam"></a>

默认情况下，用户无权访问串行控制台。您的组织必须配置 IAM policy 以授予用户所需的访问权限。有关更多信息，请参阅 *IAM 用户指南* 中的[创建 IAM 策略](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_create.html)。

对于串行控制台访问，请创建包含 `ec2-instance-connect:SendSerialConsoleSSHPublicKey` 操作的 JSON 策略文档。此操作会授予用户将公钥推送到串行控制台服务的权限，该服务将启动串行控制台会话。我们建议限制对特定 EC2 实例的访问。否则，具有此权限的所有用户都可以连接到所有 EC2 实例的串行控制台。

**Topics**
+ [明确允许访问串行控制台](#iam-explicitly-allow-access)
+ [明确拒绝访问串行控制台](#serial-console-IAM-policy)
+ [使用资源标签控制对串行控制台的访问](#iam-resource-tags)

### 明确允许访问串行控制台
<a name="iam-explicitly-allow-access"></a>

默认情况下，没有人可以访问串行控制台。要授予对串行控制台的访问权限，您需要将策略配置为明确允许访问。我们建议配置一个策略以限制对特定实例的访问。

以下策略允许访问由实例 ID 标识的特定实例的串行控制台。

请注意，`DescribeInstances`、`DescribeInstanceTypes` 和 `GetSerialConsoleAccessStatus` 操作不支持资源级权限，因此必须为这些操作指定以 `*`（星号）表示的所有资源。

------
#### [ JSON ]

****  

```
{
    "Version":"2012-10-17",		 	 	 
    "Statement": [
        {
            "Sid": "AllowDescribeInstances",
            "Effect": "Allow",
            "Action": [
                "ec2:DescribeInstances",
                "ec2:DescribeInstanceTypes",
                "ec2:GetSerialConsoleAccessStatus"
            ],
             "Resource": "*"
        },
        {
            "Sid": "AllowinstanceBasedSerialConsoleAccess",
            "Effect": "Allow",
            "Action": [
                "ec2-instance-connect:SendSerialConsoleSSHPublicKey"
            ],
            "Resource": "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:instance/{{i-0598c7d356eba48d7}}"
        }
    ]
}
```

------

### 明确拒绝访问串行控制台
<a name="serial-console-IAM-policy"></a>

以下 IAM policy 允许访问标有 `*`（星号）的所有实例的串行控制台，并明确拒绝访问由 ID 标识的特定实例的串行控制台。

------
#### [ JSON ]

****  

```
{
    "Version":"2012-10-17",		 	 	 
    "Statement": [
        {
            "Sid": "AllowSerialConsoleAccess",
            "Effect": "Allow",
            "Action": [
                "ec2-instance-connect:SendSerialConsoleSSHPublicKey",
                "ec2:DescribeInstances",
                "ec2:DescribeInstanceTypes",
                "ec2:GetSerialConsoleAccessStatus"
            ],
            "Resource": "*"
        },
        {
            "Sid": "DenySerialConsoleAccess",
            "Effect": "Deny",
            "Action": [
                "ec2-instance-connect:SendSerialConsoleSSHPublicKey"
            ],
            "Resource": "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:instance/{{i-0598c7d356eba48d7}}"
        }
    ]
}
```

------

### 使用资源标签控制对串行控制台的访问
<a name="iam-resource-tags"></a>

您可以使用资源标签来控制对实例的串行控制台的访问。

基于属性的访问控制是一种授权策略，它根据可附加到用户和 AWS 资源的标签来定义权限。例如，只有当实例的资源标签和主体标签具有相同的标签键 `SerialConsole` 值时，以下策略才会允许用户启动该实例的串行控制台连接。

有关使用标签控制对AWS资源的访问的更多信息，请参阅 *IAM 用户指南*中的[控制对AWS资源的访问](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_tags.html#access_tags_control-resources)。

请注意，`DescribeInstances`、`DescribeInstanceTypes` 和 `GetSerialConsoleAccessStatus` 操作不支持资源级权限，因此必须为这些操作指定以 `*`（星号）表示的所有资源。

------
#### [ JSON ]

****  

```
{
    "Version":"2012-10-17",		 	 	 
    "Statement": [
        {
            "Sid": "AllowDescribeInstances",
            "Effect": "Allow",
            "Action": [
                "ec2:DescribeInstances",
                "ec2:DescribeInstanceTypes",
                "ec2:GetSerialConsoleAccessStatus"
            ],
            "Resource": "*"
        },
        {
            "Sid": "AllowTagBasedSerialConsoleAccess",
            "Effect": "Allow",
            "Action": [
                "ec2-instance-connect:SendSerialConsoleSSHPublicKey"
            ],
            "Resource": "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:instance/*",
            "Condition": {
                "StringEquals": {
                    "aws:ResourceTag/{{SerialConsole}}": "${aws:PrincipalTag/{{SerialConsole}}}"
                }
            }
        }
    ]
}
```

------

## 在 Linux 实例上设置操作系统用户密码
<a name="set-user-password"></a>

您可以在没有密码的情况下连接到串行控制台。但是，要*使用*串行控制台对 Linux 实例进行故障排查，实例必须拥有基于密码的操作系统用户。

您可以为任何 OS 用户（包括根用户）设置密码。请注意，根用户可以修改所有文件，而每个 OS 用户可能只有有限权限。

您必须为要使用串行控制台的每个实例设置用户密码。这是每个实例的一次性要求。

**注意**  
默认情况下，AWS 提供的 AMI 未配置基于密码的用户。如果您使用已配置了根用户密码的 AMI 启动实例，则可以跳过这些说明。

**在 Linux 实例上设置操作系统用户密码**

1. [连接到您的 实例](connect-to-linux-instance.md)。除 EC2 Serial Console 连接方法外，您还可以使用任何方法连接到自己的实例。

1. 要为用户设置密码，请使用 **passwd** 命令。在以下示例中，用户是 `root`。

   ```
   [ec2-user ~]$ sudo passwd root
   ```

   下面是示例输出。

   ```
   Changing password for user root.
   New password:
   ```

1. 出现提 `New password` 示时，输入新密码。

1. 出现提示时，重新输入密码。