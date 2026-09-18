

# 将 IAM 角色附加到实例
<a name="attach-iam-role"></a>

在启动过程中或启动之后，您可以创建一个 IAM 角色并将其附加到实例。您也可以替换或分离 IAM 角色。

**在实例启动期间创建和附加 IAM 角色（推荐）**

1. 在 EC2 实例启动期间，展开**高级详细信息**。

1. 在 **IAM 实例配置文件**部分中，选择**创建新的 IAM 角色**。

1. 将打开内联角色创建表单，您可以：
   + 指定**角色名称**（例如 `EC2-S3-Access-Role`）
   + 通过选择 AWS 托管式策略或创建自定义策略来为实例定义权限

     例如，要授予 S3 访问权限，请选择 `AmazonS3ReadOnlyAccess` 托管式策略
   + 查看允许 `ec2.amazonaws.com` 代入该角色的信任策略
   + 为元数据添加可选标签

1. 选择**创建角色**。

   系统会自动选择新创建的角色，并在实例启动时通过实例配置文件将其附加到您的实例。

**注意**  
在实例启动期间使用控制台创建角色时，系统会自动创建一个与该角色同名的实例配置文件。实例配置文件是一个容器，用于在启动时将 IAM 角色信息传递给实例。

**重要**  
您只能将一个 IAM 角色附加到一个实例，但可以将同一角色附加到多个实例。
关联具有最低权限的 IAM 策略，从而仅允许访问应用程序所需的特定 API 调用。

有关创建和使用 IAM 角色的更多信息，请参阅 *IAM 用户指南* 中的[角色](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html)。

**在实例启动期间附加现有的 IAM 角色**  
要在启动时使用 Amazon EC2 控制台将现有的 IAM 角色附加到实例，请展开**高级详细信息**。对于 **IAM 实例配置文件**，请从下拉列表中选择该 IAM 角色。

**注意**  
如果您是使用 IAM 控制台创建的 IAM 角色，则为您创建了实例配置文件，并提供了与角色相同的名称。如果使用 AWS CLI、API 或 AWS SDK 创建了 IAM 角色，则可能为实例配置文件指定了与角色不同的名称。

您可以将 IAM 角色附加到正在运行或已停止的实例。如果实例已附加 IAM 角色，则必须将其替换为新的 IAM 角色。

------
#### [ Console ]<a name="attach-iam-role-console"></a>

**将 IAM 角色附加到实例**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**实例**。

1. 选择实例。

1. 依次选择 **Actions**（操作）、**Security**（安全）和 **Modify IAM role**（修改 IAM 角色）。

1. 对于 **IAM 角色**，选择 IAM 实例配置文件。

1. 选择**更新 IAM 角色**。

