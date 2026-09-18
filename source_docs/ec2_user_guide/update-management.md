

# Amazon EC2 实例的更新管理
<a name="update-management"></a>

我们建议您定期修补、更新和保护 EC2 实例上的操作系统和应用程序。您可以使用 [AWS Systems Manager Patch Manager](https://docs.aws.amazon.com/systems-manager/latest/userguide/patch-manager.html) 自动执行为操作系统和应用程序安装安全相关更新的过程。

对于自动扩缩组中的 EC2 实例，您可以使用 [AWS-PatchAsgInstance](https://docs.aws.amazon.com/systems-manager-automation-runbooks/latest/userguide/automation-aws-patchasginstance.html) 运行手册以避免正在修补的实例被替换。或者，您也可以使用任何自动更新服务或建议的过程安装应用程序供应商提供的更新。

**资源**
+ **AL2023**：《Amazon Linux 2023 User Guide》**中的 [Updating AL2023](https://docs.aws.amazon.com/linux/al2023/ug/updating.html)
+ **AL2**：《Amazon Linux 2 User Guide》**中的 [Manage software on your Amazon Linux 2 instance](https://docs.aws.amazon.com/linux/al2/ug/managing-software.html)
+ **Windows 实例**：[更新管理](ec2-windows-security-best-practices.md#ec2-windows-update-management)