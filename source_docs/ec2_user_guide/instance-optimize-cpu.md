

# Amazon EC2 实例适用的 CPU 选项
<a name="instance-optimize-cpu"></a>

许多 Amazon EC2 实例都支持同步多线程（SMT），该技术可让多个线程在一个 CPU 核心上并发运行。每个线程都表示为实例上的一个虚拟 CPU (vCPU)。实例具有默认数量的 CPU 核心，根据实例类型而异。例如，默认情况下，`m5.xlarge` 实例类型有两个 CPU 内核，每个内核有两个线程—，共四个 vCPU。

在大多数情况下，都有一个 Amazon EC2 实例类型，它具有适合您工作负载的内存和 vCPU 数量组合。但是，为了针对特定工作负载或业务需求优化实例，您可以在实例启动期间和之后指定以下 CPU 选项：
+ **CPU 核心数**：您可以自定义实例的 CPU 核心数。也许可以通过这种方式让实例拥有适合内存密集型工作负载的充足 RAM，同时减少 CPU 核心数，从而优化您的软件的许可成本。
+ **每核心线程数**：您可以通过为每个 CPU 核心指定一个线程来禁用 SMT。也许可以为特定工作负载执行该操作，例如高性能计算（HPC）工作负载。

**注意事项**
+ 您无法修改 T2、C7a、M7a、R7a 和 Apple 硅芯片 Mac 实例以及基于 AWS Graviton 处理器的实例的每个核心线程数。
+ [您可以运行的实例数量](https://docs.aws.amazon.com/ec2/latest/instancetypes/ec2-instance-quotas.html)基于所用实例类型的默认 vCPU。我们计算实例所消耗 vCPU 数量的方式不受更改其 CPU 选项的影响。

**定价**  
指定 CPU 选项不会增加费用。对于从包含许可证的 Windows 和 SQL Server AMI 中启动的 EC2 实例，您可以自定义 CPU 选项，以利用 EC2 优化 CPU 功能，从而根据为您的实例配置的 vCPU 数量来支付许可费用。对于其他 EC2 实例，收费标准与使用默认 CPU 选项启动的实例相同。

**Topics**
+ [指定 CPU 选项的规则](instance-cpu-options-rules.md)
+ [受支持的 CPU 选项](cpu-options-supported-instances-values.md)
+ [指定 CPU 选项](instance-specify-cpu-options.md)
+ [查看 CPU 选项](view-cpu-options.md)
+ [优化 CPU](optimize-cpu.md)