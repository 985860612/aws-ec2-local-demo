

# Amazon EC2 密钥对和 Amazon EC2 实例
<a name="ec2-key-pairs"></a>

密钥对（由公有密钥和私有密钥组成）是一组安全凭证，可在连接到 Amazon EC2 实例时用来证明您的身份。对于 Linux 实例，私有密钥可使您安全地 SSH 到您的实例。对于 Windows 实例，需要用私有密钥才能解密管理员密码，然后您可以使用该密码连接到您的实例。

Amazon EC2 在您的实例上存储公有密钥，您需要存储私有密钥，如下图所示。重要的是，您要将您的私有密钥存储在一个安全的位置，因为拥有您的私有密钥的任何人都可以连接到使用密钥对的实例。

![密钥对包含您的计算机的私有密钥，以及您的实例的公有密钥。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/ec2-key-pair.png)


启动实例时，您可以[指定密钥对](ec2-instance-launch-parameters.md#liw-key-pair)，这样便可使用需要密钥对的方法连接到您的实例。根据安全管理方式的不同，您可以为所有实例指定相同的密钥对，也可以指定不同的密钥对。

对于 Linux 实例，实例首次启动时，您在启动时指定的公有密钥将放在 Linux 实例 `~/.ssh/authorized_keys` 内的条目中。在使用 SSH 连接到 Linux 实例时，要进行登录，您必须指定与公有密钥对应的私有密钥。

有关连接到 EC2 实例的更多信息，请参阅 [连接到您的 EC2 实例](connect.md)。

**重要**  
由于 Amazon EC2 不保存私有密钥的副本，因此，如果您丢失私有密钥，则无法恢复它。但是，仍可通过一种方法连接到丢失了密钥对的实例。有关更多信息，请参阅 [我丢失了私有密钥。如何连接到我的实例？](TroubleshootingInstancesConnecting.md#replacing-lost-key-pair)。

作为密钥对的替代方案，您可以使用 [AWS Systems Manager Session Manager](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html) 通过基于浏览器的交互式 Shell 或 AWS Command Line Interface（AWS CLI）连接到您的实例。

**Topics**
+ [为您的 Amazon EC2 实例创建密钥对](create-key-pairs.md)
+ [描述密钥对](describe-keys.md)
+ [删除您的密钥对](delete-key-pair.md)
+ [在 Linux 实例上添加或更换公有密钥](replacing-key-pair.md)
+ [验证您的密钥对的指纹](verify-keys.md)