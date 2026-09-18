

# 为您的工作负载自定义示例 Amazon Linux 2023 映像描述
<a name="customize-sample-ami"></a>

您可以自定义示例 Amazon Linux 2023 映像描述，并包括特定工作负载所需的软件包、脚本和文件。自定义通过添加或修改 KIWI NG 映像描述中的各种元素来实现。

**Topics**
+ [存储库管理](#prepare-custom-image-repos)
+ [程序包管理](#customize-sample-ami-packages)
+ [添加文件和目录](#customize-sample-ami-overlay)
+ [添加自定义脚本](#customize-sample-ami-script)

## 存储库管理
<a name="prepare-custom-image-repos"></a>

默认情况下，示例映像描述包括一个 `<repository>` 元素，指向 Amazon Linux 2023 核心存储库的镜像端点。如果需要，您可以添加对其他存储库的引用，以从中安装所需软件。

示例映像描述使用 `<packagemanager>` 元素中定义的 `dnf` 包管理器。

有关添加存储库的更多信息，请参阅 [Setting up Repositories](https://osinside.github.io/kiwi/concept_and_workflow/repository_setup.html)。

## 程序包管理
<a name="customize-sample-ami-packages"></a>

默认情况下，示例映像描述包括为具有 `erofs` 只读文件系统的隔离计算环境创建 Amazon Linux 2023 可证明的 AMI 所需的所有包。

您可以将其他软件包添加到映像描述中的 `<packages>` 元素中，从而在映像描述中添加这些软件包。`<packages>` 元素定义了应安装到 AMI 中的所有软件。

您也可以使用 `<packages>` 元素来卸载或删除特定的软件包。

有关在映像描述中添加或移除包的更多信息，请参阅 [Adding and Removing Packages](https://osinside.github.io/kiwi/concept_and_workflow/packages.html#)。

## 添加文件和目录
<a name="customize-sample-ami-overlay"></a>

示例映像描述包括覆盖树目录 (`/root/`)。覆盖树目录是一个目录，其中包含将在映像构建过程中复制到映像中的文件和目录。在映像构建过程中，您放在覆盖树目录中的任何文件和目录都将直接复制到映像的根文件系统中。

安装完所有包后，覆盖树目录将复制到映像中。此时添加新文件并覆盖现有文件。

## 添加自定义脚本
<a name="customize-sample-ami-script"></a>

示例映像描述包含一个自定义脚本 `edit_boot_install.sh`。该脚本包含运行 `nitro-tpm-pcr-compute` 实用程序所需的命令，该实用程序会根据映像内容生成参考测量值。安装启动加载程序后，将立即调用此脚本。

如果需要，您可以在映像描述中包含自己的自定义脚本，以在映像构建过程中或首次启动映像时执行任务或配置。使用脚本使您能够以仅使用映像描述无法实现的方式自定义映像。

要在映像描述中包含自定义脚本，您需要根据脚本类型正确命名这些脚本，并将其添加到与 `appliance.kiwi` 文件相同的目录中。如果脚本命名正确且放在正确的位置，KIWI NG 会自动检测并执行脚本，而无需在映像描述文件中进行显式引用。

有关 KIWI NG 支持的脚本的更多信息，请参阅 [User-Defined Scripts](https://osinside.github.io/kiwi/concept_and_workflow/shell_scripts.html)。