------
#### [ AWS CLI ]
<a name="attach-iam-role-instance-cli"></a>
**将 IAM 角色附加到实例**  
使用 [associate-iam-instance-profile](https://docs.aws.amazon.com/cli/latest/reference/ec2/associate-iam-instance-profile.html) 命令将 IAM 角色附加到该实例。指定实例配置文件时，您可以使用实例配置文件的 Amazon 资源名称（ARN），也可以使用其名称。

```
aws ec2 associate-iam-instance-profile \
    --instance-id {{i-1234567890abcdef0}} \
    --iam-instance-profile Name="{{TestRole-1}}"
```

------
#### [ PowerShell ]

**将 IAM 角色附加到实例**  
使用 [Register-EC2IamInstanceProfile](https://docs.aws.amazon.com/powershell/latest/reference/items/Register-EC2IamInstanceProfile.html) cmdlet。

```
Register-EC2IamInstanceProfile `
    -InstanceId {{i-1234567890abcdef0}} `
    -IamInstanceProfile_Name {{TestRole-1}}
```

------

要在已附加了 IAM 角色的实例上替换该 IAM 角色，该实例必须处于正在运行状态。如果要更改实例的 IAM 角色而先不分离现有角色，则您可以执行此操作。例如，您可以执行此操作，以确保正在实例上运行的应用程序所执行的 API 操作不会被中断。

------
#### [ Console ]<a name="replace-iam-role-console"></a>

**替换实例的 IAM 角色**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**实例**。

1. 选择实例。

1. 依次选择 **Actions**（操作）、**Security**（安全）和 **Modify IAM role**（修改 IAM 角色）。

1. 对于 **IAM 角色**，选择 IAM 实例配置文件。

1. 选择**更新 IAM 角色**。

------
#### [ AWS CLI ]<a name="replace-iam-role-cli"></a>

**替换实例的 IAM 角色**

1. 需要时使用 [describe-iam-instance-profile-associations](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-iam-instance-profile-associations.html) 命令来获取关联 ID。

   ```
   aws ec2 describe-iam-instance-profile-associations \
       --filters Name=instance-id,Values={{i-1234567890abcdef0}} \
       --query IamInstanceProfileAssociations.AssociationId
   ```

1. 使用 [replace-iam-instance-profile-association](https://docs.aws.amazon.com/cli/latest/reference/ec2/replace-iam-instance-profile-association.html) 命令。指定现有实例配置文件的关联 ID，以及新实例配置文件的 ARN 或名称。

   ```
   aws ec2 replace-iam-instance-profile-association \
       --association-id {{iip-assoc-0044d817db6c0a4ba}} \
       --iam-instance-profile Name="{{TestRole-2}}"
   ```

------
#### [ PowerShell ]

**替换实例的 IAM 角色**

1. 需要时使用 [Get-EC2IamInstanceProfileAssociation](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2IamInstanceProfileAssociation.html) cmdlet 来获取关联 ID。

   ```
   (Get-EC2IamInstanceProfileAssociation -Filter @{Name="instance-id"; Values="{{i-0636508011d8e966a}}"}).AssociationId
   ```

1. 使用 [Set-EC2IamInstanceProfileAssociation](https://docs.aws.amazon.com/powershell/latest/reference/items/Set-EC2IamInstanceProfileAssociation.html) cmdlet。指定现有实例配置文件的关联 ID，以及新实例配置文件的 ARN 或名称。

   ```
   Set-EC2IamInstanceProfileAssociation `
       -AssociationId {{iip-assoc-0044d817db6c0a4ba}} `
       -IamInstanceProfile_Name {{TestRole-2}}
   ```

------

您可以将 IAM 角色从正在运行或已停止的实例上分离。

------
#### [ Console ]<a name="detach-iam-role-console"></a>

**从实例中分离 IAM 角色**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**实例**。

1. 选择实例。

1. 依次选择 **Actions**（操作）、**Security**（安全）和 **Modify IAM role**（修改 IAM 角色）。

1. 对于 **IAM 角色**，请选择**无 IAM 角色**。

1. 选择**更新 IAM 角色**。

1. 提示进行确认时，输入**分离**，然后选择**分离**。

------
#### [ AWS CLI ]<a name="detach-iam-role-cli"></a>

**从实例中分离 IAM 角色**

1. 需要时使用 [describe-iam-instance-profile-associations](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-iam-instance-profile-associations.html)，来获取要替换的 IAM 实例配置文件的关联 ID。

   ```
   aws ec2 describe-iam-instance-profile-associations \
       --filters Name=instance-id,Values={{i-1234567890abcdef0}} \
       --query IamInstanceProfileAssociations.AssociationId
   ```

1. 使用 [disassociate-iam-instance-profile](https://docs.aws.amazon.com/cli/latest/reference/ec2/disassociate-iam-instance-profile.html) 命令。

   ```
   aws ec2 disassociate-iam-instance-profile --association-id {{iip-assoc-0044d817db6c0a4ba}}
   ```

------
#### [ PowerShell ]

**从实例中分离 IAM 角色**

1. 需要时使用 [Get-EC2IamInstanceProfileAssociation](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2IamInstanceProfileAssociation.html)，来获取要分离的 IAM 实例配置文件的关联 ID。

   ```
   (Get-EC2IamInstanceProfileAssociation -Filter @{Name="instance-id"; Values="i-0636508011d8e966a"}).AssociationId
   ```

1. 使用 [Unregister-EC2IamInstanceProfile](https://docs.aws.amazon.com/powershell/latest/reference/items/Unregister-EC2IamInstanceProfile.html) cmdlet。

   ```
   Unregister-EC2IamInstanceProfile -AssociationId {{iip-assoc-0044d817db6c0a4ba}}
   ```

------