

# Amazon EC2 实例的 UEFI 变量
<a name="uefi-variables"></a>

当您启动实例且其启动模式设置为 UEFI 时，将为变量创建键值存储。UEFI 和实例操作系统可以使用该键值存储来存储 UEFI 变量。

启动加载程序和操作系统使用 UEFI 变量来配置早期系统启动。它们允许操作系统管理启动过程的某些设置（例如启动顺序）或管理 UEFI 安全启动的密钥。

**警告**  
可以连接到实例的任何人（以及可能在实例上运行的任何软件），或者有权在实例上使用 [GetInstanceUefiData](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_GetInstanceUefiData.html) API 的任何人都可以读取变量。您绝不应将敏感数据（例如密码或个人身份信息）存储在 UEFI 变量存储中。

**UEFI 变量持久性**
+ 对于在 2022 年 5 月 10 日或之前启动的实例，UEFI 变量会在重启或停止时擦除。
+ 对于在 2022 年 5 月 11 日或之后启动的实例，标记为非易失性的 UEFI 变量将在重启和停止/启动时保留。
+ 裸机实例不会在实例停止/启动操作中保留 UEFI 非易失性变量。