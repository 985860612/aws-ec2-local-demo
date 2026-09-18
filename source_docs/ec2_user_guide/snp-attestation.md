

# 使用 AMD SEV-SNP 证明 Amazon EC2 实例
<a name="snp-attestation"></a>

证明是可让实例证明其状态和身份的过程。为实例启用 AMD SEV-SNP 后，您可以请求底层处理器提供 AMD SEV-SNP 证明报告。AMD SEV-SNP 证明报告包含初始客户机内存内容和初始 vCPU 状态的加密哈希值，称为启动指标。认证报告采用 VCEK 签名签署（在专属主机上）或可回链至 AMD 信任根（共享租赁）签名签署。您可以使用证明报告中包含的启动指标来验证实例是否在正版 AMD 环境中运行，并验证用于启动实例的初始启动代码。

**先决条件**  
启动已启用 AMD SEV-SNP 的实例。有关更多信息，请参阅 [为 EC2 实例启用 AMD SEV-SNP](snp-work-launch.md)。

**Topics**
+ [专属主机上实例的认证](#snp-att-dedicated-hosts)
+ [共享租赁实例的认证](#snp-att-shared-tenancy)

## 专属主机上实例的认证
<a name="snp-att-dedicated-hosts"></a>

专属主机使用版本控制芯片认可密钥 (VCEK)（每芯片唯一的签名密钥）来签署认证报告。您必须验证从 VCEK 证书到 AMD 信任根的信任链。

**注意**  
当前支持的处理器型号是 `milan`。

**先决条件**  
一个运行于启用 AMD SEV-SNP 的专属主机上的实例，已安装 Git、Cargo 及 Perl。

### 步骤 1：构建 snpguest 实用程序
<a name="snp-att-dh-build"></a>

在这一步中，您需要安装和构建 `snpguest` 实用程序，使用其生成认证报告，获取所需的证书和验证认证报告。

1. 连接到您的实例。

1. 验证已安装必备组件。

   ```
   $ perl --version; cargo --version; git --version
   ```

1. 运行以下命令从 [snpguest repository](https://github.com/virtee/snpguest) 构建 `snpguest` 实用程序。

   ```
   $ git clone https://github.com/virtee/snpguest.git
   $ cd snpguest
   $ cargo build -r
   $ cd target/release
   ```

### 步骤 2：生成认证报告
<a name="snp-att-dh-report"></a>

生成证明报告的请求。`snpguest` 实用程序通过主机向 AMD Secure Processor 请求证明报告，并将其写入二进制文件。以下示例生成一个随机请求现时（nonce），并将报告存储于 `report.bin` 中。

```
$ ./snpguest report {{report.bin}} {{request-file.txt}} --random
```

### 步骤 3：获取并验证 VCEK 证书链
<a name="snp-att-dh-certs"></a>

认证报告由 VCEK 签署，这是您的专属主机上的 AMD 芯片所独有的。您必须验证从 VCEK 到 AMD 信任根的信任链。

1. 从 AMD Key Distribution Service (KDS) 获取 VCEK 证书。证书由认证报告中的芯片 ID 和 TCB 版本标识。

   ```
   $ ./snpguest fetch vcek pem ./ ./report.bin --processor-model milan
   ```

1. 获取构成信任链的 AMD 根证书（AMD 根密钥 (ARK) 和 AMD SEV 密钥 (ASK)）。

   ```
   $ ./snpguest fetch ca PEM ./ milan --endorser vcek
   ```

1. 验证该证书链。

   ```
   $ ./snpguest verify certs ./
   ```

   下面是示例输出。

   ```
   The AMD ARK was self-signed!
   The AMD ASK was signed by the AMD ARK!
   The VCEK was signed by the AMD ASK!
   ```

**可选：**为了提高透明度，您可以通过直接从 AMD 下载证书并使用 `openssl` 来独立验证链。

```
$ curl --proto '=https' --tlsv1.2 -sSf https://kdsintf.amd.com/vcek/v1/Milan/cert_chain -o ./cert_chain.pem
$ openssl verify --CAfile ./cert_chain.pem vcek.pem
```

下面是示例输出。

```
vcek.pem: OK
```

### 步骤 4：验证证明报告签名
<a name="snp-att-dh-validate"></a>

确认认证报告已由 VCEK 证书签署。这证实报告是在正版 AMD 硬件上生成的，并且未被篡改。

```
$ ./snpguest verify attestation ./ report.bin
```

下面是示例输出。

```
Reported TCB Boot Loader from certificate matches the attestation report.
Reported TCB TEE from certificate matches the attestation report.
Reported TCB SNP from certificate matches the attestation report.
Reported TCB Microcode from certificate matches the attestation report.
VEK signed the Attestation Report!
```

TCB（可信计算基础）版本字段确认证书中的固件版本与认证报告中报告的固件版本相匹配。最后一行证实了 VCEK 已签署该报告。

## 共享租赁实例的认证
<a name="snp-att-shared-tenancy"></a>

共享租赁实例使用版本控制加载认可密钥（VLEK），该密钥由 AMD 为 AWS 颁发。您必须验证从 VLEK 证书到 AMD 信任根的信任链。

### 步骤 1：构建 snpguest 实用程序
<a name="snp-att-st-build"></a>

在这一步中，您需要安装和构建 `snpguest` 实用程序，使用其生成认证报告，获取所需的证书和验证认证报告。

1. 连接到您的实例。

1. 运行以下命令从 [snpguest repository](https://github.com/virtee/snpguest) 构建 `snpguest` 实用程序。

   ```
   $ git clone https://github.com/virtee/snpguest.git
   $ cd snpguest
   $ cargo build -r
   $ cd target/release
   ```

### 步骤 2：生成认证报告
<a name="snp-att-st-report"></a>

生成证明报告的请求。`snpguest` 实用程序通过主机请求认证报告，并将其写入二进制文件。以下示例生成一个随机请求现时（nonce），并将报告存储于 `report.bin` 中。

```
$ ./snpguest report {{report.bin}} {{request-file.txt}} --random
```

从主机内存请求证书，并将其存储为 PEM 文件。

```
$ ./snpguest certificates PEM {{./}}
```

### 第 3 步：获取并验证 VLEK 证书链
<a name="snp-att-st-certs"></a>

认证报告由 VLEK 签名签署，该报告由 AMD 为 AWS 颁发。您必须验证从 VLEK 到 AMD 信任根的信任链。

1. 从官方 AMD Key Distribution Service 下载 VLEK 信任根证书至当前目录。

   ```
   $ sudo curl --proto '=https' --tlsv1.2 -sSf https://kdsintf.amd.com/vlek/v1/Milan/cert_chain -o ./cert_chain.pem
   ```

1. 使用 `openssl` 验证 VLEK 证书是否是使用 AMD 根信任证书签署的。

   ```
   $ sudo openssl verify --CAfile ./cert_chain.pem vlek.pem
   ```

   下面是示例输出。

   ```
   vlek.pem: OK
   ```

### 步骤 4：验证证明报告签名
<a name="snp-att-st-validate"></a>

确认认证报告已由 VLEK 证书签署。这证实报告是在正版 AMD 硬件上生成的，并且未被篡改。

```
$ ./snpguest verify attestation ./ report.bin
```

下面是示例输出。

```
Reported TCB Boot Loader from certificate matches the attestation report.
Reported TCB TEE from certificate matches the attestation report.
Reported TCB SNP from certificate matches the attestation report.
Reported TCB Microcode from certificate matches the attestation report.
VEK signed the Attestation Report!
```