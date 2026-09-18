

# 使用自定义 UEFI 安全启动密钥创建 Linux AMI
<a name="create-ami-with-uefi-secure-boot"></a>

这些说明向您展示如何使用 UEFI 安全启动和定制私有密钥创建 Linux AMI。从 AL2023 2023.1 版本开始，Amazon Linux 支持 UEFI 安全启动。有关更多信息，请参阅《*Amazon Linux 2023 用户指南*》中的 [UEFI Secure Boot on AL2023](https://docs.aws.amazon.com/linux/al2023/ug/uefi-secure-boot.html)。

**重要**  
以下过程**仅供高级用户使用**。您必须对 SSL 和 Linux 发行版启动流程有足够的了解才能使用这些步骤。

**先决条件**
+ 将使用以下工具：
  + OpenSSL – [https://www.openssl.org/](https://www.openssl.org/)
  + efivar – [https://github.com/rhboot/efivar](https://github.com/rhboot/efivar)
  + efitools – [https://git.kernel.org/pub/scm/linux/kernel/git/jejb/efitools.git/](https://git.kernel.org/pub/scm/linux/kernel/git/jejb/efitools.git/)
  + [get-instance-uefi-data](https://docs.aws.amazon.com/cli/latest/reference/ec2/get-instance-uefi-data.html) 命令
+ 您的 Linux 实例必须使用支持 UEFI 启动模式的 Linux AMI 启动，并且存在非易失性数据。

在 `SetupMode` 中创建了没有 UEFI 安全启动密钥的新创建的实例，从而使您能够注册自己的密钥。有些 AMI 预先配置了 UEFI 安全启动，您无法更改现有密钥。如果要更改密钥，您必须基于原始 AMI 创建新 AMI。

有两种方法可以在变量存储中传播密钥，这些方法在后面的选项 A 和选项 B 中进行说明。选项 A 描述了如何在实例内执行此操作，以模仿真实硬件的流程。选项 B 描述了如何创建二进制 Blob，然后在创建 AMI 时将其作为 base64 编码文件传递。对于这两种选项，您必须首先创建三个密钥对，它们将用于信任链。

**Topics**
+ [任务 1：创建密钥对](#uefi-secure-boot-create-three-key-pairs)
+ [任务 2 - 选项 A：从实例内向变量存储添加密钥](#uefi-secure-boot-optionA)
+ [任务 2 - 选项 B：创建包含预填充变量存储的二进制 blob](#uefi-secure-boot-optionB)

## 任务 1：创建密钥对
<a name="uefi-secure-boot-create-three-key-pairs"></a>

UEFI 安全启动基于在信任链中使用的以下三个密钥数据库：平台密钥（PK）、密钥交换密钥（KEK）和签名数据库（db）。¹

在实例上创建每个密钥。要以对 UEFI 安全启动标准有效的格式准备公钥，请为每个密钥创建一个证书。`DER` 定义 SSL 格式（格式的二进制编码）。然后，您将每个证书转换为 UEFI 签名列表，这是 UEFI 安全启动所理解的二进制格式。最后，使用相关密钥签署每个证书。

**Topics**
+ [准备创建密钥对](#uefisb-prepare-to-create-key-pairs)
+ [密钥对 1：创建平台密钥（PK）](#uefisb-create-key-pair-1)
+ [密钥对 2：创建密钥交换密钥（KEK）](#uefisb-create-key-pair-2)
+ [密钥对 3：创建签名数据库（db）](#uefisb-create-key-pair-3)
+ [用私有密钥签署启动映像（内核）](#uefi-secure-boot-sign-kernel)

### 准备创建密钥对
<a name="uefisb-prepare-to-create-key-pairs"></a>

在创建密钥对之前，请创建用于密钥生成的全局唯一标识符（GUID）。

1. [连接到实例](connect.md)。

1. 在 Shell 提示符中运行以下命令。

   ```
   uuidgen --random > GUID.txt
   ```

### 密钥对 1：创建平台密钥（PK）
<a name="uefisb-create-key-pair-1"></a>

PK 是 UEFI 安全启动实例的信任根。私有 PK 用于更新 KEK，这反过来又可以用来将授权密钥添加到签名数据库（db）。

X.509 标准用于创建密钥对。有关标准的信息，请参阅 *Wikipedia* 上的 [X.509](https://en.wikipedia.org/wiki/X.509)。

**要创建 PK**

1. 创建密钥。您必须将变量命名为 `PK`。

   ```
   openssl req -newkey rsa:4096 -nodes -keyout PK.key -new -x509 -sha256 -days 3650 -subj "/CN={{Platform key}}/" -out PK.crt
   ```

   指定了以下参数：
   + `-keyout PK.key` – 私有密钥文件。
   + `-days 3650` – 证书的有效天数。
   + `-out PK.crt` – 用于创建 UEFI 变量的证书。
   + `CN={{Platform key}}` – 密钥的公用名（CN）。您可以输入您自己企业的名称而不是{{平台密钥}}。

1. 创建证书。

   ```
   openssl x509 -outform DER -in PK.crt -out PK.cer
   ```

1. 将证书转换为 UEFI 签名列表。

   ```
   cert-to-efi-sig-list -g "$(< GUID.txt)" PK.crt PK.esl
   ```

1. 使用私有 PK（自签名）签署 UEFI 签名列表。

   ```
   sign-efi-sig-list -g "$(< GUID.txt)" -k PK.key -c PK.crt PK PK.esl PK.auth
   ```

### 密钥对 2：创建密钥交换密钥（KEK）
<a name="uefisb-create-key-pair-2"></a>

私有 KEK 用于向 db 添加密钥，该数据库是要在系统上启动的授权签名列表。

**要创建 KEK**

1. 创建密钥。

   ```
   openssl req -newkey rsa:4096 -nodes -keyout KEK.key -new -x509 -sha256 -days 3650 -subj "/CN=Key Exchange Key/" -out KEK.crt
   ```

1. 创建证书。

   ```
   openssl x509 -outform DER -in KEK.crt -out KEK.cer
   ```

1. 将证书转换为 UEFI 签名列表。

   ```
   cert-to-efi-sig-list -g "$(< GUID.txt)" KEK.crt KEK.esl
   ```

1. 使用私有 PK 签署签名列表。

   ```
   sign-efi-sig-list -g "$(< GUID.txt)" -k PK.key -c PK.crt KEK KEK.esl KEK.auth
   ```

### 密钥对 3：创建签名数据库（db）
<a name="uefisb-create-key-pair-3"></a>

db 列表包含授权在系统上启动的授权密钥。要修改列表，需要私有 KEK。启动映像将使用此步骤中创建的私有密钥签名。

**要创建 db**

1. 创建密钥。

   ```
   openssl req -newkey rsa:4096 -nodes -keyout db.key -new -x509 -sha256 -days 3650 -subj "/CN=Signature Database key/" -out db.crt
   ```

1. 创建证书。

   ```
   openssl x509 -outform DER -in db.crt -out db.cer
   ```

1. 将证书转换为 UEFI 签名列表。

   ```
   cert-to-efi-sig-list -g "$(< GUID.txt)" db.crt db.esl
   ```

1. 用私有 KEK 签署签名列表。

   ```
   sign-efi-sig-list -g "$(< GUID.txt)" -k KEK.key -c KEK.crt db db.esl db.auth
   ```

### 用私有密钥签署启动映像（内核）
<a name="uefi-secure-boot-sign-kernel"></a>

对于 Ubuntu 22.04，以下映像需要签名。

```
/boot/efi/EFI/ubuntu/shimx64.efi
/boot/efi/EFI/ubuntu/mmx64.efi
/boot/efi/EFI/ubuntu/grubx64.efi
/boot/vmlinuz
```

**要签署映像**  
使用以下语法签署映像。

```
sbsign --key db.key --cert db.crt --output {{/boot/vmlinuz}} {{/boot/vmlinuz}}
```

**注意**  
您必须签署所有新内核。{{`/boot/vmlinuz`}} 通常会将符号链接到上次安装的内核。

请参阅您的发行版的文档以了解启动链和所需映像。

¹ 感谢 ArchWiki 社区所做的所有工作。创建 PK、创建 KEK、创建数据库和签署映像的命令来自[创建密钥](https://wiki.archlinux.org/title/Unified_Extensible_Firmware_Interface/Secure_Boot#Creating_keys)，由 ArchWiki 维护团队和/或 ArchWiki 贡献者撰写。

## 任务 2 - 选项 A：从实例内向变量存储添加密钥
<a name="uefi-secure-boot-optionA"></a>

创建了[三个密钥对](#uefi-secure-boot-create-three-key-pairs)后，您可以通过完成以下步骤连接到实例并从实例内将密钥添加到变量存储中。或者，完成[任务 2 - 选项 B：创建包含预填充变量存储的二进制 blob](#uefi-secure-boot-optionB)中的步骤。

**Topics**
+ [步骤 1：启动将支持 UEFI 安全启动的实例](#step1-launch-uefi-sb)
+ [步骤 2：配置实例以支持 UEFI 安全启动](#step2-launch-uefi-sb)
+ [步骤 3：从实例创建 AMI](#step3-launch-uefi-sb)

### 步骤 1：启动将支持 UEFI 安全启动的实例
<a name="step1-launch-uefi-sb"></a>

当您使用以下先决条件[启动实例](LaunchingAndUsingInstances.md)时，该实例将准备好配置为支持 UEFI 安全启动。您只能在启动时在实例上启用对 UEFI 安全启动的支持；无法在以后启用它。

**先决条件**
+ **AMI** – Linux AMI 必须支持 UEFI 启动模式。要验证 AMI 是否支持 UEFI 启动模式，AMI 启动模式参数必须为 **uefi**。有关更多信息，请参阅 [确定 Amazon EC2 AMI 的启动模式参数](ami-boot-mode.md)。

  请注意，AWS 仅提供配置为支持基于 Graviton 实例类型的 UEFI 的 Linux AMI。AWS 当前不提供支持 UEFI 启动模式的 x86\_64 Linux AMI。您可以配置自己的 AMI 以支持所有架构的 UEFI 启动模式。若要配置自己的 AMI 以支持 UEFI 启动模式，您必须在自己的 AMI 上执行多个配置步骤。有关更多信息，请参阅 [设置 Amazon EC2 AMI 的启动模式](set-ami-boot-mode.md)。
+ **实例类型** – 许多支持 UEFI 的虚拟化实例类型也支持 UEFI 安全启动。裸机实例类型不支持 UEFI 安全启动。有关支持 UEFI 安全引导的实例类型，请参阅 [UEFI 启动模式的要求](launch-instance-boot-mode.md)。
+ 在 UEFI 安全启动发布后启动您的实例。只有在 2022 年 5 月 10 日（UEFI 安全启动发布时）之后启动的实例才能支持 UEFI 安全启动。

启动实例后，您可以通过检查是否存在 UEFI 数据来验证它是否已准备好配置为支持 UEFI 安全启动（换句话说，您可以继续[步骤 2](#step2-launch-uefi-sb)）。UEFI 数据的存在表明非易失性数据是持久的。

**验证您的实例是否已为步骤 2 做好准备**  
使用 [get-instance-uefi-data](https://docs.aws.amazon.com/cli/latest/reference/ec2/get-instance-uefi-data.html) 命令并指定实例 ID。

```
aws ec2 get-instance-uefi-data --instance-id {{i-1234567890abcdef0}}
```

如果输出中存在 UEFI 数据，则实例已准备好进入步骤 2。如果输出为空，则无法将实例配置为支持 UEFI 安全启动。如果您的实例在 UEFI 安全启动支持可用之前启动，则可能会发生这种情况。启动新实例，然后重试。

### 步骤 2：配置实例以支持 UEFI 安全启动
<a name="step2-launch-uefi-sb"></a>

#### 在实例上的 UEFI 变量存储中注册密钥对
<a name="step2a-launch-uefi-sb"></a>

**警告**  
您必须在注册密钥*之后*签署启动映像，否则您将无法启动实例。

创建签名的 UEFI 签名列表后（`PK`、`KEK` 和 `db`），必须将它们注册到 UEFI 固件中。

只有在以下情况下才能写入 `PK` 变量：
+ 尚未注册 PK，当 `SetupMode` 变量为 `1` 时即表明这一点。使用以下命令检查此内容。输出为 `1` 或 `0`。

  ```
  efivar -d -n 8be4df61-93ca-11d2-aa0d-00e098032b8c-SetupMode 
  ```
+ 新 PK 由现有 PK 的私有密钥签名。

**在 UEFI 变量存储中注册密钥**  
以下命令必须在实例上运行。

如果启用了 SetupMode（值为 `1`），您可以通过在实例上运行以下命令注册密钥：

```
[ec2-user ~]$ efi-updatevar -f db.auth db
```

```
[ec2-user ~]$ efi-updatevar -f KEK.auth KEK
```

```
[ec2-user ~]$ efi-updatevar -f PK.auth PK
```

**验证 UEFI 安全启动是否已启用**  
要验证 UEFI 安全启动是否已启用，请遵照 [验证 Amazon EC2 实例是否启用了 UEFI 安全启动](verify-uefi-secure-boot.md) 中的步骤。

现在，您可以使用 [get-instance-uefi-data](https://docs.aws.amazon.com/cli/latest/reference/ec2/get-instance-uefi-data.html) CLI 命令导出 UEFI 变量存储，或者继续执行下一步并签署启动映像，以重新启动到启用了 UEFI 安全启动的实例中。

### 步骤 3：从实例创建 AMI
<a name="step3-launch-uefi-sb"></a>

要从实例创建 AMI，您可以使用控制台或 `CreateImage` API、CLI 或开发工具包。有关控制台说明，请参阅 [创建 Amazon EBS-backed AMI](creating-an-ami-ebs.md)。有关 API 说明，请参阅 [CreateImage](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_CreateImage.html)。

**注意**  
`CreateImage` API 会自动将实例的 UEFI 变量存储复制到 AMI。控制台会使用 `CreateImage` API。使用此 AMI 启动实例后，实例将具有相同的 UEFI 变量存储。

## 任务 2 - 选项 B：创建包含预填充变量存储的二进制 blob
<a name="uefi-secure-boot-optionB"></a>

创建了[三个密钥对](#uefi-secure-boot-create-three-key-pairs)后，您可以创建一个二进制 blob，其中包含含有 UEFI 安全启动密钥的预填充变量存储。或者，完成[任务 2 - 选项 A：从实例内向变量存储添加密钥](#uefi-secure-boot-optionA)中的步骤。

**警告**  
您必须先签署您的启动映像，*然后*才能注册密钥，否则您将无法启动实例。

**Topics**
+ [步骤 1：创建新的变量存储或更新现有变量存储](#uefi-secure-boot-create-or-update-variable)
+ [步骤 2：在 AMI 创建时上传二进制 blob](#uefi-secure-boot-upload-binary-blob-on-ami-creation)

### 步骤 1：创建新的变量存储或更新现有变量存储
<a name="uefi-secure-boot-create-or-update-variable"></a>

您可以使用 python-uefivars 工具*离线*创建变量存储，而不需要正在运行的实例。该工具可以从您的密钥中创建一个新的变量存储。该脚本目前支持 EDK2 格式、AWS 格式，以及使用更高级别的工具更容易编辑的 JSON 表示法。

**在没有运行实例的情况下离线创建变量存储**

1. 通过以下链接下载该工具。

   ```
   https://github.com/awslabs/python-uefivars
   ```

1. 通过运行以下命令从密钥创建新的变量存储。这将在 {{your\_binary\_blob}}.bin 中创建 base64 编码的二进制 blob。该工具还支持使用 `-I` 参数更新二进制 blob。

   ```
   ./uefivars.py -i none -o aws -O {{your_binary_blob}}.bin -P PK.esl -K KEK.esl --db db.esl --dbx dbx.esl
   ```

### 步骤 2：在 AMI 创建时上传二进制 blob
<a name="uefi-secure-boot-upload-binary-blob-on-ami-creation"></a>

使用 [register-image](https://docs.aws.amazon.com/cli/latest/reference/ec2/register-image.html) 传递 UEFI 变量存储数据。对于 `--uefi-data` 参数，指定您的二进制 blob，对于 `--boot-mode` 参数，请指定 `uefi`。

```
aws ec2 register-image \
    --name uefi_sb_tpm_register_image_test \
    --uefi-data $(cat {{your_binary_blob}}.bin) \
    --block-device-mappings "DeviceName=/dev/sda1,Ebs= {SnapshotId={{snap-0123456789example}},DeleteOnTermination=true}" \
    --architecture x86_64 \
    --root-device-name /dev/sda1 \
    --virtualization-type hvm \
    --ena-support \
    --boot-mode uefi
```