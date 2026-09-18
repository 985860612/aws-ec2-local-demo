

# 查看 Amazon EC2 实例的 CPU 线程和核心
<a name="view-cpu-options"></a>

您可以通过描述实例来查看现有实例的 CPU 选项。

------
#### [ Console ]

**查看实例的 CPU 选项**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在左侧导航窗格中，选择**实例**，然后选择实例。

1. 在**详细信息**选项卡中的**主机和置放群组**下，找到 **vCPU 数量**。

------
#### [ AWS CLI ]

**查看实例的 CPU 选项**  
可以使用 [describe-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instances.html) 命令。

```
aws ec2 describe-instances \
    --instance-ids {{i-1234567890abcdef0}} \
    --query Reservations[].Instances[].CpuOptions
```

下面是示例输出。`CoreCount` 字段指示实例的核心数。`ThreadsPerCore` 字段指示每核心线程数。

```
[
    {
        "CoreCount": 24, 
        "ThreadsPerCore": 2
    }, 
]
```

------
#### [ PowerShell ]

**查看实例的 CPU 选项**  
使用 [Get-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2Instance.html) cmdlet。

```
(Get-EC2Instance `
    -InstanceId '{{i-1234567890abcdef0}}').Instances.CpuOptions
```

下面是示例输出。

```
AmdSevSnp CoreCount ThreadsPerCore
--------- --------- --------------
          24        2
```

------

或者，要查看 CPU 信息，您可以连接到实例并使用以下系统工具之一：
+ Windows 实例上的 Windows `Task Manager`
+ Linux 实例上的 **lscpu** 命令

可以使用 AWS Config 记录、评测、审计实例的配置更改，包括终止的实例。有关更多信息，请参阅 *AWS Config 开发人员指南*中的 [AWS Config 入门](https://docs.aws.amazon.com/config/latest/developerguide/getting-started.html)