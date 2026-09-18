

# 为支持的 AWS Marketplace 产品使用付费支持
<a name="using-paid-amis-support"></a>

Amazon EC2 还使开发人员可以为软件（或派生 AMI）提供支持。开发人员可以创建您可注册使用的支持产品。在注册支持产品的过程中，开发人员会为您提供产品代码，您必须将该代码与您自己的 AMI 关联起来。这样，开发人员就能确认您的实例有获取支持的权限。此外，还能确保您在运行产品实例时，按照开发人员指定的产品使用条款付费。

**限制**
+ 设置产品代码属性后，将不能更改或移除该属性。
+ 不能将支持产品用于预留实例。通常情况下，您需按支持产品卖方指定的价格付费。

------
#### [ AWS CLI ]

**将产品代码关联到 AMI**  
使用 [modify-image-attribute](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-image-attribute.html) 命令。

```
aws ec2 modify-image-attribute \
    --image-id {{ami-0abcdef1234567890}} \
    --product-codes "{{cdef1234abc567def8EXAMPLE}}"
```

------
#### [ PowerShell ]

**将产品代码关联到 AMI**  
使用 [Edit-EC2ImageAttribute](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2ImageAttribute.html) cmdlet。

```
Edit-EC2ImageAttribute `
    -ImageId {{ami-0abcdef1234567890}} `
    -ProductCode "{{cdef1234abc567def8EXAMPLE}}"
```

------