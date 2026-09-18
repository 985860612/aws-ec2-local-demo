

# 验证您的密钥对的指纹
<a name="verify-keys"></a>

要验证您的密钥对的指纹，请将在 Amazon EC2 控制台的**密钥对**页面上显示的或由 [describe-key-pairs](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-key-pairs.html) 命令返回的指纹与您在本地计算机上使用私有密钥生成的指纹进行比较。这些指纹应该一致。

当 Amazon EC2 计算指纹时，Amazon EC2 可能会用 `=` 字符在指纹上添加填充。**ssh-keygen** 等其他工具可能会省略此填充。

如果您尝试验证 Linux EC2 实例的指纹，而不是密钥对的指纹，则请参阅[获取实例指纹](connection-prereqs-general.md#connection-prereqs-fingerprint)。

## 指纹如何计算
<a name="how-ec2-key-fingerprints-are-calculated"></a>

Amazon EC2 使用不同的哈希函数来计算 RSA 和 ED25519 密钥对的指纹。此外，对于 RSA 密钥对，Amazon EC2 使用不同的哈希函数以不同方式计算指纹，具体取决于密钥对是由 Amazon EC2 创建还是导入到 Amazon EC2 的。

下表所列的哈希函数用于计算由 Amazon EC2 创建以及导入到 Amazon EC2 的 RSA 和 ED25519 密钥对的指纹。


**（Linux 实例）用于计算指纹的哈希函数**  

| 密钥对来源 | RSA 密钥对（Windows 和 Linux） | ED25519 密钥对（Linux） | 
| --- | --- | --- | 
| 由 Amazon EC2 创建 | SHA-1 | SHA-256 | 
| 导入到 Amazon EC2 | MD5¹ | SHA-256 | 

¹ 如果您将公有的 RSA 密钥导入到 Amazon EC2，系统会使用 MD5 哈希函数计算指纹。无论您如何创建密钥对（例如，通过使用第三方工具或者从使用 Amazon EC2 创建的现有私有密钥生成新的公有密钥），都是如此。

## 在不同区域使用相同的密钥对时
<a name="when-using-same-key-pair-in-different-regions"></a>

如果您计划使用相同的密钥对连接到不同 AWS 区域 中的实例，必须将公有密钥导入到将在其中使用公有密钥的所有区域。如果使用 Amazon EC2 创建密钥对，您可以 [检索公有密钥材料](describe-keys.md#retrieving-the-public-key) 以便将公有密钥导入到其他区域。

**注意**  
如果您使用 Amazon EC2 创建 RSA 密钥对，然后从 Amazon EC2 私有密钥生成公有密钥，则导入的公有密钥的指纹将与原始公有密钥不同。这是因为使用 Amazon EC2 创建的原始 RSA 密钥的指纹是使用 SHA-1 哈希函数计算的，而导入的 RSA 密钥的指纹则使用 MD5 哈希函数计算。
对于 ED25519 密钥对，无论它们是由 Amazon EC2 创建还是导入到 Amazon EC2 的，指纹都将相同，因为两种情况下都使用相同的 SHA-256 哈希函数来计算指纹。

## 从私有密钥生成指纹
<a name="generate-fingerprint-from-private-key"></a>

使用以下命令之一可从本地机器上的私有密钥生成指纹。

如果您使用的是 Windows 本地计算机，您可以使用 Windows Subsystem for Linux (WSL) 运行以下命令。按照[如何使用 WSL 在 Windows 上安装 Linux](https://learn.microsoft.com/en-us/windows/wsl/install) 中的说明来安装 WSL 和 Linux 发行版。说明中的示例安装的是 Linux 的 Ubuntu 发行版，但您可以安装任意发行版。系统会提示您重新启动电脑以使更改生效。
+ **如果您使用 Amazon EC2 创建密钥对**

  如以下示例中所示，使用 OpenSSL 工具生成指纹。

  对于 RSA 密钥对：

  ```
  openssl pkcs8 -in {{path_to_private_key}} -inform PEM -outform DER -topk8 -nocrypt | openssl sha1 -c
  ```

  （Linux 实例）对于 ED25519 密钥对：

  ```
  ssh-keygen -l -f {{path_to_private_key}}
  ```
+ **（仅限 RSA 密钥对）如果您将公有密钥导入 Amazon EC2**

  无论密钥对的创建方式如何（例如，使用第三方工具或者从使用 Amazon EC2 创建的现有私有密钥生成新的公有密钥），都可以遵循此过程。

  如以下示例中所示，使用 OpenSSL 工具生成指纹。

  ```
  openssl rsa -in {{path_to_private_key}} -pubout -outform DER | openssl md5 -c
  ```
+ **如果您使用 OpenSSH 7.8 或更高版本创建 OpenSSH 密钥对，并将公有密钥导入到 Amazon EC2**

  如以下示例中所示，使用 **ssh-keygen** 生成指纹。

  对于 RSA 密钥对：

  ```
  ssh-keygen -ef {{path_to_private_key}} -m PEM | openssl rsa -RSAPublicKey_in -outform DER | openssl md5 -c
  ```

  （Linux 实例）对于 ED25519 密钥对：

  ```
  ssh-keygen -l -f {{path_to_private_key}}
  ```