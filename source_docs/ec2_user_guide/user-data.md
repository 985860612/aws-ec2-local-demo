

# 在启动包含用户数据输入的 EC2 实例时运行命令
<a name="user-data"></a>

启动 Amazon EC2 实例后，您可以将用户数据传递给实例，用于执行自动配置任务或在实例启动后运行脚本。

如果您对更复杂的自动化场景感兴趣，可以考虑使用 CloudFormation。有关更多信息，请参阅《*AWS CloudFormation 用户指南*》中的[使用 CloudFormation 在 Amazon EC2 上部署应用程序](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/deploying.applications.html)。

在 Linux 实例上，您可以将两类用户数据传递到 Amazon EC2：Shell 脚本和 cloud-init 指令。您还可以将此数据以纯文本、文件（这非常适合通过命令行工具启动实例）或者 base64 编码文本（用于 API 调用）的形式传递到启动实例向导中。

在 Windows 实例上，启动代理处理您的用户数据脚本。

**注意事项**
+ 用户数据会被视为非透明数据；您提供什么数据您就会得到什么数据。由实例对其进行解释。
+ 用户数据必须采用 base64 编码。Amazon EC2 控制台可以为您执行 base64 编码或接受 base64 编码的输入。如果您使用实例元数据或控制台检索用户数据，则会自动为您进行 base64 解码。
+ 用户数据在进行 base64 编码之前的原始格式的大小限制为 16 KB。长度为 *n* 的字符串在进行 base64 编码之后的大小为 ceil(*n*/3)\*4。
+ 用户数据是一种实例属性。如果您从实例创建 AMI，则实例用户数据不包含在该 AMI 中。

## AWS 管理控制台 中的用户数据
<a name="user-data-console"></a>

您可在启动实例时指定实例用户数据。如果实例的根卷是 EBS 卷，您还可以停止实例并更新其用户数据。

### 使用启动向导在启动时指定实例用户数据
<a name="user-data-launch-instance-wizard"></a>

