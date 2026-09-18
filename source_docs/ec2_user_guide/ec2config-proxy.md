

# 配置 EC2Config 服务的 .NET 代理设置
<a name="ec2config-proxy"></a>

您可以使用下列方法之一将 EC2Config 服务配置为通过代理进行通信：适用于 .NET 的 AWS 开发工具包、`system.net` 元素或 Microsoft 组策略和 Internet Explorer。使用 AWS SDK for .NET 时可以指定登录凭证，因此，请优先使用此方法。

**Topics**
+ [使用 适用于 .NET 的 AWS SDK 配置代理设置（首选）](#sdk-proxy)
+ [使用 system.net 元素配置代理设置](#system-proxy)
+ [使用 Microsoft 组策略及 Microsoft Internet Explorer 配置代理设置](#ie-proxy)

## 使用 适用于 .NET 的 AWS SDK 配置代理设置（首选）
<a name="sdk-proxy"></a>

您可以通过在 `proxy` 文件中指定 `Ec2Config.exe.config` 元素来配置 EC2Config 服务的代理设置。有关更多信息，请参阅[适用于 .NET 的 AWS 开发工具包的配置文件参考](https://docs.aws.amazon.com/sdk-for-net/latest/developer-guide/net-dg-config-ref.html#net-dg-config-ref-elements-proxy)。

**在 Ec2Config.exe.config 文件中指定代理元素**

1. 在需要 EC2Config 服务通过代理进行通信的实例上编辑 `Ec2Config.exe.config` 文件。默认情况下，该文件位于以下目录中：`%ProgramFiles%\Amazon\Ec2ConfigService`。

1. 将以下 `aws` 元素添加到 `configSections`。不要将此添加到任何现有 `sectionGroups` 中。

    **适用于 EC2Config 3.17 版本或更早版本** 

   ```
   <configSections>
      <section name="aws" type="Amazon.AWSSection, AWSSDK"/>
   </configSections>
   ```

    **适用于 EC2Config 3.18 版本或更新版本** 

   ```
   <configSections>
        <section name="aws" type="Amazon.AWSSection, AWSSDK.Core"/>
   </configSections>
   ```

1. 在 `aws` 文件中添加下面的 `Ec2Config.exe.config` 元素。

   ```
   <aws>
      <proxy
        host="{{string value}}"
        port="{{string value}}"
        username="{{string value}}"
        password="{{string value}}" />
   </aws>
   ```

1. 保存您的更改。

## 使用 system.net 元素配置代理设置
<a name="system-proxy"></a>

您可以在 `system.net` 文件的 `Ec2Config.exe.config` 元素中指定代理设置。有关更多信息，请参阅 [defaultProxy 元素（网络设置）](https://learn.microsoft.com/en-us/dotnet/framework/configure-apps/file-schema/network/defaultproxy-element-network-settings)。

**在 Ec2Config.exe.config 文件中指定 system.net 元素**

1. 在需要 EC2Config 服务通过代理进行通信的实例上编辑 `Ec2Config.exe.config` 文件。默认情况下，该文件位于以下目录中：`%ProgramFiles%\Amazon\Ec2ConfigService`。

1. 将 `defaultProxy` 条目添加 `system.net` 中。有关更多信息，请参阅 [defaultProxy 元素（网络设置）](https://learn.microsoft.com/en-us/dotnet/framework/configure-apps/file-schema/network/defaultproxy-element-network-settings)。

   例如，下面的配置将路由所有流量并使用当前为 Internet Explorer 配置的代理，但元数据和授权流量除外 (这两者将绕过该代理)。

   ```
   <defaultProxy>
       <proxy usesystemdefault="true" />
       <bypasslist>
           <add address="169.254.169.250" />
           <add address="169.254.169.251" />
           <add address="169.254.169.254" />
           <add address="[fd00:ec2::250]" />
           <add address="[fd00:ec2::254]" />
       </bypasslist>
   </defaultProxy>
   ```

1. 保存您的更改。

## 使用 Microsoft 组策略及 Microsoft Internet Explorer 配置代理设置
<a name="ie-proxy"></a>

EC2Config 服务以本地系统用户账户运行。更改实例上的组策略设置后，您可以在 Internet Explorer 中为此账户指定实例级代理设置。

**使用组策略及 Internet Explorer 配置代理设置**

1. 在需要 EC2Config 服务通过代理进行通信的实例上，以管理员身份打开命令提示符，键入 **gpedit.msc**，然后按 Enter。

1. 在本地组策略编辑器中，依次选择**本地计算机策略**下的**计算机配置**、**管理模板**、**Windows 组件**、**Internet Explorer**。

1. 在右侧窗格中，选择**按计算机进行代理服务器设置(不是按用户)**，然后选择**编辑策略设置**。

1. 选择**启用**，然后选择**应用**。

1. 打开 Internet Explorer，然后选择**工具**按钮。

1. 选择 **Internet 选项**，然后选择**连接**选项卡。

1. 选择**局域网设置**。

1. 在**代理服务器**下，选择**为 LAN 使用代理服务器**选项。

1. 指定地址和端口信息，然后选择**确定**。