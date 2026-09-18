

# 将 EFA 与 Amazon EC2 实例分离并删除 EFA
<a name="detach-efa"></a>

您可以将 EFA 与 Amazon EC2 实例分离，然后将其删除，就像在 Amazon EC2 中删除任何其他弹性网络接口一样。

## 分离 EFA
<a name="efa-detach"></a>

要从实例中分离 EFA，您必须先停止该实例。您无法从处于运行状态的实例中分离 EFA。

您可以使用从实例中分离弹性网络接口的相同方式从实例中分离 EFA。有关更多信息，请参阅 [分离网络接口](network-interface-attachments.md#detach_eni)。

## 删除 EFA
<a name="efa-delete"></a>

要删除 EFA，您必须先将其从实例中分离。在附加到实例时，您无法删除 EFA。

您可以使用删除弹性网络接口的相同方式删除 EFAs。有关更多信息，请参阅 [删除网络接口](delete_eni.md)。