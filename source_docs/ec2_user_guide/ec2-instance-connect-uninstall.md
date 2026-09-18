

# 卸载 EC2 Instance Connect
<a name="ec2-instance-connect-uninstall"></a>

要禁用 EC2 Instance Connect，请连接到 Linux 实例并卸载操作系统上安装的 `ec2-instance-connect` 程序包。如果 `sshd` 配置与您安装 EC2 Instance Connect 时设置的配置匹配，卸载 `ec2-instance-connect` 还会删除 `sshd` 配置。如果在安装 EC2 Instance Connect 后修改了 `sshd` 配置，您必须手动更新该配置。

------
#### [ Amazon Linux ]

您可以在 AL2023 和 Amazon Linux 2 2.0.20190618 或更高版本上卸载 EC2 Instance Connect，其中预配置了 EC2 Instance Connect。

**在使用 Amazon Linux 启动的实例上卸载 EC2 Instance Connect**

1. 使用 SSH 连接到实例。指定启动实例时用于实例的 SSH 密钥对，以及 AL2023 和 Amazon Linux 2 AMI 的默认用户名 (`ec2-user`)。

   例如，以下 **ssh** 命令使用密钥对 `ec2-a-b-c-d.us-west-2.compute.amazonaws.com` 连接到具有公有 DNS 名称 `my_ec2_private_key.pem` 的实例。

   ```
   $ ssh -i {{my_ec2_private_key}}.pem ec2-user@{{ec2-a-b-c-d.us-west-2.compute.amazonaws.com}}
   ```

1. 使用 `ec2-instance-connect` 命令卸载 **yum** 软件包。

   ```
   [ec2-user ~]$ sudo yum remove ec2-instance-connect
   ```

------
#### [ Ubuntu ]

**在使用 Ubuntu AMI 启动的实例上卸载 EC2 Instance Connect**

1. 使用 SSH 连接到实例。指定在启动实例时用于实例的 SSH 密钥对以及 Ubuntu AMI 的默认用户名，即 `ubuntu`。

   例如，以下 **ssh** 命令使用密钥对 `ec2-a-b-c-d.us-west-2.compute.amazonaws.com` 连接到具有公有 DNS 名称 `my_ec2_private_key.pem` 的实例。

   ```
   $ ssh -i {{my_ec2_private_key}}.pem ubuntu@{{ec2-a-b-c-d.us-west-2.compute.amazonaws.com}}
   ```

1. 使用 `ec2-instance-connect` 命令卸载 **apt-get** 软件包。

   ```
   ubuntu:~$ sudo apt-get remove ec2-instance-connect
   ```

------