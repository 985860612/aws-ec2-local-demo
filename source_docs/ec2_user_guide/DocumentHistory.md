

# 《Amazon EC2 用户指南》的文档历史记录
<a name="DocumentHistory"></a>

下表描述《Amazon EC2 用户指南》的重要补充部分（2019 年开始）。我们还会频繁更新该指南，以处理您发送给我们的反馈意见。

| 变更 | 说明 | 日期 | 
| --- |--- |--- |
| [EC2 Fast Launch 的权限检查](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/win-fast-launch-configure.html#win-fast-launch-permissions) | 新增了有关使用启动模板启用 EC2 Fast Launch 时 Amazon EC2 如何验证权限的指导，包括使用 `$Latest` 或 `$Default` 启动模板版本的安全注意事项。 | 2026 年 8 月 14 日 | 
| [区域和区的地图视图](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/global-view.html) | AWS 全局视图中的“区域和区”页面现在包括一个地图视图，可在交互式世界地图上显示您的所有区域和区。您可以在列表视图和地图视图之间进行切换。您的视图偏好设置会在不同会话之间保留。 | 2026 年 8 月 12 日 | 
| [将当前根卷替换为现有的 EBS 卷](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/replace-root.html#replace-volume) | 您可以将 Amazon EC2 实例的当前根卷替换为您已经配置的现有 Amazon EBS 卷。 | 2026 年 7 月 9 日 | 
| [适用于“即时” EC2 实例集的附加启动模板覆盖参数](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/manage-ec2-fleet.html) | `instant` 类型的 EC2 实例集现在支持以下附加启动模板覆盖参数：`IamInstanceProfile`、`KeyName` 和 `MetadataOptions`。 | 2026 年 7 月 9 日 | 
| [查找公有 AMI 的 SSM 参数](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-systems-manager-parameter-to-find-AMI.html) | 您可以查找与某个公有 AMI 关联的 AWS Systems Manager 参数，然后使用该参数来自动引用该 AMI 的最新版本。 | 2026 年 7 月 7 日 | 
| [专属主机上的 SEV-SNP](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/sev-snp.html) | 专属主机现在支持 AMD SEV-SNP，使您能够在完全供您专用的物理服务器上运行机密计算工作负载。 | 2026 年 7 月 1 日 | 
| [AWS 全局视图](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/global-view.html) | EC2 全局视图现已更名为 AWS 全局视图。借助此功能，您可以在单个视图中查看所有区域的 EC2 资源以及其他受支持的 AWS 资源。 | 2026 年 6 月 30 日 | 
| [精确时间置放群组](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-strategies.html#placement-groups-precision-time) | 借助精准时间置放群组，您可以将实例放置到能够直接访问 AWS 基础设施中的高精度时间源的受支持硬件上。 | 2026 年 6 月 29 日 | 
| [在允许的 AMI 上使用水印](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ami-watermark.html) | 现在，您可以将 AMI 水印与[允许的 AMI](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-allowed-amis.html) 结合使用，从而限定只能使用符合指定水印筛选条件的 AMI 启动实例。新增的“允许的 AMI”参数为 `ImageWatermarks`，提供以下筛选条件：`MaximumDaysSinceSourceImageCreated`、`MaximumDaysSinceWatermarkCreated`、`SourceImageRegion` 和 `WatermarkKey`。 | 2026 年 6 月 22 日 | 
| [适用于 Windows 的 AWS VMClock 设备](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/other-windows-device-drivers.html) | AWS 提供了适用于 Windows 的空（无功能）驱动程序包，从让该操作系统能够识别设备。 | 2026 年 6 月 17 日 | 
| [AMI 水印](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ami-watermark.html) | 您可以使用 AMI 水印来跟踪您的私有 AMI 的来源并强制执行治理策略。当您从实例创建 AMI、复制 AMI 或与其他账户共享 AMI 时，水印会持久保留。 | 2026 年 6 月 10 日 | 
| [取消容量预留](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/capacity-reservations-release.html) | 您可以取消未来日期的容量预留。这可能会产生费用，具体取决于取消时间。 | 2026 年 6 月 2 日 | 
| [跨可用区 ENA Express 支持](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ena-express.html) | ENA Express 现在支持在同一区域内不同可用区中的 Amazon EC2 实例之间传输流量。 | 2026 年 5 月 11 日 | 
| [托管资源可见性](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/amazon-ec2-managed-instances.html#managed-resource-visibility-settings) | 您可以控制 AWS 服务代表您预置的资源是否显示在 Amazon EC2 控制台视图及 API 列表操作中。 | 2026 年 4 月 22 日 | 
| [开始使用 EFA 和 NIXL](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start-nixl.html) | 您可以将 Elastic Fabric Adapter（EFA）与 NIXL 结合使用，从而处理分解式推理工作负载。 | 2026 年 3 月 17 日 | 
| [教程：启动使用可中断容量预留的 EC2 实例集](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-fleet-launch-instances-interruptible-cr-walkthrough.html) | 新教程展示了如何创建使用可中断容量预留的 EC2 实例集，从而让可中断的工作负载能够使用未使用的预留容量。 | 2026 年 3 月 16 日 | 
| [本地区域中的容量块](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html) | 适用于 ML 的容量块功能现已在本地区域中开放。 | 2026 年 2 月 25 日 | 
| [IMDSv2 强制使用](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/configuring-IMDS-new-instances.html#enforce-imdsv2-at-the-account-level) | 可以在账户级别为每个 AWS 区域强制要求使用 IMDSv2。强制使用后，实例只有配置为必须使用 IMDSv2 时才能启动。 | 2026 年 2 月 24 日 | 
| [嵌套虚拟化](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/amazon-ec2-nested-virtualization.html) | 您可以在虚拟化的 Amazon EC2 实例内运行虚拟机管理程序，例如 Hyper-V 和 KVM。 | 2026 年 2 月 16 日 | 
| [辅助网络](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/secondary-networks.html) | 辅助网络是专为特殊网络使用案例构建的虚拟网络。您可以同时在 VPC 和辅助网络中启动精选的 EC2 实例。 | 2026 年 2 月 9 日 | 
| [容量块共享](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/capacity-blocks-share.html) | 您可以与 AWS 组织中的其他 AWS 账户共享 EC2 容量块。 | 2026 年 2 月 2 日 | 
| [可中断容量预留](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/interruptible-capacity-reservations.html) | 可中断容量预留可帮助您将未使用的容量临时用于您的账户中的其他工作负载。 | 2025 年 11 月 21 日 | 
| [P6-B300 实例的实例拓扑结构](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-topology.html) | 您可以获取 `p6-b300.48xlarge` 实例的实例拓扑结构信息。 | 2025 年 11 月 18 日 | 
| [AMI 世系](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ami-ancestry.html) | 现在，您可以通过获取所有原级 AMI 的列表来跟踪 AMI 的来源。 | 2025 年 11 月 12 日 | 
| [容量预留拓扑](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-topology.html) | 在启动实例之前，您可以使用 DescribeCapacityReservationTopology API 来描述您的预留容量在网络层次结构中相对于彼此的位置。 | 2025 年 10 月 28 日 | 
| [优化 CPU 以节省许可证费用](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/optimize-cpu.html) | 现在，您可以配置活动 CPU，以节省包含许可证的 Windows 和 SQL Server 实例的许可费用。 | 2025 年 10 月 15 日 | 
| [新的 EC2 Capacity Manager](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/capacity-manager.html) | Amazon EC2 新增了 EC2 Capacity Manager，通过它，您可以从一个位置监控、分析并管理您在按需型实例、竞价型实例和容量预留中所使用的容量。 | 2025 年 10 月 15 日 | 
| [AWSEC2CapacityManagerServiceRolePolicy：新托管策略](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/security-iam-awsmanpol.html#security-iam-awsmanpol-AWSEC2CapacityManagerServiceRolePolicy.html) | Amazon EC2 新增了 AWSEC2CapacityManagerServiceRolePolicy 托管策略，以便可以代表您管理容量资源并与 AWS Organizations 集成。 | 2025 年 10 月 15 日 | 
| [`GPUPowerUtilization` 指标](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/viewing_metrics_with_cloudwatch.html#accelerator-metrics) | 加速型计算实例的新 `GPUPowerUtilization` 指标。 | 2025 年 10 月 13 日 | 
| [EC2 Instance Connect 端点 IPv6 支持](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/connect-with-ec2-instance-connect-endpoint.html) | EC2 Instance Connect 端点现已支持 IPv6 连接。现在，您可以将 EC2 Instance Connect 端点配置为支持双堆栈或仅 IPv6，以连接到具有 IPv6 地址的实例。 | 2025 年 10 月 2 日 | 
| [允许的 AMI：新参数](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-allowed-amis.html) | 允许的 AMI 是一项允许您限制在自己 AWS 账户内发现和使用 AMI 的功能，现在支持四个新参数：AWS Marketplace 产品代码、AMI 名称、AMI 弃用后的最长期限以及 AMI 的最长使用期限。 | 2025 年 9 月 25 日 | 
| [实例存储卷的详细性能统计数据](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/nvme-detailed-performance-stats.html) | Amazon EC2 为连接到基于 Nitro 的实例的 NVMe 实例存储卷提供实时、高分辨率的性能统计数据。 | 2025 年 9 月 16 日 | 
| [Amazon EC2 Mac 专属主机更新](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-mac-instances.html) | Amazon EC2 Mac 专属主机支持专属主机自动恢复和基于重启的主机维护。 | 2025 年 8 月 28 日 | 
| [Local Zones 的 AMI 副本](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/CopyingAMIs.html) | 您现在可以将 Amazon EBS-backed AMI 复制到 Local Zones 或从 Local Zones 复制 Amazon EBS-backed AMI。 | 2025 年 8 月 28 日 | 
| [AmazonEC2ImageReferencesAccessPolicy – 新的托管策略](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/security-iam-awsmanpol.html#security-iam-awsmanpol-AmazonEC2ImageReferencesAccessPolicy.html) | Amazon EC2 添加了 AmazonEC2ImageReferencesAccessPolicy 托管策略，以提供扫描 EC2 DescribeImageReferences API 支持的所有资源类型的权限。 | 2025 年 8 月 26 日 | 
| [AMI 使用情况报告](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/your-ec2-ami-usage.html) | 如果与其他 AWS 账户共享亚马逊机器映像（AMI）（无论是与特定 AWS 账户、组织、组织单元（OU）还是公开），可以通过创建 AMI 使用情况报告来了解这些 AMI 的使用情况。通过报告，您可以了解哪些 AWS 账户正在 EC2 实例或启动模板中使用 AMI，以及有多少个实例或启动模板正在引用每个 AMI。 | 2025 年 8 月 26 日 | 
| [AMI 引用](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-ami-references.html) | 您可以识别引用指定亚马逊机器映像（AMI）的 AWS 资源，无论 AMI 是公共的还是私有的，也无论它们的所有者是谁。这种可见性可帮助您确保资源使用最新的合规 AMI。 | 2025 年 8 月 26 日 | 
| [修改 EC2 Instance Connect Endpoint](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/modify-ec2-instance-connect-endpoint.html) | 您现在可使用 AWS CLI 或 SDK 修改现有 EC2 Instance Connect Endpoint。 | 2025 年 8 月 14 日 | 
| [容量预留共享增强功](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/cr-cpg.html) | 您现在可以共享在集群置放群组中创建的容量预留。 | 2025 年 8 月 12 日 | 
| [EC2 Instance Connect Endpoint 的更新托管式策略](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/security-iam-awsmanpol.html#Ec2InstanceConnectEndpoint) | 为了支持修改现有 EC2 Instance Connect Endpoint，Amazon EC2 更新了 `Ec2InstanceConnectEndpoint` 策略，以添加分配和取消分配 IPv6 地址的权限，并修改 EC2 实例连接端点创建的网络接口上的安全组。Amazon EC2 还更新了此策略，用 `StringLike` 条件运算符替换了 `Null` 条件运算符。 | 2025 年 7 月 31 日 | 
| [实例拓扑 - 增加的区域支持](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-topology-prerequisites.html) | DescribeInstanceTopology API 现已在亚太地区（墨尔本）推出。 | 2025 年 7 月 31 日 | 
| [强制终止](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-terminate-methods.html) | 现在，您可以强制终止实例。 | 2025 年 7 月 31 日 | 
| [实例拓扑 - 增加的区域支持](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-topology-prerequisites.html) | DescribeInstanceTopology API 现已在 AWS GovCloud (US-West) 推出。 | 2025 年 7 月 24 日 | 
| [在实例终止期间跳过操作系统关闭](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-terminate-methods.html) | 终止实例时，您可以跳过操作系统 (OS) 的正常关闭。 | 2025 年 7 月 23 日 | 
| [在实例停止期间跳过操作系统关闭](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-stop-methods.html) | 停止实例时，您可以跳过操作系统 (OS) 的正常关闭。 | 2025 年 7 月 23 日 | 
| [us-east-1 中的 P6-B200 容量块](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/capacity-blocks-prerequisites.html) | 现已在美国东部（弗吉尼亚州北部）- `us-east-1` 中提供 P6-B200 容量块。 | 2025 年 7 月 23 日 | 
| [更新了 EC2 Fast Launch 服务相关角色的托管式策略](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/security-iam-awsmanpol.html#security-iam-awsmanpol-EC2FastLaunchServiceRolePolicy) | 为了防止出现孤立资源，Amazon EC2 对此策略进行了更新，增加了描述卷、卷属性和网络接口的权限，并增加了删除 EC2 Fast Launch 创建的卷和网络接口的权限。 | 2025 年 7 月 17 日 | 
| [EC2 Serial Console - 增加的区域支持](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-serial-console-prerequisites.html) | 目前在亚太地区（泰国）和墨西哥（中部）也提供了 EC2 Serial Console。 | 2025 年 7 月 15 日 | 
| [EC2 Instance Connect - 增加的区域支持](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/connect-linux-inst-eic.html) | 目前在亚太地区（泰国）和墨西哥（中部）也提供了 EC2 Instance Connect。 | 2025 年 7 月 15 日 | 
| [硬件数据包时间戳](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/set-time.html#hardware-packet-timestamping) | 您可以在 EC2 实例上启用硬件数据包时间戳，为每个传入的网络数据包添加 64 位纳秒精度的时间戳。 | 2025 年 6 月 23 日 | 
| [在 AMI 注销过程中删除快照](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/deregister-ami.html) | 注销 AMI 时，您可以同时自动删除其关联的快照。 | 2025 年 5 月 28 日 | 
| [用户发起的重启迁移](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/schedevents_actions_reboot.html#reboot-migration) | 如果实例收到 EC2 计划重启事件通知，则系统会在您于该事件到来前重启实例时，默认启用实例迁移。 | 2025 年 5 月 20 日 | 
| [Amazon EC2 Mac 实例的 SIP 配置](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/mac-sip-settings.html) | 您可以为采用 x86 架构的 Mac 实例和搭载 Apple 芯片的 Mac 实例配置系统完整性保护（SIP）设置。 | 2025 年 5 月 20 日 | 
| [根卷所有权委托](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/mac-instance-updates.html) | 您现在可以在搭载 Apple 芯片的 Mac 实例上更新操作系统时，自动委托 Amazon EBS 根卷的根卷所有权。 | 2025 年 5 月 20 日 | 
| [P6-B200 实例的实例拓扑结构](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-topology.html) | 您可以获取 `p6-b200.48xlarge` 实例的实例拓扑结构信息。 | 2025 年 5 月 15 日 | 
| [更新了 EC2 Fast Launch 服务相关角色的托管式策略](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/security-iam-awsmanpol.html#security-iam-awsmanpol-EC2FastLaunchServiceRolePolicy) | 更新了 EC2 Fast Launch 服务相关角色策略，包含了创建和维护 Amazon EventBridge 事件规则以及其他操作的访问权限，以增强 EC2 Fast Launch 体验。有关服务相关角色所授予权限的更多信息，请参阅 [`EC2FastLaunchServiceRolePolicy` 授予的权限](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/slr-windows-fast-launch.html#slr-permissions-granted-win-faster-launching)。 | 2025 年 5 月 14 日 | 
| [更新了 EC2 Fast Launch 完全访问策略的托管式策略](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/security-iam-awsmanpol.html#security-iam-awsmanpol-EC2FastLaunchFullAccess) | 更新了 EC2 Fast Launch 完全访问策略，包含了启动模板创建和修改操作的权限，以及创建网络和安全组资源、授权入口规则以及删除 EC2 Fast Launch 所创建资源的权限。此外，此策略还可以描述和创建 CloudFormation 堆栈，以及删除 EC2 Fast Launch 创建的堆栈。 | 2025 年 5 月 14 日 | 
| [简化了 EC2 Fast Launch 的启用过程](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/win-start-fast-launch-prereqs.html) | 更新了 EC2 Fast Launch 以简化启用过程。 | 2025 年 5 月 14 日 | 
| [AWS Config 与允许的 AMI 集成](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-allowed-amis.html#identify-instances-with-allowed-AMIs) | 使用 [ec2-instance-launched-with-allowed-ami](https://docs.aws.amazon.com/config/latest/developerguide/ec2-instance-launched-with-allowed-ami.html) AWS Config 规则来检查正在运行或已停止的实例是否使用符合“允许的 AMI”标准的 AMI 启动。 | 2025 年 3 月 11 日 | 
| [更新了 AWSEC2CapacityReservationFleetRolePolicy 托管式策略](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/security-iam-awsmanpol.html#security-iam-awsmanpol-AWSEC2CapacityReservationFleetRolePolicy) | Amazon EC2 更新了 `AWSEC2CapacityReservationFleetRolePolicy` 托管式策略，使用 `ArnLike` 条件运算符，而不是 `StringLike` 条件运算符。 | 2025 年 3 月 3 日 | 
| [基于时间的 AMI 复制](https://docs.aws.amazon.com/ebs/latest/userguide/time-based-copies.html) | 现在，您可以请求为 EBS 支持的 AMI 复制操作设置完成期限，以确保在特定的时间期限内完成 AMI 复制。 | 2025 年 2 月 25 日 | 
| [更新了 AmazonEC2ReadOnlyAccess 策略](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/security-iam-awsmanpol.html#security-iam-awsmanpol-AmazonEC2ReadOnlyAccess) | Amazon EC2 将 `GetSecurityGroupsForVpc` 操作添加到现有的 AmazonEC2ReadOnlyAccess 策略中。 | 2024 年 12 月 27 日 | 
| [托管式实例](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/amazon-ec2-managed-instances.html) | 现在，您可以在 EC2 控制台中查看 Amazon EC2 托管实例。 | 2024 年 12 月 1 日 | 
| [声明式策略](#DocumentHistory) | 现在，您可以使用声明式策略将账户级别设置同时应用于多个区域和账户。支持使用声明式策略配置 EC2 Serial Console 访问权限、允许的 AMI、IMDS 默认值以及 VPC、AMI 和快照的屏蔽公共访问权限设置。有关更多信息，请参阅《AWS Organizations User Guide》**中的 [Declarative policies](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_declarative.html) 以及每项支持功能的具体文档。 | 2024 年 12 月 1 日 | 
| [允许的 AMI](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-allowed-amis.html) | 现在，您可以通过指定 AMI 必须满足的标准来控制 Amazon EC2 中对 AMI 的发现和使用。 | 2024 年 12 月 1 日 | 
| [即时容量块](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html) | 您现在可以为 ML 预留容量块，可在 30 分钟内开始。 | 2024 年 11 月 21 日 | 
| [未来日期的容量预留](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-reservations.html) | 您现在可以请求未来某个日期的容量预留。 | 2024 年 11 月 21 日 | 
| [延长容量块期限](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/capacity-blocks-extend.html) | 现在，您可以延长现有容量块的持续时间。 | 2024 年 11 月 21 日 | 
| [6 个月容量块](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html) | 您现在可以为 ML 预留容量块长达 6 个月（182 天）。 | 2024 年 11 月 21 日 | 
| [已保存的筛选条件集](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/Using_Filtering.html#saved-filter-sets-in-the-ec2-console) | 您现在可以创建自定义的筛选条件组，并重复使用它们来有效地查看 EC2 资源。 | 2024 年 11 月 20 日 | 
| [性能保护](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-fleet-attribute-based-instance-type-selection.html#ec2fleet-abis-performance-protection) | 当您对 EC2 实例集或竞价型实例集使用基于属性的实例类型选择时，现在可以启用性能保护，以确保所选实例类型类似于或超过指定的性能基准。 | 2024 年 11 月 20 日 | 
| [仅容量预留](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-reservations.html) | 您现在可以指定实例仅在容量预留或容量预留资源组中运行。 | 2024 年 11 月 20 日 | 
| [识别源 AMI](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ami-ancestry.html#identify-source-ami-used-to-create-new-ami) | 您现在可以识别用于创建 AMI 的源 AMI。 | 2024 年 11 月 13 日 | 
| [拆分容量](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/capacity-reservations-split.html) | 您可以从现有容量预留中拆分容量来创建新的预留。 | 2024 年 10 月 30 日 | 
| [移动容量](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/capacity-reservations-move.html) | 您现在可以将容量从一个容量预留移动到另一个容量预留。 | 2024 年 10 月 30 日 | 
| [初学者教程](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-launch-tutorials.html) | 新推出两个面向初学者的教程：“启动我的第一个 EC2 实例”和“启动测试 EC2 实例并连接到实例”。 | 2024 年 10 月 21 日 | 
| [Windows Server 2025 支持](#DocumentHistory) | 添加了对 Windows Server 2025 的支持。 | 2024 年 10 月 16 日 | 
| [EC2 全局视图](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/global-view.html) | 现在，您可以通过 EC2 全局视图来查看账户中所有区域的容量预留和容量块。 | 2024 年 10 月 16 日 | 
| [实时迁移主机维护](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/dedicated-hosts-maintenance.html) | Amazon EC2 专属主机现在支持实时迁移主机维护。此功能会自动将受支持的实例从受损的专属主机迁移到替代专属主机，而无需停止和重新启动实例。 | 2024 年 10 月 15 日 | 
| [共享容量预留的账单分配](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/assign-billing.html) | 现在，您可以将共享容量预留中任何可用容量的账单分配给属于同一 AWS 组织的使用者账户。 | 2024 年 10 月 14 日 | 
| [PTP 硬件时钟 – 新增区域支持](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/configure-ec2-ntp.html#connect-to-the-ptp-hardware-clock) | PTP 硬件时钟现已在美国东部（俄亥俄州）和亚太地区（马来西亚）区域推出。 | 2024 年 9 月 23 日 | 
| [EC2 Instance Connect 支持 IPv6](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/connect-linux-inst-eic.html) | 您现在可以使用 EC2 Instance Connect 连接到实例的gong'you公有 IPv6 地址。 | 2024 年 9 月 23 日 | 
| [EC2 Instance Connect 前缀列表](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-connect-prerequisites.html#ec2-instance-connect-setup-security-group) | 您现在可以在安全组中创建规则时选择 IPv4 或 IPv6 地址的托管前缀列表，从而允许来自 EC2 Instance Connect 服务的 SSH 流量。 | 2024 年 9 月 23 日 | 
| [管理按需容量预留的新功能](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/capacity-reservations-split.html) | 现在，您可以拆分容量预留，在容量预留之间移动容量，以及修改容量预留的实例资格属性。 | 2024 年 8 月 14 日 | 
| [适用于 C6g、C6gn、C6gd、C7g、C7gd、M6g、M6gd、M7g、M7gd、R6g 和 R6gd 的休眠支持](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/hibernating-prerequisites.html#hibernation-prereqs-supported-instance-families) | 休眠在 C6g、C6gn、C6gd、C7g、C7gd、M6g、M6gd、M7g、M7gd、R6g 和 R6gd 实例类型上运行的新启动实例。 | 2024 年 7 月 30 日 | 
| [为支持 Graviton 实例类型的 AMI 提供休眠支持](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/hibernating-prerequisites.html#hibernation-prereqs-supported-amis) | 休眠从支持 Graviton 实例类型的 Amazon Linux 或 Ubuntu AMI 启动的新启动实例。 | 2024 年 7 月 30 日 | 
| [凭证保护支持的其他实例类型](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/credential-guard.html) | 您现在可以为 C7i、C7-flex、M7i、M7i-flex、R7i、R7i-flex 和 T3 实例启用凭证保护。 | 2024 年 6 月 26 日 | 
| [EC2 实例类型查找器 - 其他参数](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/get-ec2-instance-type-recommendations.html) | EC2 实例类型查找器现在提供了其他参数供您为工作负载指定更详细的要求。 | 2024 年 6 月 5 日 | 
| [适用于 EC2 Fast Launch 的新托管策略](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/security-iam-awsmanpol.html#security-iam-awsmanpol-EC2FastLaunchFullAccess) | 添加了 EC2FastLaunchFullAccess 策略，以便在实例中执行与 EC2 Fast Launch 功能相关的 API 操作。 | 2024 年 5 月 14 日 | 
| [AMI 注销保护](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/deregister-ami.html#ami-deregistration-protection) | 您可以在 AMI 上开启注销保护，以防止意外或恶意删除。 | 2024 年 4 月 23 日 | 
| [PTP 硬件时钟 – 实例类型支持](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/set-time.html#connect-to-the-ptp-hardware-clock) | PTP 硬件时钟现已在 M7a、M7g、M7i、R7a 和 R7i 实例类型上推出。 | 2024 年 4 月 22 日 | 
| [添加了用于增强联网的 Nitro 性能注意事项](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ena-nitro-perf.html) | 本页重点介绍网络注意事项，以帮助调整基于 Nitro 的 Amazon EC2 实例的性能。 | 2024 年 4 月 4 日 | 
| [基于 VSS 的 EBS 快照的新托管策略](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/security-iam-awsmanpol.html#security-iam-awsmanpol-AWSEC2VssSnapshotPolicy) | Amazon EC2 VSS 提供了一种新的 IAM 托管策略，您可以将其添加到您的实例配置文件角色中，以确保您的权限保持最新并遵循最佳实践。 | 2024 年 3 月 28 日 | 
| [PTP 硬件时钟 – 美国东部（弗吉尼亚州北部）](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/set-time.html#connect-to-the-ptp-hardware-clock) | PTP 硬件时钟现已在美国东部（弗吉尼亚州北部）区域推出。 | 2024 年 3 月 26 日 | 
| [将 IMDSv2 设置为账户默认设置](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/configuring-IMDS-new-instances.html#set-imdsv2-account-defaults) | 可将账户中启动的所有新 EC2 实例设置为默认使用实例元数据服务版本 2（IMDSv2）。 | 2024 年 3 月 25 日 | 
| [标记从快照创建的新的 Linux AMI](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/creating-an-ami-ebs.html#creating-launching-ami-from-snapshot) | 从快照创建 Linux AMI 时，您可以标记新的 AMI。 | 2024 年 3 月 7 日 | 
| [复制时标记新的 AMI 和快照](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/CopyingAMIs.html) | 复制 AMI 时，您可以使用相同的标签来标记新的 AMI 和新的快照，也可以使用不同的标签来标记它们。 | 2024 年 3 月 7 日 | 
| [移除 AWS Management Pack 页面](#DocumentHistory) | AWS Management Pack 主要搭配 Windows Server 2012 及更早版本使用。旧版操作系统平台版本已不再受支持。要管理在 AWS 上和本地运行的服务器实例集并对其进行故障排除，请参阅 [AWS Systems Manager Fleet Manager](https://aws.amazon.com/systems-manager/fleet-manager/)。 | 2024 年 2 月 12 日 | 
| [预装在 macOS AMI 上的 EC2 Instance Connect](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-connect-prerequisites.html#eic-prereqs-amis) | EC2 Instance Connect 现在已预装在 macOS Sonoma 14.2.1 或更高版本、macOS Ventura 13.6.3 或更高版本，以及 macOS Monterey 12.7.2 或更高版本的 AMI 上。 | 2024 年 1 月 26 日 | 
| [CentOS、macOS 和 RHEL 上的 EC2 Instance Connect 支持](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-connect-set-up.html) | 现在可在受支持的 CentOS、macOS 和 RHEL AMI 上安装 EC2 Instance Connect。 | 2023 年 12 月 6 日 | 
| [对 C7a、C7i、R7a、R7i 和 R7iz 的休眠支持](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/hibernating-prerequisites.html#hibernation-prereqs-supported-instance-families) | 休眠新启动并在 C7a、C7i、R7a、R7i 和 R7iz 实例类型上运行的实例。 | 2023 年 12 月 1 日 | 
| [Amazon Q EC2 实例类型选择器](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/get-ec2-instance-type-recommendations.html) | Amazon Q EC2 实例类型选择器会考虑您的使用案例、工作负载类型和 CPU 制造商偏好，以及您优先考虑价格还是性能。随后，它利用这些数据提供有关最适合新工作负载的 Amazon EC2 实例类型的指导和建议。 | 2023 年 11 月 28 日 | 
| [EC2 免费套餐](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-free-tier-usage.html) | 您可以从 EC2 控制面板中跟踪您的 EC2 免费套餐使用情况。 | 2023 年 11 月 26 日 | 
| [Console-to-Code](https://docs.aws.amazon.com/ec2/latest/devguide/console-to-code.html) | Console-to-Code 可以帮助您开始使用自动化代码。Console-to-Code 会记录您的控制台操作，然后利用生成式人工智能，以您首选的基础设施即代码格式提供代码建议。您可以将此代码用作一个起点，并对其进行自定义，以使它可用于您的特定使用案例的生产。 | 2023 年 11 月 26 日 | 
| [可配置的空闲连接跟踪超时](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/security-group-connection-tracking.html#connection-tracking-timeouts) | 保持空闲状态的安全组连接可能导致连接跟踪耗尽，并导致无法跟踪连接和丢弃数据包。现在，您可以在弹性网络接口上设置安全组连接跟踪的超时时间（以秒为单位）。 | 2023 年 11 月 17 日 | 
| [PTP 硬件时钟](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/set-time.html#connect-to-the-ptp-hardware-clock) | 支持的实例现在具有精确时间协议（PTP）硬件时钟。PTP 硬件时钟支持 NTP 连接或直接 PTP 连接。 | 2023 年 11 月 16 日 | 
| [更改已启用休眠的实例的实例类型](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-hibernate-overview.html) | 您现在可以更改处于 `stopped` 状态时已启用休眠的实例的实例类型。 | 2023 年 11 月 16 日 | 
| [实例拓扑](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-topology.html) | 您可以使用 DescribeInstanceTopology API 来检测您实例的位置，然后使用此信息通过在物理上彼此更靠近的实例上运行 HPC 和 ML 作业来优化 HPC 和 ML 作业。 | 2023 年 11 月 13 日 | 
| [EC2 Fast Launch 共享 AMI 支持](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/win-ami-config-fast-launch.html) | 现在，您可以在与您共享的 AMI 上启用 EC2 Fast Launch。在共享 AMI 上启用 EC2 Fast Launch 时，将在您的账户中创建用于加快启动速度的预置快照。 | 2023 年 11 月 6 日 | 
| [适用于 ML 的容量块](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html) | 您现在可以在未来某个日期预留 GPU 实例，从而支持您的短期机器学习（ML）工作负载。 | 2023 年 10 月 31 日 | 
| [竞价型实例休眠](#DocumentHistory) | 现在，您可以使用当前可用于按需型实例的相同休眠体验和实例系列来让竞价型实例休眠。 | 2023 年 10 月 24 日 | 
| [阻止公开访问 AMI 的默认设置](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/sharingamis-intro.html#block-public-access-to-amis-default-settings) | 现在，所有新账户和没有公有 AMI 的现有账户将默认启用阻止公开访问 AMI。 | 2023 年 10 月 20 日 | 
| [Amazon EC2 全局视图](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/global-view.html) | Amazon EC2 全局视图支持其他资源类型和可自定义的显示选项。 | 2023 年 10 月 18 日 | 
| [对 Ubuntu 22.04.2 LTS（Jammy Jellyfish）的休眠支持](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/hibernating-prerequisites.html#hibernation-prereqs-supported-amis) | 休眠从 Ubuntu 22.04.2 LTS（Jammy Jellyfish）AMI 启动的新启动实例。 | 2023 年 10 月 16 日 | 
| [禁用 AMI](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/disable-an-ami.html) | 您可以禁用 AMI，以防止系统将其用于实例启动。 | 2023 年 10 月 12 日 | 
| [附加的 EBS 状态检查](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/monitoring-system-instance-status-check.html#attached-ebs-status-checks) | 您可以使用附加的 EBS 状态检查来监控附加到实例的 Amazon EBS 卷是否可以访问。 | 2023 年 10 月 11 日 | 
| [Red Hat Enterprise Linux 9 休眠支持](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/hibernating-prerequisites.html#hibernation-prereqs-supported-amis) | 休眠从 Red Hat Enterprise Linux 9 AMI 启动的新启动实例。 | 2023 年 10 月 2 日 | 
| [Microsoft Windows Server 2022 休眠支持](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/hibernating-prerequisites.html#hibernation-prereqs-supported-amis) | 休眠从 Microsoft Windows Server 2022 AMI 启动的新启动实例。 | 2023 年 10 月 2 日 | 
| [对 AL2023 的休眠支持](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/hibernating-prerequisites.html#hibernation-prereqs-supported-amis) | 休眠从 AL2023 AMI 启动的新启动实例。 | 2023 年 10 月 2 日 | 
| [启动竞价型实例集中竞价型实例的中断](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/initiate-a-spot-instance-interruption.html) | 您可以在 Amazon EC2 控制台中选择一个竞价型实例集并启动实例集中竞价型实例的中断，从而测试竞价型实例上的应用程序将如何处理中断。 | 2023 年 9 月 21 日 | 
| [阻止公开访问 AMI](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/sharingamis-intro.html#block-public-access-to-amis) | 您可以在账户级别启用*阻止公开访问 AMI*，以阻止任何公开您的 AMI 的尝试。 | 2023 年 9 月 12 日 | 
| [对 M7i 和 M7i-flex 的休眠支持](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/hibernating-prerequisites.html#hibernation-prereqs-supported-instance-families) | 使 M7i 和 M7i-flex 实例类型上运行的新启动实例休眠。 | 2023 年 8 月 22 日 | 
| [EC2-Classic 已弃用](#DocumentHistory) | 通过使用 EC2-Classic，EC2 实例会在一个可与其他客户共享的扁平化网络中运行。Amazon VPC 将替代 EC2-Classic。通过使用 Amazon VPC，您的实例会在一个逻辑上与 AWS 账户分离的虚拟私有云（VPC）中运行。 | 2023 年 8 月 8 日 | 
| [专属主机](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/dh-outposts.html) | 您可以在 Outpost 上的特定硬件资产上分配专属主机。 | 2023 年 6 月 20 日 | 
| [EC2 Instance Connect Endpoint](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/connect-with-ec2-instance-connect-endpoint.html) | 现在，您可以通过 SSH 或 RDP 连接到实例，而无需实例具有公有 IPv4 地址。 | 2023 年 6 月 13 日 | 
| [IMDS Package Analyzer](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/configuring-instance-metadata-service.html#instance-metadata-transition-to-version-2) | 现在，您可以使用 IMDS Packet Analyzer 在 EC2 实例上识别 IMDSv1 调用的源。 | 2023 年 6 月 1 日 | 
| [EC2 Serial Console 裸机实例](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-serial-console-prerequisites.html#sc-prereqs-instance-types) | EC2 Serial Console 现在支持连接到选定裸机实例的串行端口。 | 2023 年 4 月 11 日 | 
| [启动模板配额](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/launch-template-restrictions.html) | 现在，您可以在服务限额控制台中使用服务限额 CLI 查看启动模板和启动模板版本的配额。 | 2023 年 4 月 3 日 | 
| [容量预留利用率通知](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/monitor-cr-utilization.html) | AWS Health现在，当您的账户中容量预留的容量利用率降至 20% 以下时， 会发送通知。 | 2023 年 4 月 3 日 | 
| [容量预留组](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/create-cr-group.html) | 现在，您可以将与您共享的容量预留添加到您拥有的容量预留组。 | 2023 年 3 月 30 日 | 
| [修改实例元数据选项](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/configuring-IMDS-existing-instances.html) | 现在，您可以使用 Amazon EC2 控制台修改实例元数据选项。 | 2023 年 3 月 20 日 | 
| [就地 macOS 操作系统更新](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-mac-instances.html#mac2) | 现在，您可以在 M1 Mac 实例上执行就地 Apple macOS 操作系统更新。 | 2023 年 3 月 14 日 | 
| [UEFI Preferred](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/set-ami-boot-mode.html) | 现在，您可以创建同时支持统一可扩展固件接口（UEFI）和传统 BIOS 启动模式的单个 AMI。 | 2023 年 3 月 3 日 | 
| [修改 IMDSv2 的 AMI](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/configuring-IMDS-new-instances.html#configure-IMDS-new-instances-ami-configuration) | 修改现有 AMI，以确保从此 AMI 启动的实例默认要求使用 IMDSv2。 | 2023 年 2 月 28 日 | 
| [基于 Windows 虚拟化的安全 – 凭证保护](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/credential-guard.html) | 您可以在受支持的 Amazon EC2 实例上启用凭证保护，这是一项基于虚拟化的安全（VBS）功能。 | 2023 年 1 月 31 日 | 
| [EC2 Instance Connect Endpoint 的新托管式策略](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/security-iam-awsmanpol.html#Ec2InstanceConnectEndpoint) | 添加了 `Ec2InstanceConnectEndpoint` 策略，该策略附加到 **AWSServiceRoleForEC2InstanceConnect** 服务相关角色，以允许 Amazon EC2 在您创建 EC2 Instance Connect Endpoint 时代表您执行操作。 | 2023 年 1 月 24 日 | 
| [启动模板中的 AMI 别名](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/create-launch-template.html#use-an-ssm-parameter-instead-of-an-ami-id) | 您可以在启动模板中指定 AWS Systems Manager 参数而不是 AMI ID，从而无需每次 AMI ID 发生更改时都更新模板。 | 2023 年 1 月 19 日 | 
| [对 C6i、I3en 和 M6i 的休眠支持](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/hibernating-prerequisites.html#hibernation-prereqs-supported-instance-families) | 使 C6i、I3en 和 M6i 实例类型上运行的新启动实例休眠。 | 2022 年 12 月 19 日 | 
| [撕裂写防护](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/storage-twp.html) | 借助撕裂写防护这一数据块存储功能，可提高 I/O 密集型关系数据库工作负载的性能并减少延迟，而不会影响数据弹性。 | 2022 年 11 月 29 日 | 
| [ENA Express](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ena-express.html) | 使用 ENA Express 提高吞吐量并最大限度减少 EC2 实例之间网络流量的尾部延迟。 | 2022 年 11 月 28 日 | 
| [复制 AMI 标签](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/CopyingAMIs.html#ami-copy-steps) | 复制 AMI 时，可以同时复制用户定义的 AMI 标签。 | 2022 年 11 月 18 日 | 
| [用于存储和还原的 AMI 大小](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ami-store-restore.html#limitations) | 可在 Amazon S3 存储桶之间存储和还原的 AMI 大小（压缩前）现可高达 5000 GB。 | 2022 年 11 月 16 日 | 
| [竞价型实例的 priceCapacityOptimized 分配策略](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-fleet-allocation-strategy.html) | 使用 `priceCapacityOptimized` 分配策略的竞价型实例集需同时考虑价格和容量，以选择中断可能性最小、价格尽可能最低的竞价型实例池。 | 2022 年 11 月 10 日 | 
| [竞价型实例的 price-capacity-optimized 分配策略](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-fleet-allocation-strategy.html) | 使用 `price-capacity-optimized` 分配策略的 EC2 实例集需同时考虑价格和容量，以选择中断可能性最小、价格尽可能最低的竞价型实例池。 | 2022 年 11 月 10 日 | 
| [取消与您的账户共享 AMI](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/cancel-sharing-an-AMI.html) | 如果已与您的 AWS 账户 共享 AMI，而您不想再与您的账户共享该 AMI，则可以将您的账户从 AMI 的启动权限中移除。 | 2022 年 11 月 4 日 | 
| [转移弹性 IP 地址](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/elastic-ip-addresses-eip.html#transfer-EIPs-intro-ec2) | 您现在可以将弹性 IP 地址从一个 AWS 账户转移到另一个。 | 2022 年 10 月 31 日 | 
| [替换根卷](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/replace-root.html) | 您可以使用 AMI 替换正在运行的实例的根 Amazon EBS 卷。 | 2022 年 10 月 27 日 | 
| [自动将实例连接到数据库](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/tutorial-connect-ec2-instance-to-rds-database.html) | 使用自动连接功能将一个或多个 EC2 实例快速连接到一个 RDS 数据库，以允许它们之间的流量。 | 2022 年 10 月 10 日 | 
| [AMI 限额](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ami-quotas.html) | 限额现在适用于创建和共享 AMI。 | 2022 年 10 月 10 日 | 
| [为 AMI 配置 IMDSv2](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/configuring-IMDS-new-instances.html#configure-IMDS-new-instances-ami-configuration) | 配置您的 AMI，以确保从此 AMI 启动的实例默认要求使用 IMDSv2。 | 2022 年 10 月 3 日 | 
| [启动竞价型实例中断](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/initiate-a-spot-instance-interruption.html) | 您可以在 Amazon EC2 控制台中选择一个竞价型实例并启动中断，从而测试竞价型实例上的应用程序将如何处理中断。 | 2022 年 9 月 26 日 | 
| [经过验证的 AMI 提供商](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/sharing-amis.html#verified-ami-provider) | 在 Amazon EC2 控制台中，将 Amazon 或经过验证的 Amazon 合作伙伴拥有的公有 AMI 标记为**经过验证的提供商**。 | 2022 年 7 月 22 日 | 
| [ 上的置放群组AWS Outposts](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-groups-outpost.html) | 增加了适用于 Outpost 上的置放群组的主机分布策略。 | 2022 年 6 月 30 日 | 
| [ 上的专属主机AWS Outposts](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/dh-outposts.html) | 您可以在 AWS Outposts 上分配专属主机。 | 2022 年 5 月 31 日 | 
| [实例停止保护](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-stop-protection.html) | 要防止实例意外停止，可以为实例启用停止保护。 | 2022 年 5 月 24 日 | 
| [UEFI 安全引导](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/uefi-secure-boot.html) | UEFI 安全引导构建在 Amazon EC2 长期以来的安全启动过程之上，并提供了额外的深度防御功能，可以帮助客户保护软件免受重新引导过程中持续存在的威胁。 | 2022 年 5 月 10 日 | 
| [NitroTPM](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/nitrotpm.html) | Nitro 可信平台模块 (NitroTPM) 是一种虚拟设备，由 AWS Nitro 系统提供，并符合 TPM 2.0 规范。 | 2022 年 5 月 10 日 | 
| [AMI 状态更改事件](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/monitor-ami-events.html) | 现在，当 AMI 更改状态时，Amazon EC2 会生成一个事件。您可以使用 Amazon EventBridge 检测并响应这些事件。 | 2022 年 5 月 9 日 | 
| [描述公有密钥](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/describe-keys.html) | 您可以查询 Amazon EC2 密钥对的公有密钥和创建日期。 | 2022 年 4 月 28 日 | 
| [创建密钥对](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/create-key-pairs.html#having-ec2-create-your-key-pair) | 您可以在创建新密钥对时指定密钥格式（PEM 或 PPK）。 | 2022 年 4 月 28 日 | 
| [在启动时挂载 Amazon FSx 文件系统](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/storage_fsx.html) | 您可以使用新的启动实例向导在启动时挂载新的或现有的适用于 NetApp ONTAP 的 Amazon FSx 或适用于 OpenZFS 的 Amazon FSx 文件系统。 | 2022 年 4 月 12 日 | 
| [新启动实例向导](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-launch-instance-wizard.html) | Amazon EC2 控制台中全新改进后的启动体验，提供了更快、更简单的 EC2 实例启动方法。 | 2022 年 4 月 5 日 | 
| [自动弃用公用 AMI](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/sharingamis-intro.html#considerations-for-sharing-public-AMIs) | 默认情况下，所有公用 AMI 的弃用日期设置为自 AMI 创建日期起的两年。 | 2022 年 3 月 31 日 | 
| [实例元数据类别：autoscaling/target-lifecycle-state](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-metadata.html#instancedata-data-categories) | 使用 Auto Scaling 组时，您可以从实例元数据访问实例的目标生命周期状态。 | 2022 年 3 月 24 日 | 
| [AMI 的上次启动时间](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ami-deprecate.html#ami-last-launched-time) | `lastLaunchedTime` 指示您上次使用 AMI 启动实例时的时间戳。 | 2022 年 2 月 28 日 | 
| [ED25519 密钥](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html) | EC2 Instance Connect 和 EC2 Serial Console 现在支持 ED25519 密钥。 | 2022 年 1 月 20 日 | 
| [用于容量预留的其他 RHEL 平台](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-reservations.html#capacity-reservations-platforms) | 用于按需容量预留的其他 Red Hat Enterprise Linux 平台。 | 2022 年 1 月 11 日 | 
| [配置 Windows AMI 以加快启动速度](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/win-ami-config-fast-launch.html) | 请使用预配置的快照，将 Windows AMI 配置为将启动实例的速度提高 65%。 | 2022 年 1 月 10 日 | 
| [实例元数据中的实例标签](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/Using_Tags.html#work-with-tags-in-IMDS) | 您可以从实例元数据访问实例的标签。 | 2022 年 1 月 6 日 | 
| [集群置放群组中的容量预留](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/cr-cpg.html) | 您可以在集群置放群组中创建容量预留。 | 2022 年 1 月 6 日 | 
| [竞价型实例集 launch-before-terminate](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-fleet-capacity-rebalance.html) | 竞价型实例集可以在新的替换竞价型实例启动后终止接收再平衡通知的竞价型实例。 | 2021 年 11 月 4 日 | 
| [EC2 机群 launch-before-terminate](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-fleet-capacity-rebalance.html) | EC2 机群可以在新的替换竞价型实例启动后终止接收再平衡通知的竞价型实例。 | 2021 年 11 月 4 日 | 
| [比较时间戳](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/set-time.html#compare-timestamps-with-clockbound) | 您可以通过将 Amazon EC2 Linux 实例的时间戳与 ClockBound 进行比较来确定事件的真实时间。 | 2021 年 11 月 2 日 | 
| [与企业和 OU 共享 AMI](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/share-amis-with-organizations-and-OUs.html) | 您现在可以与以下 AWS 资源共享 AMI：企业和企业部门 (OU)。 | 2021 年 10 月 29 日 | 
| [竞价放置分数](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/spot-placement-score.html) | 根据您的 Spot 容量要求，获取 AWS 区域或可用区的建议。 | 2021 年 10 月 27 日 | 
| [竞价型实例集的基于属性的实例类型选择](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-fleet-attribute-based-instance-type-selection.html) | 指定实例必须具有的属性，Amazon EC2 将使用这些属性标识所有实例类型。 | 2021 年 10 月 27 日 | 
| [EC2 机群的基于属性的实例类型选择](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-fleet-attribute-based-instance-type-selection.html) | 指定实例必须具有的属性，Amazon EC2 将使用这些属性标识所有实例类型。 | 2021 年 10 月 27 日 | 
| [按需容量预留机群](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/cr-fleets.html) | 您可以使用容量预留机群启动容量预留的组或机群。 | 2021 年 10 月 5 日 | 
| [Ubuntu 20.04 LTS - Focal 的休眠支持](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/hibernating-prerequisites.html#hibernation-prereqs-supported-amis) | 休眠从 Ubuntu 20.04 LTS - Focal AMI 启动的新推出的实例。 | 2021 年 10 月 4 日 | 
| [EC2 实例集和目标按需容量预留](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-fleet-on-demand-capacity-reservations.html) | EC2 实例集可以将按需实例启动到 `targeted` 容量预留。 | 2021 年 9 月 22 日 | 
| [专属主机上的 T3 实例](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/dedicated-hosts-overview.html#burstable-t3) | Amazon EC2 专属主机上的 T3 实例支持。 | 2021 年 9 月 14 日 | 
| [对 RHEL、Fedora 和 CentOS 的休眠支持](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/hibernating-prerequisites.html#hibernation-prereqs-supported-amis) | 使从 RHEL、Fedora 和 CentOS AMI 启动的新启动实例休眠。 | 2021 年 9 月 9 日 | 
| [Amazon EC2 全局视图](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/Using_Filtering.html#global-view) | 通过 Amazon EC2 全局视图，您可以在单个控制台中查看跨多个 AWS 区域的 VPC、子网、实例、安全组和卷。 | 2021 年 9 月 1 日 | 
| [C5d、M5d 和 R5d 的休眠支持](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/Hibernate.html#hibernating-prerequisites) | 使 C5d、M5d 和 R5d 实例类型上运行的新启动实例休眠。 | 2021 年 8 月 19 日 | 
| [Amazon EC2 密钥对](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html) | Amazon EC2 现在支持 Linux 和 Mac 实例上的 ED25519 密钥。 | 2021 年 8 月 17 日 | 
| [网络接口前缀](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-prefix-eni.html) | 您可以自动或手动为网络接口分配私有 IPv4 或 IPv6 CIDR 范围。 | 2021 年 7 月 22 日 | 
| [事件窗口](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/event-windows.html) | 您可以为重新启动、停止或终止 Amazon EC2 实例的计划事件定义每周重复运行的自定义事件窗口。 | 2021 年 7 月 15 日 | 
| [针对安全组规则的资源 ID 和标记支持](#DocumentHistory) | 您可以按资源 ID 引用安全组规则。您还可以为安全组规则添加标签。 | 2021 年 7 月 7 日 | 
| [弃用 AMI](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ami-deprecate.html) | 现在，您可以指定何时弃用 AMI。 | 2021 年 6 月 11 日 | 
| [Windows 按秒计费](#DocumentHistory) | Amazon EC2 按秒对基于 Windows 和 SQL 服务器的使用收费，最低收取一分钟的费用。 | 2021 年 6 月 10 日 | 
| [ 上的容量预留AWS Outposts](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/capacity-reservations-outposts.html) | 现在，您可以使用 AWS Outposts 上的容量预留。 | 2021 年 5 月 24 日 | 
| [容量预留共享](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/capacity-reservation-sharing.html) | 您现在可以在 Local Zones 和 Wavelength 区域中共享创建的容量预留。 | 2021 年 5 月 24 日 | 
| [根卷替换](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/replace-root.html) | 现在，您可以使用根卷替换任务来替换正在运行的实例的根 EBS 卷。 | 2021 年 4 月 22 日 | 
| [使用 S3 存储和还原 AMI](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ami-store-restore.html) | 将 EBS 支持的 AMI 存储在 S3 中，然后从 S3 还原它们，以启用 AMI 跨分区复制。 | 2021 年 4 月 6 日 | 
| [EC2 Serial Console](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-serial-console.html) | 通过建立面向实例串行端口的连接来排除引导和网络连接问题。 | 2021 年 3 月 30 日 | 
| [启动模式](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ami-boot.html) | Amazon EC2 现在在选定的基于 AMD 和 Intel 的 EC2 实例上支持 UEFI 启动。 | 2021 年 3 月 22 日 | 
| [创建反向 DNS 记录](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/elastic-ip-addresses-eip.html#Using_Elastic_Addressing_Reverse_DNS) | 您现在可以为弹性 IP 地址设置反向 DNS 查找。 | 2021 年 2 月 3 日 | 
| [在创建 AMI 时标记 AMI 和快照](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/creating-an-ami-ebs.html#how-to-create-ebs-ami) | 创建 AMI 时，您可以使用相同的标签来标记 AMI 和快照，也可以使用不同的标签来标记它们。 | 2020 年 12 月 4 日 | 
| [使用 Amazon EventBridge 监控竞价型实例集事件](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/monitor-ec2-fleet-using-eventbridge.html) | 创建触发编程操作以响应竞价型实例集状态更改和错误的 EventBridge 规则。 | 2020 年 11 月 20 日 | 
| [使用 Amazon EventBridge 监控 EC2 实例集事件](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/monitor-ec2-fleet-using-eventbridge.html) | 创建触发编程操作以响应 EC2 实例集状态更改和错误的 EventBridge 规则。 | 2020 年 11 月 20 日 | 
| [删除 instant 队列](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/manage-ec2-fleet.html#delete-fleet) | 在单个 API 调用中删除类型 `instant` 的 EC2 实例集，并终止实例集中的所有实例。 | 2020 年 11 月 18 日 | 
| [对 T3 和 T3a 的休眠支持](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/Hibernate.html#hibernating-prerequisites) | 使 T3 和 T3a 实例类型上运行的新启动实例休眠。 | 2020 年 11 月 17 日 | 
| [Amazon EFS 快速创建](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AmazonEFS.html#quick-create) | 您可以使用 Amazon EFS 快速创建在启动时创建 Amazon EFS 文件系统并将其挂载到实例。 | 2020 年 11 月 9 日 | 
| [实例元数据类别：events/recommendations/rebalance](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-metadata.html#instancedata-data-categories) | 为实例发出 EC2 实例再平衡建议通知的大致时间 (UTC)。 | 2020 年 11 月 4 日 | 
| [EC2 实例再平衡建议](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/rebalance-recommendations.html) | 当竞价型实例的中断风险升高时通知您的信号。 | 2020 年 11 月 4 日 | 
| [Wavelength 区域中的容量预留](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/capacity-reservations-wavelengthzones.html) | 现在可以在Wavelength 区中创建和使用 容量预留。 | 2020 年 11 月 4 日 | 
| [容量再平衡](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-fleet-capacity-rebalance.html) | 配置竞价型实例集或 EC2 实例集，以便在 Amazon EC2 发出再平衡建议时启动替换竞价型实例。 | 2020 年 11 月 4 日 | 
| [对 I3、M5ad 和 R5ad 的休眠支持](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/Hibernate.html#hibernating-prerequisites) | 使 I3、M5ad 和 R5ad 实例类型上运行的新启动实例休眠。 | 2020 年 10 月 21 日 | 
| [竞价型实例 vCPU 限制](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-spot-limits.html) | 竞价型实例限制现在根据您为完成未处理的请求而正在使用或将使用的运行中竞价型实例所用的 vCPU 数量进行管理。 | 2020 年 10 月 1 日 | 
| [Local Zones 中的容量预留](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/capacity-reservations-localzones.html) | 现在可以在 Local Zones 中创建和使用容量预留。 | 2020 年 9 月 30 日 | 
| [对 M5a 和 R5a 的休眠支持](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/Hibernate.html#hibernating-prerequisites) | 使 M5a 和 R5a 实例类型上运行的新启动实例休眠。 | 2020 年 8 月 28 日 | 
| [实例元数据提供实例位置和放置信息](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-metadata.html#instancedata-data-categories) | `placement` 类别下的新实例元数据字段：区域、放置组名称、分区号、主机 ID 和可用区 ID。 | 2020 年 8 月 24 日 | 
| [容量预留组](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/create-cr-group.html) | 您可以使用 AWS Resource Groups 创建容量预留的逻辑集合，然后将实例启动定位到这些组中。 | 2020 年 7 月 29 日 | 
| [EC2Launch v2](ec2launch-v2.md) | 您可以使用 EC2Launch v2 在实例启动期间执行任务，包括实例停止并稍后启动或者实例重新启动期间，它还可按需执行任务。EC2Launch v2 支持所有版本的 Windows Server，并替换 EC2Launch 和 EC2Config。 | 2020 年 6 月 30 日 | 
| [自带 IPv6 地址](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-byoip.html) | 您可以将部分或全部 IPv6 地址范围从本地网络引入到您的 AWS 账户中。 | 2020 年 5 月 21 日 | 
| [使用 Systems Manager 参数启动实例](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/finding-an-ami.html#using-systems-manager-parameter-to-find-AMI) | 您可以在启动实例时指定 AWS Systems Manager 参数而不是 AMI。 | 2020 年 5 月 5 日 | 
| [自定义计划事件通知](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/monitoring-instances-status-check_sched.html#customizing_scheduled_event_notifications) | 您可以自定义计划事件通知，以便在电子邮件通知中包含标签。 | 2020 年 5 月 4 日 | 
| [专属主机上的 Windows Server](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/dedicated-hosts-overview.html) | 您可以使用 Amazon 提供的 Windows Server AMI，在专属主机上运行最新版本的 Windows Server。 | 2020 年 4 月 7 日 | 
| [停止和启动竞价型实例](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/spot-requests.html#stopping-a-spot-instance) | 停止由 Amazon EBS 支持的竞价型实例并根据需要随时启动它，而不是依赖于停止中断行为。 | 2020 年 1 月 13 日 | 
| [为资源添加标签](#DocumentHistory) | 您可以标记仅出口互联网网关、本地网关、本地网关路由表、本地网关虚拟接口、本地网关虚拟接口组、本地网关路由表 VPC 关联以及本地网关路由表虚拟接口组关联。 | 2020 年 1 月 10 日 | 
| [使用会话管理器连接到您的实例](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/connect-with-systems-manager-session-manager.html) | 您可以从 Amazon EC2 控制台使用实例来启动会话管理器会话。 | 2019 年 12 月 18 日 | 
| [专属主机和主机资源组](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/launching-hrg-instances.html) | 专属主机现在可以与主机资源组一起使用。 | 2019 年 12 月 2 日 | 
| [专属主机共享](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/dh-sharing.html) | 您现在可以跨 AWS 账户共享专属主机。 | 2019 年 12 月 2 日 | 
| [账户级别的默认积分规范](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/burstable-performance-instances-how-to.html#burstable-performance-instance-set-default-credit-specification-for-account) | 您可以在每个 AWS 区域的账户级别设置每个可突增性能实例系列的默认积分规范。 | 2019 年 11 月 25 日 | 
| [实例类型查找](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-discovery.html) | 您可以找到满足您需求的实例类型。 | 2019 年 11 月 22 日 | 
| [专属主机](#DocumentHistory) | 现在，您可以配置专属主机以支持实例系列中的多种实例类型。 | 2019 年 11 月 21 日 | 
| [实例元数据服务版本 2](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/configuring-instance-metadata-service.html) | 您可以使用 实例元数据服务版本 2，这是一种面向会话的方法，用于请求实例元数据。 | 2019 年 11 月 19 日 | 
| [ Elastic Fabric Adapter](#DocumentHistory) | Elastic Fabric Adapter 现在可以与 Intel MPI 2019 Update 6 配合使用。 | 2019 年 11 月 15 日 | 
| [对按需 Windows 实例的休眠支持](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/Hibernate.html#hibernating-prerequisites) | 您可以使按需 Windows 实例休眠。 | 2019 年 10 月 14 日 | 
| [排队购买预留实例](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ri-market-concepts-buying.html#ri-queued-purchase) | 您最早可以提前三年排队购买 Reserved Instance。 | 2019 年 10 月 4 日 | 
| [诊断中断](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/diagnostic-interrupt.html) | 您可以将诊断中断发送到无法访问或无响应的实例以触发内核错误。 | 2019 年 8 月 14 日 | 
| [容量优化的分配策略](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-fleet-configuration-strategies.html#ec2-fleet-strategy-capacity-optimized) | 使用 EC2 实例集或竞价型实例集，您可以通过为正在启动的实例数量提供最佳容量来从 Spot 池启动竞价型实例。 | 2019 年 8 月 12 日 | 
| [按需容量预留共享](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/capacity-reservation-sharing.html) | 您现在可以跨 AWS 账户共享容量预留。 | 2019 年 7 月 29 日 | 
| [ Elastic Fabric Adapter](#DocumentHistory) | EFA 现在支持 Open MPI 3.1.4 和 Intel MPI 2019 Update 4。 | 2019 年 7 月 26 日 | 
| [ EC2 Instance Connect](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/connect-linux-inst-eic.html) | EC2 Instance Connect 提供了一种简单且安全的方法以使用 Secure Shell（SSH）连接到实例。 | 2019 年 6 月 27 日 | 
| [主机恢复](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/dedicated-hosts-recovery.html) | 如果在专属主机上发生意外硬件故障，则在新主机上自动重新启动实例。 | 2019 年 6 月 5 日 | 
| [VSS 应用程序一致性快照](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/application-consistent-snapshots.html) | 通过使用 AWS Systems Manager Run Command，您可以为附加到您的 Windows 实例的所有 Amazon EBS 卷拍摄应用程序一致性快照。 | 2019 年 5 月 13 日 | 
| [Microsoft SQL Server 数据库从 Windows 到 Linux 的平台转换助手](https://docs.aws.amazon.com/sql-server-ec2/latest/userguide/replatform-sql-server.html) | 将现有 Microsoft SQL Server 工作负载从 Windows 移动到 Linux 操作系统。更新后的链接指向《Amazon EC2 用户指南》上的 Microsoft SQL Server。 | 2019 年 5 月 8 日 | 
| [Windows 自动升级](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/automated-upgrades.html) | 使用 AWS Systems Manager 执行 EC2 Windows 实例的自动升级。 | 2019 年 5 月 6 日 | 
| [ Elastic Fabric Adapter](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start.html) | 您可以将 Elastic Fabric Adapter 附加到实例以加快高性能计算 (HPC) 应用程序的速度。 | 2019 年 4 月 29 日 | 

有关 Amazon EC2 实例类型版本的信息，请参阅《Amazon EC2 Instance Types Guide》**中的 [Document history](https://docs.aws.amazon.com/ec2/latest/instancetypes/doc-history.html)。

## 2018 年及更早的历史记录
<a name="previous-history"></a>

下表描述《Amazon EC2 用户指南》的重要补充部分（2018 年以及之前年份）。


| 功能 | API 版本 | 描述 | 发行日期 | 
| --- | --- | --- | --- | 
| <a name="history-2018"></a>分区置放群组 | 2016-11-15 | 分区置放群组跨逻辑分区来分配实例，以确保一个分区中的实例不会与其他分区中的实例共享基础硬件。有关更多信息，请参阅[分区置放群组](placement-strategies.md#placement-groups-partition)。 | 2018 年 12 月 20 日 | 
| 休眠 EC2 Linux 实例 | 2016-11-15 | 如果 Linux 实例已启用休眠并且满足休眠先决条件，则可以休眠该实例。有关更多信息，请参阅[将您的 Amazon EC2 实例休眠](Hibernate.md)。 | 2018 年 11 月 28 日 | 
| Amazon Elastic Inference 加速器 | 2016-11-15 | 您可以将 Amazon EI 加速器附加到实例上以添加 GPU 支持的加速，从而减少运行深度学习推理的成本。 | 2018 年 11 月 28 日 | 
| Spot 控制台推荐实例实例集 | 2016-11-15 | Spot 控制台根据 Spot 最佳实践（实例多元化）推荐实例实例集，以满足您应用程序所需的最低硬件规格（vCPU、内存和存储）。有关更多信息，请参阅[创建竞价型实例集](create-spot-fleet.md)。 | 2018 年 11 月 20 日 | 
| 新 EC2 实例集请求类型：instant | 2016-11-15 | EC2 实例集现在支持新请求类型 instant，您可用它来跨实例类型和购买模式同步预配置容量。instant 请求在 API 响应中返回启动的实例，不采取更多操作，使您能够控制是否启动实例以及何时启动。有关更多信息，请参阅[EC2 实例集和竞价型实例集请求类型](ec2-fleet-request-type.md)。 | 2018 年 11 月 14 日 | 
| Spot 节省信息 | 2016-11-15 | 您可以查看使用单个竞价型实例集或所有竞价型实例的竞价型实例所节省的成本。有关更多信息，请参阅[通过购买竞价型实例实现节省](spot-savings.md)。 | 2018 年 11 月 5 日 | 
| 用于优化 CPU 选项的控制台支持 | 2016-11-15 | 启动实例时，您可以使用 Amazon EC2 控制台优化 CPU 选项以适应特定的工作负载或业务需求。有关更多信息，请参阅[Amazon EC2 实例适用的 CPU 选项](instance-optimize-cpu.md)。 | 2018 年 10 月 31 日 | 
| 控制台支持从实例创建启动模板 | 2016-11-15 | 您可以通过 Amazon EC2 控制台，以实例为基础创建新的启动模板。有关更多信息，请参阅[创建 Amazon EC2 启动模板](create-launch-template.md)。 | 2018 年 10 月 30 日 | 
| 按需容量预留 | 2016-11-15 | 您可在特定可用区中为 Amazon EC2 实例预留容量任意持续时间。这使您能够独立于预留实例 (RI) 提供的账单折扣来创建和管理容量预留。有关更多信息，请参阅[使用 EC2 按需容量预留来预留计算容量](ec2-capacity-reservations.md)。 | 2018 年 10 月 25 日 | 
| 自带 IP 地址 (BYOIP) | 2016-11-15 | 您可将自己的全部或部分公有 IPv4 地址从本地网络引入到 AWS 账户中。在将地址范围引入 AWS 中之后，它会在您的账户中显示为地址池。您可从地址池创建弹性 IP 地址，并将其用于您的 AWS 资源。有关更多信息，请参阅[自带 IP 地址（BYOIP）到 Amazon EC2](ec2-byoip.md)。 | 2018 年 10 月 23 日 | 
| 在创建时标记专属主机和控制台支持 | 2016-11-15 | 您可在创建时标记专属主机，并可以使用 Amazon EC2 控制台管理专属主机标签。有关更多信息，请参阅[分配一台 Amazon EC2 专属主机供您的账户使用](dedicated-hosts-allocating.md)。 | 2018 年 10 月 8 日 | 
| 针对竞价型实例集计划扩展的控制台支持。 | 2016-11-15 | 根据日期和时间增加或减少实例集的当前容量。有关更多信息，请参阅[计划扩展：按计划扩展竞价型实例集](spot-fleet-scheduled-scaling.md)。 | 2018 年 9 月 20 日 | 
| EC2 实例集的分配策略 | 2016-11-15 | 您可以指定是按价格（最低价格优先）还是优先级（最高优先级优先）来满足按需容量。您可以指定在其中分配您的目标 Spot 容量的 Spot 池数量。有关更多信息，请参阅[使用分配策略确定 EC2 实例集或竞价型实例集如何满足竞价型和按需型容量](ec2-fleet-allocation-strategy.md)。 | 2018 年 7 月 26 日 | 
| 竞价型实例集的分配策略 | 2016-11-15 | 您可以指定是按价格（最低价格优先）还是优先级（最高优先级优先）来满足按需容量。您可以指定在其中分配您的目标 Spot 容量的 Spot 池数量。有关更多信息，请参阅[使用分配策略确定 EC2 实例集或竞价型实例集如何满足竞价型和按需型容量](ec2-fleet-allocation-strategy.md)。 | 2018 年 7 月 26 日 | 
| 自动化快照生命周期 | 2016-11-15 | 您可以使用 Amazon Data Lifecycle Manager 来自动创建和删除 EBS 卷的快照。有关更多信息，请参阅 [Amazon Data Lifecycle Manager](https://docs.aws.amazon.com/ebs/latest/userguide/snapshot-lifecycle.html)。 | 2018 年 7 月 12 日 | 
| 启动模板 CPU 选项 | 2016-11-15 | 在使用命令行工具创建启动模板时，您可以优化 CPU 选项以适合特定工作负载或业务需求。有关更多信息，请参阅[创建 Amazon EC2 启动模板](create-launch-template.md)。 | 2018 年 7 月 11 日 | 
| 标记专属主机 | 2016-11-15 | 您可以标记专属主机。 | 2018 年 7 月 3 日 | 
| 获取最新的控制台输出 | 2016-11-15 | 使用 [get-console-output](https://docs.aws.amazon.com/cli/latest/reference/ec2/get-console-output.html) AWS CLI 命令时，您可以检索某些实例类型的最新控制台输出。 | 2018 年 5 月 9 日 | 
| 优化 CPU 选项 | 2016-11-15 | 启动实例时，您可以优化 CPU 选项以适应特定的工作负载或业务需求。有关更多信息，请参阅[Amazon EC2 实例适用的 CPU 选项](instance-optimize-cpu.md)。 | 2018 年 5 月 8 日 | 
| EC2 Fleet | 2016-11-15 | 您可以使用 EC2 实例集在不同的 EC2 实例类型和可用区以及按需型实例、预留实例和竞价型实例采购模型之间启动一组实例。有关更多信息，请参阅 [EC2 实例集和竞价型实例集](Fleets.md)。 | 2018 年 5 月 2 日 | 
| 竞价型实例集 中的按需型实例 | 2016-11-15 | 您可以在竞价型实例集请求中包含按需容量请求，以确保始终拥有实例容量。有关更多信息，请参阅 [EC2 实例集和竞价型实例集](Fleets.md)。 | 2018 年 5 月 2 日 | 
| 创建时标记 EBS 快照 | 2016-11-15 | 在创建过程中，您可以将标签应用于快照。 | 2018 年 4 月 2 日 | 
| 更改置放群组 | 2016-11-15 | 您可以将实例移入或移出置放群组，也可以更改实例的置放群组。有关更多信息，请参阅[更改 Amazon EC2 实例的置放](change-instance-placement-group.md)。 | 2018 年 3 月 1 日 | 
| 较长的资源 ID | 2016-11-15 | 您可以为更多资源类型启用较长 ID 格式。 | 2018 年 2 月 9 日 | 
| 网络性能改进 | 2016-11-15 | 在其他实例或 Amazon S3 之间发送或接收网络通信时，集群置放群组之外的实例现在可以受益于增加的带宽。 | 2018 年 1 月 24 日 | 
| <a name="history-2017"></a>标记弹性 IP 地址 | 2016-11-15 | 您可以标记您的弹性 IP 地址。 | 2017 年 12 月 21 日 | 
| Amazon Time Sync Service | 2016-11-15 | 您可以使用 Amazon Time Sync Service 在您的实例上保持准确的时间。有关更多信息，请参阅 [在 EC2 实例上实现精确时钟和时间同步](set-time.md)。 | 2017 年 11 月 29 日 | 
| T2 无限 | 2016-11-15 | T2 无限实例可以突增到基准以上所需的时间。有关更多信息，请参阅[可突增性能实例](burstable-performance-instances.md)。 | 2017 年 11 月 29 日 | 
| 启动模板 | 2016-11-15 | 启动模板可以包含用于启动实例的全部或部分参数，而无需在每次启动实例时都指定这些参数。有关更多信息，请参阅[在 Amazon EC2 启动模板中存储实例启动参数](ec2-launch-templates.md)。 | 2017 年 11 月 29 日 | 
| 分布置放 | 2016-11-15 | 建议在具有少量应单独放置的重要实例的应用程序中使用分布置放群组。有关更多信息，请参阅[分布置放群组](placement-strategies.md#placement-groups-spread)。 | 2017 年 11 月 29 日 | 
| 竞价型实例休眠 | 2016-11-15 | 在发生中断时，Spot 服务可以将竞价型实例休眠。 | 2017 年 11 月 28 日 | 
| 竞价型实例集目标跟踪 | 2016-11-15 | 您可以为竞价型实例集设置目标跟踪扩展策略。有关更多信息，请参阅[目标跟踪扩展：通过确定特定指标的目标值来扩展竞价型实例集](spot-fleet-target-tracking.md)。 | 2017 年 11 月 17 日 | 
| 竞价型实例集与 Elastic Load Balancing 集成 | 2016-11-15 | 您可以将一个或多个负载均衡器附加到竞价型实例集。 | 2017 年 11 月 10 日 | 
| 合并和拆分可转换预留实例 | 2016-11-15 | 您可以合并两个或更多可转换预留实例，也可以将其与新可转换预留实例交换。您还可以使用修改过程将 可转换预留实例 拆分为较小的预留。有关更多信息，请参阅[交换 可转换预留实例](ri-convertible-exchange.md)。 | 2017 年 11 月 6 日 | 
| 修改 VPC 租赁 | 2016-11-15 | 可以将 VPC 的实例租赁属性从 `dedicated` 改为 `default`。有关更多信息，请参阅[更改 VPC 的实例租赁](change-tenancy-vpc.md)。 | 2017 年 10 月 16 日 | 
| 按秒计费 | 2016-11-15 | Amazon EC2 按秒对基于 Linux 的使用收费，最低收取一分钟的费用。 | 2017 年 10 月 2 日 | 
| 在中断时停止 | 2016-11-15 | 您可以指定在竞价型实例中断时 Amazon EC2 应将其停止还是终止。有关更多信息，请参阅[竞价型实例中断行为](interruption-behavior.md)。 | 2017 年 9 月 18 日 | 
| 给 NAT 网关加标签 | 2016-11-15 | 您可以给自己的 NAT 网关加标签。有关更多信息，请参阅[标记 资源](Using_Tags.md#tag-resources)。 | 2017 年 9 月 7 日 | 
| 安全组规则说明 | 2016-11-15 | 您可以向安全组规则添加说明。 | 2017 年 8 月 31 日 | 
| Elastic Graphics | 2016-11-15 | 将 Elastic Graphics 加速器附加到您的实例来提升应用程序的图形性能。 | 2017 年 8 月 29 日 | 
| 恢复弹性 IP 地址 | 2016-11-15 | 如果您释放了一个在 VPC 中使用的弹性 IP 地址，则可能能够恢复它。 | 2017 年 8 月 11 日 | 
| 标记竞价型实例集实例 | 2016-11-15 | 您可以将您的竞价型实例集配置为自动标记其启动的实例。 | 2017 年 7 月 24 日 | 
| 在创建过程中，为资源添加标签 | 2016-11-15 | 在创建过程中，您可以将标签应用于实例和卷。有关更多信息，请参阅[标记 资源](Using_Tags.md#tag-resources)。此外，您可以使用基于标签的资源级权限来控制应用的标签。有关更多信息，请参阅 [在创建过程中授予标记 Amazon EC2 资源的权限](supported-iam-actions-tagging.md)。 | 2017 年 3 月 28 日 | 
| 在附加的 EBS 卷上进行修改 | 2016-11-15 | 对于附加到大多数 EC2 实例的大多数 EBS 卷，您可以在不分离卷或不停止实例的情况下修改卷大小、类型和 IOPS。 | 2017 年 2 月 13 日 | 
| 附加 IAM 角色 | 2016-11-15 | 您可以为现有实例附加、分离或替换 IAM 角色。有关更多信息，请参阅[适用于 Amazon EC2 的 IAM 角色](iam-roles-for-amazon-ec2.md)。 | 2017 年 2 月 9 日 | 
| 专用竞价型实例 | 2016-11-15 | 您可在 Virtual Private Cloud (VPC) 中的单租户硬件上运行竞价型实例。有关更多信息，请参阅[在单租户硬件上启动](how-spot-instances-work.md#spot-instance-tenancy)。 | 2017 年 1 月 19 日 | 
| IPv6 支持 | 2016-11-15 | 您可以将一个 IPv6 CIDR 与 VPC 和子网关联，并为 VPC 中的实例分配 IPv6 地址。有关更多信息，请参阅[Amazon EC2 实例 IP 寻址](using-instance-addressing.md)。 | 2016 年 12 月 1 日 | 
| 竞价型实例集的自动扩展 |  | 现在，您可以为竞价型实例集设置扩展策略。有关更多信息，请参阅[了解竞价型实例集的自动扩展](spot-fleet-automatic-scaling.md)。 | 2016 年 9 月 1 日 | 
| 弹性网络适配器（ENA） | 2016-04-01 | 您现在可以将 ENA 用于增强网络。有关更多信息，请参阅 [Amazon EC2 实例上的增强联网功能](enhanced-networking.md)。 | 2016 年 6 月 28 日 | 
| 增强了对查看和修改较长 ID 的支持 | 2016-04-01 | 您现在可以查看和修改其他 IAM 用户、IAM 角色或根用户的较长 ID 设置。 | 2016 年 6 月 23 日 | 
| 在 AWS 账户之间复制加密的 Amazon EBS 快照 | 2016-04-01 | 您现在可以在 AWS 账户之间复制加密的 EBS 快照。 | 2016 年 6 月 21 日 | 
| 捕获实例控制台的屏幕截图 | 2015-10-01 | 您现在可以在调试无法访问的实例时获取其他信息。有关更多信息，请参阅 [捕获无法访问的实例的屏幕截图](troubleshoot-unreachable-instance.md#instance-console-screenshot)。 | 2016 年 24 月 5 日 | 
| 两种新的 EBS 卷类型 | 2015-10-01 | 您现在可以创建经过吞吐量优化的 HDD (st1) 以及冷数据 HDD (sc1) 卷。 | 2016 年 4 月 19 日 | 
| 添加了针对 Amazon EC2 的新的 NetworkPacketsIn 和 NetworkPacketsOut 指标 |  | 添加了针对 Amazon EC2 的新的 NetworkPacketsIn 和 NetworkPacketsOut 指标。有关更多信息，请参阅[实例指标](viewing_metrics_with_cloudwatch.md#ec2-cloudwatch-metrics)。 | 2016 年 3 月 23 日 | 
| 竞价型实例集的 CloudWatch 指标 |  | 您现在可以获取竞价型实例集的 CloudWatch 指标。有关更多信息，请参阅 [使用 CloudWatch 监控 EC2 实例集或竞价型实例集](ec2-fleet-cloudwatch-metrics.md)。 | 2016 年 3 月 21 日 | 
| 计划实例 | 2015-10-01 | 利用计划的预留实例 (计划实例)，您可以购买具有指定的开始时间和持续时间，并且每日、每周或每月重复一次的容量预留。 | 2016 年 1 月 13 日 | 
| 较长的资源 ID | 2015-10-01 | Amazon EC2 正在逐步为某些 Amazon EC2 和 Amazon EBS 资源类型引入更长的 ID。在选择周期内，您可以为支持的资源类型启用较长 ID 格式。 | 2016 年 1 月 13 日 | 
| ClassicLink DNS 支持 | 2015-10-01 | 您可以对您的 VPC 启用 ClassicLink DNS 支持，以使定位在链接的 EC2-Classic 实例与 VPC 中的实例之间的 DNS 主机名解析为私有 IP 地址而不是公有 IP 地址。 | 2016 年 1 月 11 日 | 
| 专属主机 | 2015-10-01 | Amazon EC2 专属主机是指实例容量供您专用的物理服务器。有关更多信息，请参阅[Amazon EC2 专属主机](dedicated-hosts-overview.md)。 | 2015 年 11 月 23 日 | 
| 竞价型实例持续时间 | 2015-10-01 | 现在，您可以为竞价型实例指定持续时间。不支持竞价型限制（2023 年 1 月）。 | 2015 年 10 月 6 日 | 
| 竞价型实例集修改请求 | 2015-10-01 | 您现在可以修改竞价型实例集请求的目标容量。有关更多信息，请参阅[修改竞价型实例集请求](modify-spot-fleet.md)。 | 2015 年 9 月 29 日 | 
| 竞价型实例集多样化分配策略 | 2015-04-15 | 您现在可以使用单个竞价型实例集请求在多个 Spot 池中分配竞价型实例。有关更多信息，请参阅 [使用分配策略确定 EC2 实例集或竞价型实例集如何满足竞价型和按需型容量](ec2-fleet-allocation-strategy.md)。 | 2015 年 9 月 15 日 | 
| 竞价型实例集实例权重 | 2015-04-15 | 您现在可以定义每个实例类型在应用程序性能中所占的容量单位，并相应地为每个 Spot 池的竞价型实例调整愿意支付的金额。有关更多信息，请参阅 [使用实例权重来管理 EC2 实例集或竞价型实例集的成本和性能](ec2-fleet-instance-weighting.md)。 | 2015 年 8 月 31 日 | 
| 新的重启警报操作和用于警报操作的新 IAM 角色 |  | 增加了重启警报操作和与警报操作一起使用的新 IAM 角色。有关更多信息，请参阅[创建停止、终止、重启或恢复实例的警报](UsingAlarmActions.md)。 | 2015 年 7 月 23 日 | 
| Spot Fleets | 2015-04-15 | 您可以管理竞价型实例的集合或实例集，而不必管理单独的竞价型实例请求。有关更多信息，请参阅 [EC2 实例集和竞价型实例集](Fleets.md)。 | 2015 年 5 月 18 日 | 
| 将弹性 IP 地址迁移至 EC2-Classic | 2015-04-15 | 您无法将已分配为在 EC2-Classic 中使用的弹性 IP 地址迁移到在 VPC 中使用。 | 2015 年 5 月 15 日 | 
| 将具有多个磁盘的虚拟机作为 AMI 导入 | 2015-03-01 | VM Import 过程现在支持将具有多个磁盘的虚拟机作为 AMI 导入。有关更多信息，请参阅 *VM Import/Export 用户指南* 中的[使用 VM Import/Export 将虚拟机作为映像导入](https://docs.aws.amazon.com/vm-import/latest/userguide/vmimport-image-import.html)。 | 2015 年 4 月 23 日 | 
| Systems Manager |  | Systems Manager 使您可以配置和管理您的 EC2 实例。 | 2015 年 2 月 17 日 | 
| Systems Manager for Microsoft SCVMM 1.5 |  | 您现在可以使用 Systems Manager for Microsoft SCVMM 启动实例，并将虚拟机从 SCVMM 导入到 Amazon EC2。 | 2015 年 1 月 21 日 | 
| EC2 实例的自动恢复 |  | 您可以创建 Amazon CloudWatch 警报用于监控 Amazon EC2 实例，并且在实例受损（由于发生底层硬件故障或需要 AWS 参与才能修复的问题）时自动恢复实例。恢复的实例与原始实例相同，包括实例 ID、IP 地址以及所有实例元数据。<br />有关更多信息，请参阅[实例自动恢复](ec2-instance-recover.md)。 | 2015 年 1 月 12 日 | 
| ClassicLink | 2014-10-01 | 您可使用 ClassicLink 将 EC2-Classic 实例链接到您账户中的 VPC。您可以将 VPC 安全组与 EC2-Classic 实例关联起来，从而允许 EC2-Classic 实例与 VPC 中使用私有 IP 地址的实例进行通信。 | 2015 年 1 月 7 日 | 
| 竞价型实例终止通知 |  | 防范竞价型实例中断的最佳方法是为应用程序设计容错能力。此外，您还可以利用竞价型实例中断通知，该通知可在 Amazon EC2 必须停止或终止您的竞价型实例时，提前两分钟发出警告。<br />有关更多信息，请参阅[竞价型实例中断通知](spot-instance-termination-notices.md)。 | 2015 年 1 月 5 日 | 
| Systems Manager for Microsoft SCVMM |  | Systems Manager for Microsoft SCVMM 可为从 Microsoft SCVMM 管理 AWS 资源（如 EC2 实例）提供简单易用的界面。 | 2014 年 10 月 29 日 | 
| `DescribeVolumes` 分页支持 | 2014-09-01 | `DescribeVolumes` API 调用现在可使用 `MaxResults` 和 `NextToken` 参数支持结果分页。有关更多信息，请参阅 *Amazon EC2 API Reference* 中的 [DescribeVolumes](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeVolumes.html)。 | 2014 年 10 月 23 日 | 
| 增加了对 Amazon CloudWatch Logs 的支持 |  | 您可以使用 Amazon CloudWatch Logs 来监控、存储和访问您的系统、应用程序以及来自实例或其他来源的自定义日志文件。然后可以使用 Amazon CloudWatch 控制台、AWS CLI 中的 CloudWatch Logs 命令或使用 CloudWatch Logs 开发工具包，从 CloudWatch Logs 检索关联的日志数据。 | 2014 年 7 月 10 日 | 
| 新 EC2 Service Limits (EC2 服务限制) 页面 |  | 使用 Amazon EC2 控制台中的 **EC2 Service Limits (EC2 服务限制)** 页面可按区域查看 Amazon EC2 和 Amazon VPC 提供的资源的当前限制。 | 2014 年 6 月 19 日 | 
| Amazon EBS 通用型 SSD 卷 | 2014-05-01 | 通用型 SSD 卷提供经济实惠的存储，是广泛工作负载的理想选择。这些卷可提供不超过 10 毫秒的延迟，能突增至 3000 IOPS 很长时间，基准性能为 3 IOPS/GiB。通用型 SSD 卷的大小范围为 1 GiB 到 1 TiB。 | 2014 年 6 月 16 日 | 
| AWS Management Pack |  | AWS 管理包现在支持 System Center Operations Manager 2012 R2。 | 2014 年 5 月 22 日 | 
| Amazon EBS encryption | 2014-05-01 | Amazon EBS 加密 提供 EBS 数据卷和快照的无缝加密，无需构建和维护安全密钥管理基础设施。通过使用 AWS 托管式密钥 加密数据，EBS 加密可保护静态数据的安全。加密还发生在托管 EC2 实例的服务器上，当数据在 EC2 实例和 EBS 存储之间移动时提供数据加密。 | 2014 年 5 月 21 日 | 
| Amazon EC2 使用率报告 |  | Amazon EC2 使用率报告是一组显示 EC2 的成本和使用率数据的报告。 | 2014 年 1 月 28 日 | 
| 导入 Linux 虚拟机 | 2013-10-15 | VM Import 过程现在支持 Linux 实例的导入。有关更多信息，请参阅 [VM Import/Export 用户指南](https://docs.aws.amazon.com/vm-import/latest/userguide/)。 | 2013 年 12 月 16 日 | 
| RunInstances 的资源级权限 | 2013-10-15 | 您现在可以在 AWS Identity and Access Management 中创建策略以控制 Amazon EC2 RunInstances API 操作的资源级权限。有关更多信息以及示例策略，请参阅[适用于 Amazon EC2 的 Identity and Access Management](security-iam.md)。 | 2013 年 11 月 20 日 | 
| 从 AWS Marketplace 启动实例 |  | 您现在可以使用 Amazon EC2 启动向导从 AWS Marketplace 启动实例。有关更多信息，请参阅[从 AWS Marketplace AMI 中启动 Amazon EC2 实例](launch-marketplace-console.md)。 | 2013 年 11 月 11 日 | 
| 新启动向导 |  | 提供一个重新设计的新的 EC2 启动向导。有关更多信息，请参阅 [使用控制台中的启动实例向导来启动 EC2 实例](ec2-launch-instance-wizard.md)。 | 2013 年 10 月 10 日 | 
| 修改预留实例的实例类型 | 2013-10-01 | 您现在可以修改同一系列 (例如 M1、M2、M3、C1) 中 Linux 预留实例的实例类型。有关更多信息，请参阅[修改 预留实例](ri-modifying.md)。 | 2013 年 10 月 09 日 | 
| 修改 Amazon EC2 预留实例 | 2013-08-15 | 您现在可以修改区域中的预留实例。有关更多信息，请参阅[修改 预留实例](ri-modifying.md)。 | 2013 年 9 月 11 日 | 
| 分配公有 IP 地址 | 2013-07-15 | 在 VPC 中启动实例时，现在可以分配公有 IP 地址。有关更多信息，请参阅[在启动时分配公有 IPv4 地址](working-with-ip-addresses.md#public-ip-addresses)。 | 2013 年 8 月 20 日 | 
| 授予资源级权限 | 2013-06-15 | Amazon EC2 支持新的亚马逊资源名称 (ARN) 和条件键。有关更多信息，请参阅[Amazon EC2 基于身份的策略](iam-policies-for-amazon-ec2.md)。 | 2013 年 7 月 8 日 | 
| 增量快照副本 | 2013-02-01 | 您现在可以执行增量快照副本。 | 2013 年 6 月 11 日 | 
| AWS Management Pack |  | AWS Management Pack 会将 Amazon EC2 实例与其内部运行的 Windows 或 Linux 操作系统相关联。AWS 管理包是 Microsoft System Center Operations Manager 的一种扩展程序。 | 2013 年 5 月 8 日 | 
| 新 **Tags (标签)** 页面 |  | Amazon EC2 控制台中提供一个新的 **Tags (标签)** 页面。有关更多信息，请参阅[标记 Amazon EC2 资源](Using_Tags.md)。 | 2013 年 4 月 4 日 | 
| 将 AMI 从一个区域复制到另一个区域 | 2013-02-01 | 您可以将 AMI 从一个区域复制到另一个区域，以便快速轻松地在多个 AWS 区域中启动一致的实例。<br />有关更多信息，请参阅[复制 Amazon EC2 AMI](CopyingAMIs.md)。 | 2013 年 3 月 11 日 | 
| 在默认 VPC 中启动实例 | 2013-02-01 | 根据各区域的情况，您的 AWS 账户可以在 EC2-Classic 或 VPC 中启动实例，或者仅在 VPC 中启动。如果您只能在 VPC 中启动实例，系统会为您创建一个默认 VPC。当您启动实例时，我们会将其启动为默认 VPC，除非您创建了非默认 VPC 并在启动实例时对其做出指定。 | 2013 年 3 月 11 日 | 
| EBS 快照副本 | 2012-12-01 | 您可以使用快照备份创建数据备份、创建新 Amazon EBS 卷，或创建亚马逊机器映像（AMI）。 | 2012 年 12 月 17 日 | 
| 已更新 Provisioned IOPS SSD 卷的 EBS 指标和状态检查 | 2012 年 10 月 1 日 | 已更新 EBS 指标，以便包含 Provisioned IOPS SSD 卷的两项新指标。还添加了 Provisioned IOPS SSD 卷的新状态检查。 | 2012 年 11 月 20 日 | 
| 竞价型实例请求状态 | 2012 年 10 月 1 日 | 竞价型实例请求状态简化了确定您的 Spot 请求状态的过程。 | 2012 年 10 月 14 日 | 
| Amazon EC2 预留实例 Marketplace | 2012 年 8 月 15 日 | 预留实例 Marketplace 将想要出售不再需要的 Amazon EC2 预留实例的卖方与正在寻找购买额外容量的买方匹配起来。通过预留实例 Marketplace 购买和出售的预留实例与其他预留实例一样工作，不同的是他们受标准条款限制更少，并能以不同价格出售。 | 2012 年 9 月 11 日 | 
| 适用于 Amazon EBS 的 Provisioned IOPS SSD | 2012 年 7 月 20 日 | Provisioned IOPS SSD 卷为 I/O 密集型工作负载，如依赖于稳定和快速响应时间的数据库应用程序，提供可预测、高性能的服务。 | 2012 年 7 月 31 日 | 
| IAM 对 Amazon EC2 实例的作用 | 2012-06-01 | 适用于 Amazon EC2 实例的 IAM 角色提供：+  AWS在 Amazon EC2 实例上运行的应用程序的 访问密钥。 <br />+  Amazon EC2 实例上的 AWS 访问密钥的自动交替。 <br />+  为 Amazon EC2 实例上请求 AWS 服务的运行应用程序细调权限。  | 2012 年 6 月 11 日 | 
| 让启动和处理中断可能性变得更加容易的竞价型实例功能。 |  | 现在您可以按照以下方式管理您的竞价型实例：+  使用 Auto Scaling 启动配置指定您愿意为竞价型实例支付的金额，并设置计划来指定您愿意为竞价型实例支付的金额。有关更多信息，请参阅《Amazon EC2 Auto Scaling 用户指南》**中的[请求竞价型实例](https://docs.aws.amazon.com/autoscaling/ec2/userguide/launch-template-spot-instances.html)。 <br />+  实例启动或终止时获得通知。 <br />+  在 AWS 资源堆栈中使用 CloudFormation 模板来启动竞价型实例。  | 2012 年 6 月 7 日 | 
| 用于 Amazon EC2 状态检查的 EC2 实例导出和时间戳  | 2012 年 5 月 1 日 | 已添加将您原先导入到 EC2 的 Windows Server 实例导出的支持。<br />已添加对实例状态和系统状态时间戳的支持，该戳记显示状态检查失败的日期和时间。 | 2012 年 5 月 25 日 | 
| Amazon VPC 实例和系统状态检查中的 EC2 实例导出和时间戳 | 2012 年 5 月 1 日 | 已添加将 EC2 实例导出至 Citrix Xen、Microsoft Hyper-V 和 VMware vSphere 的支持。<br />已添加多实例和系统状态检查中的时间戳的支持。 | 2012 年 5 月 25 日 | 
| AWS Marketplace AMI | 2012 年 4 月 1 日 | 增加了对 AWS Marketplace AMI 的支持。 | 2012 年 4 月 19 日 | 
| 预留实例定价套餐 | 2011 年 12 月 15 日 | 增加了新的一节来讨论如何充分利用预留实例定价套餐自带的折扣价格。 | 2012 年 3 月 5 日 | 
| Amazon Virtual Private Cloud 中的适用于 EC2 实例的 Elastic Network Interfaces (ENIs) | 2011 年 12 月 1 日 | 已添加有关 VPC 中适用于 EC2 实例的 Elastic Network Interfaces (ENIs) 的新章节。有关更多信息，请参阅[弹性网络接口](using-eni.md)。 | 2011 年 12 月 21 日 | 
| Amazon EC2 预留实例的新产品类型 | 2011 年 11 月 1 日 | 您可以选择各种各样的预留实例产品，以满足您对实例的预期使用要求。 | 2011 年 12 月 1 日 | 
| Amazon EC2 实例状态 | 2011 年 11 月 1 日 | 您可以查看您的实例状态的其他详细信息，包括 AWS 计划的可能会影响您的实例的事件。这些操作活动包括，执行软件更新和安全性补丁程序所要求的实例重启，和出现硬件问题时所需的实例停止。有关更多信息，请参阅[监控 Amazon EC2 实例的状态](monitoring-instances-status-check.md)。 | 2011 年 11 月 16 日 | 
| Amazon VPC 中的竞价型实例 | 2011-07-15 | 增加了 Amazon VPC 中的竞价型实例支持的有关信息。通过此更新，用户可以在 Virtual Private Cloud (VPC) 中启动竞价型实例。通过在 VPC 中启动竞价型实例，竞价型实例的用户可以享受到 Amazon VPC 带来的好处。 | 2011 年 10 月 11 日 | 
| 适用于 CLI 工具用户的简化的 VM Import 过程 | 2011-07-15 | `ImportInstance` 和 `ImportVolume` 的增强功能简化了 VM Import 过程；现在，创建导入任务后，系统会将映像上传到 Amazon EC2 上。此外，通过引入 `ResumeImport`，用户可以从任务停止的时间点重新开始未完成的上传。 | 2011 年 9 月 15 日 | 
| 导入 VHD 文件格式的支持 |  | VM Import 现在可导入 VHD 格式的虚拟机图像文件。VHD 文件格式与 Citrix Xen 和 Microsoft Hyper-V 虚拟化平台兼容。通过这种新产品，VM Import 现在支持 RAW、VHD 和 VMDK (与 VMware ESX 兼容的) 图像格式。有关更多信息，请参阅 [VM Import/Export 用户指南](https://docs.aws.amazon.com/vm-import/latest/userguide/)。 | 2011 年 8 月 24 日 | 
| 更新至适用于 VMware vCenter 的 Amazon EC2 VM Import 连接器 |  | 适用于 VMware vCenter 虚拟设备 (连接器) 的 1.1 版本的 Amazon EC2 VM Import 连接器的有关补充信息。此次更新包括访问因特网的代理支持、更好的错误处理方法、任务进度栏准确性的提高以及一些 bug 修复。 | 2011 年 6 月 27 日 | 
| 竞价型实例可用区定价更改 | 2011 年 5 月 15 日 | 增加了竞价型实例可用区定价功能的有关信息。在此版本中，新增了可用区定价选项，当您查询竞价型实例请求和 Spot 价格历史记录时，返回的信息中将包含这些新定价选项。通过这些新增功能，可以更方便地确定将竞价型实例启动到特定可用区所需的价格。 | 2011 年 5 月 26 日 | 
| AWS Identity and Access Management |  | 已添加 AWS Identity and Access Management（IAM）的有关信息，使用户可以指定借助 Amazon EC2 资源一般能使用哪些 Amazon EC2 功能。有关更多信息，请参阅[适用于 Amazon EC2 的 Identity and Access Management](security-iam.md)。 | 2011 年 4 月 26 日 | 
| 专用实例 |  | 专用实例是在 Amazon Virtual Private Cloud (Amazon VPC) 中启动的，是在主机硬件层次上物理隔离的实例。专用实例让您能享用 Amazon VPC 和 AWS 云的好处，包括按需弹性配置、仅为实际用量付费等，但同时也在硬件层次上隔离您的 Amazon EC2 计算实例。有关更多信息，请参阅[Amazon EC2 专用实例](dedicated-instance.md)。 | 2011 年 3 月 27 日 | 
| 预留实例更新至 AWS 管理控制台 |  | 更新至 AWS 管理控制台让用户查看他们的预留实例以及购买额外预留实例，包括专用预留实例，变得更加简单。 | 2011 年 3 月 27 日 | 
| 元数据信息 | 2011 年 1 月 1 日 | 已添加元数据的有关信息，将反映 2011-01-01 版本中的更改。有关更多信息，请参阅[使用实例元数据管理 EC2 实例](ec2-instance-metadata.md)和[实例元数据类别](ec2-instance-metadata.md#instancedata-data-categories)。 | 2011 年 3 月 11 日 | 
| 适用于 VMware vCenter 的 Amazon EC2 VM Import 连接器。 |  | 已添加适用于 VMware vCenter 虚拟设备 (连接器) 的 Amazon EC2 VM Import 连接器的有关信息。这个连接器是一个用于 VMware vCenter 的插件，集成了 VMware vSphere 客户端，并提供了一个图形用户界面，您可以用它来将 VMware 虚拟机导入到 Amazon EC2 中。 | 2011 年 3 月 3 日 | 
| 实施卷分离 |  | 您现在可以使用 AWS 管理控制台 强制将 Amazon EBS 卷从实例分离。 | 2011 年 2 月 23 日 | 
| 实例终止保护 |  | 您现在可以使用 AWS 管理控制台来防止实例终止。有关更多信息，请参阅[更改实例终止保护](Using_ChangingDisableAPITermination.md)。 | 2011 年 2 月 23 日 | 
| VM Import | 2010-11-15 | 已添加有关 VM Import 的信息，允许您将虚拟机或卷导入到 Amazon EC2 中。有关更多信息，请参阅 [VM Import/Export 用户指南](https://docs.aws.amazon.com/vm-import/latest/userguide/)。 | 2010 年 12 月 15 日 | 
| 实例的基本监控 | 2010-08-31 | 已添加有关 EC2 实例的基本监控的信息。 | 2010 年 12 月 12 日 | 
| 筛选条件和标记 | 2010-08-31 | 已添加列举、筛选和标记资源的有关信息。有关更多信息，请参阅[查找 Amazon EC2 资源](Using_Filtering.md)和[标记 Amazon EC2 资源](Using_Tags.md)。 | 2010 年 9 月 19 日 | 
| 幂等实例启动 | 2010-08-31 | 已添加关于确保实例运行时的幂等性的信息。 | 2010 年 9 月 19 日 | 
| AWS Identity and Access ManagementAmazon EC2 的  |  | Amazon EC2 现已集成（AWS Identity and Access ManagementIAM）。有关更多信息，请参阅[适用于 Amazon EC2 的 Identity and Access Management](security-iam.md)。 | 2010 年 9 月 2 日 | 
| Amazon VPC IP 地址指定 | 2010-06-15 | Amazon VPC 用户现在可以指定用于分配在 VPC 中启动的实例的 IP 地址。 | 2010 年 7 月 12 日 | 
| 对 Amazon EBS 卷进行 Amazon CloudWatch 监控 |  | Amazon CloudWatch 监控现在可以自动用于 Amazon EBS 卷。 | 2010 年 6 月 14 日 | 
| Windows 预留实例 |  | Amazon EC2 现在支持 Windows 预留实例。 | 2010 年 2 月 22 日 | 