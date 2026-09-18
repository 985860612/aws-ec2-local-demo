

# 设置 Amazon EC2 AMI 工具
<a name="set-up-ami-tools"></a>

您可以使用 AMI 工具创建和管理 Amazon S3 支持的 Linux AMI。要使用这些工具，必须在 Linux 实例上安装它们。AMI 工具可作为 RPM 提供，也为不支持 RPM 的 Linux 发行版提供 .zip 格式的文件。

**使用 RPM 设置 AMI 工具**

1. 使用您的 Linux 发行版的程序包管理器 (如 yum) 安装 Ruby。例如：

   ```
   [ec2-user ~]$ sudo yum install -y ruby
   ```

1. 使用 wget 或 curl 等工具下载 RPM 文件。例如：

   ```
   [ec2-user ~]$ wget https://s3.amazonaws.com/ec2-downloads/ec2-ami-tools.noarch.rpm
   ```

1. 使用以下命令验证 RPM 文件的签名：

   ```
   [ec2-user ~]$ rpm -K ec2-ami-tools.noarch.rpm
   ```

   上述命令应指示该文件的 SHA1 和 MD5 哈希值是 `OK.`如果该命令指示这些哈希值是 `NOT OK`，请使用以下命令查看该文件的标头 SHA1 和 MD5 哈希值：

   ```
   [ec2-user ~]$ rpm -Kv ec2-ami-tools.noarch.rpm
   ```

   然后，将您的文件的标头 SHA1 和 MD5 哈希值与以下经验证的 AMI 工具哈希值进行比较，以确认文件的真实性：
   + 标头 SHA1：a1f662d6f25f69871104e6a62187fa4df508f880
   + MD5：9faff05258064e2f7909b66142de6782

   如果您的文件的标头 SHA1 和 MD5 哈希值与经验证的 AMI 工具哈希值相匹配，请继续下一步。

1. 使用以下命令安装 RPM：

   ```
   [ec2-user ~]$ sudo yum install ec2-ami-tools.noarch.rpm
   ```

1. 使用 [ec2-ami-tools-version](ami-tools-commands.md#ami-tools-version) 命令验证您的 AMI 工具安装。

   ```
   [ec2-user ~]$ ec2-ami-tools-version
   ```
**注意**  
如果您收到一个加载错误，例如“cannot load such file -- ec2/amitools/version (LoadError)”(无法加载此类文件 -- ec2/amitools/version (LoadError))，请完成下一步骤以将 AMI 工具安装的位置添加到 `RUBYLIB` 路径。

1. （可选）如果您在上一步中收到了错误，则将您的 AMI 工具的安装位置添加到您的 `RUBYLIB` 路径中。

   1. 运行以下命令以确定要添加的路径。

      ```
      [ec2-user ~]$ rpm -qil ec2-ami-tools | grep ec2/amitools/version
      /usr/lib/ruby/site_ruby/ec2/amitools/version.rb
      /usr/lib64/ruby/site_ruby/ec2/amitools/version.rb
      ```

      在以上示例中，以前加载错误中的丢失文件位于 `/usr/lib/ruby/site_ruby` 和 `/usr/lib64/ruby/site_ruby`。

   1. 将上一步的位置添加到您的 `RUBYLIB` 路径中。

      ```
      [ec2-user ~]$ export RUBYLIB=$RUBYLIB:{{/usr/lib/ruby/site_ruby}}:{{/usr/lib64/ruby/site_ruby}}
      ```

   1. 使用 [ec2-ami-tools-version](ami-tools-commands.md#ami-tools-version) 命令验证您的 AMI 工具安装。

      ```
      [ec2-user ~]$ ec2-ami-tools-version
      ```

**使用 .zip 文件设置 AMI 工具**

1. 使用您的 Linux 发行版的程序包管理器安装 Ruby 并解压缩，例如 **apt-get**。例如：

   ```
   [ec2-user ~]$ sudo apt-get update -y && sudo apt-get install -y ruby unzip
   ```

1. 使用 wget 或 curl 等工具下载 .zip 文件。例如：

   ```
   [ec2-user ~]$ wget https://s3.amazonaws.com/ec2-downloads/ec2-ami-tools.zip
   ```

1. 将文件解压缩到合适的安装目录，如 `/usr/local/ec2`。

   ```
   [ec2-user ~]$ sudo mkdir -p /usr/local/ec2
   $ sudo unzip ec2-ami-tools.zip -d /usr/local/ec2
   ```

   请注意，.zip 文件包含文件夹 ec2-ami-tools-{{x}}.{{x}}.{{x}}，其中 {{x}}.{{x}}.{{x}} 是工具的版本号（例如，`ec2-ami-tools-1.5.7`）。

1. 将 `EC2_AMITOOL_HOME` 环境变量设置为工具的安装目录。例如：

   ```
   [ec2-user ~]$ export EC2_AMITOOL_HOME=/usr/local/ec2/ec2-ami-tools-{{x}}.{{x}}.{{x}}
   ```

1. 将工具添加到您的 `PATH` 环境变量。例如：

   ```
   [ec2-user ~]$ export PATH=$EC2_AMITOOL_HOME/bin:$PATH
   ```

1. 您可以使用 [ec2-ami-tools-version](ami-tools-commands.md#ami-tools-version) 命令验证您的 AMI 工具安装。

   ```
   [ec2-user ~]$ ec2-ami-tools-version
   ```

## 管理签名证书
<a name="ami-tools-managing-certs"></a>

AMI 工具中的某些命令需要签名证书 (也称为 X.509 证书)。您必须创建证书，然后将其上传到 AWS。例如，您可以使用第三方工具 (例如 OpenSSL) 创建证书。

**创建签名证书**

1. 安装和配置 OpenSSL。

1. 使用 `openssl genrsa` 命令创建私有密钥，并将输出保存到 `.pem` 文件。我们建议您创建 2048 或 4096 位 RSA 密钥。

   ```
   openssl genrsa 2048 > {{private-key.pem}}
   ```

1. 使用 `openssl req` 命令生成证书。

   ```
   openssl req -new -x509 -nodes -sha256 -days 365 -key {{private-key.pem}} -outform PEM -out {{certificate.pem}}
   ```

要将证书上传到 AWS，请使用 [upload-signing-certificate](https://docs.aws.amazon.com/cli/latest/reference/iam/upload-signing-certificate.html) 命令。

```
aws iam upload-signing-certificate --user-name {{user-name}} --certificate-body file://{{path/to/certificate}}.pem
```

要列出用户的证书，请使用 [list-signing-certificates](https://docs.aws.amazon.com/cli/latest/reference/iam/list-signing-certificates.html) 命令：

```
aws iam list-signing-certificates --user-name {{user-name}}
```

要对用户禁用或重新启用签名证书，请使用 [update-signing-certificate](https://docs.aws.amazon.com/cli/latest/reference/iam/update-signing-certificate.html) 命令。以下命令可禁用证书：

```
aws iam update-signing-certificate --certificate-id {{OFHPLP4ZULTHYPMSYEX7O4BEXAMPLE}} --status {{Inactive}} --user-name {{user-name}}
```

要删除证书，请使用 [delete-signing-certificate](https://docs.aws.amazon.com/cli/latest/reference/iam/delete-signing-certificate.html) 命令：

```
aws iam delete-signing-certificate --user-name {{user-name}} --certificate-id {{OFHPLP4ZULTHYPMSYEX7O4BEXAMPLE}}
```