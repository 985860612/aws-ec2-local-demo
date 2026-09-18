

# 自带软件许可证到 Amazon EC2 专属主机
<a name="dedicated-hosts-BYOL"></a>

专属主机允许使用现有的按插槽、按内核或按虚拟机软件的许可证。如果自带许可，您有责任管理自己的许可证。不过，Amazon EC2 具有一些帮助您保持许可证合规性的功能，例如实例关联和定向置放。

以下是将您自己的批量许可机器映像引入 Amazon EC2 所需执行的常规步骤。

1. 验证控制您的系统映像使用的许可证条款是否允许在虚拟化云环境中使用系统映像。有关 Microsoft 许可的更多信息，请参阅[亚马逊云科技和 Microsoft 许可](https://aws.amazon.com/windows/faq/#licensing)。

1. 在确认可在 Amazon EC2 中使用系统映像后，使用 VM Import/Export 导入该映像。有关如何导入系统映像的信息，请参阅 [VM Import/Export 用户指南](https://docs.aws.amazon.com/vm-import/latest/userguide/)。

1. 在导入系统映像后，可以在您的账户中的活动专属主机上从该映像中启动实例。

1. 在运行这些实例时，您可能需要针对自己的 KMS 服务器（例如，Windows Server 或 Windows SQL Server）激活这些实例，具体取决于操作系统。您无法针对 Amazon Windows KMS 服务器激活导入的 Windows AMI。

**注意**  
要跟踪您的映像在 AWS 中的使用方式，请在 AWS Config 中启用主机记录。您可以使用 AWS Config 来记录专属主机的配置更改并将输出用作许可证报告的数据来源。有关更多信息，请参阅 [使用 AWS Config 跟踪 Amazon EC2 专属主机配置更改](dedicated-hosts-aws-config.md)。