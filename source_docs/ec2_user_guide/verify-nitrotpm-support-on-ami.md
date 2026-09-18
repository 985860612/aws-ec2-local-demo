

# 验证是否为 NitroTPM 启用了 AMI
<a name="verify-nitrotpm-support-on-ami"></a>

要为实例启用 NitroTPM，必须使用启用了 NitroTPM 的 AMI 启动该实例。您可以描述图像以验证是否为 NitroTPM 启用了该图像。如果您是 AMI 所有者，则可以描述 `tpmSupport` 图像属性。

Amazon EC2 控制台不显示 `TpmSupport`。

------
#### [ AWS CLI ]

**验证是否启用了 NitroTPM**  
使用 [describe-images](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-images.html) 命令。

```
aws ec2 describe-images \
    --image-ids {{ami-0abcdef1234567890}} \
    --query Images[*].TpmSupport
```

如果为 AMI 启用了 NitroTPM，输出将如下所示。如果并未启用 TPM，则输出为空。

```
[
    "v2.0"
]
```

或者，如果您是 AMI 所有者，则可以将 [describe-image-attribute](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-image-attribute.html) 命令与 `tpmSupport` 属性配合使用。

```
aws ec2 describe-image-attribute \
    --image-id {{ami-0abcdef1234567890}} \
    --attribute tpmSupport
```

 下面是示例输出。

```
{
    "ImageId": "{{ami-0abcdef1234567890}}",
    "TpmSupport": {
        "Value": "v2.0"
    }
}
```

**查找启用了 NitroTPM 的 AMI**  
以下示例列出了您拥有的已启用 NitrotPM 的 AMI ID。

```
aws ec2 describe-images \
    --owners self \
    --filters Name=tpm-support,Values=v2.0 \
    --query Images[].ImageId
```

------
#### [ PowerShell ]

**验证是否启用了 NitroTPM**  
使用 [Get-EC2Image](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2Image.html) cmdlet。

```
Get-EC2Image `
    -ImageId {{ami-0abcdef1234567890}} | Select TpmSupport
```

如果为 AMI 启用了 NitroTPM，输出将如下所示。如果并未启用 TPM，则输出为空。

```
TpmSupport
----------
v2.0
```

或者，如果您是 AMI 所有者，则可以将 [Get-EC2ImageAttribute](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2ImageAttribute.html) cmdlet 与 `tpmSupport` 属性配合使用。

```
Get-EC2ImageAttribute `
    -ImageId {{ami-0abcdef1234567890}} `
    -Attribute tpmSupport
```

**查找启用了 NitroTPM 的 AMI**  
以下示例列出了您拥有的已启用 NitrotPM 的 AMI ID。

```
Get-EC2Image `
    -Owner self `
    -Filter @{Name="tpm-support; Values="v2.0"} | Select ImageId
```

------