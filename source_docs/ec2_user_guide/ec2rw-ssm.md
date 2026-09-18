

# 使用 EC2Rescue 和 Systems Manager 对受损的 Windows 实例进行问题排查
<a name="ec2rw-ssm"></a>

支持 为您提供了 Systems Manager Run Command 文档，目的是与您启用了 Systems Manager 的实例交互来运行 EC2Rescue for Windows Server。Run Command 文档称为 `AWSSupport-RunEC2RescueForWindowsTool`。

此 Systems Manager Run Command 文档执行下列任务：
+ 下载并验证 EC2Rescue for Windows Server。
+ 导入 PowerShell 模块以使您与此工具的交互变得简单。
+ 使用提供的命令和参数运行 EC2RescueCmd。

Systems Manager Run Command 文档接受三个参数：
+ **命令** — EC2Rescue for Windows Server 操作。当前允许的值如下：
  + **ResetAccess** — 重置本地管理员密码。将会重置当前实例的本地管理员密码，并且随机生成的密码将会作为 `/EC2Rescue/Password/<INSTANCE_ID>` 安全地存储在 Parameter Store 中。如果您选择此操作并且不提供任何参数，则密码将自动使用默认的 KMS 密钥 密钥加密。（可选）可以在参数中指定 KMS 密钥 ID，以使用您自己的密钥来加密密码。
  + **CollectLogs** — 使用 `/collect:all` 操作运行 EC2Rescue for Windows Server。如果选择此操作，`Parameters` 必须包含将日志上传到的 Amazon S3 存储桶名称。
  + **FixAll** — 使用 `/rescue:all` 操作运行 EC2Rescue for Windows Server。如果您选择此操作，`Parameters` 必须包含要抢救的块储存设备名称。
+ **参数** — 要为指定命令传递的 PowerShell 参数。

## 要求
<a name="ec2rw-requirements"></a>

要运行 **ResetAccess** 操作，您的 Amazon EC2 实例必须附加策略，以授予将加密的密码写入 Parameter Store 的权限。附加策略后，请等待几分钟，然后再将此策略附加到相关 IAM 角色后尝试重置实例的密码。

------
#### [ JSON ]

****  

```
{
  "Version":"2012-10-17",		 	 	 
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ssm:PutParameter"
      ],
      "Resource": [
        "arn:aws:ssm:{{us-east-1}}:{{111122223333}}:parameter/EC2Rescue/Passwords/{{<instanceid>}}"
      ]
    }
  ]
}
```

------

如果您使用的是自定义 KMS 密钥而不是默认 KMS 密钥，请使用此策略。

------
#### [ JSON ]

****  

```
{
  "Version":"2012-10-17",		 	 	 
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ssm:PutParameter"
      ],
      "Resource": [
        "arn:aws:ssm:{{us-east-1}}:{{111122223333}}:parameter/EC2Rescue/Passwords/{{<instanceid>}}"
      ] 
    }, 
    { 
      "Effect": "Allow",
      "Action": [
        "kms:Encrypt"
      ],
      "Resource": [
        "arn:aws:kms:{{us-east-1}}:{{111122223333}}:key/{{<kmskeyid>}}"
      ]
    }
  ]
}
```

------

## 查看文档的 JSON
<a name="ec2rw-view-json"></a>

以下过程介绍了如何查看此文档的 JSON。

**查看 Systems Manager Run Command 文档的 JSON**

1. 访问 [https://console.aws.amazon.com/systems-manager/](https://console.aws.amazon.com/systems-manager/)，打开 AWS Systems Manager 控制台。

1. 在导航窗格中，展开**变更管理工具**，然后选择**文档**。

1. 在搜索栏中，输入 `AWSSupport-RunEC2RescueForWindowsTool`，然后选择 `AWSSupport-RunEC2RescueForWindowsTool` 文档。

1. 选择**内容**选项卡。

## 示例
<a name="ec2rw-ssm-examples"></a>

下面是一些有关如何使用 Systems Manager Run Command 文档通过 AWS CLI 运行 EC2Rescue for Windows Server 的示例。有关使用 AWS CLI 发送命令的更多信息，请参阅 [send-command](https://docs.aws.amazon.com/cli/latest/reference/ssm/send-command.html)。

**Topics**
+ [尝试修复脱机根卷上的所有已识别问题](#ec2rw-ssm-exam1)
+ [从当前 Amazon EC2 Windows 实例收集日志](#ec2rw-ssm-exam2)
+ [重置本地管理员密码](#ec2rw-ssm-exam4)

### 尝试修复脱机根卷上的所有已识别问题
<a name="ec2rw-ssm-exam1"></a>

尝试修复在附加到 Amazon EC2 Windows 实例的脱机根卷上发现的所有问题：

```
aws ssm send-command --instance-ids "{{i-0cb2b964d3e14fd9f}}" --document-name "AWSSupport-RunEC2RescueForWindowsTool" --parameters "Command=FixAll, Parameters='{{xvdf}}'" --output text
```

### 从当前 Amazon EC2 Windows 实例收集日志
<a name="ec2rw-ssm-exam2"></a>

从当前的在线 Amazon EC2 Windows 实例收集所有日志并将日志上传到 Amazon S3 存储桶：

```
aws ssm send-command --instance-ids "{{i-0cb2b964d3e14fd9f}}" --document-name "AWSSupport-RunEC2RescueForWindowsTool" --parameters "Command=CollectLogs, Parameters='{{amzn-s3-demo-bucket}}'" --output text
```

### 重置本地管理员密码
<a name="ec2rw-ssm-exam4"></a>

下面的示例显示了可用于重置本地管理员密码的方法。输出提供了一个指向 Parameter Store 的链接，在那里您可以找到随机生成的安全密码，然后您可以使用它以本地管理员身份来 RDP 到您的 Amazon EC2 Windows 实例。

使用默认的 AWS KMS key 密钥 alias/aws/ssm 重置联机实例的本地管理员密码：

```
aws ssm send-command --instance-ids "{{i-0cb2b964d3e14fd9f}}" --document-name "AWSSupport-RunEC2RescueForWindowsTool" --parameters "Command=ResetAccess" --output text
```

使用 KMS 密钥 重置联机实例的本地管理员密码：

```
aws ssm send-command --instance-ids "{{i-0cb2b964d3e14fd9f}}" --document-name "AWSSupport-RunEC2RescueForWindowsTool" --parameters "Command=ResetAccess, Parameters={{a133dc3c-a2g4-4fc6-a873-6c0720104bf0}}" --output text
```

**注意**  
在此示例中，KMS 密钥 为 `a133dc3c-a2g4-4fc6-a873-6c0720104bf0`。