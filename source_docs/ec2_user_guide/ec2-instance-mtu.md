

# 设置 Amazon EC2 实例的 MTU
<a name="ec2-instance-mtu"></a>

网络连接的最大传输单位 (MTU) 是能够通过该连接传递的最大可允许数据包的大小（以字节为单位）。所有 Amazon EC2 实例都支持标准帧（1500 MTU），所有当前一代实例类型都支持巨型帧（9001 MTU）。

您可以查看 Amazon EC2 实例的 MTU，查看您的实例与其他主机之间的路径 MTU，并将您的实例配置为使用标准帧或巨型帧。

**Topics**
+ [查看两个主机之间的路径 MTU](#check_path_mtu)
+ [检查实例的 MTU](#check_mtu)
+ [设置实例的 MTU](#set_mtu)

## 查看两个主机之间的路径 MTU
<a name="check_path_mtu"></a>

您可以检查 EC2 实例与另一主机之间的路径 MTU。可以指定 DNS 名称或 IP 地址作为目标。如果目标是另一个 EC2 实例，则验证其安全组是否允许入站 UDP 流量。

您使用的过程取决于实例的操作系统。

### Linux 实例
<a name="check-path-mtu-linux"></a>

在实例上运行 **tracepath** 命令来检查您的 EC2 实例与指定目标之间的路径 MTU。此命令是 `iputils` 软件包的一部分，默认情况下，许多 Linux 发行版中都提供该命令。

本例检查 EC2 实例与 `amazon.com` 之间的路径 MTU。

```
[ec2-user ~]$ tracepath {{amazon.com}}
```

在此示例输出中，路径 MTU 为 1500。

```
 1?: [LOCALHOST]     pmtu 9001
 1:  ip-172-31-16-1.us-west-1.compute.internal (172.31.16.1)   0.187ms pmtu 1500
 1:  no reply
 2:  no reply
 3:  no reply
 4:  100.64.16.241 (100.64.16.241)                          0.574ms
 5:  72.21.222.221 (72.21.222.221)                         84.447ms asymm 21
 6:  205.251.229.97 (205.251.229.97)                       79.970ms asymm 19
 7:  72.21.222.194 (72.21.222.194)                         96.546ms asymm 16
 8:  72.21.222.239 (72.21.222.239)                         79.244ms asymm 15
 9:  205.251.225.73 (205.251.225.73)                       91.867ms asymm 16
...
31:  no reply
     Too many hops: pmtu 1500
     Resume: pmtu 1500
```

### Windows 实例
<a name="check-path-mtu-windows"></a>

**使用 mturoute 检查路径 MTU**

1. 从 [https://elifulkerson.com/projects/mturoute.php](https://elifulkerson.com/projects/mturoute.php) 将 **mturoute.exe** 下载到您的 EC2 实例。

1. 打开命令提示符窗口并将当前目录更改为 **mturoute.exe** 的下载目录。

1. 使用以下命令检查您的 EC2 实例与指定目标之间的路径 MTU。本例检查 EC2 实例与 `www.elifulkerson.com` 之间的路径 MTU。

   ```
   .\mturoute.exe {{www.elifulkerson.com}}
   ```

   在此示例输出中，路径 MTU 为 1500。

   ```
   * ICMP Fragmentation is not permitted. *
   * Speed optimization is enabled. *
   * Maximum payload is 10000 bytes. *
   + ICMP payload of 1472 bytes succeeded.
   - ICMP payload of 1473 bytes is too big.
   Path MTU: 1500 bytes.
   ```

## 检查实例的 MTU
<a name="check_mtu"></a>

您可以检查实例的 MTU 值。一些实例配置为使用巨型帧，另一些则配置为使用标准帧大小。

您使用的过程取决于实例的操作系统。

### Linux 实例
<a name="check-mtu-linux"></a>

**查看 Linux 实例上的 MTU 设置**  
在您的 EC2 实例上运行以下 **ip** 命令。如果主网络接口不是 `eth0`，则请将 `eth0` 替换为您的网络接口。

```
[ec2-user ~]$ ip link show {{eth0}}
```

在此示例输出中，{{mtu 9001}} 指示实例使用了巨型帧。

```
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> {{mtu 9001}} qdisc pfifo_fast state UP mode DEFAULT group default qlen 1000
    link/ether 02:90:c0:b7:9e:d1 brd ff:ff:ff:ff:ff:ff
```

### Windows 实例
<a name="check-mtu-windows"></a>

您使用的过程取决于实例上的驱动程序。

------
#### [ ENA driver ]

**版本 2.1.0 及更高版本**  
要获取 MTU 值，请在 EC2 实例上使用以下 **Get-NetAdapterAdvancedProperty** 命令。使用通配符（星号）获取所有以太网名称。检查接口名称 `*JumboPacket` 的输出。值为 9015 表示已启用巨型帧。默认情况下禁用巨型帧。

```
Get-NetAdapterAdvancedProperty -Name "Ethernet*"
```

**版本 1.5 及更早版本**  
要获取 MTU 值，请在 EC2 实例上使用以下 **Get-NetAdapterAdvancedProperty** 命令。检查接口名称 `MTU` 的输出。值为 9001 表示已启用巨型帧。默认情况下禁用巨型帧。

```
Get-NetAdapterAdvancedProperty -Name "Ethernet"
```

------
#### [ Intel SRIOV 82599 driver ]

要获取 MTU 值，请在 EC2 实例上使用以下 **Get-NetAdapterAdvancedProperty** 命令。检查接口名称 `*JumboPacket` 的条目。值为 9014 表示已启用巨型帧。(注意，MTU 的大小中包括标头和负载。) 默认情况下禁用巨型帧。

```
Get-NetAdapterAdvancedProperty -Name "Ethernet"
```

------
#### [ AWS PV driver ]

要获取 MTU 值，请在 EC2 实例上使用以下命令。接口的名称可能会有所不同。在输出中，查找名为“Ethernet”、“Ethernet 2”或“Local Area Connection”的条目。您需要接口名称来启用或禁用巨型帧。值为 9001 表示已启用巨型帧。

```
netsh interface ipv4 show subinterface
```

------

## 设置实例的 MTU
<a name="set_mtu"></a>

您可能希望将巨型帧用于 VPC 内的网络流量，并将标准帧用于互联网流量。无论是哪种用例，我们都建议您验证实例是否如预期那样运行。

您使用的过程取决于实例的操作系统。

### Linux 实例
<a name="set-mtu-linux"></a>

**在 Linux 实例上设置 MTU 值**

1. 在您的实例上运行以下 **ip** 命令。其将预期 MTU 值设置为 1500，但是您可以使用 9001 代替。如果主网络接口不是 `eth0`，请将 `eth0` 替换为实际网络接口。

   ```
   [ec2-user ~]$ sudo ip link set dev {{eth0}} mtu {{1500}}
   ```

1. (可选) 要在重启后保留您的网络 MTU 设置，请根据您的操作系统类型修改配置文件。
   + **Amazon Linux 2023**：修改配置文件的 `[Link]` 部分。默认配置文件是 `/usr/lib/systemd/network/80-ec2.network`，您也可以更新在 /run/systemd/network/ 中创建的任何自定义配置文件，其中文件名为 {{priority}}-{{interface}}.network。有关更多信息，请参阅 Amazon Linux 文档中的 [Networking service](https://docs.aws.amazon.com/linux/al2023/ug/networking-service.html)。

     ```
     MTUBytes={{1500}}
     ```
   + **Amazon Linux 2**：将以下一行添加到 `/etc/sysconfig/network-scripts/ifcfg-{{eth0}}` 文件：

     ```
     MTU={{1500}}
     ```

     将以下行添加到 `/etc/dhcp/dhclient.conf` 文件：

     ```
     request subnet-mask, broadcast-address, time-offset, routers, domain-name, domain-search, domain-name-servers, host-name, nis-domain, nis-servers, ntp-servers;
     ```
   + **其他 Linux 发行版**：请参阅其具体文档。

1. (可选) 重启实例并验证 MTU 设置是否正确。

### Windows 实例
<a name="set-mtu-windows"></a>

您使用的过程取决于实例上的驱动程序。

------
#### [ ENA driver ]

您可以使用设备管理器或在实例上使用 **Set-NetAdapterAdvancedProperty** 命令更改 MTU 设置。

**版本 2.1.0 及更高版本**  
使用以下命令启用巨型帧。

```
Set-NetAdapterAdvancedProperty -Name "Ethernet" -RegistryKeyword "*JumboPacket" -RegistryValue 9015
```

使用以下命令禁用巨型帧。

```
Set-NetAdapterAdvancedProperty -Name "Ethernet" -RegistryKeyword "*JumboPacket" -RegistryValue 1514
```

**版本 1.5 及更早版本**  
使用以下命令启用巨型帧。

```
Set-NetAdapterAdvancedProperty -Name "Ethernet" -RegistryKeyword "MTU" -RegistryValue 9001
```

使用以下命令禁用巨型帧。

```
Set-NetAdapterAdvancedProperty -Name "Ethernet" -RegistryKeyword "MTU" -RegistryValue 1500
```

------
#### [ Intel SRIOV 82599 driver ]

您可以使用设备管理器或在实例上使用 **Set-NetAdapterAdvancedProperty** 命令更改 MTU 设置。

使用以下命令启用巨型帧。

```
Set-NetAdapterAdvancedProperty -Name "Ethernet" -RegistryKeyword "*JumboPacket" -RegistryValue 9014
```

使用以下命令禁用巨型帧。

```
Set-NetAdapterAdvancedProperty -Name "Ethernet" -RegistryKeyword "*JumboPacket" -RegistryValue 1514
```

------
#### [ AWS PV driver ]

您可以在实例上使用 **netsh** 命令更改 MTU 设置。您无法使用设备管理器更改 MTU。

使用以下命令启用巨型帧。

```
netsh interface ipv4 set subinterface "{{Ethernet}}" mtu=9001
```

使用以下命令禁用巨型帧。

```
netsh interface ipv4 set subinterface "{{Ethernet}}" mtu=1500
```

------