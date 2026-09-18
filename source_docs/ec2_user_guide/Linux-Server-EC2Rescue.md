

# 使用 EC2Rescue 对受损的 Amazon EC2 Linux 实例进行问题排查
<a name="Linux-Server-EC2Rescue"></a>

EC2Rescue for Linux 是一种易于使用的开源工具，可在 Amazon EC2 Linux 实例上运行此工具以通过其包含 100 多个*模块*的库来诊断、排查和修复常见问题。模块是包含 BASH 或 Python 脚本以及必要元数据的 YAML 文件。

EC2Rescue for Linux 实例的一些通用使用案例包括：
+ 收集系统日志和软件包管理器日志
+ 收集资源利用率数据
+ 诊断和修复已知有问题的内核参数和常见 OpenSSH 问题

**注意**  
`AWSSupport-TroubleshootSSH` AWS Systems Manager Automation 运行手册安装了 EC2Rescue for Linux，然后使用该工具检查或尝试修复阻止 SSH 连接到 Linux 实例的常见问题。有关更多信息，请参阅 [AWSSupport-TroubleshootSSH](https://docs.aws.amazon.com/systems-manager-automation-runbooks/latest/userguide/automation-awssupport-troubleshootssh.html)。

如果您使用的是 Windows 实例，则请参阅 [使用 EC2Rescue 对受损的 Amazon EC2 Windows 实例进行问题排查](Windows-Server-EC2Rescue.md)。

**Topics**
+ [安装 EC2Rescue](ec2rl_install.md)
+ [运行 EC2Rescue 命令](ec2rl_working.md)
+ [开发 EC2Rescue 模块](ec2rl_moduledev.md)