

# 描述竞价型实例集请求、其实例及事件历史记录
<a name="manage-spot-fleet"></a>

**重要**  
竞价型实例集仍在使用旧版 API，且暂无相关投资计划。建议改用 EC2 实例集或自动扩缩组。有关更多信息，请参阅 [哪种是实例集最佳使用方法？](which-fleet-method-to-use.md)。

您可以描述竞价型实例集配置、竞价型实例集中的实例以及竞价型实例集的事件历史记录。

------
#### [ Console ]

**描述竞价型实例集**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，请选择 **Spot Requests**。

1. 选择竞价型实例集请求。ID 以 **sfr-** 开头。要查看配置详细信息，请选择 **Description (描述)**。

1. 要列出竞价型实例集的竞价型实例，请选择**实例**。

1. 要查看竞价型实例集的历史记录，请选择**历史记录**。

------
#### [ AWS CLI ]

**描述竞价型实例集请求**  
使用 [describe-spot-fleet-requests](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-spot-fleet-requests.html) 命令。

```
aws ec2 describe-spot-fleet-requests \
    --spot-fleet-request-ids {{sfr-73fbd2ce-aa30-494c-8788-1cee4EXAMPLE}}
```

**描述用于指定竞价型实例集请求的运行实例**  
使用 [describe-spot-fleet-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-spot-fleet-instances.html) 命令。

```
aws ec2 describe-spot-fleet-instances \
    --spot-fleet-request-id {{sfr-73fbd2ce-aa30-494c-8788-1cee4EXAMPLE}}
```

**描述用于指定竞价型实例集请求的事件历史记录**  
使用 [describe-spot-fleet-request-history](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-spot-fleet-request-history.html) 命令。

```
aws ec2 describe-spot-fleet-request-history \
    --spot-fleet-request-id {{sfr-73fbd2ce-aa30-494c-8788-1cee4EXAMPLE}} \
    --start-time {{2024-05-18T00:00:00Z}}
```

------
#### [ PowerShell ]

**描述竞价型实例集请求**  
使用 [Get-EC2SpotFleetRequest](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2SpotFleetRequest.html) cmdlet。

```
Get-EC2SpotFleetRequest
```

**描述用于指定竞价型实例集请求的运行实例**  
使用 [Get-EC2SpotFleetInstance](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2SpotFleetInstance.html) cmdlet。

```
Get-EC2SpotFleetInstance `
    -SpotFleetRequestId "{{sfr-73fbd2ce-aa30-494c-8788-1cee4EXAMPLE}}"
```

**描述用于指定竞价型实例集请求的事件历史记录**  
使用 [Get-EC2SpotFleetRequestHistory](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2SpotFleetRequestHistory.html) cmdlet。

```
Get-EC2SpotFleetRequestHistory `
    -SpotFleetRequestId "{{sfr-73fbd2ce-aa30-494c-8788-1cee4EXAMPLE"}} `
    -UtcStartTime {{2024-05-18T00:00:00Z}}
```

------