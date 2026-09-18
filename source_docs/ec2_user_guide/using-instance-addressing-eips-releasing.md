

# 释放弹性 IP 地址
<a name="using-instance-addressing-eips-releasing"></a>

如果您不再需要某个弹性 IP 地址，建议您释放该地址。要发布的弹性 IP 地址当前不得与 AWS 资源关联。

------
#### [ Console ]

**释放弹性 IP 地址**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Elastic IPs**。

1. 选择要释放的弹性 IP 地址，然后依次选择 **Actions (操作)**、**Release Elastic IP addresses (释放弹性 IP 地址)**。

1. 选择 **Release (释放)**。

------
#### [ AWS CLI ]

**释放弹性 IP 地址**  
使用 [release-address](https://docs.aws.amazon.com/cli/latest/reference/ec2/release-address.html) AWS CLI 命令。

```
aws ec2 release-address --allocation-id {{eipalloc-64d5890a}}
```

------
#### [ PowerShell ]

**释放弹性 IP 地址**  
使用 [Remove-EC2Address](https://docs.aws.amazon.com/powershell/latest/reference/items/Remove-EC2Address.html) cmdlet。

```
Remove-EC2Address -AllocationId {{eipalloc-64d5890a}}
```

------

释放弹性 IP 地址后，您可能能够恢复它。以下规则适用：
+ 如果弹性 IP 地址已分配至其他 AWS 账户，或者该地址将导致您超出弹性 IP 地址限制，则您无法恢复该地址。
+ 您不能恢复与弹性 IP 地址关联的标签。

------
#### [ AWS CLI ]

**恢复弹性 IP 地址**  
使用 [allocate-address](https://docs.aws.amazon.com/cli/latest/reference/ec2/allocate-address.html) 命令。

```
aws ec2 allocate-address \
    --domain vpc \
    --address {{203.0.113.3}}
```

------
#### [ PowerShell ]

**恢复弹性 IP 地址**  
使用 [New-EC2Address](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2Address.html) cmdlet。

```
New-EC2Address `
    -Address {{203.0.113.3}} `
    -Domain vpc `
    -Region {{us-east-1}}
```

------