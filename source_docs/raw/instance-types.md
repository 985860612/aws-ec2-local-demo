

# Amazon EC2 实例类型
<a name="instance-types"></a>

启动实例时，您指定的*实例类型* 决定了用于您的实例的主机硬件。每个实例类型提供不同的计算、内存和存储功能，并按照这些功能分组到实例系列。选择一种基于您打算在实例上运行的应用程序或软件的需求的实例类型。有关功能和使用案例的更多信息，请参阅 [Amazon EC2 实例类型](https://aws.amazon.com/ec2/instance-types/)。

Amazon EC2 会将主机的一些资源（例如 CPU、内存和实例存储）专用于特定实例。Amazon EC2 在实例间共享主机的其他资源，例如网络和磁盘子系统。如果一个主机上的每个实例都试图尽可能多地使用这些共享的资源，那么每个实例都将获得该资源相等份额。但是，当某个资源利用不充分时，会有实例会在该资源可用时消耗其更多的份额。

每种实例类型均从共享资源提供更高或更低的起始性能。例如，高 I/O 性能的实例类型能获取共享资源的更高份额。分配更大份额的共享资源也降低了 I/O 性能的方差。对于大多数应用程序，中等 I/O 是绰绰有余的。然而，对于需要更大或一致性更高的 I/O 性能的应用程序，可考虑使用更高 I/O 性能的实例类型。

**Topics**
+ [可用实例类型](#AvailableInstanceTypes)
+ [硬件规格](#instance-hardware-specs)
+ [虚拟机监控程序类型](#instance-hypervisor-type)
+ [AMI 虚拟化类型](#instance-virtualization-type)
+ [处理器](#instance-types-processors)
+ [查找 Amazon EC2 实例类型](instance-discovery.md)
+ [从 EC2 实例类型查找器获取建议](get-ec2-instance-type-recommendations.md)
+ [从 Compute Optimizer 获取 EC2 实例建议](ec2-instance-recommendations.md)
+ [Amazon EC2 实例类型更改](ec2-instance-resize.md)
+ [可突增性能实例](burstable-performance-instances.md)
+ [使用 GPU 实例加速性能](configure-gpu-instances.md)
+ [Amazon EC2 Mac 实例](ec2-mac-instances.md)
+ [Amazon EBS 优化的实例类型](ebs-optimized.md)
+ [Amazon EC2 实例适用的 CPU 选项](instance-optimize-cpu.md)
+ [Amazon EC2 实例的 AMD SEV-SNP](sev-snp.md)
+ [Amazon EC2 Linux 实例的处理器状态控制](processor_state_control.md)

## 可用实例类型
<a name="AvailableInstanceTypes"></a>

Amazon EC2 提供各种不同的实例类型，这些实例类型经过优化，适合不同的使用案例。实例类型包括 CPU、内存、存储和网络容量的不同组合，便于您灵活选择适合应用程序的资源组合。每种实例类型都包含一个或多个实例大小，您可以根据目标工作负载的要求扩展资源。

**实例类型命名约定**  
名称基于实例系列、代系、处理器系列、功能和型号。有关更多信息，请参阅《Amazon EC2 实例类型指南》**中的[命名约定](https://docs.aws.amazon.com/ec2/latest/instancetypes/instance-type-names.html)。

**查找实例类型**  
要确定哪些实例类型满足您的要求（例如支持的区域、计算资源或存储资源），请参阅 [查找 Amazon EC2 实例类型](instance-discovery.md) 和《Amazon EC2 Instance Types Guide》**中的 [Amazon EC2 instance type specifications](https://docs.aws.amazon.com/ec2/latest/instancetypes/ec2-instance-type-specifications.html)。

## 硬件规格
<a name="instance-hardware-specs"></a>

有关详细的实例类型规格，请参阅《Amazon EC2 实例类型指南》**中的[规格](https://docs.aws.amazon.com/ec2/latest/instancetypes/ec2-instance-type-specifications.html)。有关定价信息，请参阅 [Amazon EC2 按需定价](https://aws.amazon.com/ec2/pricing/on-demand/)。

要确定最适合您的需求的实例类型，我们建议启动一个实例，并使用自己的基准测试应用程序。由于您是按实例秒付费的，因此在做出决策前测试多个实例类型将会既方便又经济。如果您的需求有变化，甚至是在做出决策后，您可以在以后更改您的实例类型。有关更多信息，请参阅 [Amazon EC2 实例类型更改](ec2-instance-resize.md)。

## 虚拟机监控程序类型
<a name="instance-hypervisor-type"></a>

Amazon EC2 支持以下虚拟机监控程序：Xen 和 Nitro。

**基于 Nitro 的实例**
+ **通用型：**M5 \| M5a \| M5ad \| M5d \| M5dn \| M5n \| M5zn \| M6a \| M6g \| M6gd \| M6i \| M6id \| M6idn \| M6in \| M7a \| M7g \| M7gd \| M7i \| M7i-flex \| M8a \| M8azn \| M8g \| M8gb \| M8gd \| M8gn \| M8i \| M8id \| M8i-flex \| M8in \| M8idn \| M8ine \| M8ib \| M8idb \| M9g \| M9gd \| T3 \| T3a \| T4g
+ **计算优化型：**C5 \| C5a \| C5ad \| C5d \| C5n \| C6a \| C6g \| C6gd \| C6gn \| C6i \| C6id \| C6in \| C7a \| C7g \| C7gd \| C7gn \| C7i \| C7i-flex \| C8a \| C8g \| C8gb \| C8gd \| C8gn \| C8i \| C8id \| C8i-flex \| C8in \| C8ine \| C8ib \| C9g \| C9gd
+ **内存优化型：**R5 \| R5a \| R5ad \| R5b \| R5d \| R5dn \| R5n \| R6a \| R6g \| R6gd \| R6i \| R6id \| R6idn \| R6in \| R7a \| R7g \| R7gd \| R7i \| R7iz \| R8a \| R8g \| R8gb \| R8gd \| R8gn \| R8i \| R8id \| R8i-flex \| R8in \| R8idn \| R8ib \| R8idb \| R9g \| R9gd \| U-3tb1 \| U-6tb1 \| U-9tb1 \| U-12tb1 \| U-18tb1 \| U-24tb1 \| U7i-6tb \| U7i-8tb \| U7i-12tb \| U7in-16tb \| U7in-24tb \| U7in-32tb \| U7inh-32tb \| X2gd \| X2idn \| X2iedn \| X2iezn \| X8g \| X8aedz \| X8i \| z1d
+ **存储优化型：**D3 \| D3en \| I3en \| I4g \| I4i \| I7i \| I7ie \| I8g \| I8ge \| Im4gn \| Is4gen
+ **加速计算型：**DL1 \| DL2q \| F2 \| G4ad \| G4dn \| G5 \| G5g \| G6 \| G6e \| G6f \| Gr6 \| Gr6f \| G7 \| G7e \| Inf1 \| Inf2 \| P4d \| P4de \| P5 \| P5e \| P5en \| P6-B200 \| P6-B300 \| P6e-GB200 \| Trn1 \| Trn1n \| Trn2 \| Trn2u \| VT1
+ **高性能计算：**Hpc6a \| Hpc6id \| Hpc7a \| Hpc7g \| Hpc8a
+ **上一代实例：**A1 \| P3dn

要详细了解支持的 Nitro 虚拟机监控器版本，请参阅 *Amazon EC2 实例类型指南*中的[网络功能支持](https://docs.aws.amazon.com/ec2/latest/instancetypes/ec2-nitro-instances.html#nitro-version-network-features)。

**基于 Xen 的实例**
+ **通用型**：M1 \| M2 \| M3 \| M4 \| T1 \| T2
+ **计算优化型**：C1 \| C3 \| C4
+ **内存优化型**：R3 \| R4 \| X1 \| X1e
+ **存储优化型**：D2 \| H1 \| I2 \| I3
+ **加速计算型**：G3 \| P3

## AMI 虚拟化类型
<a name="instance-virtualization-type"></a>

<a name="virtualization"></a>实例的虚拟化类型由用于启动该实例的 AMI 决定。最新一代实例类型仅支持硬件虚拟机 (HVM)。某些上一代实例类型支持半虚拟化 (PV)，某些 AWS 区域支持半虚拟化实例。有关更多信息，请参阅[虚拟化类型](ComponentsAMIs.md#virtualization_types)。

为获得最佳性能，我们建议您使用 HVM AMI。此外，HVM AMI 还需要利用增强联网。HVM 虚拟化使用 AWS 平台提供的硬件辅助技术。借助 HVM 虚拟化，访客虚拟机如同在本地硬件平台上运行一样，除了仍然使用半虚拟 (PV) 网络和存储驱动程序以提高性能。

## 处理器
<a name="instance-types-processors"></a>

EC2 实例支持多种处理器。

**Topics**
+ [英特尔处理器](#instance-hardware-processors)
+ [AMD 处理器](#amd-epyc-instances)
+ [AWS Graviton 处理器](#aws-graviton-instances)
+ [AWS Trainium](#aws-trainium-instances)
+ [AWS Inferentia](#aws-inferentia-instances)

### 英特尔处理器
<a name="instance-hardware-processors"></a>

在 Intel 处理器上运行的 Amazon EC2 实例可能包括以下处理器功能。并非所有在 Intel 处理器上运行的实例都支持所有这些处理器功能。有关每种实例类型有哪些功能可用的信息，请参阅 [Amazon EC2 实例类型](https://aws.amazon.com/ec2/instance-types/)。
+ **Intel AES New Instructions (AES-NI)** — Intel AES-NI 加密指令集改进了原先 Advanced Encryption Standard (AES) 的算法，可以提供更快的数据保护和更好的安全性。所有最新一代 EC2 实例都支持此处理器功能。
+ **Intel Advanced Vector Extensions（Intel AVX、Intel AVX2 和 Intel AVX-512）** — ：Intel AVX/Intel AVX2 和 Intel AVX-512 分别是 256 位和 512 位指令集扩展，专为浮点 (FP) 密集型应用程序而设计。Intel AVX 指令可以提升诸如图像和音频/视频处理、科学模拟、财务分析、3D 建模与分析等应用的性能。这些功能仅在使用 HVM AMI 启动的实例上可用。
+ **Intel 睿频加速技术** — Intel 睿频加速技术处理器以比基本操作频率快的速度自动运行核心。
+ **Intel Deep Learning Boost (Intel DL Boost)** — 加速 AI 深度学习使用案例。第二代 Intel Xeon 可扩展处理器能够扩展采用全新向量神经网络指令 (VNNI/INT8) 的 Intel AVX-512，与上一代 Intel Xeon 可扩展处理器（配有 FP32）相比，深度学习推理性能显著提高，适用于图像识别/分割、对象检测、语音识别、语言翻译、推荐系统和强化学习等。VNNI 可能不会兼容所有 Linux 发行版。

  以下实例支持 VNNI：`M5n`、`R5n`、`M5dn`、`M5zn`、`R5b`、`R5dn`、`D3`、`D3en` 和 `C6i`。`C5` 和 `C5d` 实例仅支持 `12xlarge`、`24xlarge` 和 `metal` 实例的 VNNI。

64 位 CPU 的行业命名惯例可能会导致混淆。芯片制造商 Advanced Micro Devices (AMD) 成功引入了第一款基于 Intel x86 指令集的商用 64 位架构。因此，不论芯片制造商是谁，这一架构被普遍称为 AMD64。Windows 和多个 Linux 发行版遵循这一实践。这说明了为什么实例即使运行在 Intel 硬件上，但 Ubuntu 或 Windows 上的内部系统信息仍将 CPU 架构显示为 AMD64。

### AMD 处理器
<a name="amd-epyc-instances"></a>

在 [AMD EPYC](https://aws.amazon.com/ec2/amd/) 处理器上运行的 Amazon EC2 实例有助您优化工作负载的成本和性能。此类实例可能支持以下处理器功能。并非所有在 AMD 处理器上运行的实例都支持所有这些处理器功能。有关每种实例类型有哪些功能可用的信息，请参阅 [Amazon EC2 实例类型](https://aws.amazon.com/ec2/instance-types/)。
+ AMD 安全内存加密（SME）
+ AMD 透明单密钥内存加密（TSME）
+ AMD 高级向量扩展（AVX）
+ AMD 安全加密虚拟化安全嵌套分页（[SEV-SNP](sev-snp.md)）
+ 向量神经网络指令（VNNI）
+ BFloat16

### AWS Graviton 处理器
<a name="aws-graviton-instances"></a>

[AWS Graviton](https://aws.amazon.com/ec2/graviton/) 是一系列处理器，旨在为在 Amazon EC2 实例上运行的工作负载提供最佳的性价比。

有关更多信息，请参阅 [Getting started with Graviton](https://aws.amazon.com/ec2/graviton/getting-started/)。

### AWS Trainium
<a name="aws-trainium-instances"></a>

由 [AWS Trainium](https://aws.amazon.com/ai/machine-learning/trainium/) 提供支持的实例专为高性能、经济实惠的深度学习训练而构建。您可以使用这些实例来训练在语音识别、推荐、欺诈检测以及图像和视频分类等各种应用程序中使用的自然语言处理、计算机视觉和推荐器模型。在流行的机器学习（ML）框架（如 PyTorch 和 TensorFlow）中使用您的现有工作流程。

### AWS Inferentia
<a name="aws-inferentia-instances"></a>

由 [AWS Inferentia](https://aws.amazon.com/ai/machine-learning/inferentia/) 提供支持的实例旨在加速机器学习。其提供高性能、低延迟的机器学习推理。这些实例经过优化，专用于部署各种应用领域的深度学习 (DL) 模型，例如自然语言处理、对象检测和分类、内容个性化和过滤以及语音识别。

您可以通过多种方式开始使用这些模型：
+ 使用 SageMaker AI（这是一种完全托管式服务）是开始使用机器学习模型的最简单方法。有关更多信息，请参阅《Amazon SageMaker AI Developer Guide》**中的 [Get Started with SageMaker AI](https://docs.aws.amazon.com/sagemaker/latest/dg/gs.html)。
+ 使用 Deep Learning AMI 启动 Inf1 或 Inf2 实例。有关更多信息，请参阅 *AWS Deep Learning AMIs 开发人员指南*中的[使用 DLAMI 的 AWS Inferentia](https://docs.aws.amazon.com/dlami/latest/devguide/tutorial-inferentia.html)。
+ 使用您自己的 AMI 启动 Inf1 或 Inf2 实例并安装 [AWS Neuron 开发工具包](https://github.com/aws/aws-neuron-sdk)，您可以利用此工具包为 AWS Inferentia 编译、运行和分析深度学习模型。
+ 结合使用 Inf1 或 Inf2 实例和经过 Amazon ECS 优化的 AMI 启动容器实例。有关更多信息，请参阅《Amazon Elastic Container Service 开发人员指南》**中的 [Amazon Linux 2（Inferentia）AMI](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-optimized_AMI.html)。
+ 创建包含运行 Inf1 实例的节点的 Amazon EKS 集群。有关更多信息，请参阅 **Amazon EKS 用户指南**中的 [Inferentia 支持](https://docs.aws.amazon.com/eks/latest/userguide/inferentia-support.html)。