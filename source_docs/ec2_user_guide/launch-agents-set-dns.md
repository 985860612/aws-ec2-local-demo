

# 为 EC2 Windows 启动代理配置 DNS 后缀
<a name="launch-agents-set-dns"></a>

借助 Amazon EC2 启动代理，您可以配置 Windows 实例用于域名解析的 DNS 后缀列表。启动代理将以下值添加到 DNS 后缀搜索列表中，从而覆盖 `System\CurrentControlSet\Services\Tcpip\Parameters\SearchList` 注册表项中的标准 Windows 设置：
+ 实例的域
+ 因实例域传递而产生的后缀
+ NV 域
+ 每个网络接口卡指定的域

所有启动代理都支持 DNS 后缀配置。有关更多信息，请参阅您的特定启动代理版本：
+ 有关 `setDnsSuffix` 任务以及如何在 EC2Launch v2 中配置 DNS 后缀的信息，请参阅 [setDnsSuffix](ec2launch-v2-task-definitions.md#ec2launch-v2-setdnssuffix)。
+ 有关 DNS 后缀列表设置以及如何为 EC2Launch v1 启用或禁用传递的信息，请参阅 [在 Windows 实例上配置 EC2Launch v1 代理](ec2launch-config.md)。
+ 有关 DNS 后缀列表设置以及如何为 EC2Config 启用或禁用传递的信息，请参阅 [EC2Config 设置文件](ec2config-service.md#UsingConfigXML_WinAMI)。

**域名传递**  
域名传递是一种 Active Directory 行为，该行为允许子域中的计算机在不使用完全限定的域名的情况下访问父域中的资源。默认情况下，域名传递会一直持续到域名进度中只剩下两个节点。

如果实例已连接到某个域，则启动代理会对域名执行传递，并将结果添加到 **`System\CurrentControlSet\Services\Tcpip\Parameters\SearchList`** 注册表项中维护的 DNS 后缀搜索列表中。代理使用以下注册表项中的设置来确定传递行为。
+ **`System\CurrentControlSet\Services\Tcpip\Parameters\UseDomainNameDevolution`**
  + 未设置时，禁用传递
  + 设置为 `1` 时，启用传递（默认）
  + 设置为 `0` 时，禁用传递
+ **`System\CurrentControlSet\Services\Dnscache\Parameters\DomainNameDevolutionLevel`**
  + 未设置时，使用等级 `2`（默认）
  + 设置为 `3` 或更大值时，使用该值来设置等级

当您禁用传递或将传递设置更改为更高级别时，`System\CurrentControlSet\Services\Tcpip\Parameters\SearchList` 注册表项仍包含先前添加的后缀。这些后缀不会被自动移除。您可以手动更新列表，也可以清除列表并让代理完成设置新列表的过程。

**注意**  
要从注册表中清除 DNS 后缀列表，可以运行以下命令。  

```
PS C:\> Invoke-CimMethod -ClassName Win32_NetworkAdapterConfiguration -MethodName "SetDNSSuffixSearchOrder" -Arguments @{ DNSDomainSuffixSearchOrder = $null } | Out-Null
```

**传递示例**  
以下示例显示传递过程中的域名进度。

`corp.example.com`  
+ 进展到 `example.com`

`locale.region.corp.example.com`  

1. 进展到 `region.corp.example.com`

1. 进展到 `corp.example.com`

1. 进展到 `example.com`

具有 `DomainNameDevolutionLevel=3` 设置的 `locale.region.corp.example.com`  

1. 进展到 `region.corp.example.com`

1. 进展到 `corp.example.com`。由于等级设置，进度到此停止。