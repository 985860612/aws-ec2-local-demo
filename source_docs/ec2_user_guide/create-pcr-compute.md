

# 计算自定义 AMI 的 PCR 测量值
<a name="create-pcr-compute"></a>

`nitro-tpm-pcr-compute` 实用程序使您能够在构建期间根据可证明的 AMI 的统一内核映像（UKI）生成其参考测量值。

示例 Amazon Linux 2023 映像描述会自动将该实用程序安装到 `/usr/bin/` 目录中的内置映像。示例映像描述还包含一个脚本，其中包含在映像构建期间运行该实用程序生成参考测量值所需的命令。如果您使用示例映像描述，则无需安装或手动运行该实用程序。有关更多信息，请参阅 [构建示例 Amazon Linux 2023 映像描述](build-sample-ami.md)。

## 安装 `nitro-tpm-pcr-compute` 实用程序
<a name="nitro-tpm-compute-install"></a>

如果您使用 Amazon Linux 2023，则可以按如下方式从 Amazon Linux 存储库安装 `nitro-tpm-pcr-compute` 实用程序。

```
sudo yum install aws-nitro-tpm-tools
```

这些工具安装在 `/usr/bin` 目录中。

## 使用 `nitro-tpm-pcr-compute` 实用程序
<a name="nitro-tpm-compute-use"></a>

该实用程序提供用于生成参考测量值的单一命令 `nitro-tpm-pcr-compute`。

运行该命令时，您必须指定以下内容：
+ 统一内核映像 (`UKI.efi`)：标准启动和 UEFI 必需。

**要为可证明的 AMI 生成参考测量值，请执行以下操作：**  
使用以下命令和参数：

```
/usr/bin/nitro-tpm-pcr-compute \
--image {{UKI.efi}}
```

该实用程序使用以下 JSON 格式返回参考测量值：

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

有关如何使用 `nitro-tpm-pcr-compute` 实用程序的实际示例，请参阅[示例 Amazon Linux 2023 映像描述](build-sample-ami.md)中包含的 `edit_boot_install.sh` 脚本。