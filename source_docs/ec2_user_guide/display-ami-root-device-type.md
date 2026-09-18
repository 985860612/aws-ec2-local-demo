

# 识别由您的 AMI 确定的根卷类型
<a name="display-ami-root-device-type"></a>

您用于启动 EC2 实例的 AMI 决定根卷的类型。EC2 实例的根卷是 EBS 卷或实例存储卷。

[基于 Nitro 的实例](instance-types.md#instance-hypervisor-type)仅支持 EBS 根卷。下列上一代实例类型是支持实例存储根卷的唯一实例类型：C1、C3、D2、I2、M1、M2、M3、R3 和 X1。

------
#### [ Console ]

**识别由 AMI 确定的根卷类型**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **AMIs**（AMI），选择 AMI。

1. 在 **Details**（详细信息）选项卡中检查 **Root Device Type**（根设备类型）的值，如下所示：
   + `ebs` – 从此 AMI 启动的实例将获得 EBS 根卷
   + `instance store` – 从此 AMI 启动的实例将获得实例存储根卷。

------
#### [ AWS CLI ]

**识别由 AMI 确定的根卷类型**  
使用 [describe-images](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-images.html) 命令。

```
aws ec2 describe-images \
    --image-ids {{ami-0abcdef1234567890}} \
    --query Images[].RootDeviceType
```

下面是示例输出。

```
ebs
```

------
#### [ PowerShell ]

**识别由 AMI 确定的根卷类型**  
使用 [Get-EC2Image](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2Image.html) cmdlet。

```
(Get-EC2Image `
    -ImageId {{ami-0abcdef1234567890}}).RootDeviceType.Value
```

下面是示例输出。

```
ebs
```

------