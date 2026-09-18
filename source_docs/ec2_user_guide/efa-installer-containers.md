

# 在容器中安装 EFA 软件
<a name="efa-installer-containers"></a>

本节介绍如何在容器化环境中使用 EFA 安装程序。您可以通过在 Dockerfile 中添加命令或直接在运行容器的 shell 中运行命令来安装 EFA 软件。

**使用 shell 命令在容器中安装 EFA 软件**

1. 更新操作系统程序包。此步骤可确保您拥有最新的程序包。
   + 对于基于 Debian 的操作系统：

     ```
     apt-get update && apt-get upgrade -y
     ```
   + 对于基于 RHEL 的操作系统：

     ```
     yum update -y
     ```

1. 下载 EFA 安装程序。建议使用最新的 EFA 安装程序。有关最新版本的信息，请参阅[Elastic Fabric Adapter 发布说明](efa-changelog.md)。

   ```
   mkdir /tmp/efa \
   && cd /tmp/efa \
   && curl -O https://efa-installer.amazonaws.com/aws-efa-installer-{{version}}.tar.gz
   ```

   （可选）验证 EFA 安装程序包的签名。

   ```
   wget https://efa-installer.amazonaws.com/aws-efa-installer.key \
   && gpg --import aws-efa-installer.key \
   && cat aws-efa-installer.key | gpg --fingerprint \
   && wget https://efa-installer.amazonaws.com/aws-efa-installer-{{version}}.tar.gz.sig \
   && gpg --verify ./aws-efa-installer-{{version}}.tar.gz.sig
   ```

1. 安装 EFA 软件。以下命令使用这些参数：
   + `--skip-kmod`：跳过内核模块安装。容器环境无法修改内核模块。
   + `--skip-limit-conf`：跳过限制配置。您不能在容器内设置 `ulimit`。请改为在创建容器时进行配置。
   + `--no-verify`：跳过 EFA 设备检测。设备检测使用 `lspci`，这在容器化环境中不起作用。

   ```
   tar -xf aws-efa-installer-{{version}}.tar.gz \
   && cd aws-efa-installer \
   && ./efa_installer.sh -y --skip-kmod --skip-limit-conf --no-verify
   ```
**注意**  
对于 NGC 容器，在 EFA 安装程序版本 1.49.0 或更高版本中，您可以使用 `--enable-ngc` 标志，而不是上述三个标志。此标志会自动处理所有特定于容器的配置：  

   ```
   ./efa_installer.sh -y --enable-ngc
   ```

1. 清理临时安装文件。

   ```
   rm -rf /tmp/efa
   ```