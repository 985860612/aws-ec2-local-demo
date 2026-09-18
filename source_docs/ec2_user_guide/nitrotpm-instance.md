

# 在 Amazon EC2 实例上启用或停止使用 NitroTPM
<a name="nitrotpm-instance"></a>

您只能在启动时为 NitroTPM 启用 Amazon EC2 实例。为实例启用 NitroTPM 后，您将无法禁用它。如果您不再需要使用 NitroTPM，则必须配置操作系统以停止使用它。

**Topics**
+ [在启用 NitroTPM 的情况下启动实例](#launch-instance-with-nitrotpm)
+ [停止在实例上使用 NitroTPM](#disable-nitrotpm-support-on-instance)

## 在启用 NitroTPM 的情况下启动实例
<a name="launch-instance-with-nitrotpm"></a>

当您启动具有[先决条件](enable-nitrotpm-prerequisites.md)的实例时，将自动在该实例上启用 NitroTPM。您只能在启动时在实例上启用 NitroTPM。有关启动实例的信息，请参阅 [启动 Amazon EC2 实例](LaunchingAndUsingInstances.md)。

## 停止在实例上使用 NitroTPM
<a name="disable-nitrotpm-support-on-instance"></a>

在启动已启用 NitroTPM 的实例后，您将无法为该实例禁用 NitroTPM。但您可以使用以下工具，将操作系统配置为停止使用 NitroTPM，方法是禁用实例上的 TPM 2.0 设备驱动程序：
+ 对于 **Linux 实例**，请使用 tpm-tools。
+ 对于 **Windows 实例**，请使用 TPM 管理控制台（tpm.msc）。

有关禁用设备驱动程序的更多信息，请参阅您的操作系统的文档。