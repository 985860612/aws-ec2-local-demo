

# 查看竞价型实例定价历史记录
<a name="using-spot-instances-history"></a>

竞价型实例的价格由 Amazon EC2 设置，并根据竞价型实例容量的长期供求趋势逐步调整。

当您的 Spot 请求得到满足时，您的竞价型实例将以当前 Spot 价格启动，并且不超过按需价格。您可以查看最近 90 天的 Spot 价格历史记录，并按照实例类型、操作系统和可用区筛选。

要查看*当前*竞价型实例价格，请参阅 [Amazon EC2 竞价型实例定价](https://aws.amazon.com/ec2/spot/pricing/)。

------
#### [ Console ]

**查看竞价型实例价格历史记录**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，请选择 **Spot Requests**。

1. 选择**定价历史记录**。

1. 对于 **Graph (图表)**，选择按 **Availability Zones (可用区)** 或 **Instance Types (实例类型)** 来比较价格历史记录。
   + 如果选择**可用区**，则选择**实例类型**、操作系统（**平台**）以及要查看价格历史记录的**日期范围**。
   + 如果选择**实例类型**，则最多选择五个**实例类型**、**可用区**、操作系统（**平台**）以及要查看价格历史记录的**日期范围**。

   以下屏幕截图显示了不同实例类型的价格比较。  
![Amazon EC2 控制台中的 Spot Instance pricing history (竞价型实例定价历史记录) 工具。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/spot-instance-pricing-history.png)

1. 将指针移动到图形上并悬停，可显示选定日期范围内的特定时间的价格。价格显示在图表上方的信息块中。顶行中显示的价格显示了特定日期的价格。第二行中显示的价格显示了选定日期范围内的平均价格。

1. 要显示每个 vCPU 的价格，请开启 **Display normalized prices (显示标准化价格)**。要显示实例类型的价格，请关闭 **Display normalized prices (显示标准化价格)**。

------
#### [ AWS CLI ]

**查看竞价型实例价格历史记录**  
使用以下 [describe-spot-price-history](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-spot-price-history.html) 命令。

```
aws ec2 describe-spot-price-history \
    --instance-types {{c6i.xlarge}} \
    --product-descriptions "{{Linux/UNIX}}" \
    --start-time {{2025-04-01T00:00:00}} \
    --end-time {{2025-04-02T00:00:0}}
```

------
#### [ PowerShell ]

**查看竞价型实例价格历史记录**  
使用 [Get-EC2SpotPriceHistory](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2SpotPriceHistory.html) cmdlet。

```
Get-EC2SpotPriceHistory `
    -InstanceType {{c6i.xlarge}} `
    -ProductDescription "{{Linux/UNIX}}" `
    -UtcStartTime {{2025-04-01T00:00:00}} `
    -UtcEndTime {{2025-04-02T00:00:0}}
```

------