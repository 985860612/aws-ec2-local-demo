

# 描述密钥对
<a name="describe-keys"></a>

您可以描述存储在 Amazon EC2 中的密钥对。您还可以检索公有密钥材料并识别启动时指定的公有密钥。

**Topics**
+ [描述密钥对](#describe-public-key)
+ [检索公有密钥材料](#retrieving-the-public-key)
+ [确定启动时指定的公有密钥](#identify-key-pair-specified-at-launch)

## 描述密钥对
<a name="describe-public-key"></a>

您可以查看有关存储在 Amazon EC2 中的公有密钥的以下信息：公有密钥名称、ID、密钥类型、指纹、公有密钥材料、Amazon EC2 创建密钥的日期和时间（采用 UTC 时区）（如果密钥是由第三方工具创建的，则是将该密钥导入 Amazon EC2 的日期和时间），以及与该公有密钥相关联的所有标签。

------
#### [ Console ]

**查看有关密钥对的信息**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在左侧导航器中，选择 **Key Pairs**（密钥对）。

1. 您可以在**Key pairs**（密钥对）表中查看每个公有密钥的相关信息。  
![密钥对表。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/key-pairs-describe-console.png)

1. 要查看公有密钥的标签，请选中密钥旁边的复选框，然后选择**操作**、**管理标签**。

------
#### [ AWS CLI ]

**查看有关密钥对的信息**  
使用 [describe-key-pairs](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-key-pairs.html) 命令。

```
aws ec2 describe-key-pairs --key-names {{key-pair-name}}
```

------
#### [ PowerShell ]

**查看有关密钥对的信息**  
使用 [Get-EC2KeyPair](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2KeyPair.html) cmdlet。

```
Get-EC2KeyPair -KeyName {{key-pair-name}}
```

------

## 检索公有密钥材料
<a name="retrieving-the-public-key"></a>

您可以获取密钥对的公有密钥材料。以下是一个示例公有密钥。请注意，添加的换行符是为了提高可读性。

```
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQClKsfkNkuSevGj3eYhCe53pcjqP3maAhDFcvBS7O6V
hz2ItxCih+PnDSUaw+WNQn/mZphTk/a/gU8jEzoOWbkM4yxyb/wB96xbiFveSFJuOp/d6RJhJOI0iBXr
lsLnBItntckiJ7FbtxJMXLvvwJryDUilBMTjYtwB+QhYXUMOzce5Pjz5/i8SeJtjnV3iAoG/cQk+0FzZ
qaeJAAHco+CY/5WrUBkrHmFJr6HcXkvJdWPkYQS3xqC0+FmUZofz221CBt5IMucxXPkX4rWi+z7wB3Rb
BQoQzd8v7yeb7OzlPnWOyN0qFU0XA246RA8QFYiCNYwI3f05p6KLxEXAMPLE
```

------
#### [ Private key ]

**使用 ssh-keygen 检索公有密钥材料（Linux）**  
在本地 Linux 或 macOS 计算机上，使用 **ssh-keygen** 命令。指定您已在其中下载私有密钥的路径（`.pem` 文件）。

```
ssh-keygen -y -f /{{path_to_key_pair}}/{{my-key-pair}}.pem
```

如果此 **ssh-keygen** 命令运行失败，请运行以下 **chmod** 命令，确保私有密钥文件具有所需的权限。

```
chmod 400 {{key-pair-name}}.pem
```

**使用 PuTTYgen 检索公有密钥材料（Windows）**  
在本地 Windows 计算机上，启动 PuTTYgen。选择 **Load**（加载）。选择 `.ppk` 或者 `.pem` 私有密钥文件。PuTTYgen 在 **Public key for pasting into OpenSSH authorized\_keys file (粘贴到 OpenSSH authorized\_keys 文件的公有密钥)** 下方显示公有密钥。也可以通过以下方式查看公有密钥：选择 **Save public key (保存公有密钥)**，请指定文件的名称，然后打开文件。

------
#### [ AWS CLI ]

**检索公有密钥材料**  
使用以下 [describe-key-pairs](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-key-pairs.html) 命令并指定 `--include-public-key` 选项。

```
aws ec2 describe-key-pairs \
    --key-names {{key-pair-name}} \
    --include-public-key \
    --query "KeyPairs[].PublicKey"
```

------
#### [ PowerShell ]

**检索公有密钥材料**  
使用 [Get-EC2KeyPair](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2KeyPair.html) cmdlet。

```
(Get-EC2KeyPair -KeyName {{key-pair-name}} -IncludePublicKey $true).PublicKey
```

------
#### [ IMDSv2 ]

**Linux**  
在 Linux 实例上运行以下命令。

```
TOKEN=`curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"` \
&& curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/public-keys/0/openssh-key
```

**Windows**  
在 Windows 实例上运行以下 cmdlet。

```
[string]$token = Invoke-RestMethod -Headers @{"X-aws-ec2-metadata-token-ttl-seconds" = "21600"} -Method PUT -Uri http://169.254.169.254/latest/api/token
```

```
Invoke-RestMethod -Headers @{"X-aws-ec2-metadata-token" = $token} -Method GET -Uri http://169.254.169.254/latest/meta-data/public-keys/0/openssh-key
```

------
#### [ IMDSv1 ]

**Linux**  
在 Linux 实例上运行以下命令。

```
curl http://169.254.169.254/latest/meta-data/public-keys/0/openssh-key
```

**Windows**  
在 Windows 实例上运行以下 cmdlet。

```
Invoke-RestMethod -uri  http://169.254.169.254/latest/meta-data/public-keys/0/openssh-key
```

------

## 确定启动时指定的公有密钥
<a name="identify-key-pair-specified-at-launch"></a>

如果您在启动实例时指定公有密钥，则该实例将记录公有密钥名称。即使更改了实例上的公有密钥或添加了公有密钥，报告的实例公有密钥对名称也不会更改。

------
#### [ Console ]

**识别在实例启动时指定的公有密钥**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**实例**。

1. 选择实例。

1. 在**详细信息**选项卡的**实例详细信息**下，找到**启动时分配的密钥对**。

------
#### [ AWS CLI ]

**识别在实例启动时指定的公有密钥**  
使用以下 [describe-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instances.html) 命令。

```
aws ec2 describe-instances \
    --instance-id {{i-1234567890abcdef0}} \
    --query "Reservations[].Instances[].KeyName" \
    --output text
```

下面是示例输出。

```
key-pair-name
```

------
#### [ PowerShell ]

**识别在实例启动时指定的公有密钥**  
使用 [Get-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2Instance.html) cmdlet。

```
(Get-EC2Instance -InstanceId {{i-1234567890abcdef0}}).Instances | Select KeyName
```

下面是示例输出。

```
KeyName
-------
key-pair-name
```

------