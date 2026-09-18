

# 可证明的 AMI
<a name="attestable-ami"></a>

可证明的 AMI 是具有相应加密哈希的亚马逊机器映像（AMI），该哈希代表其所有内容。哈希值在 AMI 创建过程中生成，并根据该 AMI 的全部内容（包括应用程序、代码和启动过程）计算得出。

## 保持可认证的状态
<a name="maintain-attestability"></a>

实例的测量值基于其初始启动状态。启动后对实例所做的任何软件或代码更改，如果在重启后仍然存在，都将在重启后更改实例的测量值。如果测量值发生更改，它们就会偏离可证明的 AMI 的参考测量值，并且实例在实例重启后将无法再成功向 AWS KMS 认证。因此，要使可证明的 AMI 发挥作用，实例需要在其重启后恢复到其原始启动状态。

始终返回到原始启动状态可确保实例在重启后能够成功认证。以下实用程序可用于确保实例在重启后保持可认证状态：
+ `erofs`：增强型只读文件系统。此实用程序可确保您的根文件系统是只读的。使用此实用程序，对文件系统（包括 `/etc`、`/run` 和 `/var`）的写入将存储在内存中，并在实例重新启动时丢失，从而使根文件系统保持其原始启动状态。有关更多信息，请参阅 [erofs 文档](https://docs.kernel.org/filesystems/erofs.html)。
+ `dm-verity`：为只读根文件系统提供完整性保护。该实用程序计算文件系统块的哈希值并将其存储在内核命令行中。这使内核能够在启动期间验证文件系统的完整性。有关更多信息，请参阅 [dm-verity 文档](https://docs.kernel.org/admin-guide/device-mapper/verity.html)。

## 创建可证明的 AMI 的要求
<a name="ami-attestable-requirements"></a>

可证明的 AMI 有以下要求：
+ **基础操作系统**：Amazon Linux 2023 和 [NixOS](https://github.com/aws/nitrotpm-attestation-samples)
+ **架构**：`x86_64` 或 `arm64` 架构
+ **TPM 支持**：必须启用 NitroTPM。有关更多信息，请参阅 [将 NitroTPM 与 Amazon EC2 实例结合使用的要求](enable-nitrotpm-prerequisites.md)。
+ **启动模式**：必须启用 UEFI 启动模式。

**Topics**
+ [保持可认证的状态](#maintain-attestability)
+ [创建可证明的 AMI 的要求](#ami-attestable-requirements)
+ [创建可证明的 AMI](#sample-ami)
+ [构建示例映像描述](build-sample-ami.md)
+ [示例 Amazon Linux 2023 映像描述](al2023-isolated-compute-recipe.md)
+ [自定义示例映像描述](customize-sample-ami.md)
+ [计算 PCR 测量值](create-pcr-compute.md)

## 创建可证明的 AMI
<a name="sample-ami"></a>

要创建可证明的 AMI，您需要将 Amazon Linux 2023 与[下一代 KIWI（KIWI NG）](https://osinside.github.io/kiwi/)配合使用。Amazon Linux 2023 提供了使用 KIWI NG 构建可证明的 AMI 所需的所有软件和实用工具。

KIWI NG 是一款开源工具，用于构建预配置的基于 Linux 的映像。KIWI NG 使用 XML *映像描述*来定义映像的内容。映像描述指定了要运行的基本操作系统、软件、内核配置和脚本，以便为特定使用案例构建即用型 AMI。

在 AMI 构建期间，您需要使用 `nitro-tpm-pcr-compute` 实用程序根据 KIWI NG 生成的统一内核映像（UKI）生成参考测量值。有关使用 `nitro-tpm-pcr-compute` 实用程序的更多信息，请参阅[计算自定义 AMI 的 PCR 测量值](create-pcr-compute.md)。

AWS 提供了示例 Amazon Linux 2023 映像描述，其中包括在隔离的计算环境中配置 EC2 实例所需的所有配置。有关更多信息，请参阅 [构建示例 Amazon Linux 2023 映像描述](build-sample-ami.md)。