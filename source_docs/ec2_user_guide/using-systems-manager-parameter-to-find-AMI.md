

# 使用 Systems Manager 参数引用 AMI
<a name="using-systems-manager-parameter-to-find-AMI"></a>

在 Amazon EC2 控制台中使用 EC2 启动实例向导启动实例时，您可以从列表中选择 AMI，也可以选择指向 AMI ID 的 AWS Systems Manager 参数（如此部分中所述）。如果您使用自动化代码启动实例，则可以指定 Systems Manager 参数而不是 AMI ID。

Systems Manager 参数是客户定义的键/值对，您可以在 Systems Manager Parameter Store 中创建该键/值对。Parameter Store 提供了一个中央存储来对应用程序配置值进行外部化。有关更多信息，请参阅 *AWS Systems Manager 用户指南*中的 [AWS Systems Manager Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html)。

创建指向 AMI ID 的参数时，请确保将数据类型指定为 `aws:ec2:image`。指定此数据类型可确保在创建或修改参数时，将参数值作为 AMI ID 进行验证。有关更多信息，请参阅 *AWS Systems Manager 用户指南*中[对亚马逊机器映像 ID 的原生参数支持](https://docs.aws.amazon.com/systems-manager/latest/userguide/parameter-store-ec2-aliases.html)。

**Topics**
+ [使用案例](#systems-manager-parameter-use-case)
+ [权限](#systems-manager-permissions)
+ [限制](#AMI-systems-manager-parameter-limitations)
+ [使用 Systems Manager 参数启动实例](#systems-manager-parameter-launch-instance)

## 使用案例
<a name="systems-manager-parameter-use-case"></a>

当您使用 Systems Manager 参数指向 AMI ID 时，您的用户在启动实例时可以更轻松地选择正确的 AMI。Systems Manager 参数还可以简化自动化代码的维护。

**用户使用更简单**

如果您需要使用特定 AMI 启动实例并且该 AMI 定期更新，我们建议您要求用户选择 Systems Manager 参数来查找 AMI。要求用户选择 Systems Manager 参数可确保使用最新的 AMI 启动实例。

例如，您的组织中可能会每个月创建一个新版本的 AMI，其中具有最新操作系统和应用程序修补程序。同时，您要求用户使用最新版本的 AMI 启动实例。为确保用户使用最新版本，您可以创建指向正确 AMI ID 的 Systems Manager 参数（例如 `golden-ami`）。每次创建新版本的 AMI 时，您需要更新参数中的 AMI ID 值，以使其始终指向最新 AMI。您的用户不需要了解对 AMI 的定期更新，因为他们每次都会继续选择相同的 Systems Manager 参数。为您的 AMI 使用 Systems Manager 参数可让他们更轻松地选择正确的 AMI 来启动实例。

**简化自动化代码维护**

如果您使用自动化代码启动实例，则可以指定 Systems Manager 参数而不是 AMI ID。如果创建了新版本的 AMI，您可以更改参数中的 AMI ID 值，以使其指向最新 AMI。每次创建新版本的 AMI 时，都不需要修改引用该参数的自动化代码。这样做简化了自动化的维护，有助于降低部署成本。

**注意**  
当您更改 Systems Manager 参数指向的 AMI ID 时，正在运行的实例不受影响。

## 权限
<a name="systems-manager-permissions"></a>

如果您在启动实例向导中使用指向 AMI ID 的 Systems Manager 参数，则必须将以下权限添加到您的 IAM 策略：
+ `ssm:DescribeParameters`：授予查看和选择 Systems Manager 参数的权限。
+ `ssm:GetParameters`：授予检索 Systems Manager 参数值的权限。

您还可以限制对特定 Systems Manager 参数的访问权限。有关更多信息以及示例 IAM 策略，请参阅 [示例：使用 EC2 启动实例向导](iam-policies-ec2-console.md#ex-launch-wizard)。

## 限制
<a name="AMI-systems-manager-parameter-limitations"></a>

AMI 和 Systems Manager 参数特定于区域。要跨区域使用相同的 Systems Manager 参数名称，请在各个区域中创建具有相同名称的 Systems Manager 参数（例如，`golden-ami`）。在每个区域中，将 Systems Manager 参数指向该区域的 AMI。

参数名称区分大小写。只有在参数是层次结构的一部分时，参数名称才需要使用反斜杠，例如，`/amis/production/golden-ami`。如果参数不是层次结构的一部分，您可以省略反斜杠。

## 使用 Systems Manager 参数启动实例
<a name="systems-manager-parameter-launch-instance"></a>

启动实例时，您可以不指定 AMI ID，而选择指定指向某个 AMI ID 的 Systems Manager 参数。

要以编程方式指定参数，请使用以下语法，其中 `resolve:ssm` 是标准前缀，`parameter-name` 是唯一参数名称。

```
resolve:ssm:{{parameter-name}}
```

Systems Manager 参数具有版本支持。参数的每个迭代将分配一个唯一的版本号。您可以按如下方式引用参数的版本，其中 `version` 是唯一版本号。默认情况下，未指定版本时将使用参数的最新版本。

```
resolve:ssm:{{parameter-name}}:{{version}}
```

要使用 AWS 提供的公有参数启动实例，请参阅[使用 Systems Manager 公共参数引用最新的 AMI](finding-an-ami-parameter-store.md)。

------
#### [ Console ]

**使用 Systems Manager 参数查找 AMI**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 从导航栏，选择您在其中启动实例的区域。您可以选择向您提供的任何区域，无需理会您身处的位置。

1. 从控制台控制面板中，选择**启动实例**。

1. 在**应用程序和操作系统镜像（Amazon 机器映像）**下，选择**浏览其他 AMI**。

1. 选择搜索栏右侧的箭头按钮，然后选择 **Search by Systems Manager parameter**（按 Systems Manager 参数搜索）。

1. 对于 **Systems Manager 参数 (Systems Manager 参数)**，请选择一个参数。相应的 AMI ID 将显示在 **Currently resolves to**（当前解析为）下方。

1. 选择**搜索**。与 AMI ID 匹配的 AMI 将显示在列表中。

1. 从列表中选择 AMI，然后选择**选择**。

有关使用启动实例向导启动实例的更多信息，请参阅 [使用控制台中的启动实例向导来启动 EC2 实例](ec2-launch-instance-wizard.md)。

------
#### [ AWS CLI ]

**使用 Systems Manager 参数启动实例**  
使用 [run-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/run-instances.html) 命令和 `--image-id` 选项。此示例使用名为 **golden-ami** 的 Systems Manager 参数来指定 AMI ID。

```
--image-id resolve:ssm:/{{golden-ami}}
```

您可以为 Systems Manager 参数创建若干版本。以下示例指定了 **golden-ami** 参数的版本 2。

```
--image-id resolve:ssm:/{{golden-ami:2}}
```

------
#### [ PowerShell ]

**使用 Systems Manager 参数启动实例**  
将 [New-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2Instance.html) cmdlet 与 `-ImageId` 参数结合使用。此示例使用名为 **golden-ami** 的 Systems Manager 参数来指定 AMI ID。

```
-ImageId "resolve:ssm:/golden-ami"
```

您可以为 Systems Manager 参数创建若干版本。以下示例指定了 **golden-ami** 参数的版本 2。

```
-ImageId "resolve:ssm:/golden-ami:2"
```

------