

# 删除您的密钥对
<a name="delete-key-pair"></a>

您可以删除密钥对，这将移除存储在 Amazon EC2 中的公有密钥。删除密钥对不会删除匹配的私有密钥。

使用以下方法删除公有密钥时，您仅删除了[创建](create-key-pairs.md#having-ec2-create-your-key-pair)或[导入](create-key-pairs.md#how-to-generate-your-own-key-and-import-it-to-aws)密钥对时在 Amazon EC2 中存储的公有密钥。删除公有密钥并不会从您添加公有密钥的任何实例中删除公有密钥，无论是在启动实例时还是启动后。也不会删除本地计算机上的私有密钥。您可以继续连接到使用已从 Amazon EC2 删除的公有密钥启动的实例，只要您仍然拥有私有密钥（`.pem`）文件。

**重要**  
如果您使用的是自动扩缩组（例如，在 Elastic Beanstalk 环境中），请确保您要删除的公有密钥未在关联的启动模板或启动配置中指定。如果 Amazon EC2 Auto Scaling 检测到运行不正常的实例，它将启动替代实例。但是，如果找不到公有密钥，则实例启动失败。有关更多信息，请参阅《Amazon EC2 Auto Scaling 用户指南》**中的[启动模板](https://docs.aws.amazon.com/autoscaling/ec2/userguide/launch-templates.html)。

------
#### [ Console ]

**要在 Amazon EC2 上删除您的公有密钥**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Key Pairs (密钥对)**。

1. 选择要删除的密钥对，然后依次选择 **Actions**（操作）、**Delete**（删除）。

1. 在确认字段中，输入 `Delete`，然后选择 **Delete (删除)**。

------
#### [ AWS CLI ]

**要在 Amazon EC2 上删除您的公有密钥**  
使用 [delete-key-pair](https://docs.aws.amazon.com/cli/latest/reference/ec2/delete-key-pair.html) 命令。

```
aws ec2 delete-key-pair --key-name {{my-key-pair}}
```

------
#### [ PowerShell ]

**要在 Amazon EC2 上删除您的公有密钥**  
使用 [Remove-EC2KeyPair](https://docs.aws.amazon.com/powershell/latest/reference/items/Remove-EC2KeyPair.html) cmdlet。

```
Remove-EC2KeyPair -KeyName {{my-key-pair}}
```

------