

# 连接到 EC2 Serial Console
<a name="connect-to-serial-console"></a>

您可以使用 Amazon EC2 控制台或通过 SSH 连接到 EC2 实例的串行控制台。连接到串行控制台后，您可以使用它来排除引导、网络配置和其他方面的问题。有关排查故障的更多信息，请参阅 [使用 EC2 Serial Console 对 Amazon EC2 实例进行故障排查](troubleshoot-using-serial-console.md)。

**注意事项**
+ 每个实例仅支持一个活动串行控制台连接。
+ 串行控制台连接通常会持续一小时，除非您[断开连接](disconnect-serial-console-session.md)。但是，在系统维护期间，Amazon EC2 将断开串行控制台会话。

  连接的持续时间并不是由 IAM 凭证的持续时间决定的。如果您的 IAM 凭证过期，连接将继续保持，直到达到串行控制台连接的最长持续时间。使用 EC2 Serial Console 控制台体验时，如果 IAM 凭证过期，请关闭浏览器页面终止连接。
+ 断开与串行控制台的连接后，需要 30 秒钟来终止会话，之后才允许新会话。
+ 支持的串行控制台端口：`ttyS0`（Linux 实例）和 `COM1`（Windows 实例）
+ 连接到串行控制台时，您可能会观察到实例的吞吐量略有下降。

