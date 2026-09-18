

# 配置 Amazon EC2 Mac 实例的系统完整性保护
<a name="mac-sip-settings"></a>

您可以为采用 x86 架构的 Mac 实例和 Apple silicon Mac 实例配置系统完整性保护（SIP）设置。SIP 是 macOS 的一项关键安全功能，有助防止未经授权的代码执行和系统级别修改。有关更多信息，请参阅[关于系统完整性保护](https://support.apple.com/en-us/102149)。

您可以完全启用或禁用 SIP，也可以有选择地启用或禁用特定 SIP 设置。建议仅在执行必要任务时暂时禁用 SIP，并在任务完成后尽快重新启用。禁用 SIP 可能会使实例容易受到恶意代码攻击。

所有支持 Amazon EC2 Mac 实例的 AWS 区域都支持 SIP 配置。

**Topics**
+ [注意事项](#mac-sip-considerations)
+ [默认 SIP 配置](#mac-sip-defaults)
+ [检查 SIP 配置](#mac-sip-check-settings)
+ [Apple silicon Mac 实例的先决条件](#mac-sip-prereqs)
+ [配置 SIP 设置](#mac-sip-configure)
+ [检查 SIP 配置任务状态](#mac-sip-state)

## 注意事项
<a name="mac-sip-considerations"></a>
+ 支持下列 Amazon EC2 Mac 实例类型和 macOS 版本：
  + **Mac1 \| Mac2 \| Mac2-m1ultra** – macOS Ventura（版本 13.0 或更高版本）
  + **Mac2-m2 \| Mac2-m2pro** – macOS Ventura（版本 13.2 或更高版本）
  + **Mac-m4 \| Mac-m4pro**：macOS Sequoia（版本 15.6 或更高版本）
**注意**  
不支持 macOS 测试版和预览版。
+ 您可以指定自定义 SIP 配置，来🈶选择地启用或禁用特定 SIP 设置。如果您实施自定义配置，请[连接到实例并验证设置](#mac-sip-check-settings)，从而确保正确实现了您的需求并按预期运行。

  SIP 配置可能会随 macOS 更新更改。我们建议在执行任何 macOS 版本升级后检查自定义 SIP 设置，确保安全配置依然兼容并正常发挥作用。
+ 对于采用 x86 架构的 Mac 实例，SIP 设置在实例级别应用。连接到实例的任何根卷都将自动沿用已配置的 SIP 设置。

  对于 Apple silicon Mac 实例，SIP 设置在卷级别应用。连接到实例的根卷不会沿用 SIP 设置。如果挂载其他根卷，则必须重新将 SIP 设置配置为所需状态。
+ 完成 SIP 配置任务最长可能需要 90 分钟时间。在 SIP 配置任务进行期间，实例会保持无法访问状态。
+ SIP 配置不会传递到您随后利用该实例创建的快照或 AMI。
+  Apple silicon Mac 实例必须只有一个可引导卷，并且每个挂载卷只能有一个额外的管理员用户。

## 默认 SIP 配置
<a name="mac-sip-defaults"></a>

下表列举了采用 x86 架构的 Mac 实例和 Apple silicon Mac 实例的默认 SIP 配置。


|  | Apple silicon Mac 实例 | 采用 x86 架构的 Mac 实例 | 
| --- | --- | --- | 
| Apple 内部专用 | 已启用 | 已禁用 | 
| 文件系统保护 | 已启用 | 已禁用 | 
| 基础系统 | 已启用 | 已启用 | 
| 调试限制 | 已启用 | 已启用 | 
| Dtrace 限制 | 已启用 | 已启用 | 
| Kext 签名 | 已启用 | 已启用 | 
| Nvram 保护 | 已启用 | 已启用 | 

## 检查 SIP 配置
<a name="mac-sip-check-settings"></a>

我们建议在进行更改之前和之后检查 SIP 配置，确保其配置符合预期。

**检查 Amazon EC2 Mac 实例的 SIP 配置**  
[使用 SSH 连接到实例](connect-to-mac-instance.md#mac-instance-ssh)，然后在命令行中运行以下命令。

```
$ csrutil status
```

下面是示例输出。

```
System Integrity Protection status: enabled.

Configuration:
    Apple Internal: enabled
    Kext Signing: disabled
    Filesystem Protections: enabled
    Debugging Restrictions: enabled
    DTrace Restrictions: enabled
    NVRAM Protections: enabled
    BaseSystem Verification: disabled
```

## Apple silicon Mac 实例的先决条件
<a name="mac-sip-prereqs"></a>

在为 Apple silicon Mac 实例配置 SIP 设置之前，必须为 Amazon EBS 根卷管理员用户（`ec2-user`）设置密码并启用安全令牌。

**注意**  
密码和安全令牌将在您首次使用 GUI 连接到 Apple silicon Mac 实例时设置。如果您之前[使用 GUI 连接到实例](connect-to-mac-instance.md#mac-instance-vnc)或者您使用采用 x86 架构的 Mac 实例，则**无需**执行这些步骤。

**注意**  
所有用于 macOS 身份验证的 macOS 用户名和密码长度都必须为 4 到 16 个字符，才能用于 SIP 设置 API 调用。

**为 EBS 根卷管理员用户设置密码并启用安全令牌**

1. [使用 SSH 连接到实例](connect-to-mac-instance.md#mac-instance-ssh)。

1. 为 `ec2-user` 用户设置密码。

   ```
   $ sudo /usr/bin/dscl . -passwd /Users/ec2-user
   ```

1. 为 `ec2-user` 用户启用安全令牌。对于 `-oldPassword`，请指定与上一步中相同的密码。对于 `-newPassword`，请指定一个不同的密码。以下命令假定您已将旧密码和新密码保存在 `.txt` 文件中。

   ```
   $ sysadminctl -oldPassword `cat old_password.txt` -newPassword `cat new_password.txt`
   ```

1. 确认已启用安全令牌。

   ```
   $ sysadminctl -secureTokenStatus ec2-user
   ```

## 配置 SIP 设置
<a name="mac-sip-configure"></a>

在配置实例的 SIP 设置时，您可以启用或禁用所有 SIP 设置，也可以指定自定义配置，从而有选择地启用或禁用特定 SIP 设置。

**注意**  
如果您实施自定义配置，请[连接到实例并验证设置](#mac-sip-check-settings)，从而确保正确实现了您的需求并按预期运行。  
SIP 配置可能会随 macOS 更新更改。我们建议在执行任何 macOS 版本升级后检查自定义 SIP 设置，确保安全配置依然兼容并正常发挥作用。

要配置实例的 SIP 设置，您必须创建一个 SIP 配置任务。该 SIP 配置任务将指定实例的 SIP 设置。

在为 Apple silicon Mac 实例创建 SIP 配置时，必须指定以下凭证：
+ **内部磁盘管理员用户**
  + 用户名：仅支持默认管理员用户 (`aws-managed-user`)，并且默认使用该用户。不能指定其他管理员用户。
  + 密码：如果没有更改 `aws-managed-user` 的默认密码，请指定默认密码，即*空*。否则请指定您的密码。
+ **Amazon EBS 根卷管理员用户**
  + 用户名：如果未更改默认管理员用户，请指定 `ec2-user`。否则指定您的管理员用户的用户名。
  + 密码：必须始终指定此密码。

使用以下方法创建一个 SIP 配置任务。

------
#### [ Console ]

**使用控制台创建 SIP 配置任务**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**实例**，然后选择该 Amazon EC2 Mac 实例。

1. 在**安全**选项卡中，选择**修改 Mac，修改系统完整性保护**。

1. 要启用所有 SIP 设置，请选择**启用 SIP**。要禁用所有 SIP 设置，请清除**启用 SIP**。

1. 要指定自定义配置来有选择地启用或禁用特定 SIP 设置的，请选择**指定自定义 SIP 配置**，然后选择要启用的 SIP 设置，或者清除要禁用的 SIP 设置。

1. 指定根卷用户和内部磁盘所有者的凭证。

1. 选择**创建 SIP 修改任务**。

------
#### [ AWS CLI ]

**使用 AWS CLI 创建 SIP 配置任务**  
使用 [ create-mac-system-integrity-protection-modification-task](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-mac-system-integrity-protection-modification-task.html) 命令。

**启用或禁用所有 SIP 设置**  
要完全启用或禁用所有 SIP 设置，请仅使用 `--mac-system-integrity-protection-status` 参数。

以下示例命令会启用所有 SIP 设置。

```
aws ec2 create-mac-system-integrity-protection-modification-task \
--instance-id {{i-0abcdef9876543210}} \
--mac-system-integrity-protection-status {{enabled}} \
--mac-credentials file://mac-credentials.json
```

**指定自定义 SIP 配置**  
要指定自定义 SIP 配置来有选择地启用或禁用特定 SIP 设置，请指定 `--mac-system-integrity-protection-status` 和 `--mac-system-integrity-protection-configuration` 参数。其中 `mac-system-integrity-protection-status` 用来指定整体 SIP 状态，`mac-system-integrity-protection-configuration` 用来有选择地启用或禁用特定 SIP 设置。

以下示例命令会创建一个 SIP 配置任务，来启用除 `NvramProtections` 和 `FilesystemProtections` 之外的所有 SIP 设置。

```
aws ec2 create-mac-system-integrity-protection-modification-task \
--instance-id {{i-0abcdef9876543210}} \
--mac-system-integrity-protection-status {{enabled}} \
--mac-system-integrity-protection-configuration "{{NvramProtections=disabled}}, {{FilesystemProtections=disabled}}" \
--mac-credentials file://mac-credentials.json
```

以下示例命令会创建一个 SIP 配置任务，来禁用除 `DtraceRestrictions` 之外的所有 SIP 设置。

```
aws ec2 create-mac-system-integrity-protection-modification-task \
--instance-id {{i-0abcdef9876543210}} \
--mac-system-integrity-protection-status {{disabled}} \
--mac-system-integrity-protection-configuration "{{DtraceRestrictions=enabled}}" \
--mac-credentials file://mac-credentials.json
```

**`mac-credentials.json` 文件的内容**  
以下为上文示例中所引用 `mac-credentials.json` 文件的内容。

```
{
  "internalDiskPassword":"internal-disk-admin_password",
  "rootVolumeUsername":"root-volume-admin_username",
  "rootVolumePassword":"root-volume-admin_password"
}
```

------

## 检查 SIP 配置任务状态
<a name="mac-sip-state"></a>

可以使用以下方法之一检查 SIP 配置任务的状态。

------
#### [ Console ]

**使用控制台查看 SIP 配置任务**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**实例**，然后选择该 Amazon EC2 Mac 实例。

1. 在**安全**选项卡中，向下滚动到 **Mac 修改任务**部分。

------
#### [ AWS CLI ]

**使用 AWS CLI 检查 SIP 配置任务的状态**  
使用 [describe-mac-modification-tasks](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-mac-modification-tasks.html) 命令。

------