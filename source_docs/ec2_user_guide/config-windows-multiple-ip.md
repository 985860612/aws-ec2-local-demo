

# 为 Windows 实例配置辅助私有 IPv4 地址
<a name="config-windows-multiple-ip"></a>

您可以为实例指定多个私有 IPv4 地址。将辅助私有 IPv4 地址分配给实例后，您必须在实例上配置操作系统才能识别辅助私有 IPv4 地址。

**注意**  
以下说明是基于 Windows Server 2022 的。这些步骤的实施可能因 Windows 实例的操作系统而异。

**Topics**
+ [先决条件](#prereq-steps)
+ [步骤 1：在实例中配置静态 IP 寻址](#step1)
+ [步骤 2：为实例配置辅助私有 IP 地址](#step2)
+ [步骤 3：配置应用程序以使用辅助私有 IP 地址](#step3)

## 先决条件
<a name="prereq-steps"></a>
+ 将辅助私有 IPv4 地址分配给实例的网络接口。您可以在启动实例时或在实例运行后分配辅助私有 IPv4 地址。有关更多信息，请参阅 [为实例分配辅助 IP 地址](instance-secondary-ip-addresses.md#assign-secondary-ip-address)。

## 步骤 1：在实例中配置静态 IP 寻址
<a name="step1"></a>

要使 Windows 实例能够使用多个 IP 地址，必须配置实例，使其使用静态 IP 寻址，而不是 DHCP 服务器。

**重要**  
当在实例中配置静态 IP 寻址时，IP 地址必须与控制台、CLI 或 API 中显示的地址精确匹配。如果您输入的 IP 地址不正确，实例可能会不可连接。

**在 Windows 实例上配置静态 IP 寻址**

1. 连接到您的实例。

1. 通过执行以下步骤，查找实例的 IP 地址、子网掩码和默认网关地址：

   1. 在 PowerShell 中运行下面的命令：

     ```
     ipconfig /all
     ```

     检查输出，记下网络接口的 **IPv4 地址**、**子网掩码**、**默认网关**和 **DNS 服务器**值。输出应与以下示例类似：

     ```
     ...
     
     Ethernet adapter Ethernet 4:
     
        Connection-specific DNS Suffix  . : us-west-2.compute.internal
        Description . . . . . . . . . . . : Amazon Elastic Network Adapter #2
        Physical Address. . . . . . . . . : 02-9C-3B-FC-8E-67
        DHCP Enabled. . . . . . . . . . . : Yes
        Autoconfiguration Enabled . . . . : Yes
        Link-local IPv6 Address . . . . . : fe80::f4d1:a773:5afa:cd1%7(Preferred)
        IPv4 Address. . . . . . . . . . . : {{10.200.0.128}}(Preferred)
        Subnet Mask . . . . . . . . . . . : {{255.255.255.0}}
        Lease Obtained. . . . . . . . . . : Monday, April 8, 2024 12:19:29 PM
        Lease Expires . . . . . . . . . . : Monday, April 8, 2024 4:49:30 PM
        Default Gateway . . . . . . . . . : {{10.200.0.1}}
        DHCP Server . . . . . . . . . . . : 10.200.0.1
        DHCPv6 IAID . . . . . . . . . . . : 151166011
        DHCPv6 Client DUID. . . . . . . . : 00-01-00-01-2D-67-AC-FC-12-34-9A-BE-A5-E7
        DNS Servers . . . . . . . . . . . : {{10.200.0.2}}
        NetBIOS over Tcpip. . . . . . . . : Enabled
     ```

1. 在 PowerShell 中运行以下命令，打开**网络和共享中心**：

   ```
   & $env:SystemRoot\system32\control.exe ncpa.cpl
   ```

1. 打开网络接口（本地连接或以太网）的上下文（右键单击）菜单，选择**属性**。

1. 依次选择 **Internet 协议版本 4 (TCP/IPv4)**、**属性**。

1. 在 **Internet 协议版本 4 (TCP/IPv4)属性**对话框中，选择**使用下面的 IP 地址**，输入以下值，然后选择**确定**。    
[See the AWS documentation website for more details](http://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/config-windows-multiple-ip.html)
**重要**  
如果将 IP 地址设置为当前 IP 地址以外的任何值，则会丢失与实例的连接。  
![IP 地址。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/windows-ip-static.png)

当实例从使用 DHCP 转为使用静态寻址时，会短时丢失与 Windows 实例的 RDP 连接。实例会像之前一样保留 IP 地址信息，但是现在，这些信息是静态的，且不受 DHCP 管理。

## 步骤 2：为实例配置辅助私有 IP 地址
<a name="step2"></a>

在 Windows 实例上设置了静态 IP 寻址之后，您便可准备第二个私有 IP 地址。

**配置辅助 IP 地址**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances**，然后选择您的实例。

1. 在 **Networking (联网)** 上，记下辅助 IP 地址。

1. 连接到您的实例。

1. 在您的 Windows 实例上，选择**开始**、**控制面板**。

1. 选择**网络和 Internet**、**网络和共享中心**。

1. 选择网络接口（本地连接或以太网），然后选择**属性**。

1. 在**本地连接属性**页面上，选择 **Internet 协议版本 4 (TCP/IPv4)**、**属性**、**高级**。

1. 选择**添加**。

1. 在 **TCP/IP 地址**对话框中，键入辅助私有 IP 地址作为 **IP 地址**。对于**子网掩码**，键入与[步骤 1：在实例中配置静态 IP 寻址](#step1) 中为主私有 IP 地址输入的子网掩码，然后选择**添加**。  
![“TCP/IP 地址”对话框。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/windows-ip-add.png)

1. 验证 IP 地址设置，然后选择**确定**。  
![“IP 设置”选项卡。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/windows-ip-advanced-tcpip.png)

1. 选择**确定**、**关闭**。

1. 要确认辅助 IP 地址已添加到操作系统，请在 PowerShell 中运行 `ipconfig /all` 命令。输出应与以下内容类似：

   ```
   Ethernet adapter Ethernet 4:
   
      Connection-specific DNS Suffix  . :
      Description . . . . . . . . . . . : Amazon Elastic Network Adapter #2
      Physical Address. . . . . . . . . : 02-9C-3B-FC-8E-67
      DHCP Enabled. . . . . . . . . . . : No
      Autoconfiguration Enabled . . . . : Yes
      Link-local IPv6 Address . . . . . : fe80::f4d1:a773:5afa:cd1%7(Preferred)
      IPv4 Address. . . . . . . . . . . : {{10.200.0.128}}(Preferred)
      Subnet Mask . . . . . . . . . . . : 255.255.255.0
      IPv4 Address. . . . . . . . . . . : {{10.200.0.129}}(Preferred)
      Subnet Mask . . . . . . . . . . . : 255.255.255.0
      Default Gateway . . . . . . . . . : 10.200.0.1
      DHCPv6 IAID . . . . . . . . . . . : 151166011
      DHCPv6 Client DUID. . . . . . . . : 00-01-00-01-2D-67-AC-FC-12-34-9A-BE-A5-E7
      DNS Servers . . . . . . . . . . . : 10.200.0.2
      NetBIOS over Tcpip. . . . . . . . : Enabled
   ```

## 步骤 3：配置应用程序以使用辅助私有 IP 地址
<a name="step3"></a>

可配置任何应用程序来使用辅助私有 IP 地址。例如，如果您的实例在 IIS 上运行网站，则可以配置 IIS 使用辅助私有 IP 地址。

**要配置 IIS 以使用辅助私有 IP 地址**

1. 连接到您的实例。

1. 打开互联网信息服务 (IIS) 管理器。

1. 在“**Connections**”窗格，展开“**Sites**”。

1. 打开您网站的上下文（右键单击）菜单，选择**编辑绑定**。

1. 在**网站绑定**对话框中，对于**类型**，选择 **http**、**编辑**。

1. 在**编辑网站绑定**对话框中，对于 **IP 地址**，选择辅助私有 IP 地址。(默认情况下，各网站均可接受来自所有 IP 地址的 HTTP 请求。)  
![IP 地址。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/windows-ip-iis-site-binding.png)

1. 选择**确定**、**关闭**。