**Topics**
+ [使用基于浏览器的客户端进行连接](#sc-connect-browser-based-client)
+ [使用您自己的密钥和 SSH 客户端进行连接](#sc-connect-SSH)
+ [EC2 Serial Console 端点和指纹](#sc-endpoints-and-fingerprints)

## 使用基于浏览器的客户端进行连接
<a name="sc-connect-browser-based-client"></a>

您可以使用基于浏览器的客户端连接到 EC2 实例的串行控制台。您可以通过在 Amazon EC2 控制台中选择实例并选择连接到串行控制台来完成此操作。基于浏览器的客户端处理权限并可提供成功连接。

EC2 Serial Console 适用于大多数浏览器，并支持键盘和鼠标输入。

在连接之前，请确保您已完成[先决条件](ec2-serial-console-prerequisites.md)。

**使用基于浏览器的客户端（Amazon EC2 控制台）连接到实例的串行端口**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances (实例)**。

1. 您可以选择相应实例，然后选择 **Actions**（操作）、**Monitor and troubleshoot**（监控和问题排查）、**EC2 Serial Console**、**Connect**（连接）。

   您也可以选择相应实例，然后选择 **Connect**（连接）、**EC2 Serial Console**、**Connect**（连接）。

   浏览器内终端窗口随即打开。

1. 按 **Enter**。如果返回登录提示，则表示您已连接到串行控制台。

   如果保持黑屏，则可以使用以下信息来帮助解决连接到串行控制台的问题：
   + **检查您是否已配置了串行控制台的访问权限。**有关更多信息，请参阅 [配置对 EC2 Serial Console 的访问](configure-access-to-serial-console.md)。
   + （仅限 Linux 实例）**使用 SysRq 连接到串行控制台。**SysRq 不要求您使用基于浏览器的客户端进行连接。有关更多信息，请参阅 [（Linux 实例）使用 SysRq 对您的实例进行故障排除](troubleshoot-using-serial-console.md#SysRq)。
   + （仅限 Linux 实例）**重新启动 getty。**如果您对实例拥有 SSH 访问权限，则使用 SSH 连接到实例，然后使用以下命令重新启动 getty。

     ```
     [ec2-user ~]$ sudo systemctl restart serial-getty@ttyS0
     ```
   + **重新启动您的实例。**您可以使用 SysRq（Linux 实例）、EC2 控制台或 AWS CLI 重启实例 。有关更多信息，请参阅 [（Linux 实例）使用 SysRq 对您的实例进行故障排除](troubleshoot-using-serial-console.md#SysRq)（Linux 实例）或 [重启 Amazon EC2 实例](ec2-instance-reboot.md)。

1. （仅限 Linux 实例）在 `login` 提示符下，输入您[之前设置](configure-access-to-serial-console.md#set-user-password)的、基于密码的用户的用户名，然后按 **Enter** 键。

1. （仅限 Linux 实例）在 `Password` 提示符下，输入密码，然后按 **Enter** 键。

## 使用您自己的密钥和 SSH 客户端进行连接
<a name="sc-connect-SSH"></a>

您可以使用自己的 SSH 密钥，并在使用 串行控制台 API 时从您选择的 SSH 客户端连接到您的实例。这使您能够从将公有密钥推送到实例的串行控制台功能中受益。

将 SSH 密钥推送到实例后，SSH 连接不受您配置用于授予用户 EC2 Serial Console 访问权限的 IAM 策略约束。

**开始前的准备工作**  
验证是否满足[先决条件](ec2-serial-console-prerequisites.md)。

**使用 SSH 连接到实例的串行控制台**

1. **将 SSH 公钥推送到实例以启动串行控制台会话**

   使用 [send-serial-console-ssh-public-key](https://docs.aws.amazon.com/cli/latest/reference/ec2-instance-connect/send-serial-console-ssh-public-key.html) 命令可将 SSH 公有密钥推送到实例。这将启动串行控制台会话。

   如果已为此实例启动串行控制台会话，则该命令将失败，因为您每次只能打开一个会话。断开与串行控制台的连接后，需要 30 秒钟来终止会话，之后才允许新会话。

   ```
   aws ec2-instance-connect send-serial-console-ssh-public-key \
       --instance-id {{i-001234a4bf70dec41EXAMPLE}} \
       --serial-port 0 \
       --ssh-public-key file://{{my_key.pub}} \
       --region {{us-east-1}}
   ```

1. 

**使用私钥连接到串行控制台**

   在从串行控制台服务删除公钥之前，使用 **ssh** 命令连接到串行控制台。在移除之前，您有 60 秒钟的时间。

   使用与公钥对应的私钥。

   用户名格式为 `instance-id.port0`，其中包括实例 ID 和端口 0。在以下示例中，用户名为 `i-001234a4bf70dec41EXAMPLE.port0`。

   串行控制台服务的端点因区域而异。有关每个区域的端点，请参阅 [EC2 Serial Console 端点和指纹](#sc-endpoints-and-fingerprints) 表。在以下示例中，串行控制台服务位于 us-east-1 区域。

   ```
   ssh -i {{my_key}} {{i-001234a4bf70dec41EXAMPLE.port0}}@{{serial-console.ec2-instance-connect.us-east-1.aws}}
   ```

   以下示例使用 `timeout 3600` 将 SSH 会话设置为 1 小时后终止。会话终止后，会话期间启动的进程可能会继续在您的实例上运行。

   ```
   timeout 3600 ssh -i {{my_key}} {{i-001234a4bf70dec41EXAMPLE.port0}}@{{serial-console.ec2-instance-connect.us-east-1.aws}}
   ```

1. 

**（可选）验证指纹**

   首次连接到串行控制台时，系统会提示您验证指纹。您可以比较串行控制台指纹与为了进行验证而显示的指纹。如果这些指纹不匹配，则表示有人可能在试图实施“中间人”攻击。如果它们匹配，您可以放心地连接到串行控制台。

   以下指纹用于 us-east-1 区域中的串行控制台服务。有关每个区域的指纹，请参阅 [EC2 Serial Console 端点和指纹](#sc-endpoints-and-fingerprints)。

   ```
   SHA256:dXwn5ma/xadVMeBZGEru5l2gx+yI5LDiJaLUcz0FMmw
   ```

   该指纹仅在您第一次连接到串行控制台时出现。

1. 按 **Enter**。如果返回提示，则表示您已连接到串行控制台。

   如果保持黑屏，则可以使用以下信息来帮助解决连接到串行控制台的问题：
   + **检查您是否已配置了串行控制台的访问权限。**有关更多信息，请参阅 [配置对 EC2 Serial Console 的访问](configure-access-to-serial-console.md)。
   + （仅限 Linux 实例）**使用 SysRq 连接到串行控制台。**SysRq 不要求您使用 SSH 连接。有关更多信息，请参阅 [（Linux 实例）使用 SysRq 对您的实例进行故障排除](troubleshoot-using-serial-console.md#SysRq)。
   + （仅限 Linux 实例）**重新启动 getty。**如果您对实例拥有 SSH 访问权限，则使用 SSH 连接到实例，然后使用以下命令重新启动 getty。

     ```
     [ec2-user ~]$ sudo systemctl restart serial-getty@ttyS0
     ```
   + **重新启动您的实例。**您可以使用 SysRq（仅限 Linux 实例）、EC2 控制台或 AWS CLI 重启实例 。有关更多信息，请参阅 [（Linux 实例）使用 SysRq 对您的实例进行故障排除](troubleshoot-using-serial-console.md#SysRq)（仅限 Linux 实例）或 [重启 Amazon EC2 实例](ec2-instance-reboot.md)。

1. （仅限 Linux 实例）在 `login` 提示符下，输入您[之前设置](configure-access-to-serial-console.md#set-user-password)的、基于密码的用户的用户名，然后按 **Enter** 键。

1. （仅限 Linux 实例）在 `Password` 提示符下，输入密码，然后按 **Enter** 键。

## EC2 Serial Console 端点和指纹
<a name="sc-endpoints-and-fingerprints"></a>

以下是 EC2 Serial Console 的服务端点和指纹。要以编程方式连接到实例的串行控制台，请使用 EC2 Serial Console 端点。EC2 Serial Console 端点和指纹对每个 AWS 区域都是唯一的。


| 区域名称 | 区域 | 端点 | 指纹 | 
| --- | --- | --- | --- | 
| 美国东部（俄亥俄州） | us-east-2 | serial-console.ec2-instance-connect.us-east-2.aws | SHA256:EhwPkTzRtTY7TRSzz26XbB0/HvV9jRM7mCZN0xw/d/0 | 
| 美国东部（弗吉尼亚州北部） | us-east-1 | serial-console.ec2-instance-connect.us-east-1.aws | SHA256:dXwn5ma/xadVMeBZGEru5l2gx\+yI5LDiJaLUcz0FMmw | 
| 美国西部（北加利福尼亚） | us-west-1 | serial-console.ec2-instance-connect.us-west-1.aws | SHA256:OHldlcMET8u7QLSX3jmRTRAPFHVtqbyoLZBMUCqiH3Y | 
| 美国西部（俄勒冈州） | us-west-2 | serial-console.ec2-instance-connect.us-west-2.aws | SHA256:EMCIe23TqKaBI6yGHainqZcMwqNkDhhAVHa1O2JxVUc | 
| 非洲（开普敦） | af-south-1 | ec2-serial-console.af-south-1.api.aws | SHA256:RMWWZ2fVePeJUqzjO5jL2KIgXsczoHlz21Ed00biiWI | 
| 亚太地区（香港） | ap-east-1 | ec2-serial-console.ap-east-1.api.aws | SHA256:T0Q1lpiXxChoZHplnAkjbP7tkm2xXViC9bJFsjYnifk | 
| 亚太地区（台北） | ap-east-2 | ec2-serial-console.ap-east-2.api.aws | SHA256:z1rsF5DE8aQqsHwBr/D40tR2GnyMqnScCUa1z1eFwDQ | 
| 亚太地区（海得拉巴） | ap-south-2 | ec2-serial-console.ap-south-2.api.aws | SHA256:WJgPBSwV4/shN\+OPITValoewAuYj15DVW845JEhDKRs | 
| 亚太地区（雅加达） | ap-southeast-3 | ec2-serial-console.ap-southeast-3.api.aws | SHA256:5ZwgrCh\+lfns32XITqL/4O0zIfbx4bZgsYFqy3o8mIk | 
| 亚太地区（马来西亚） | ap-southeast-5 | ec2-serial-console.ap-southeast-5.api.aws | SHA256:cQXTHQMRcqRdIjmAGoAMBSExeoRobYyRwT67yTjnEiA | 
| 亚太地区（新西兰） | ap-southeast-6 | ec2-serial-console.ap-southeast-6.api.aws | SHA256:wNltdH0gVfM5uHJKjrw\+ElFuKoJgalcSKqjCS\+lLkv4 | 
| 亚太地区（墨尔本） | ap-southeast-4 | ec2-serial-console.ap-southeast-4.api.aws | SHA256:Avaq27hFgLvjn5gTSShZ0oV7h90p0GG46wfOeT6ZJvM | 
| 亚太地区（孟买） | ap-south-1 | serial-console.ec2-instance-connect.ap-south-1.aws | SHA256:oBLXcYmklqHHEbliARxEgH8IsO51rezTPiSM35BsU40 | 
| 亚太地区（大阪） | ap-northeast-3 | ec2-serial-console.ap-northeast-3.api.aws | SHA256:Am0/jiBKBnBuFnHr9aXsgEV3G8Tu/vVHFXE/3UcyjsQ | 
| 亚太地区（首尔） | ap-northeast-2 | serial-console.ec2-instance-connect.ap-northeast-2.aws | SHA256:FoqWXNX\+DZ\+\+GuNTztg9PK49WYMqBX\+FrcZM2dSrqrI | 
| 亚太地区（新加坡） | ap-southeast-1 | serial-console.ec2-instance-connect.ap-southeast-1.aws | SHA256:PLFNn7WnCQDHx3qmwLu1Gy/O8TUX7LQgZuaC6L45CoY | 
| 亚太地区（悉尼） | ap-southeast-2 | serial-console.ec2-instance-connect.ap-southeast-2.aws | SHA256:yFvMwUK9lEUQjQTRoXXzuN\+cW9/VSe9W984Cf5Tgzo4 | 
| 亚太地区（泰国） | ap-southeast-7 | ec2-serial-console.ap-southeast-7.api.aws | SHA256:KCAZiRYrR1Q2lqsg7vTwixWmvc2wmjVT31XRgSdEfDY | 
| 亚太地区（东京） | ap-northeast-1 | serial-console.ec2-instance-connect.ap-northeast-1.aws | SHA256:RQfsDCZTOfQawewTRDV1t9Em/HMrFQe\+CRlIOT5um4k | 
| 加拿大（中部） | ca-central-1 | serial-console.ec2-instance-connect.ca-central-1.aws | SHA256:P2O2jOZwmpMwkpO6YW738FIOTHdUTyEv2gczYMMO7s4 | 
| 加拿大西部（卡尔加里） | ca-west-1 | ec2-serial-console.ca-west-1.api.aws | SHA256:s3rc8lI2xhbhr3iedjJNxGAFLPGOLjx7IxxXrGckk6Q | 
| 中国（北京） | cn-north-1 | ec2-serial-console.cn-north-1.api.amazonwebservices.com.cn | SHA256:2gHVFy4H7uU3\+WaFUxD28v/ggMeqjvSlgngpgLgGT\+Y | 
| 中国（宁夏） | cn-northwest-1 | ec2-serial-console.cn-northwest-1.api.amazonwebservices.com.cn | SHA256:TdgrNZkiQOdVfYEBUhO4SzUA09VWI5rYOZGTogpwmiM | 
| 欧洲地区（法兰克福） | eu-central-1 | serial-console.ec2-instance-connect.eu-central-1.aws | SHA256:aCMFS/yIcOdOlkXvOl8AmZ1Toe\+bBnrJJ3Fy0k0De2c | 
| 欧洲地区（爱尔兰） | eu-west-1 | serial-console.ec2-instance-connect.eu-west-1.aws | SHA256:h2AaGAWO4Hathhtm6ezs3Bj7udgUxi2qTrHjZAwCW6E | 
| 欧洲地区（伦敦） | eu-west-2 | serial-console.ec2-instance-connect.eu-west-2.aws | SHA256:a69rd5CE/AEG4Amm53I6lkD1ZPvS/BCV3tTPW2RnJg8 | 
| 欧洲地区（米兰） | eu-south-1 | ec2-serial-console.eu-south-1.api.aws | SHA256:lC0kOVJnpgFyBVrxn0A7n99ecLbXSX95cuuS7X7QK30 | 
| 欧洲地区（巴黎） | eu-west-3 | serial-console.ec2-instance-connect.eu-west-3.aws | SHA256:q8ldnAf9pymeNe8BnFVngY3RPAr/kxswJUzfrlxeEWs | 
| 欧洲（西班牙） | eu-south-2 | ec2-serial-console.eu-south-2.api.aws | SHA256:GoCW2DFRlu669QNxqFxEcsR6fZUz/4F4n7T45ZcwoEc | 
| 欧洲地区（斯德哥尔摩） | eu-north-1 | serial-console.ec2-instance-connect.eu-north-1.aws | SHA256:tkGFFUVUDvocDiGSS3Cu8Gdl6w2uI32EPNpKFKLwX84 | 
| 欧洲（苏黎世） | eu-central-2 | ec2-serial-console.eu-central-2.api.aws | SHA256:8Ppx2mBMf6WdCw0NUlzKfwM4/IfRz4OaXFutQXWp6mk | 
| 以色列（特拉维夫） | il-central-1 | ec2-serial-console.il-central-1.api.aws | SHA256:JR6q8v6kNNPi8\+QSFQ4dj5dimNmZPTgwgsM1SNvtYyU | 
| 墨西哥（中部） | mx-central-1 | ec2-serial-console.mx-central-1.api.aws | SHA256:BCuVl13iQNk\+CcVnt18Ef4p2ZHUrBBAOxlFetB32GS0 | 
| 中东（巴林） | me-south-1 | ec2-serial-console.me-south-1.api.aws | SHA256:nPjLLKHu2QnLdUq2kVArsoK5xvPJOMRJKCBzCDqC3k8 | 
| 中东（阿联酋） | me-central-1 | ec2-serial-console.me-central-1.api.aws | SHA256:zpb5duKiBZ\+l0dFwPeyykB4MPBYhI/XzXNeFSDKBvLE | 
| 南美洲（圣保罗） | sa-east-1 | serial-console.ec2-instance-connect.sa-east-1.aws | SHA256:rd2\+/32Ognjew1yVIemENaQzC\+Botbih62OqAPDq1dI | 
| AWS GovCloud (US-East) | us-gov-east-1 | serial-console.ec2-instance-connect.us-gov-east-1.amazonaws.com | SHA256:tIwe19GWsoyLClrtvu38YEEh\+DHIkqnDcZnmtebvF28 | 
| AWS GovCloud (US-West) | us-gov-west-1 | serial-console.ec2-instance-connect.us-gov-west-1.amazonaws.com | SHA256:kfOFRWLaOZfB\+utbd3bRf8OlPf8nGO2YZLqXZiIw5DQ | 