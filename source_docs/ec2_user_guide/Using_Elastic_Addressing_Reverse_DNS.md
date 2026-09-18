

# 在 Amazon EC2 上为电子邮件创建反向 DNS 记录
<a name="Using_Elastic_Addressing_Reverse_DNS"></a>

如果您打算从 EC2 实例向第三方发送电子邮件，我们建议您预置一个或多个弹性 IP 地址，并向您用于发送电子邮件的弹性 IP 地址分配静态反向 DNS 记录。这样有助于避免电子邮件被一些反垃圾电子邮件组织标记为垃圾电子邮件。AWS 与 ISP 以及 Internet 反垃圾电子邮件组织合作，减少从这些地址发送的电子邮件被标记为垃圾电子邮件的几率。

**注意事项**
+ 在创建反向 DNS 记录之前，您必须先设置对应的正向 DNS 记录（A 记录），该记录应解析为您账户中的弹性 IP 地址。作为最佳实践，请将您计划创建反向 DNS 记录的所有弹性 IP 地址均包含在正向 DNS 记录中。
+ 如果反向 DNS 记录与弹性 IP 地址关联，则该弹性 IP 地址将锁定到您的账户中且无法从您的账户中释放，直至删除记录。
+ 如果您联系了 支持 为弹性 IP 地址设置反向 DNS，您可以删除该反向 DNS，但不能释放弹性 IP 地址，因为它已被 支持 锁定。要解锁弹性 IP 地址，请联系 [AWS 支持](https://console.aws.amazon.com/support/home#/)。解锁弹性 IP 地址后，您就可以释放该地址。
+ [AWS GovCloud (US) Region] 您不能创建反向 DNS 记录。AWS 必须为您分配静态反向 DNS 记录。建立支持案例，取消反向 DNS 和电子邮件发送限制。您必须提供弹性 IP 地址和反向 DNS 记录。

## 创建反向 DNS 记录
<a name="eip-create-rdns-record"></a>

您可以按如下方式为弹性 IP 地址创建反向 DNS 记录。

------
#### [ Console ]

**创建反向 DNS 记录**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**弹性 IP**。

1. 选择弹性 IP 地址，然后依次选择 **Actions**（操作）和 **Update reverse DNS**（更新反向 DNS）。

1. 对于 **Reverse DNS domain name**（反向 DNS 域名），输入域名。

1. 输入 **update** 以确认。

1. 选择 **Update**。

------
#### [ AWS CLI ]

**创建反向 DNS 记录**  
使用 [modify-address-attribute](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-address-attribute.html) 命令。

```
aws ec2 modify-address-attribute \
    --allocation-id {{eipalloc-abcdef01234567890}} \
    --domain-name {{example.com}}
```

下面是示例输出。

```
{
    "Addresses": [
        {
            "PublicIp": "192.0.2.0",
            "AllocationId": "eipalloc-abcdef01234567890",
            "PtrRecord": "example.net.",
            "PtrRecordUpdate": {
                "Value": "example.com.",
                "Status": "PENDING"
            }
        }
    ]
}
```

------
#### [ PowerShell ]

**创建反向 DNS 记录**  
使用 [Edit-EC2AddressAttribute](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2AddressAttribute.html) cmdlet。

```
Edit-EC2AddressAttribute `
    -AllocationId '{{eipalloc-abcdef01234567890}}' `
    -DomainName '{{example.com}}' |
Format-List `
    AllocationId, PtrRecord, PublicIp,
    @{Name='PtrRecordUpdate';Expression={$_.PtrRecordUpdate | Format-List | Out-String}}
```

下面是示例输出。

```
AllocationId    : eipalloc-abcdef01234567890
PtrRecord       : example.net.
PublicIp        : 192.0.2.0
PtrRecordUpdate : 
                  Reason :
                  Status : PENDING
                  Value  : example.com.
```

------

## 删除反向 DNS 记录
<a name="eip-remove-rdns-record"></a>

您可以按以下方式从弹性 IP 地址中删除反向 DNS 记录。

如果收到以下错误，您可以向 支持 团队提交[删除电子邮件发送限制的请求](https://repost.aws/knowledge-center/ec2-port-25-throttle)来获得帮助。

```
The address cannot be released because it is locked to your account.
```

------
#### [ Console ]

**移除反向 DNS 记录**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**弹性 IP**。

1. 选择弹性 IP 地址，然后依次选择 **Actions**（操作）和 **Update reverse DNS**（更新反向 DNS）。

1. 对于 **Reverse DNS domain name**（反向 DNS 域名），清除域名。

1. 输入 **update** 以确认。

1. 选择 **Update**。

------
#### [ AWS CLI ]

**移除反向 DNS 记录**  
使用 [reset-address-attribute](https://docs.aws.amazon.com/cli/latest/reference/ec2/reset-address-attribute.html) 命令。

```
aws ec2 reset-address-attribute \
    --allocation-id {{eipalloc-abcdef01234567890}} \
    --attribute {{domain-name}}
```

下面是示例输出。

```
{
    "Addresses": [
        {
            "PublicIp": "192.0.2.0",
            "AllocationId": "eipalloc-abcdef01234567890",
            "PtrRecord": "example.com.",
            "PtrRecordUpdate": {
                "Value": "example.net.",
                "Status": "PENDING"
            }
        }
    ]
}
```

------
#### [ PowerShell ]

**移除反向 DNS 记录**  
使用 [Reset-EC2AddressAttribute](https://docs.aws.amazon.com/powershell/latest/reference/items/Reset-EC2AddressAttribute.html) cmdlet。

```
Reset-EC2AddressAttribute `
    -AllocationId 'eipalloc-abcdef01234567890' `
    -Attribute domain-name |
Format-List `
    AllocationId, PtrRecord, PublicIp,
    @{Name='PtrRecordUpdate';Expression={$_.PtrRecordUpdate | Format-List | Out-String}}
```

下面是示例输出。

```
AllocationId    : eipalloc-abcdef01234567890
PtrRecord       : example.com.
PublicIp        : 192.0.2.0
PtrRecordUpdate : 
                  Reason :
                  Status : PENDING
                  Value  : example.net.
```

------