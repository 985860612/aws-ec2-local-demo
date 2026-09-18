

# 使用 AWS Systems Manager 将 STIG 设置应用到您的实例
<a name="ec2-stig-ssm-cmd-doc"></a>

您可以使用 `AWSEC2-ConfigureSTIG` Systems Manager 命令文档将 STIG 设置应用于现有 EC2 实例。您必须从其更新的实例运行命令文档。命令文档根据其所运行实例的操作系统和配置应用相应的设置。

本页包含有关 `AWSEC2-ConfigureSTIG` 命令文档的详细信息，包括输入参数以及如何在 Systems Manager 控制台中或在 AWS CLI 中使用 `send-command` 运行该文档。

## AWSEC2-ConfigureSTIG 输入参数
<a name="ec2-stig-ssm-cmd-doc-params"></a>

您可以提供以下输入参数来指定命令文档应如何将 STIG 设置应用到您的实例。

**Level**（字符串，必填）  
指定要应用的 STIG 严重性类别。有效值包括：  
+ 高
+ 中
+ 低
如果您未指定值，系统将默认该值为 `High`。

**InstallPackages**（字符串，可选 – 仅限 Linux）  
如果值为 `No`，则脚本不安装任何其他软件包。如果值为 `Yes`，则脚本会安装实现最大合规性所需的其他软件包。默认值为 `No`。

**SetDoDConsentBanner**（字符串，可选 – 仅限 Linux）  
如果值为 `No`，则当您连接到安装了 Linux STIG 脚本的实例时不会显示 DoD 同意横幅。如果值为 `Yes`，则当您连接到安装了 STIG Linux 脚本之一的实例时，会在您登录之前显示 DoD 同意横幅。您必须先确认该横幅，然后才能登录。默认值为 `No`。  
有关同意横幅的示例，请参阅当您访问 DLA 文档服务网站时显示的 [Disclaimer Department of Defense Privacy and Consent Notice](https://dso.dla.mil/)。

## 运行 AWSEC2-ConfigureSTIG 命令文档
<a name="ec2-stig-ssm-cmd-doc-run"></a>

要运行 `AWSEC2-ConfigureSTIG` 文档，请按照适用于您的首选环境的步骤操作。

------
#### [ Console ]

1. 访问 [https://console.aws.amazon.com/systems-manager/](https://console.aws.amazon.com/systems-manager/)，打开 AWS Systems Manager 控制台。

1. 从导航窗格中选择**运行命令**。这将显示您的账户中当前正在运行的命令的列表（如果适用）。

1. 选择 **Run command（运行命令）**。这将打开**运行命令**对话框，并显示您有权访问的命令文档列表。

1. 从命令文档列表中选择 `AWSEC2-ConfigureSTIG`。为了简化结果，您可以输入完整或部分文档名称。也可以按所有者、平台类型或标签进行筛选。

   当选择命令文档时，将在列表下方填充详细信息。

1. 从**文档版本**列表中选择 `Default version at runtime`。

1. 配置**命令参数**以定义 `AWSEC2-ConfigureSTIG` 如何安装脚本包并运行它来更新实例。有关参数的详细信息，请参阅 [AWSEC2-ConfigureSTIG 输入参数](#ec2-stig-ssm-cmd-doc-params)。

1. 对于**目标选择**，请指定标签或者手动选择实例，以确定要在其上执行此操作的实例。
**注意**  
如果手动选择实例，而且要查看的实例未包含在列表中，请参阅[我的实例在哪里？](https://docs.aws.amazon.com/systems-manager/latest/userguide/troubleshooting-remote-commands.html#where-are-instances)以获得故障排除提示。

1. 要获得用来定义 Systems Manager Run Command 行为（例如**速率控制**）的其他参数，请输入[从控制台运行命令](https://docs.aws.amazon.com/systems-manager/latest/userguide/running-commands-console.html)中所述的值。

1. 选择**运行**。

   如果成功，命令文档将安装脚本并配置您的实例。如果命令执行失败，请查看 Systems Manager 命令输出，了解执行失败的详细原因。

------
#### [ AWS CLI ]

**示例 1：使用默认值运行**  
运行以下命令安装 STIG 脚本并使用默认值运行该脚本。有关输入参数的更多信息，请参阅[AWSEC2-ConfigureSTIG 输入参数](#ec2-stig-ssm-cmd-doc-params)。

```
aws ssm send-command \
	--document-name "AWSEC2-ConfigureSTIG" \
	--instance-ids "{{i-1234567890abcdef0}}"'
```

**示例 2：在您的实例上配置“中等”级别的 STIG 设置**  
运行以下命令安装 STIG 脚本，并将 `Level` 输入参数设置为 `Medium` 后运行该脚本。有关输入参数的更多信息，请参阅[AWSEC2-ConfigureSTIG 输入参数](#ec2-stig-ssm-cmd-doc-params)。

```
aws ssm send-command \
	--document-name "AWSEC2-ConfigureSTIG" \
	--instance-ids "{{i-1234567890abcdef0}}"
	--parameters '{"Level":"Medium"}'
```

如果成功，命令文档将安装脚本并配置您的实例。如果命令执行失败，请查看命令输出，了解执行失败的详细原因。

------
#### [ PowerShell ]

**示例 1：使用默认值运行**  
运行以下命令安装 STIG 脚本并使用默认值运行该脚本。有关输入参数的更多信息，请参阅[AWSEC2-ConfigureSTIG 输入参数](#ec2-stig-ssm-cmd-doc-params)。

```
Send-SSMCommand -DocumentName "AWSEC2-ConfigureSTIG" -InstanceId "{{i-1234567890abcdef0}}"}
```

**示例 2：在您的实例上配置“中等”级别的 STIG 设置**  
运行以下命令安装 STIG 脚本，并将 `Level` 输入参数设置为 `Medium` 后运行该脚本。有关输入参数的更多信息，请参阅[AWSEC2-ConfigureSTIG 输入参数](#ec2-stig-ssm-cmd-doc-params)。

```
Send-SSMCommand -DocumentName "AWSEC2-ConfigureSTIG" -InstanceId "{{i-1234567890abcdef0}}" -Parameter @{'Level'='Medium'}
```

如果成功，命令文档将安装脚本并配置您的实例。如果命令执行失败，请查看命令输出，了解执行失败的详细原因。

------