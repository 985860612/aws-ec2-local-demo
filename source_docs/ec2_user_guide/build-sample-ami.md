

# 构建示例 Amazon Linux 2023 映像描述
<a name="build-sample-ami"></a>

AWS 提供了示例 Amazon Linux 2023 映像描述，您可以将其作为创建自定义可证明的 AMI 的起点，以满足自己的工作负载需求。示例映像描述包括作为基本操作系统的 Amazon Linux 2023，用于文件系统不可变性的 `dm-verity` 和 `erofs` 配置，其删除了所有交互式访问权限（例如 SSH、EC2 实例连接和串行控制台），以创建隔离的计算环境。有关示例映像描述的更多信息，请参阅 [Github repo](https://github.com/amazonlinux/kiwi-image-descriptions-examples)。

示例映像描述会自动在构建映像的 `/usr/bin/` 目录中安装 NitroTPM 工具（`nitro-tpm-pcr-compute` 和 `nitro-tpm-attest`）。这可确保从 AMI 启动的实例上已预安装这些工具。

示例映像描述包含一个脚本 `edit_boot_install.sh`，其中包含生成参考测量值所需的命令。该脚本将 KIWI NG 创建的原始磁盘映像文件 (`.raw`) 挂载到环回设备，找到文件扩展名为 `.efi` 的 UKI，然后运行 `nitro-tpm-pcr-compute` 实用程序来生成 AMI 的参考测量值。该脚本由 KIWI NG 在构建期间自动执行。

本教程向您展示如何构建示例映像描述以创建可证明的 AMI。

有关创建您自己的映像描述的更多信息，请参阅以下 KIWI NG 文档：
+ [快速入门](https://osinside.github.io/kiwi/quickstart.html)
+ [映像描述](https://osinside.github.io/kiwi/image_description.html)
+ [示例 Amazon Linux 2023 映像描述](https://github.com/amazonlinux/kiwi-image-descriptions-examples)

先决条件

您的 IAM 身份必须具有以下权限才能完成本教程：
+ `arn:aws:ec2:*::snapshot/*` 上的 `ebs:CompleteSnapshot`、`ebs:StartSnapshot`、`ebs:PutSnapshotBlock` 权限
+ `ec2:RegisterImage`对所有资源的 

**使用 KIWI NG 构建示例 Amazon Linux 2023 映像描述**

1. 使用最新的 AL2023 AMI 启动 Amazon EC2 实例。为确保您的实例有足够的存储空间来构建 AMI，请确保预置至少 12 GB 的存储空间。

1. 安装所需的依赖项。以下命令将安装以下实用程序：
   + `kiwi-cli`
   + `veritysetup`
   + `erofs-utils`
   + `aws-nitro-tpm-tools`

   ```
   sudo dnf install -y kiwi-cli python3-kiwi kiwi-systemdeps-core python3-poetry-core qemu-img veritysetup erofs-utils git cargo aws-nitro-tpm-tools
   ```

1. 安装 `coldsnap` 实用程序。此实用程序使您能够根据原始映像数据创建 Amazon EBS 快照。您将使用此实用程序根据 KIWI NG 创建的原始磁盘映像文件创建 EBS 快照。

   ```
   git clone https://github.com/awslabs/coldsnap.git
   cd coldsnap
   cargo install --locked coldsnap
   cd ..
   ```

1. 获取示例映像描述文件。

   ```
   sudo dnf install kiwi-image-descriptions-examples
   ```

   示例映像描述文件将下载到以下目录：`/usr/share/kiwi-image-descriptions-examples/al2023/attestable-image-example`

1. 使用 KIWI NG `system build` 命令生成示例映像描述。以下命令将在 `./image` 目录中创建原始磁盘映像文件。

   ```
   sudo kiwi-ng \
   --color-output \
   --loglevel 0 \
   system build \
   --description /usr/share/kiwi-image-descriptions-examples/al2023/attestable-image-example \
   --target-dir ./image
   ```

   有关更多信息，请参阅 [kiwi-ng system build](https://osinside.github.io/kiwi/commands/system_build.html) 文档。

1. 获取 AMI 的参考测量值。这些测量值由 `nitro-tpm-pcr-compute` 实用程序在上一步的映像构建过程中生成。您可在以下文件中找到参考测量值：`./image/pcr_measurements.json`。

   这些测量值均使用以下 JSON 格式提供：

   ```
   {
     "Measurements": {
       "HashAlgorithm": "SHA384 { ... }",
       "PCR4": "{{PCR4_measurement}}",
       "PCR7": "{{PCR7_measurement}}",
       "PCR12": "{{PCR12_measurement}}"
     }
   }
   ```

1. 使用 `coldsnap` 实用程序将 KIWI NG 创建的原始磁盘映像上传到 EBS 快照。该命令将返回快照 ID。记下该 ID，您需要在下一步中使用它。

   ```
   SNAPSHOT=$(.cargo/bin/coldsnap upload ./image/al2023*.raw)
   echo "Created snapshot: $SNAPSHOT"
   ```

   有关 `coldsnap` 实用程序的更多信息，请参阅 [coldsnap GitHub repo](https://github.com/awslabs/coldsnap)。

1. 使用上一步中的快照注册启用 TPM 2.0 且具有 UEFI 启动模式 的 AMI。对于 `--architecture`，请为 Intel 指定 `x86_64`，或为 Graviton 指定 `arm64`。

   ```
   aws ec2 register-image \
   --name "attestable_isolated_al2023_ami" \
   --virtualization-type hvm \
   --boot-mode uefi \
   --architecture {{x86_64|arm64}} \
   --root-device-name /dev/xvda \
   --block-device-mappings DeviceName=/dev/xvda,Ebs={SnapshotId=${SNAPSHOT}} \
   --tpm-support v2.0 \
   --ena-support
   ```