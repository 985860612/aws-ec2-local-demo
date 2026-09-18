

# 管理 Amazon EC2 Linux 实例上的系统用户
<a name="managing-users"></a>

每个 Linux 实例均以默认的 Linux 系统用户启动。您可以向实例添加用户，也可以删除用户。

对于默认用户，[默认用户名](#ami-default-user-names)由您在启动实例时指定的 AMI 决定。

**注意**  
默认情况下，密码身份验证和根用户登录将被禁用，而 sudo 将会启用。要登录您的实例，必须使用密钥对。有关日志记录的更多信息，请参阅 [使用 SSH 连接到 Linux 实例](connect-to-linux-instance.md)。  
您可以允许对您的实例进行密码身份验证和根用户登录。有关更多信息，请参阅您的操作系统文档。

**注意**  
Linux 系统用户不应与 IAM 用户混淆。有关更多信息，请参阅 *IAM 用户指南*中的 [IAM 用户](https://docs.aws.amazon.com/IAM/latest/UserGuide/id.html#id_iam-users)。

**Topics**
+ [默认用户名](#ami-default-user-names)
+ [注意事项](#add-user-best-practice)
+ [创建用户](#create-user-account)
+ [删除用户](#delete-user-account)

## 默认用户名
<a name="ami-default-user-names"></a>

EC2 实例的默认用户名由您在启动实例时指定的 AMI 决定。

默认用户名为：
+ 对于 Amazon Linux AMI，用户名是 `ec2-user`。
+ 对于 CentOS AMI，用户名是 `centos` 或 `ec2-user`。
+ 对于 Debian AMI，用户名是 `admin`。
+ 对于 Fedora AMI，用户名是 `fedora` 或 `ec2-user`。
+ 对于 FreeBSD AMI，用户名是 `ec2-user`。
+ 对于 RHEL AMI，用户名是 `ec2-user` 或 `root`。
+ 对于 SUSE AMI，用户名是 `ec2-user` 或 `root`。
+ 对于 Ubuntu AMI，用户名为 `ubuntu`。
+ 对于 Oracle AMI，用户名是 `ec2-user`。
+ 对于 Bitnami AMI，用户名是 `bitnami`。

**注意**  
要查找其他 Linux 发行版的默认用户名，请咨询 AMI 提供商。

## 注意事项
<a name="add-user-best-practice"></a>

对于许多应用程序来说，使用默认用户是适当的。但是，您可以选择添加用户，以便个人能够拥有自己的文件和工作区。此外，为新用户创建用户比向多个（可能缺乏经验的）用户授予对默认用户的访问权限更安全，因为如果使用不当，该默认用户可能对系统造成严重破坏。

要使用 Linux 系统用户启用对 EC2 实例的用户 SSH 访问，您必须与用户分享 SSH 密钥。此外，您可以使用 EC2 Instance Connect 来向用户提供访问权限而无需共享和管理 SSH 密钥。有关更多信息，请参阅 [使用公有 IP 地址和 EC2 Instance Connect 连接到 Linux 实例](connect-linux-inst-eic.md)。

## 创建用户
<a name="create-user-account"></a>

先创建用户，然后添加允许用户连接并登录实例的 SSH 公有密钥。

**重要**  
在此过程的步骤 1 中，创建新的密钥对。由于密钥对的功能类似于密码，因此安全处理至关重要。如果您为用户创建密钥对，则必须确保将私有密钥安全地发送给这些用户。或者，用户可以通过创建自己的密钥对来完成步骤 1 和步骤 2，确保其计算机上的私有密钥安全，然后将公有密钥发送给您以完成步骤 3 中的过程。

**创建用户**

1. [创建新的密钥对](create-key-pairs.md#having-ec2-create-your-key-pair)：您必须将 `.pem` 文件提供给要为其创建用户的用户。他们必须使用此文件来连接到实例。

1. 从您在上一步中创建的密钥对中检索公有密钥。

   ```
   $ ssh-keygen -y -f /{{path_to_key_pair}}/{{key-pair-name}}.pem
   ```

   该命令返回公有密钥，如以下示例所示。

   ```
   ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQClKsfkNkuSevGj3eYhCe53pcjqP3maAhDFcvBS7O6Vhz2ItxCih+PnDSUaw+WNQn/mZphTk/a/gU8jEzoOWbkM4yxyb/wB96xbiFveSFJuOp/d6RJhJOI0iBXrlsLnBItntckiJ7FbtxJMXLvvwJryDUilBMTjYtwB+QhYXUMOzce5Pjz5/i8SeJtjnV3iAoG/cQk+0FzZqaeJAAHco+CY/5WrUBkrHmFJr6HcXkvJdWPkYQS3xqC0+FmUZofz221CBt5IMucxXPkX4rWi+z7wB3RbBQoQzd8v7yeb7OzlPnWOyN0qFU0XA246RA8QFYiCNYwI3f05p6KLxEXAMPLE
   ```

1. 连接到实例。

1. 使用 **adduser** 命令创建用户并将其添加到系统（`/etc/passwd` 文件中会有一个条目）。该命令还可以为用户创建一个组和一个主目录。在此示例中，用户名为 `{{newuser}}`。
   + AL2023 和 Amazon Linux 2

     对于 AL2023 和 Amazon Linux 2，创建用户时将默认禁用密码身份验证。

     ```
     [ec2-user ~]$ sudo adduser {{newuser}}
     ```
   + Ubuntu

     添加 `--disabled-password` 参数以创建用户并禁用密码身份验证。

     ```
     [ubuntu ~]$ sudo adduser {{newuser}} --disabled-password
     ```

1. 切换到新用户，以便所创建的目录和文件具有适当的所有权。

   ```
   [ec2-user ~]$ sudo su - {{newuser}}
   ```

   如果提示从 `ec2-user` 变为 `{{newuser}}`，则表示您已将 Shell 会话切换到新用户。

1. 将 SSH 公有密钥添加到用户。首先在 SSH 密钥文件对应的用户主目录中创建一个目录，然后创建密钥文件，最后将公有密钥粘贴到该密钥文件中，如以下分步说明中所述。

   1. 在 `{{newuser}}` 主目录中创建一个 `.ssh` 目录，并将其权限更改为 `700` (只有文件所有者能够读取、写入或打开该目录。)

      ```
      [newuser ~]$ mkdir .ssh
      ```

      ```
      [newuser ~]$ chmod 700 .ssh
      ```
**重要**  
如果没有这些确切的文件权限，用户将无法登录。

   1. 在 `.ssh` 目录中，创建一个名为 `authorized_keys` 的文件，并将该文件权限更改为 `600`（只有文件所有者才能够读取或写入此文件)。

      ```
      [newuser ~]$ touch .ssh/authorized_keys
      ```

      ```
      [newuser ~]$ chmod 600 .ssh/authorized_keys
      ```
**重要**  
如果没有这些确切的文件权限，用户将无法登录。

   1. <a name="edit_auth_keys"></a>使用您常用的文本编辑器 (如 **vim** 或 **nano**) 打开 `authorized_keys` 文件。

      ```
      [newuser ~]$ nano .ssh/authorized_keys
      ```

      将您在**步骤 2** 中检索到的公有密钥粘贴到文件中并保存更改。
**重要**  
确保将公有密钥粘贴到一个连续行中。不得将公有密钥拆分为多行。

      用户现在能够使用添加到 `{{newuser}}` 文件的公有密钥所对应的私有密钥登录实例上的 `authorized_keys` 用户。有关连接到 Linux 实例的不同方法的更多信息，请参阅[使用 SSH 连接到 Linux 实例](connect-to-linux-instance.md)。

## 删除用户
<a name="delete-user-account"></a>

如果不再需要某个用户，可以将其删除，使它不再可用。

使用 **userdel** 命令从系统中删除用户。当您指定 `-r` 参数时，用户的主目录和邮件后台打印将被删除。要保留用户的主目录和邮件后台打印，请省略 `-r` 参数。

```
[ec2-user ~]$ sudo userdel -r {{olduser}}
```