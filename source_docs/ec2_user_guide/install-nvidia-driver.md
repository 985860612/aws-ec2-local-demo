

# Amazon EC2 实例的 NVIDIA 驱动程序
<a name="install-nvidia-driver"></a>

已挂载 NVIDIA GPU 的实例（例如 P 系列或 G 系列实例类型）必须安装相应的 NVIDIA 驱动程序。根据实例类型，您可以下载公有 NVIDIA 驱动程序、从仅对 AWS 客户可用的 Amazon S3 下载驱动程序或者使用预安装了驱动程序的 AWS AMI。

要在挂载 AMD GPU 的实例（例如，G4ad 实例）上安装 AMD 驱动程序，则请参阅[AMD 驱动程序](install-amd-driver.md)。

**Topics**
+ [NVIDIA 驱动程序的类型](#nvidia-driver-types)
+ [按实例类型列出的可用驱动程序](#nvidia-driver-instance-type)
+ [安装选项](#nvidia-installation-options)
+ [使用包含 NVIDIA 驱动程序的 AMI](preinstalled-nvidia-driver.md)
+ [安装 NVIDIA 公共驱动程序](public-nvidia-driver.md)
+ [安装 NVIDIA GRID 驱动程序（G7e、G6、Gr6、G6e、G6f、Gr6f、G5、G4dn 和 G3 实例）](nvidia-GRID-driver.md)
+ [安装 NVIDIA 游戏驱动程序（G7e、G6、G6e、G5 和 G4dn 实例）](nvidia-gaming-driver.md)

## NVIDIA 驱动程序的类型
<a name="nvidia-driver-types"></a>

以下是可与基于 GPU 的实例一起使用的 NVIDIA 驱动程序的主要类型。

Tesla 驱动程序  
这些驱动程序主要用于将 GPU 用于计算任务的计算工作负载，例如适用于机器学习的并行浮点计算，以及适用于高性能计算应用的快速傅里叶变换。

GRID 驱动程序  
这些驱动程序经过认证，可针对渲染 3D 模型或高分辨率视频等内容的专业可视化应用程序，提供最佳性能。您可以将 GRID 驱动程序配置为支持两种模式。Quadro 虚拟工作站的每个 GPU 可支持四个 4K 显示器。GRID vApps 提供 RDSH App 托管功能。

Gaming 驱动程序  
这些驱动程序包含针对游戏的优化，并经常更新以提供性能增强。它们支持每个 GPU 单个 4K 显示器。

**已配置模式**  
在 Windows 上，Tesla 驱动程序配置为在 Tesla Compute Cluster (TCC) 模式下运行。GRID 和 Gaming 驱动程序配置为在 Windows Display Driver Model (WDDM) 模式下运行。在 TCC 模式下，该卡专用于计算工作负载。在 WDDM 模式下，该卡同时支持计算和图形工作负载。

**NVIDIA 控制面板**  
GRID 和游戏驱动程序支持 NVIDIA 控制面板。Tesla 驱动程序不支持此控制面板。

**支持 Tesla、GRID 和游戏驱动程序的 API**
+ OpenCL、OpenGL 和 Vulkan
+ NVIDIA CUDA 和相关库（例如，cuDNN、TensorRT、nvJPEG 和 cuBLAS）
+ 用于视频编码的 NVENC 和用于视频解码的 NVDEC
+ 仅限 Windows 的 API：DirectX、Direct2D、DirectX Video Acceleration、DirectX Raytracing

## 按实例类型列出的可用驱动程序
<a name="nvidia-driver-instance-type"></a>

下表总结了各种 GPU 实例类型支持的 NVIDIA 驱动程序。


| 实例类型 | Tesla 驱动程序 | GRID 驱动程序 | Gaming 驱动程序 | 
| --- | --- | --- | --- | 
| G3 | 是 | 是 | 否 | 
| G4dn | 是 | 是 | 是 | 
| G5 | 支持 | 是 | 是 | 
| G5g | 是¹ | 否 | 否 | 
| G6 | 支持 | 是 | 是 | 
| G6e | 支持 | 是 | 是 | 
| G6f | 否 | 是 | 否 | 
| Gr6 | 支持 | 是 | 否 | 
| Gr6f | 否 | 是 | 否 | 
| G7e | 支持 | 是 | 是 | 
| P3 | 是 | 否 | 否 | 
| P4d | 是 | 否 | 否 | 
| P4de | 是 | 否 | 否 | 
| P5 | 是 | 否 | 否 | 
| P5e | 是 | 否 | 否 | 
| P5en | 是 | 否 | 否 | 
| P6-B200 | 是 | 否 | 否 | 
| P6e-GB200 | 是 | 否 | 否 | 
| P6-B300 | 是 | 否 | 否 | 

¹ 此 Tesla 驱动程序还支持特定于 ARM64 平台的优化图形应用程序

## 安装选项
<a name="nvidia-installation-options"></a>

使用以下选项之一获取 GPU 实例所需的 NVIDIA 驱动程序。

**Options**

1. [使用包含 NVIDIA 驱动程序的 AMI](preinstalled-nvidia-driver.md)

1. [安装 NVIDIA 公共驱动程序](public-nvidia-driver.md)

1. [安装 NVIDIA GRID 驱动程序（G7e、G6、Gr6、G6e、G6f、Gr6f、G5、G4dn 和 G3 实例）](nvidia-GRID-driver.md)

1. [安装 NVIDIA 游戏驱动程序（G7e、G6、G6e、G5 和 G4dn 实例）](nvidia-gaming-driver.md)