您可以在 EC2 控制台中使用启动向导启动实例时指定用户数据。要在启动时指定用户数据，请按照[启动实例](ec2-launch-instance-wizard.md)的过程进行操作。**User data**（用户数据）字段位于启动实例向导的 [高级详细信息](ec2-instance-launch-parameters.md#liw-advanced-details) 部分。在**用户数据**字段中输入您的 PowerShell 脚本，然后完成实例启动程序。

在**用户数据**字段的屏幕截图中，示例脚本在 Windows 临时文件夹中创建文件，在文件名中使用当前日期和时间。当您包括 `<persist>true</persist>` 时，每次重新引导或启动实例时将运行脚本。如果将**用户数据已执行 base64 编码**复选框保留为空，则 Amazon EC2 控制台将执行 base64 编码。

![Advanced Details（高级详细信息）用户数据文本字段。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/configure_ec2config_userdata.png)


有关更多信息，请参阅 [使用启动向导在启动时指定实例用户数据](#user-data-launch-instance-wizard)。有关使用 AWS CLI 的 Linux 示例，请参阅 [用户数据和 AWS CLI](#user-data-api-cli)。有关使用 Tools for Windows PowerShell 的 Windows 示例，请参阅 [用户数据和 Tools for Windows PowerShell](#user-data-powershell)。

### 查看和更新实例用户数据
<a name="user-data-view-change"></a>

您可以查看任何实例的实例用户数据，也可以更新已停止实例的实例用户数据。

**使用控制台更新实例的用户数据**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**实例**。

1. 选择所需实例，然后依次选择**操作**、**实例状态**、**停止实例**。
**警告**  
停止某个实例时，实例存储卷上的数据将会丢失。要保留这些数据，请将其备份到持久性存储中。

1. 当系统提示您确认时，选择 **Stop**。停止实例可能需要几分钟时间。

1. 在实例仍被选中的情况下，依次选择**操作**、**实例设置**和**编辑用户数据**。如果实例正在运行，您不能更改用户数据，但是可以查看。

1. 在 **Edit user data (编辑用户数据)** 对话框中，更新用户数据，然后选择 **Save (保存)**。要在每次重新引导或启动实例时运行用户数据脚本，请添加 `<persist>true</persist>`，如下例中所示。  
![编辑 User Data（用户数据）对话框。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/view-change-user-data.png)

1. 启动实例。如果为后续重新引导或启动启用了用户数据运行，则在实例启动过程中执行更新后的用户数据脚本。

## Amazon EC2 如何处理 Linux 实例的用户数据
<a name="userdata-linux"></a>

以下示例使用用户数据在实例启动时运行设置 LAMP 服务器的命令。在每个示例中，执行以下任务：
+ 更新发行版软件包。
+ 安装 Web 服务器、`php` 和 `mariadb` 包。
+ 启动并启用 `httpd` 服务。
+ 用户 `ec2-user` 将添加到 apache 组。
+ 为 Web 目录以及其中的文件设置适当的所有权和文件权限。
+ 创建简单网页来测试 Web 服务器和 PHP 引擎。

**Topics**
+ [前提条件](#user-data-requirements)
+ [用户数据和 Shell 脚本](#user-data-shell-scripts)
+ [更新实例用户数据](#user-data-modify)
+ [用户数据和 cloud-init 指令](#user-data-cloud-init)
+ [用户数据和 AWS CLI](#user-data-api-cli)
+ [将 Shell 脚本和 cloud-init 指令组合使用](#user-data-mime-multi)

### 前提条件
<a name="user-data-requirements"></a>

本主题中的示例假定以下内容：
+ 您的实例具有可从互联网访问的公用 DNS 名称。
+ 与您的实例关联的安全组将被配置为允许 SSH（端口 22）流量，以便您可以连接到该实例，以查看输出日志文件。
+ 您的实例是使用 Amazon Linux AMI 启动的。这些命令和指令可能不适用于其他 Linux 发行版。有关其他发行版的更多信息（例如它们对 cloud-init 的支持），请参阅特定发行版的文档。

### 用户数据和 Shell 脚本
<a name="user-data-shell-scripts"></a>

如果您熟悉 Shell 脚本编写，要在启动时将指令发送到实例，这是最简单、最完整的方式。在启动时添加这些任务会增加启动实例所需的时间。您应多等待几分钟让这些任务完成，然后测试用户脚本是否已成功完成。

**重要**  
默认情况下，用户数据脚本和 cloud-init 指令仅在首次启动实例时在引导周期内运行。您可以更新您的配置，以确保您的用户数据脚本和 cloud-init 指令在每次重新启动实例时都会运行。有关更多信息，请参阅AWS知识中心中的[如何利用用户数据在每次重新启动 Amazon EC2 Linux 实例时自动运行脚本？](https://repost.aws/knowledge-center/execute-user-data-ec2)。

用户数据 Shell 脚本必须以 `#!` 字符以及指向要读取脚本的解释器的路径（通常为 **/bin/bash)**）开头。有关 shell 脚本的介绍，请参阅 *GNU 操作系统*网站上的 [Bash 参考手册](https://www.gnu.org/software/bash/manual/bash.html)。

作为用户数据输入的脚本是作为根用户加以运行的，因此在脚本中不使用 **sudo** 命令。请注意，您创建的任何文件都将归根用户所有；如果您需要非根用户具有文件访问权限，应在脚本中相应地修改权限。此外，这是因为脚本不交互运行，所以无法包含要求用户反馈的命令（如 **yum update**，无 `-y` 标志）。

如果您使用 AWS API（包括 AWS CLI），则在启动实例时必须使用实例配置文件。实例配置文件提供用户数据脚本发出 API 调用所需的适当 AWS 凭证。有关更多信息，请参阅《IAM 用户指南》中的[使用实例配置文件](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-ec2_instance-profiles.html)。您分配给 IAM 角色的权限取决于您使用 API 调用的服务。有关更多信息，请参阅 [适用于 Amazon EC2 的 IAM 角色](iam-roles-for-amazon-ec2.md)。

cloud-init 输出日志文件捕获控制台输出，因此，如果实例的行为不符合您的预期，可在启动后方便地调试脚本。要查看日志文件，[请连接到实例](connect-to-linux-instance.md)并打开 `/var/log/cloud-init-output.log`。

在处理用户数据脚本时，该脚本将复制到 `/var/lib/cloud/instances/{{instance-id}}/` 目录并从该目录运行。脚本在运行后无法删除。请在从实例创建 AMI 之前务必删除 `/var/lib/cloud/instances/{{instance-id}}/` 中的用户数据脚本。否则，该脚本将存在于从 AMI 启动的任何实例上的此目录中。

### 更新实例用户数据
<a name="user-data-modify"></a>

要更新实例用户数据，您必须先停止实例。如果实例正在运行，那么您可以查看用户数据，但不能进行修改。

**警告**  
停止某个实例时，实例存储卷上的数据将会丢失。要保留这些数据，请将其备份到持久性存储中。

**修改实例用户数据**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**实例**。

1. 选择所需实例，然后依次选择**实例状态**、**停止实例**。如果此选项处于禁用状态，则表示实例已停止，或者其根卷是实例存储卷。

1. 当系统提示您确认时，选择 **Stop**。停止实例可能需要几分钟时间。

1. 在实例仍被选中的情况下，依次选择**操作**、**实例设置**和**编辑用户数据**。

1. 根据需要修改用户数据，然后选择**保存**。

1. 开启实例。开启实例后，新的用户数据将在实例上可见；但不会运行用户数据脚本。

### 用户数据和 cloud-init 指令
<a name="user-data-cloud-init"></a>

cloud-init 程序包在启动时配置新 Amazon Linux 实例的特定方面；最值得注意的是，它为 ec2-user 配置 `.ssh/authorized_keys` 文件，以便您使用自己的私有密钥登录。有关 cloud-init 包为 Amazon Linux 实例执行的配置任务的更多信息，请参阅以下文档：
+ **Amazon Linux 2023** – [自定义 cloud-init](https://docs.aws.amazon.com/linux/al2023/ug/cloud-init.html)
+ **Amazon Linux 2** – [在 Amazon Linux 2 上 cloud-init](https://docs.aws.amazon.com/linux/al2/ug/amazon-linux-cloud-init.html)

可在启动时将 cloud-init 用户指令传递给实例，方式与传递脚本相同，只是语法不同。有关 cloud-init 的更多信息，请参阅 [https://cloudinit.readthedocs.org/en/latest/index.html](https://cloudinit.readthedocs.org/en/latest/index.html)。

**重要**  
默认情况下，用户数据脚本和 cloud-init 指令仅在首次启动实例时在引导周期内运行。您可以更新您的配置，以确保您的用户数据脚本和 cloud-init 指令在每次重新启动实例时都会运行。有关更多信息，请参阅AWS知识中心中的[如何利用用户数据在每次重新启动 Amazon EC2 Linux 实例时自动运行脚本？](https://repost.aws/knowledge-center/execute-user-data-ec2)。

在启动时添加这些任务会增加启动实例所需的时间。您应多等待几分钟让这些任务完成，然后测试用户数据指令是否已完成。

**将 cloud-init 指令传递给 Amazon Linux 实例**

1. 按照[启动实例](ec2-launch-instance-wizard.md)的程序进行操作。**User data**（用户数据）字段位于启动实例向导的 [高级详细信息](ec2-instance-launch-parameters.md#liw-advanced-details) 部分。在 **User data**（用户数据）字段中输入您的 cloud-init 指令文本，然后完成实例启动程序。

   在下面的示例中，指令在 Amazon Linux 上创建并配置了一个 Web 服务器。顶部的 `#cloud-config` 行是必需的，用于将命令标识为 cloud-init 指令。

------
#### [ AL2023 ]

   ```
   #cloud-config
   package_update: true
   package_upgrade: all
   	
   packages:
   - httpd
   - mariadb105-server
   - php8.1
   - php8.1-mysqlnd
   
   runcmd:
   - systemctl start httpd
   - systemctl enable httpd
   - [ sh, -c, "usermod -a -G apache ec2-user" ]
   - [ sh, -c, "chown -R ec2-user:apache /var/www" ]
   - chmod 2775 /var/www
   - [ find, /var/www, -type, d, -exec, chmod, 2775, {}, \; ]
   - [ find, /var/www, -type, f, -exec, chmod, 0664, {}, \; ]
   - [ sh, -c, 'echo "<?php phpinfo(); ?>" > /var/www/html/phpinfo.php' ]
   ```

------
#### [ AL2 ]

   ```
   #cloud-config
   package_update: true
   package_upgrade: all
   	
   packages:
   - httpd
   - mariadb-server
   	
   runcmd:
   - [ sh, -c, "amazon-linux-extras install -y lamp-mariadb10.2-php7.2 php7.2" ]
   - systemctl start httpd
   - systemctl enable httpd
   - [ sh, -c, "usermod -a -G apache ec2-user" ]
   - [ sh, -c, "chown -R ec2-user:apache /var/www" ]
   - chmod 2775 /var/www
   - [ find, /var/www, -type, d, -exec, chmod, 2775, {}, \; ]
   - [ find, /var/www, -type, f, -exec, chmod, 0664, {}, \; ]
   - [ sh, -c, 'echo "<?php phpinfo(); ?>" > /var/www/html/phpinfo.php' ]
   ```

------

1. 让实例有足够的时间启动和运行用户数据中的指令，然后查看指令是否完成了预期的任务。

   对于此示例，在 Web 浏览器中输入指令创建的 PHP 测试文件的 URL。此 URL 是实例的公用 DNS 地址，后接正斜杠和文件名。

   ```
   http://{{my.public.dns.amazonaws.com}}/phpinfo.php
   ```

   您应该会看到 PHP 信息页面。如果您无法看到 PHP 信息页，请检查所用的安全组是否包含允许 HTTP (端口 80) 通信的规则。有关更多信息，请参阅 [配置安全组规则](changing-security-group.md#add-remove-security-group-rules)。

1. （可选）如果您的指令没有完成您期望的任务，或者如果您只是想验证您的指令是否已完成且没有错误，[请连接到实例](connect-to-linux-instance.md)，检查输出日志文件 (`/var/log/cloud-init-output.log`)，然后查找输出中的错误消息。对于其他调试信息，您可以将以下行添加到指令：

   ```
   output : { all : '| tee -a /var/log/cloud-init-output.log' }
   ```

   此指令将 **runcmd** 输出发送到 `/var/log/cloud-init-output.log`。

### 用户数据和 AWS CLI
<a name="user-data-api-cli"></a>

您可以使用 AWS CLI 指定、修改和查看实例的用户数据。有关使用实例元数据从实例查看用户数据的信息，请参阅[访问 EC2 实例的实例元数据](instancedata-data-retrieval.md)。

在 Windows 上，您可以使用 AWS Tools for Windows PowerShell 而不是使用 AWS CLI。有关更多信息，请参阅 [用户数据和 Tools for Windows PowerShell](#user-data-powershell)。

**示例：启动时指定用户数据**  
要在启动实例时指定用户数据，请结合使用 [run-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/run-instances.html) 命令与 `--user-data` 参数。使用 **run-instances**，AWS CLI 将对您的用户数据执行 base64 编码。

以下示例显示如何在命令行上指定字符串形式的脚本：

```
aws ec2 run-instances --image-id ami-{{abcd1234}} --count {{1}} --instance-type {{m3.medium}} \
    --key-name {{my-key-pair}} --subnet-id subnet-{{abcd1234}} --security-group-ids sg-{{abcd1234}} \
    --user-data {{echo user data}}
```

以下示例显示如何使用文本文件指定脚本。请务必使用 `file://` 前缀指定该文件。

```
aws ec2 run-instances --image-id ami-{{abcd1234}} --count {{1}} --instance-type {{m3.medium}} \
    --key-name {{my-key-pair}} --subnet-id subnet-{{abcd1234}} --security-group-ids sg-{{abcd1234}} \
    --user-data file://{{my_script.txt}}
```

以下是具有 Shell 脚本的示例文本文件。

```
#!/bin/bash
yum update -y
service httpd start
chkconfig httpd on
```

**示例：修改停止的实例的用户数据**  
您可以使用 [modify-instance-attribute](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-instance-attribute.html) 命令修改已停止的实例的用户数据。使用 **modify-instance-attribute**，AWS CLI 不会对用户数据执行 base64 编码。
+ 在 **Linux** 计算机上，使用 base64 命令对用户数据进行编码。

  ```
  base64 my_script.txt >my_script_base64.txt
  ```
+ 在 **Windows** 计算机上，使用 certutil 命令可对用户数据进行编码。您必须先删除第一行 (BEGIN CERTIFICATE) 和最后一行 (END CERTIFICATE)，然后才能将此文件用于 AWS CLI。

  ```
  certutil -encode my_script.txt my_script_base64.txt
  notepad my_script_base64.txt
  ```

使用 `--attribute` 和 `--value` 参数可通过编码的文本文件指定用户数据。请务必使用 `file://` 前缀指定该文件。

```
aws ec2 modify-instance-attribute --instance-id {{i-1234567890abcdef0}} --attribute userData --value file://{{my_script_base64.txt}}
```

**示例：清除停止的实例的用户数据**  
要删除现有的用户数据，请按以下方式使用 [modify-instance-attribute](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-instance-attribute.html) 命令：

```
aws ec2 modify-instance-attribute --instance-id {{i-1234567890abcdef0}} --user-data Value=
```

**示例：查看用户数据**  
要检索实例的用户数据，请使用 [describe-instance-attribute](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instance-attribute.html) 命令。使用 **describe-instance-attribute**，AWS CLI 不会对用户数据执行 base64 解码。

```
aws ec2 describe-instance-attribute --instance-id {{i-1234567890abcdef0}} --attribute userData
```

以下是具有已进行 base64 编码的用户数据的示例输出。

```
{
    "UserData": {
        "Value": "IyEvYmluL2Jhc2gKeXVtIHVwZGF0ZSAteQpzZXJ2aWNlIGh0dHBkIHN0YXJ0CmNoa2NvbmZpZyBodHRwZCBvbg=="
    },
    "InstanceId": "i-1234567890abcdef0"
}
```
+ 在 **Linux** 计算机上，使用 `--query` 选项获取已编码的用户数据和用于对该数据进行解码的 base64 命令。

  ```
  aws ec2 describe-instance-attribute --instance-id {{i-1234567890abcdef0}} --attribute userData --output text --query "UserData.Value" | base64 --decode
  ```
+ 在 **Windows** 计算机上，使用 `--query` 选项获取已编码的用户数据和用于对该数据进行解码的 certutil 命令。请注意，编码的输出存储在一个文件中，解码的输出存储在另一个文件中。

  ```
  aws ec2 describe-instance-attribute --instance-id {{i-1234567890abcdef0}} --attribute userData --output text --query "UserData.Value" >my_output.txt
  certutil -decode my_output.txt my_output_decoded.txt
  type my_output_decoded.txt
  ```

下面是示例输出。

```
#!/bin/bash
yum update -y
service httpd start
chkconfig httpd on
```

### 将 Shell 脚本和 cloud-init 指令组合使用
<a name="user-data-mime-multi"></a>

默认情况下，一次只能在用户数据中包含一个内容类型。不过，您可以在 mime-multi part 文件中使用 `text/cloud-config` 和 `text/x-shellscript`，以便在用户数据中同时包含 Shell 脚本和 cloud-init 指令。

下面显示了 mime-multi part 的格式。

```
Content-Type: multipart/mixed; boundary="//"
MIME-Version: 1.0
	
--//
Content-Type: text/cloud-config; charset="us-ascii"
MIME-Version: 1.0
Content-Transfer-Encoding: 7bit
Content-Disposition: attachment; filename="cloud-config.txt"
	
#cloud-config
{{cloud-init directives}}
	
--//
Content-Type: text/x-shellscript; charset="us-ascii"
MIME-Version: 1.0
Content-Transfer-Encoding: 7bit
Content-Disposition: attachment; filename="userdata.txt"
	
#!/bin/bash
{{shell script commands}}
--//--
```

例如，以下用户数据包含了 cloud-init 指令和 bash Shell 脚本。cloud-init 指令会创建一个文件（`/test-cloudinit/cloud-init.txt`），然后将 `Created by cloud-init` 写入该文件。bash Shell 脚本会创建一个文件（`/test-userscript/userscript.txt`），然后将 `Created by bash shell script` 写入该文件。

```
Content-Type: multipart/mixed; boundary="//"
MIME-Version: 1.0
	
--//
Content-Type: text/cloud-config; charset="us-ascii"
MIME-Version: 1.0
Content-Transfer-Encoding: 7bit
Content-Disposition: attachment; filename="cloud-config.txt"
	
#cloud-config
runcmd:
- [ mkdir, /test-cloudinit ]
write_files:
- path: /test-cloudinit/cloud-init.txt
content: Created by cloud-init
	
--//
Content-Type: text/x-shellscript; charset="us-ascii"
MIME-Version: 1.0
Content-Transfer-Encoding: 7bit
Content-Disposition: attachment; filename="userdata.txt"
	
#!/bin/bash
mkdir test-userscript
touch /test-userscript/userscript.txt
echo "Created by bash shell script" >> /test-userscript/userscript.txt
--//--
```

## Amazon EC2 如何处理 Windows 实例的用户数据
<a name="ec2-windows-user-data"></a>

在 Windows 实例上，启动代理会执行与用户数据相关的任务。有关更多信息，请参阅下列内容：
+ [EC2Launch v2](ec2launch-v2.md) 
+ [EC2Launch](ec2launch.md) 
+ [EC2Config 服务](ec2config-service.md)

有关 `UserData` 模板中 CloudFormation 属性的程序集示例，请参阅 [Base64 编码 UserData 属性](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/quickref-general.html#scenario-userdata-base64)和[带 AccessKey 和 SecretKey 的 Base64 编码 UserData 属性](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/quickref-general.html#scenario-userdata-base64-with-keys)。

有关在使用生命周期挂钩的自动扩缩组中实例上运行命令的示例，请参阅《Amazon EC2 Auto Scaling User Guide》**中的 [Tutorial: Configure user data to retrieve the target lifecycle state through instance metadata](https://docs.aws.amazon.com/autoscaling/ec2/userguide/tutorial-lifecycle-hook-instance-metadata.html)。

**Topics**
+ [用户数据脚本](#user-data-scripts)
+ [压缩后的用户数据](#user-data-compressed)
+ [用户数据执行](#user-data-execution)
+ [用户数据和 Tools for Windows PowerShell](#user-data-powershell)

### 用户数据脚本
<a name="user-data-scripts"></a>

要让 `EC2Config` 或 `EC2Launch` 运行脚本，在将脚本添加到用户数据中时，您必须将脚本封装在特殊标签中。您使用的标签取决于命令是在命令提示符窗口（批处理命令）中还是使用 Windows PowerShell 运行。

如果同时指定批处理脚本和 Windows PowerShell 脚本，则批处理脚本先运行，然后运行 Windows PowerShell 脚本，不论这些脚本在实例用户数据中的显示顺序如何。

如果您在用户数据脚本中使用 AWS API（包括 AWS CLI），则在启动实例时必须使用实例配置文件。实例配置文件提供用户数据脚本执行 API 调用所需的适当 AWS 凭证。有关更多信息，请参阅[实例配置文件](iam-roles-for-amazon-ec2.md#ec2-instance-profile)。您分配给 IAM 角色的权限取决于您使用 API 调用的服务。有关更多信息，请参阅 [适用于 Amazon EC2 的 IAM 角色](iam-roles-for-amazon-ec2.md)。

**Topics**
+ [批处理脚本的语法](#user-data-batch-scripts)
+ [Windows PowerShell 脚本的语法](#user-data-powershell-scripts)
+ [YAML 配置脚本的语法](#user-data-yaml-scripts)
+ [Base64 编码](#user-data-base64-encoding)

#### 批处理脚本的语法
<a name="user-data-batch-scripts"></a>

使用 `script` 标签指定批处理脚本。使用换行符分隔命令，如以下示例所示。

```
<script>
    echo Current date and time >> %SystemRoot%\Temp\test.log
    echo %DATE% %TIME% >> %SystemRoot%\Temp\test.log
</script>
```

默认情况下，用户数据脚本在您启动实例时运行一次。要在每次重新引导或启动实例时运行用户数据脚本，请将 `<persist>true</persist>` 添加到用户数据。

```
<script>
    echo Current date and time >> %SystemRoot%\Temp\test.log
    echo %DATE% %TIME% >> %SystemRoot%\Temp\test.log
</script>
<persist>true</persist>
```

**EC2Launch v2 代理**  
要在 EC2Launch v2 **executeScript** 任务处于 `UserData` 阶段时将 XML 用户数据脚本作为分离的进程运行，请向用户数据添加 `<detach>true</detach>`。

**注意**  
以前的启动代理不支持 detach 标签。

```
<script>
    echo Current date and time >> %SystemRoot%\Temp\test.log
    echo %DATE% %TIME% >> %SystemRoot%\Temp\test.log
</script>
<detach>true</detach>
```

#### Windows PowerShell 脚本的语法
<a name="user-data-powershell-scripts"></a>

AWS Windows AMI 包括 [AWS Tools for Windows PowerShell](https://aws.amazon.com/powershell/)，因此您可在用户数据中指定这些 cmdlet。如果您将一个 IAM 角色与实例相关联，那么您不必为 cmdlet 指定凭证，因为实例上运行的应用程序可以使用该角色的凭证访问AWS资源（例如 Amazon S3 存储桶）。

使用 `<powershell>` 标签指定 Windows PowerShell 脚本。使用换行符分隔命令。`<powershell>` 标签区分大小写。

例如：

```
<powershell>
    $file = $env:SystemRoot + "\Temp\" + (Get-Date).ToString("MM-dd-yy-hh-mm")
    New-Item $file -ItemType file
</powershell>
```

默认情况下，用户数据脚本会在您启动实例时运行一次。要在每次重新引导或启动实例时运行用户数据脚本，请将 `<persist>true</persist>` 添加到用户数据。

```
<powershell>
    $file = $env:SystemRoot + "\Temp\" + (Get-Date).ToString("MM-dd-yy-hh-mm")
    New-Item $file -ItemType file
</powershell>
<persist>true</persist>
```

您可以使用 `<powershellArguments>` 标签来指定一个或多个 PowerShell 参数。如果未传递任何参数，则默认情况下，EC2Launch 和 EC2Launch v2 会添加以下参数：`-ExecutionPolicy Unrestricted`。

**示例：**

```
<powershell>
    $file = $env:SystemRoot + "\Temp" + (Get-Date).ToString("MM-dd-yy-hh-mm")
    New-Item $file -ItemType file
</powershell>
<powershellArguments>-ExecutionPolicy Unrestricted -NoProfile -NonInteractive</powershellArguments>
```

**EC2Launch v2 代理**  
要在 EC2Launch v2 **executeScript** 任务处于 `UserData` 阶段时将 XML 用户数据脚本作为分离的进程运行，请向用户数据添加 `<detach>true</detach>`。

**注意**  
以前的启动代理不支持 detach 标签。

```
<powershell>
    $file = $env:SystemRoot + "\Temp\" + (Get-Date).ToString("MM-dd-yy-hh-mm")
    New-Item $file -ItemType file
</powershell>
<detach>true</detach>
```

#### YAML 配置脚本的语法
<a name="user-data-yaml-scripts"></a>

如果使用 EC2Launch v2 运行脚本，则可以使用 YAML 格式。要查看 EC2Launch v2 的配置任务、详细信息和示例，请参阅 [EC2Launch v2 任务配置](ec2launch-v2-settings.md#ec2launch-v2-task-configuration)。

使用 `executeScript` 任务指定 YAML 脚本。

**运行 PowerShell 脚本的 YAML 语法示例** 

```
version: 1.0
tasks:
- task: executeScript
  inputs:
  - frequency: always
    type: powershell
    runAs: localSystem
    content: |-
      $file = $env:SystemRoot + "\Temp\" + (Get-Date).ToString("MM-dd-yy-hh-mm")
      New-Item $file -ItemType file
```

**运行批处理脚本的 YAML 语法示例**

```
version: 1.1
tasks:
- task: executeScript
  inputs:
  - frequency: always
    type: batch
    runAs: localSystem
    content: |-
      echo Current date and time >> %SystemRoot%\Temp\test.log
      echo %DATE% %TIME% >> %SystemRoot%\Temp\test.log
```

#### Base64 编码
<a name="user-data-base64-encoding"></a>

如果使用的是 Amazon EC2 API 或不对用户数据执行 base64 编码的工具，则您必须自行对用户数据进行编码。否则，系统会记录找不到要运行的 `script` 或 `powershell` 标签的错误。下面是使用 Windows PowerShell 进行编码的示例。

```
$UserData = [System.Convert]::ToBase64String([System.Text.Encoding]::ASCII.GetBytes($Script))
```

下面是一个使用 PowerShell 进行解码的示例。

```
$Script = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($UserData))
```

有关 base64 编码的更多信息，请参阅 [ https://www.ietf.org/rfc/rfc4648.txt](https://www.ietf.org/rfc/rfc4648.txt)。

### 压缩后的用户数据
<a name="user-data-compressed"></a>

EC2Launch v2 支持使用压缩用户数据的方法，来提交超过 16 KB 这一 IMDS 规定限制的用户数据。要使用此功能，请将用户数据脚本压缩为 `.zip` 存档，然后将其传递给 EC2 实例。检测到压缩用户数据时，EC2Launch v2 会自动将压缩后的用户数据脚本解压缩，然后再运行该脚本。

对于标准用户数据，如果使用的是 Amazon EC2 API 或不对用户数据执行 base64 编码的工具，则必须自行对压缩用户数据进行编码。有关用户数据大小限制和 base64 编码的更多信息，请参阅[访问 EC2 实例的实例元数据](instancedata-data-retrieval.md)。

### 用户数据执行
<a name="user-data-execution"></a>

默认情况下，所有 AWS Windows AMI 均已为初次启动启用了用户数据执行。您可以指定用户数据脚本在下次实例重新引导或重启时运行。此外，您可以指定用户数据脚本在每次实例重新引导或重启时运行。

**注意**  
默认情况下不会使用户数据在首次启动后运行。要使用户数据在实例重启或启动时运行，请参阅[在后续重启或启动期间运行脚本](#user-data-scripts-subsequent)。

生成随机密码之后，从本地管理员账户运行用户数据脚本。否则，从系统账户运行用户数据脚本。

#### 实例启动脚本
<a name="user-data-scripts-launch"></a>

实例用户数据中的脚本在实例的初次启动期间运行。如果找到 `persist` 标签，则为后续重新引导或启动启用用户数据执行。EC2Launch v2、EC2Launch 和 EC2Config 的日志文件包含源自标准输出和标准错误流的输出。

**EC2Launch v2**  
EC2Launch v2 的日志文件为 `C:\ProgramData\Amazon\EC2Launch\log\agent.log`。

**注意**  
`C:\ProgramData` 文件夹可能已隐藏。要查看该文件夹，您必须显示隐藏的文件和文件夹。

执行用户数据时将记录以下信息：
+ `Info: Converting user-data to yaml format` – 如果用户数据是以 XML 格式提供的
+ `Info: Initialize user-data state` – 用户数据执行开始
+ `Info: Frequency is: always` – 如果每次启动时都运行用户数据任务
+ `Info: Frequency is: once` – 如果用户数据任务只运行一次
+ `Stage: postReadyUserData execution completed` – 用户数据执行结束

**EC2Launch**  
EC2Launch 的日志文件为 `C:\ProgramData\Amazon\EC2-Windows\Launch\Log\UserdataExecution.log`。

`C:\ProgramData` 文件夹可能已隐藏。要查看该文件夹，您必须显示隐藏的文件和文件夹。

执行用户数据时将记录以下信息：
+ `Userdata execution begins` – 用户数据执行开始
+ `<persist> tag was provided: true` – 找到持久标签时
+ `Running userdata on every boot` – 找到持久标签时
+ `<powershell> tag was provided.. running powershell content` – 如果找到 PowerShell 标签
+ `<script> tag was provided.. running script content` – 如果找到脚本标签
+ `Message: The output from user scripts` – 如果运行用户数据脚本，则会记录其输出

**EC2Config**  
EC2Config 的日志文件为 `C:\Program Files\Amazon\Ec2ConfigService\Logs\Ec2Config.log`。执行用户数据时将记录以下信息：
+ `Ec2HandleUserData: Message: Start running user scripts` – 用户数据执行开始
+ `Ec2HandleUserData: Message: Re-enabled userdata execution` – 找到持久标签时
+ `Ec2HandleUserData: Message: Could not find <persist> and </persist>` – 如果未找到持久标签
+ `Ec2HandleUserData: Message: The output from user scripts` – 如果运行用户数据脚本，则会记录其输出

#### 在后续重启或启动期间运行脚本
<a name="user-data-scripts-subsequent"></a>

在更新实例用户数据后，更新后的用户将在下次重启或启动实例时自动反映在实例元数据中。但根据安装的启动代理不同，可能需要额外的配置才能将用户数据脚本配置为在后续重启或启动时运行。

如果选择了**使用 Sysprep 关闭**选项，则用户数据脚本将在下一次实例启动或重启时运行，即使没有为后续重启或启动启用用户数据执行，也是如此。

有关启用用户数据执行的说明，请选择与启动代理相匹配的选项卡。

------
#### [ EC2Launch v2 ]

与 EC2Launch v1 不同，EC2Launch v2 在每次启动时都会对用户数据任务进行评估。无需手动计划用户数据任务。用户数据基于包含的频率或持久性选项运行。

对于 XML 用户数据脚本  
要在每次启动时运行用户数据脚本，请在用户数据中添加 `<persist>true</persist>` 标志。如果未包含持久性标志，则用户数据脚本仅在首次启动时运行。

对于 YAML 用户数据  
+ 要在首次启动时运行用户数据中的任务，请将任务 `frequency` 设置为 `once`。
+ 要在每次启动时都运行用户数据中的任务，请将任务 `frequency` 设置为 `always`。

------
#### [ EC2Launch ]

1. 连接到您的 Windows 实例。

1. 打开 PowerShell 命令窗口，并运行以下命令之一：

**运行一次**  
要在下次启动时运行一次用户数据，请使用 `-Schedule` 标志。

   ```
   C:\ProgramData\Amazon\EC2-Windows\Launch\Scripts\InitializeInstance.ps1 -Schedule
   ```

**在所有后续启动时运行**  
要在所有后续启动时运行用户数据，请使用 `-SchedulePerBoot` 标志。

   ```
   C:\ProgramData\Amazon\EC2-Windows\Launch\Scripts\InitializeInstance.ps1 -SchedulePerBoot
   ```

1. 从 Windows 实例断开连接。要在下次实例启动时运行更新后的脚本，请停止实例并更新用户数据。

------
#### [ EC2Config ]

1. 连接到您的 Windows 实例。

1. 打开 `C:\Program Files\Amazon\Ec2ConfigService\Ec2ConfigServiceSetting.exe`。

1. 对于**用户数据**，选择 **Enable UserData execution for next service start** (为下次服务启动启用用户数据执行)。

1. 从 Windows 实例断开连接。要在下次实例启动时运行更新后的脚本，请停止实例并更新用户数据。

------

### 用户数据和 Tools for Windows PowerShell
<a name="user-data-powershell"></a>

您可以使用 Tools for Windows PowerShell 指定、修改和查看实例的用户数据。有关使用实例元数据从实例查看用户数据的信息，请参阅[访问 EC2 实例的实例元数据](instancedata-data-retrieval.md)。有关用户数据和 AWS CLI 的信息，请参阅 [用户数据和 AWS CLI](#user-data-api-cli)。

**示例：启动时指定实例用户数据**  
使用实例用户数据创建一个文本文件。要在每次重新引导或启动实例时运行用户数据脚本，请添加 `<persist>true</persist>`，如下例中所示。

```
<powershell>
    $file = $env:SystemRoot + "\Temp\" + (Get-Date).ToString("MM-dd-yy-hh-mm")
    New-Item $file -ItemType file
</powershell>
<persist>true</persist>
```

要在启动实例时指定实例用户数据，请使用 [New-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2Instance.html) 命令。该命令不会对用户数据进行 base64 编码。使用以下命令在名为 `script.txt` 的文本文件中对用户数据进行编码。

```
PS C:\> $Script = Get-Content -Raw {{script.txt}}
PS C:\> $UserData = [System.Convert]::ToBase64String([System.Text.Encoding]::ASCII.GetBytes($Script))
```

使用 `-UserData` 参数可将用户数据传递到 **New-EC2Instance** 命令。

```
PS C:\> New-EC2Instance -ImageId {{ami-abcd1234}} -MinCount {{1}} -MaxCount {{1}} -InstanceType {{m3.medium}} \
    -KeyName {{my-key-pair}} -SubnetId {{subnet-12345678}} -SecurityGroupIds {{sg-1a2b3c4d}} \
    -UserData $UserData
```

**示例：更新已停止实例的实例用户数据**  
您可以使用 [Edit-EC2InstanceAttribute](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2InstanceAttribute.html) 命令修改已停止的实例的用户数据。

使用新脚本创建一个文本文件。使用以下命令在名为 `new-script.txt` 的文本文件中对用户数据进行编码。

```
PS C:\> $NewScript = Get-Content -Raw {{new-script.txt}}
PS C:\> $NewUserData = [System.Convert]::ToBase64String([System.Text.Encoding]::ASCII.GetBytes($NewScript))
```

使用 `-UserData` 和 `-Value` 参数可指定用户数据。

```
PS C:\> Edit-EC2InstanceAttribute -InstanceId {{i-1234567890abcdef0}} -Attribute userData -Value $NewUserData
```

**示例：查看实例用户数据**  
要检索实例的用户数据，请使用 [Get-EC2InstanceAttribute](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2InstanceAttribute.html) 命令。

```
PS C:\> (Get-EC2InstanceAttribute -InstanceId {{i-1234567890abcdef0}} -Attribute userData).UserData
```

下面是示例输出。请注意，用户数据已编码。

```
PHBvd2Vyc2hlbGw+DQpSZW5hbWUtQ29tcHV0ZXIgLU5ld05hbWUgdXNlci1kYXRhLXRlc3QNCjwvcG93ZXJzaGVsbD4=
```

使用以下命令可将已编码的用户数据存储在变量中，然后对其进行编码。

```
PS C:\> $UserData_encoded = (Get-EC2InstanceAttribute -InstanceId {{i-1234567890abcdef0}} -Attribute userData).UserData
PS C:\> [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($UserData_encoded))
```

下面是示例输出。

```
<powershell>
    $file = $env:SystemRoot + "\Temp\" + (Get-Date).ToString("MM-dd-yy-hh-mm")
    New-Item $file -ItemType file
</powershell>
<persist>true</persist>
```

**示例：重命名实例以匹配标签值**  
要读取标签值、在首次启动时重命名实例以匹配标签值并重新启动，您可以使用 [Get-EC2Tag](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2Tag.html) 命令。要成功运行此命令，您必须将具有 `ec2:DescribeTags` 权限的角色附加到实例上，因为标签信息通过 API 调用检索。有关使用 IAM 角色的设置权限的更多信息，请参阅 [将 IAM 角色附加到实例](attach-iam-role.md)。

------
#### [ IMDSv2 ]

```
<powershell>
    [string]$token = Invoke-RestMethod -Headers @{"X-aws-ec2-metadata-token-ttl-seconds" = "21600"} -Method PUT -Uri 'http://169.254.169.254/latest/api/token' -UseBasicParsing
    $instanceId = Invoke-RestMethod -Headers @{"X-aws-ec2-metadata-token" = $token} -Method GET -Uri 'http://169.254.169.254/latest/meta-data/instance-id' -UseBasicParsing
	$nameValue = (Get-EC2Tag -Filter @{Name="resource-id";Value=$instanceid},@{Name="key";Value="Name"}).Value
	$pattern = "^(?![0-9]{1,15}$)[a-zA-Z0-9-]{1,15}$"
	#Verify Name Value satisfies best practices for Windows hostnames
	If ($nameValue -match $pattern) 
	    {Try
	        {Rename-Computer -NewName $nameValue -Restart -ErrorAction Stop} 
	    Catch
	        {$ErrorMessage = $_.Exception.Message
	        Write-Output "Rename failed: $ErrorMessage"}}
	Else
	    {Throw "Provided name not a valid hostname. Please ensure Name value is between 1 and 15 characters in length and contains only alphanumeric or hyphen characters"}
</powershell>
```

------
#### [ IMDSv1 ]

```
<powershell>
	$instanceId = (Invoke-WebRequest http://169.254.169.254/latest/meta-data/instance-id -UseBasicParsing).content
	$nameValue = (Get-EC2Tag -Filter @{Name="resource-id";Value=$instanceid},@{Name="key";Value="Name"}).Value
	$pattern = "^(?![0-9]{1,15}$)[a-zA-Z0-9-]{1,15}$"
	#Verify Name Value satisfies best practices for Windows hostnames
	If ($nameValue -match $pattern) 
	    {Try
	        {Rename-Computer -NewName $nameValue -Restart -ErrorAction Stop} 
	    Catch
	        {$ErrorMessage = $_.Exception.Message
	        Write-Output "Rename failed: $ErrorMessage"}}
	Else
	    {Throw "Provided name not a valid hostname. Please ensure Name value is between 1 and 15 characters in length and contains only alphanumeric or hyphen characters"}
</powershell>
```

------

您还可以使用实例元数据中的标签对实例进行重命名，前提是您的实例配置为从实例元数据访问标签。有关更多信息，请参阅 [使用实例元数据来查看 EC2 实例的标签](work-with-tags-in-IMDS.md)。

------
#### [ IMDSv2 ]

```
<powershell>
    [string]$token = Invoke-RestMethod -Headers @{"X-aws-ec2-metadata-token-ttl-seconds" = "21600"} -Method PUT -Uri 'http://169.254.169.254/latest/api/token' -UseBasicParsing
	$nameValue = Invoke-RestMethod -Headers @{"X-aws-ec2-metadata-token" = $token} -Method GET -Uri 'http://169.254.169.254/latest/meta-data/tags/instance/Name' -UseBasicParsing
	$pattern = "^(?![0-9]{1,15}$)[a-zA-Z0-9-]{1,15}$"
	#Verify Name Value satisfies best practices for Windows hostnames
	If ($nameValue -match $pattern) 
	    {Try
	        {Rename-Computer -NewName $nameValue -Restart -ErrorAction Stop} 
	    Catch
	        {$ErrorMessage = $_.Exception.Message
	        Write-Output "Rename failed: $ErrorMessage"}}
	Else
	    {Throw "Provided name not a valid hostname. Please ensure Name value is between 1 and 15 characters in length and contains only alphanumeric or hyphen characters"}
</powershell>
```

------
#### [ IMDSv1 ]

```
<powershell>
	$nameValue = Get-EC2InstanceMetadata -Path /tags/instance/Name
	$pattern = "^(?![0-9]{1,15}$)[a-zA-Z0-9-]{1,15}$"
	#Verify Name Value satisfies best practices for Windows hostnames
	If ($nameValue -match $pattern) 
	    {Try
	        {Rename-Computer -NewName $nameValue -Restart -ErrorAction Stop} 
	    Catch
	        {$ErrorMessage = $_.Exception.Message
	        Write-Output "Rename failed: $ErrorMessage"}}
	Else
	    {Throw "Provided name not a valid hostname. Please ensure Name value is between 1 and 15 characters in length and contains only alphanumeric or hyphen characters"}
</powershell>
```

------