

# 确定 EC2 实例的启动模式
<a name="instance-boot-mode"></a>

实例的启动模式会在 Amazon EC2 控制台中的**启动模式**字段中，通过 AWS CLI 中的 `currentInstanceBootMode` 参数显示。

启动实例时，其启动模式参数的值由启动该实例所用的 AMI 的启动模式参数的值决定，如下所示：
+ 启动模式参数为 `uefi` 的 AMI 会创建 `currentInstanceBootMode` 参数为 `uefi` 的实例。
+ 启动模式参数为 `legacy-bios` 的 AMI 会创建 `currentInstanceBootMode` 参数为 ` legacy-bios` 的实例。
+ 如果实例类型支持 UEFI，则启动模式参数为 `uefi-preferred` 的 AMI 会创建 `currentInstanceBootMode` 参数为 `uefi` 的实例；否则将创建 `currentInstanceBootMode` 参数为 `legacy-bios` 的实例。
+ 没有启动模式参数值的 AMI 会创建参数值为 `currentInstanceBootMode` 的实例，该值取决于 AMI 架构是 ARM 还是 x86，以及实例类型支持哪种启动模式。Graviton 实例类型上的默认启动模式为 `uefi`，而 Intel 和 AMD 实例类型上的默认启动模式为 `legacy-bios`。

------
#### [ Console ]

**确定实例的启动模式**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances (实例)**，然后选择您的实例。

1. 在**详细信息**选项卡上，检查**启动模式**字段。

------
#### [ AWS CLI ]

**确定实例的启动模式**  
使用 [describe-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instances.html) 命令确定实例的启动模式。您还可以确定用于创建实例的 AMI 的启动模式。

```
aws ec2 describe-instances \
    --region {{us-east-1}} \
    --instance-ids {{i-1234567890abcdef0}} \
    --query Reservations[].Instances[].BootMode \
    --output text
```

下面是示例输出。

```
uefi
```

------
#### [ PowerShell ]

**确定实例的启动模式**  
使用 [Get-EC2Image](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2Instance.html) cmdlet 确定实例的启动模式。您还可以确定用于创建实例的 AMI 的启动模式。

```
(Get-EC2Instance `
    -InstanceId {{i-1234567890abcdef0}}).Instances | Format-List BootMode, CurrentInstanceBootMode, InstanceType, ImageId
```

下面是示例输出。

```
BootMode                : uefi
CurrentInstanceBootMode : uefi
InstanceType            : c5a.large
ImageId                 : ami-0abcdef1234567890
```

------