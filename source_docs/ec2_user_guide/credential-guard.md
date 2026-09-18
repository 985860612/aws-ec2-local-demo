

# 适用于 Windows 实例的凭证保护
<a name="credential-guard"></a>

AWS Nitro System 支持适用于 Amazon Elastic Compute Cloud（Amazon EC2）Windows 实例的凭证保护。凭证保护是一项基于 Windows 虚拟化的安全（VBS）功能，允许创建隔离环境以在 Windows 内核保护基础上提供安全资产保护，例如 Windows 用户凭证和代码完整性实施。运行 EC2 Windows 实例时，凭证保护将通过 AWS Nitro System 为 Windows 登录凭证提供保护，防止他人从操作系统内存中提取登录凭证。

**Topics**
+ [前提条件](#credential-guard-prerequisites)
+ [启动受支持的实例](#credential-guard-launch-instance)
+ [禁用内存完整性](#disable-memory-integrity)
+ [启用凭证保护](#turn-on-credential-guard)
+ [验证凭证保护是否正在运行](#verify-credential-guard)

## 前提条件
<a name="credential-guard-prerequisites"></a>

您的 Windows 实例必须满足以下先决条件才能使用凭证保护。

**亚马逊机器映像（AMI）**  
必须预配置 AMI 才能启用 NitroTPM 与 UEFI 安全启动。有关支持的 AMI 的更多信息，请参阅 [将 NitroTPM 与 Amazon EC2 实例结合使用的要求](enable-nitrotpm-prerequisites.md)。

**内存完整性**  
*内存完整性*，也称为*虚拟机监控程序保护的代码完整性（HVCI）*或*虚拟机监控程序强制执行的代码完整性*不受支持。在开启凭证保护之前，您必须确保禁用此功能。有关更多信息，请参阅 [禁用内存完整性](#disable-memory-integrity)。

**实例类型**  
除非另有说明，以下实例类型支持所有大小的凭证保护：`C5`、`C5d`、`C5n`、`C6i`、`C6id`、`C6in`、`C7i`、`C7i-flex`、`M5`、`M5d`、`M5dn`、`M5n`、`M5zn`、`M6i`、`M6id`、`M6idn`、`M6in`、`M7i`、`M7i-flex`、`R5`、`R5b`、`R5d`、`R5dn`、`R5n`、`R6i`、`R6id`、`R6idn`、`R6in`、`R7i`、`R7iz`、`T3`。  
+ 尽管 NitroTPM 包含某些共同的必需实例类型，但实例类型必须是上述实例类型之一才能支持凭证保护。
+ 不支持凭证保护的类型包括：
  + 裸机实例。
  + 以下实例类型：`C7i.48xlarge`、`M7i.48xlarge` 和 `R7i.48xlarge`。
有关实例类型的信息，请参阅《[Amazon EC2 用户指南](https://docs.aws.amazon.com/ec2/latest/instancetypes/instance-types.html)》中的实例类型。

## 启动受支持的实例
<a name="credential-guard-launch-instance"></a>

您可以使用 Amazon EC2 控制台或 AWS Command Line Interface（AWS CLI）来启动可支持凭证保护的实例。您需要兼容的 AMI ID 来启动实例，该实例对于每个 AWS 区域 都是唯一的。

**提示**  
您可以通过以下链接，在 Amazon EC2 控制台中使用 Amazon 提供的兼容 AMI 来发现和启动实例：  
[https://console.aws.amazon.com/ec2/v2/home?#Images:visibility=public-images;v=3;search=:TPM-Windows_Server;ownerAlias=amazon](https://console.aws.amazon.com/ec2/v2/home?#Images:visibility=public-images;v=3;search=:TPM-Windows_Server;ownerAlias=amazon)

------
#### [ Console ]

**启动实例**  
按照[启动实例](ec2-launch-instance-wizard.md)的步骤操作，指定受支持的实例类型和预配置的 Windows AMI。

------
#### [ AWS CLI ]

**启动实例**  
使用 [run-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/run-instances.html) 命令，启动使用受支持的实例类型和预配置的 Windows AMI 的实例。

```
aws ec2 run-instances \
    --image-id resolve:ssm:/aws/service/ami-windows-latest/{{TPM-Windows_Server-2022-English-Full-Base}} \
    --instance-type {{c6i.large}} \
    --region {{us-east-1}} \
    --subnet-id {{subnet-0abcdef1234567890}}
    --key-name {{key-name}}
```

------
#### [ PowerShell ]

**启动实例**  
使用 [New-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2Instance.html) 命令，启动使用受支持的实例类型和预配置的 Windows AMI 的实例。

```
New-EC2Instance `
    -ImageId resolve:ssm:/aws/service/ami-windows-latest/{{TPM-Windows_Server-2022-English-Full-Base}} `
    -InstanceType {{c6i.large}} `
    -Region {{us-east-1}} `
    -SubnetId {{subnet-0abcdef1234567890}} `
    -KeyName {{key-name}}
```

------

## 禁用内存完整性
<a name="disable-memory-integrity"></a>

在支持的场景中，您可以使用本地组策略编辑器禁用内存完整性。以下指导可以应用于**基于虚拟化的代码完整性保护**下的每个配置设置：
+ **启用（无锁定）**– 将设置修改为**禁用**以禁用内存完整性。
+ **使用 UEFI 锁定启用** – 已使用 UEFI 锁定启用内存完整性。使用 UEFI 锁定启用内存完整性后，将无法禁用该功能。我们建议创建一个禁用了内存完整性的新实例，并且在不使用该实例时将其终止。

**使用本地组策略编辑器禁用内存完整性**

1. 使用远程桌面协议（RDP），以具有管理员权限的用户账户身份连接到实例。有关更多信息，请参阅 [使用 RDP 客户端连接到 Windows 实例](connect-rdp.md)。

1. 打开“开始”菜单并搜索 **cmd** 以启动命令提示符。

1. 运行以下命令以打开本地组策略编辑器：`gpedit.msc`

1. 在本地组策略编辑器中，依次选择**计算机配置**、**管理模板**、**系统**、**设备保护**。

1. 选择**启用基于虚拟化的安全**，然后选择**编辑策略设置**。

1. 打开**基于虚拟化的代码完整性保护**的设置下拉列表，选择**禁用**，然后选择**应用**。

1. 重启实例以应用更改。

## 启用凭证保护
<a name="turn-on-credential-guard"></a>

启动具有受支持实例类型和兼容 AMI 的 Windows 实例并且确认内存完整性被禁用后，即可启用凭证保护。

**重要**  
需要管理员权限才能按照以下步骤启用凭证保护。

**启用凭证保护**

1. 使用远程桌面协议（RDP），以具有管理员权限的用户账户身份连接到实例。有关更多信息，请参阅 [使用 RDP 客户端连接到 Windows 实例](connect-rdp.md)。

1. 打开“开始”菜单并搜索 **cmd** 以启动命令提示符。

1. 运行以下命令以打开本地组策略编辑器：`gpedit.msc`

1. 在本地组策略编辑器中，依次选择**计算机配置**、**管理模板**、**系统**、**设备保护**。

1. 选择**启用基于虚拟化的安全**，然后选择**编辑策略设置**。

1. 在**启用基于虚拟化的安全**菜单中选择**启用**。

1. 对于**选择平台安全级别**，选择**安全启动和 DMA 保护**。

1. 对于**凭证保护配置**，选择**使用 UEFI 锁定启用**。
**注意**  
其余策略设置无需启用凭证保护，可以保留为**未配置**。

   下图显示了如前所述配置的 VBS 设置：  
![基于虚拟化的安全组策略对象设置（已启用“启用基于虚拟化的安全”）。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/vbs-credential-guard-gpo-enabled.png)

1. 重启实例以应用设置。

## 验证凭证保护是否正在运行
<a name="verify-credential-guard"></a>

您可以使用 Microsoft 系统信息 (`Msinfo32.exe`) 工具来确认凭证保护是否正在运行。

**重要**  
必须先重启实例才能应用启用凭证保护所需的策略设置。

**验证凭证保护是否正在运行**

1. 使用远程桌面协议（RDP）连接到实例。有关更多信息，请参阅 [使用 RDP 客户端连接到 Windows 实例](connect-rdp.md)。

1. 在实例的 RDP 会话中，打开“开始”菜单并搜索 **cmd** 以启动命令提示符。

1. 通过运行以下命令打开系统信息：`msinfo32.exe`

1. Microsoft 系统信息工具列出了 VBS 配置的详细信息。在基于虚拟化的安全服务旁边，确认**凭证保护**是否显示为**正在运行**。

   下图显示 VBS 正在运行，如前所述：  
![带有基于虚拟化的安全线的 Microsoft 系统信息工具图像，其中显示“正在运行”状态，可确认凭证保护正在运行。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/vbs-credential-guard-msinfo32-enabled.png)