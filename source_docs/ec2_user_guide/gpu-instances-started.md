

# 开始使用 GPU 加速实例
<a name="gpu-instances-started"></a>

最新一代 GPU 加速实例类型（如以下列表所示的类型）为深度学习和高性能计算 (HPC) 应用程序提供了最高性能的功能。选择实例类型链接以了解有关其功能的更多信息。
+ [P6 系列](https://aws.amazon.com/ec2/instance-types/p6/)
+ [P6 系列](https://aws.amazon.com/ec2/instance-types/p6/)
+ [P5 系列](https://aws.amazon.com/ec2/instance-types/p5/)

有关加速实例类型的实例类型规范的完整列表，请参阅 *Amazon EC2 实例类型*参考中的[加速计算](https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html)。

**软件配置**  
开始使用最新一代 GPU 加速实例类型的最简单方法是从预先配置了所有必需软件的 AWS 深度学习 AMI 启动实例。有关与 GPU 加速实例类型配合使用的最新 AWS Deep Learning AMIs，请参阅《*AWS Deep Learning AMIs 开发人员指南*》中的 [P6 Supported DLAMI](https://docs.aws.amazon.com/dlami/latest/devguide/p6-support-dlami.html)。

如果需要构建自定义 AMI 来启动托管深度学习或 HPC 应用程序的实例，则建议在基础映像上安装以下最低软件版本。


| 实例类型 | NVIDIA 驱动程序 | CUDA | NVIDIA GDRCopy | EFA 安装程序 | NCCL | EFA K8s | 
| --- | --- | --- | --- | --- | --- | --- | 
| G7 | 595 | 13.2 | 2.5.1 | 1.48.0 | 2.29.7-1 | 0.5.10 | 
| G7e | 575 | 12.9 | 2.5 | 1.45.0 | 2.28.3 | 0.5.10 | 
| P5 | 530 | 12.1 | 2.3 | 1.24.1 | 2.18.3 | 0.4.4 | 
| p5.4xLarge | 530 | 12.1 | 2.3 | 1.43.1 ² | 2.18.3 | 0.4.4 | 
| P5e | 550 | 12.1 | 2.3 | 1.24.1 | 2.18.3 | 0.5.5 | 
| P5en | 550 | 12.1 | 2.3 | 1.24.1 | 2.18.3 | 0.5.6 | 
| P6-B200 | 570 | 12.8 | 2.5 | 1.41.0 | 2.26.2-1 | 0.5.10 | 
| P6e-GB200 | 570 | 12.8 | 2.5 | 1.41.0 | 2.26.2-1 | 0.5.10 | 
| P6-B300 | 580 | 13.0 | 2.5 | 1.44.0 | 2.28.3 | 0.5.10 | 

** ¹** **EFA K8s** 列包含 `aws-efa-k8s-device-plugin` 的最低推荐版本。

**²** 当 GPU 到 GPU 通信使用 Elastic Fabric Adapter (EFA) 和 NVIDIA 集体通信库 (NCCL) 时，存在影响 `P5.4xlarge` 实例的兼容性问题。要缓解此问题，需将环境变量 `FI_HMEM_DISABLE_P2P` 设置为 `1`，并确保安装了 1.43.1 或更高版本的 EFA。

**注意**  
如果您使用 EFA 安装程序 1.41.0 版本，则 `aws-ofi-nccl plugin` 会附带它。对于早期版本的 EFA 安装程序，请使用 `aws-ofi-nccl plugin` 版本 `1.7.2-aws` 或更高版本。

还会建议您将实例配置为不使用深层 C 状态。有关更多信息，请参阅《Amazon Linux 2 User Guide》**中的 [High performance and low latency by limiting deeper C-states](https://docs.aws.amazon.com/linux/al2/ug/processor_state_control.html#c-states)。最新的 AWS 深度学习基础 GPU AMI 已预先配置为不使用深层 C 状态。

有关网络和 Elastic Fabric Adapter（EFA）配置，请参阅 [使用多网卡最大化 Amazon EC2 实例上的网络带宽](efa-acc-inst-types.md)。