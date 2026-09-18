

# Amazon EC2 Windows 实例上的 Windows 启动代理
<a name="configure-launch-agents"></a>

每个 AWS Windows AMI 都包含一个已预配置默认设置的 Windows 启动代理。启动代理在实例启动期间执行任务，并可在实例停止并稍后启动或重新启动时运行。有关特定代理的信息，请参阅以下列表中的详细信息页面。

有关 AWS Windows AMI 的更多信息，请参阅 [AWSWindows AMI 参考](https://docs.aws.amazon.com/ec2/latest/windows-ami-reference/windows-amis.html)。
+ [使用 EC2Launch v2 代理在 EC2 Windows 实例启动期间执行任务](ec2launch-v2.md)
+ [使用 EC2Launch v1 代理在 EC2 Windows 实例启动期间执行任务](ec2launch.md)
+ [使用 EC2Config 服务在 EC2 旧版 Windows 操作系统实例启动期间执行任务](ec2config-service.md)

**内容**
+ [比较 Amazon EC2 启动代理](#ec2launch-agent-compare)
+ [为 EC2 Windows 启动代理配置 DNS 后缀](launch-agents-set-dns.md)
+ [订阅 EC2 Windows 启动代理通知](launch-agents-subscribe-notifications.md)
+ [EC2Launch v2 和 EC2Config 代理的 Windows 服务管理](launch-agents-service-admin.md)

## 比较 Amazon EC2 启动代理
<a name="ec2launch-agent-compare"></a>

下表显示了 EC2Config、EC2Launch v1 和 EC2Launch v2 之间的主要功能差异。


| 功能 | EC2Config | EC2Launch v1 | EC2Launch v2 | 
| --- | --- | --- | --- | 
| Run as (运行方式) | Windows 服务 | PowerShell 脚本 | Windows 服务 | 
| 支持 | 仅限传统操作系统 | Windows Server 版本：+ 2016<br />+ 2019（LTSC 和 SAC） | Windows Server 版本：+ 2016<br />+ 2019（LTSC 和 SAC）<br />+ 2022<br />+ 2025 | 
| 配置文件 | XML | JSON | JSON/YAML | 
| 设置管理员用户名 | 否 | 否 | 是 | 
| 压缩后的用户数据 | 否 | 否 | 是 | 
| 本地用户数据录入到 AMI 上 | 否 | 否 | 是的，可配置 | 
| 用户数据中的任务配置 | 否 | 否 | 是 | 
| 可配置壁纸 | 否 | 否 | 是 | 
| 自定义任务运行顺序 | 否 | 否 | 是 | 
| 可配置任务 | 15 | 9 | 在启动时为 20 | 
| 支持 Windows 事件查看器 | 是 | 否 | 是 | 
| 事件查看器事件类型的数量 | 2 | 0 | 30 | 

**注意**  
EC2Config 文档仅供历史参考之用。Microsoft 不再支持它运行的操作系统版本。强烈建议升级到最新的启动服务。