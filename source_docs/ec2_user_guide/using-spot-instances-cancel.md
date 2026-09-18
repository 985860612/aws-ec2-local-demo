

# 取消竞价型实例请求
<a name="using-spot-instances-cancel"></a>

如果您不再需要竞价型实例请求，您可以将其取消。您只能取消 `open`、`active` 或 `disabled` 的竞价型实例请求。
+ 当您的请求未执行，且实例没有启动时，您的竞价型实例请求处于 `open` 状态。
+ 当您的请求完成且竞价型实例因此已启动时，您的竞价型实例请求处于 `active` 状态。
+ 当您停止竞价型实例时，您的竞价型实例请求处于 `disabled` 状态。

如果您的竞价型实例请求处于 `active` 状态，且关联的竞价型实例正在运行，那么取消请求不会终止该实例。有关终止竞价型实例的更多信息，请参阅 [终止竞价型实例](using-spot-instances-request.md#terminating-a-spot-instance)。

------
#### [ Console ]

**取消竞价型实例请求**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，请选择 **Spot Requests**。

1. 选择竞价型实例请求。

1. 依次选择**操作**和**取消请求**。

1. (可选) 如果不再使用关联的竞价型实例，可以将其终止。在**取消竞价请求**对话框中，选择**终止实例**，然后选择**确认**。

------
#### [ AWS CLI ]

**取消竞价型实例请求**  
使用以下 [cancel-spot-instance-requests](https://docs.aws.amazon.com/cli/latest/reference/ec2/cancel-spot-instance-requests.html) 命令。

```
aws ec2 cancel-spot-instance-requests --spot-instance-request-ids {{sir-0e54a519c9EXAMPLE}}
```

------
#### [ PowerShell ]

**取消竞价型实例请求**  
使用 [Stop-EC2SpotInstanceRequest](https://docs.aws.amazon.com/powershell/latest/reference/items/Stop-EC2SpotInstanceRequest.html) cmdlet。

```
Stop-EC2SpotInstanceRequest -SpotInstanceRequestId {{sir-0e54a519c9EXAMPLE}}
```

------