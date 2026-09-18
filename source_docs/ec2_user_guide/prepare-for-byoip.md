

# Amazon EC2 中 BYOIP 的先决条件
<a name="prepare-for-byoip"></a>

BYOIP 的载入过程分为两个阶段，您必须为此执行三个步骤。这些步骤与下图中描述的步骤相对应。我们在本文档中包含了手动操作步骤，但您的 RIR 可能会提供托管服务来帮助您完成这些步骤。

**提示**  
本节中的任务需要 Linux 终端，可以使用 Linux、[AWS CloudShell](https://docs.aws.amazon.com/cloudshell/latest/userguide/welcome.html) 或 [适用于 Linux 的 Windows 子系统](https://learn.microsoft.com/en-us/windows/wsl/about)来执行。

**Topics**
+ [概述](#byoip-onboarding-overview)
+ [创建私有密钥并生成 X.509 证书](#byoip-certificate)
+ [将 X.509 证书上传到 RIR 中的 RDAP 记录](#byoip-add-certificate)
+ [在 RIR 中创建 ROA 对象](#byoip-create-roa-object)

## 概述
<a name="byoip-onboarding-overview"></a>

**准备阶段**  
[1] 为进行身份验证，请[创建私有密钥](#byoip-certificate)并用其生成自签名 X.509 证书。此证书仅用于预调配阶段。预调配完成后，可以从 RIR 的记录中删除证书

**RIR 配置阶段**

[2] [将自签名证书上传](#byoip-add-certificate)到 RDAP 记录注释。

[3] 在 RIR 中[创建 ROA 对象](#byoip-create-roa-object)。ROA 定义了所需的地址范围、允许公告地址范围的自治系统编号 (ASN) 以及向您 RIR 的资源公有密钥基础设施 (RPKI) 进行注册的到期日期。

**注意**  
不公开发布的 IPv6 地址空间不需要 ROA。

![BYOIP 的载入过程有三个步骤。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/byoip-preonboarding.png)


要引入多个不连续地址范围，您必须对每个地址范围重复此过程。不过，如果在几个不同 AWS 区域之间拆分连续数据块，则无需执行重复准备和 RIR 配置步骤。

引入地址范围不会影响您之前引入的任何地址范围。

## 创建私有密钥并生成 X.509 证书
<a name="byoip-certificate"></a>

使用以下过程创建自签名 X.509 证书，并将其添加到您的 RIR 的 RDAP 记录。此密钥对用于向 RIR 对地址范围进行身份验证。**openssl** 命令需要 OpenSSL 版本 1.0.2 或更高版本。

复制以下命令并仅替换占位符值（以彩色斜体文本显示）。

此过程遵循加密私有 RSA 密钥并要求使用通行短语来访问该密钥的最佳实践。

1. 生成 RSA 2048 位私有密钥，如下所示。

   ```
   $ openssl genpkey -aes256 -algorithm RSA -pkeyopt rsa_keygen_bits:2048 -out private-key.pem
   ```

   `-aes256` 参数指定用于加密私有密钥的算法。该命令返回以下输出，包括设置通行短语的提示：

   ```
   ......+++
   .+++
   Enter PEM pass phrase: {{xxxxxxx}}
   Verifying - Enter PEM pass phrase: {{xxxxxxx}}
   ```

   您可以使用以下命令检查密钥：

   ```
   $ openssl pkey -in private-key.pem -text
   ```

   这会返回通行短语提示和密钥内容，应类似于以下内容：

   ```
   Enter pass phrase for private-key.pem: {{xxxxxxx}}
   -----BEGIN PRIVATE KEY-----
   MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDFBXHRI4HVKAhh
   3seiciooizCRTbJe1+YsxNTja4XyKypVGIFWDGhZs44FCHlPOOSVJ+NqP74w96oM
   7DPS3xo9kaQyZBFn2YEp2EBq5vf307KHNRmZZUmkn0zHOSEpNmY2fMxISBxewlxR
   FAniwmSd/8TDvHJMY9FvAIvWuTsv5l0tJKk+a91K4+tO3UdDR7Sno5WXExfsBrW3
   g1ydo3TBsx8i5/YiVOcNApy7ge2/FiwY3aCXJB6r6nuF6H8mRgI4r4vkMRsOlAhJ
   DnZPNeweboo+K3Q3lwbgbmOKD/z9svk8N/+hUTBtIX0fRtbG+PLIw3xWRHGrMSn2
   BzsPVuDLAgMBAAECggEACiJUj2hfJkKv47Dc3es3Zex67A5uDVjXmxfox2Xhdupn
   fAcNqAptV6fXt0SPUNbhUxbBKNbshoJGufFwXPli1SXnpzvkdU4Hyco4zgbhXFsE
   RNYjYfOGzTPwdBLpNMB6k3Tp4RHse6dNrlH0jDhpioL8cQEBdBJyVF5X0wymEbmV
   mC0jgH/MxsBAPWW6ZKicg9ULMlWiAZ3MRAZPjHHgpYkAAsUWKAbCBwVQcVjGO59W
   jfZjzTX5pQtVVH68ruciH88DTZCwjCkjBhxg+OIkJBLE5wkh82jIHSivZ63flwLw
   z+E0+HhELSZJrn2MY6Jxmik3qNNUOF/Z+3msdj2luQKBgQDjwlC/3jxp8zJy6P8o
   JQKv7TdvMwUj4VSWOHZBHLv4evJaaia0uQjIo1UDa8AYitqhX1NmCCehGH8yuXj/
   v6V3CzMKDkmRr1NrONnSz5QsndQ04Z6ihAQlPmJ96g4wKtgoC7AYpyP0g1a+4/sj
   b1+o3YQI4pD/F71c+qaztH7PRwKBgQDdc23yNmT3+Jyptf0fKjEvONK+xwUKzi9c
   L/OzBq5yOIC1Pz2T85gOe1i8kwZws+xlpG6uBT6lmIJELd0k59FyupNu4dPvX5SD
   6GGqdx4jk9KvI74usGeOBohmF0phTHkrWKBxXiyT0oS8zjnJlEn8ysIpGgO28jjr
   LpaHNZ/MXQKBgQDfLNcnS0LzpsS2aK0tzyZU8SMyqVHOGMxj7quhneBq2T6FbiLD
   T9TVlYaGNZ0j71vQaLI19qOubWymbautH0Op5KV8owdf4+bf1/NJaPIOzhDUSIjD
   Qo01WW31Z9XDSRhKFTnWzmCjBdeIcajyzf10YKsycaAW9lItu8aBrMndnQKBgQDb
   nNp/JyRwqjOrNljk7DHEs+SD39kHQzzCfqd+dnTPv2sc06+cpym3yulQcbokULpy
   fmRo3bin/pvJQ3aZX/Bdh9woTXqhXDdrrSwWInVYMQPyPk8f/D9mIOJp5FUWMwHD
   U+whIZSxsEeE+jtixlWtheKRYkQmzQZXbWdIhYyI3QKBgD+F/6wcZ85QW8nAUykA
   3WrSIx/3cwDGdm4NRGct8ZOZjTHjiy9ojMOD1L7iMhRQ/3k3hUsin5LDMp/ryWGG
   x4uIaLat40kiC7T4I66DM7P59euqdz3w0PD+VU+h7GSivvsFDdySUt7bNK0AUVLh
   dMJfWxDN8QV0b5p3WuWH1U8B
   -----END PRIVATE KEY-----
   Private-Key: (2048 bit)
   modulus:
       00:c5:05:71:d1:23:81:d5:28:08:61:de:c7:a2:72:
       2a:28:8b:30:91:4d:b2:5e:d7:e6:2c:c4:d4:e3:6b:
       85:f2:2b:2a:55:18:81:56:0c:68:59:b3:8e:05:08:
       79:4f:38:e4:95:27:e3:6a:3f:be:30:f7:aa:0c:ec:
       33:d2:df:1a:3d:91:a4:32:64:11:67:d9:81:29:d8:
       40:6a:e6:f7:f7:d3:b2:87:35:19:99:65:49:a4:9f:
       4c:c7:39:21:29:36:66:36:7c:cc:48:48:1c:5e:c2:
       5c:51:14:09:e2:c2:64:9d:ff:c4:c3:bc:72:4c:63:
       d1:6f:00:8b:d6:b9:3b:2f:e6:5d:2d:24:a9:3e:6b:
       dd:4a:e3:eb:4e:dd:47:43:47:b4:a7:a3:95:97:13:
       17:ec:06:b5:b7:83:5c:9d:a3:74:c1:b3:1f:22:e7:
       f6:22:54:e7:0d:02:9c:bb:81:ed:bf:16:2c:18:dd:
       a0:97:24:1e:ab:ea:7b:85:e8:7f:26:46:02:38:af:
       8b:e4:31:1b:0e:94:08:49:0e:76:4f:35:ec:1e:6e:
       8a:3e:2b:74:37:97:06:e0:6e:63:8a:0f:fc:fd:b2:
       f9:3c:37:ff:a1:51:30:6d:21:7d:1f:46:d6:c6:f8:
       f2:c8:c3:7c:56:44:71:ab:31:29:f6:07:3b:0f:56:
       e0:cb
   publicExponent: 65537 (0x10001)
   privateExponent:
       0a:22:54:8f:68:5f:26:42:af:e3:b0:dc:dd:eb:37:
       65:ec:7a:ec:0e:6e:0d:58:d7:9b:17:e8:c7:65:e1:
       76:ea:67:7c:07:0d:a8:0a:6d:57:a7:d7:b7:44:8f:
       50:d6:e1:53:16:c1:28:d6:ec:86:82:46:b9:f1:70:
       5c:f9:62:d5:25:e7:a7:3b:e4:75:4e:07:c9:ca:38:
       ce:06:e1:5c:5b:04:44:d6:23:61:f3:86:cd:33:f0:
       74:12:e9:34:c0:7a:93:74:e9:e1:11:ec:7b:a7:4d:
       ae:51:f4:8c:38:69:8a:82:fc:71:01:01:74:12:72:
       54:5e:57:d3:0c:a6:11:b9:95:98:2d:23:80:7f:cc:
       c6:c0:40:3d:65:ba:64:a8:9c:83:d5:0b:32:55:a2:
       01:9d:cc:44:06:4f:8c:71:e0:a5:89:00:02:c5:16:
       28:06:c2:07:05:50:71:58:c6:3b:9f:56:8d:f6:63:
       cd:35:f9:a5:0b:55:54:7e:bc:ae:e7:22:1f:cf:03:
       4d:90:b0:8c:29:23:06:1c:60:f8:e2:24:24:12:c4:
       e7:09:21:f3:68:c8:1d:28:af:67:ad:df:97:02:f0:
       cf:e1:34:f8:78:44:2d:26:49:ae:7d:8c:63:a2:71:
       9a:29:37:a8:d3:54:38:5f:d9:fb:79:ac:76:3d:a5:
       b9
   prime1:
       00:e3:c2:50:bf:de:3c:69:f3:32:72:e8:ff:28:25:
       02:af:ed:37:6f:33:05:23:e1:54:96:38:76:41:1c:
       bb:f8:7a:f2:5a:6a:26:b4:b9:08:c8:a3:55:03:6b:
       c0:18:8a:da:a1:5f:53:66:08:27:a1:18:7f:32:b9:
       78:ff:bf:a5:77:0b:33:0a:0e:49:91:af:53:6b:38:
       d9:d2:cf:94:2c:9d:d4:34:e1:9e:a2:84:04:25:3e:
       62:7d:ea:0e:30:2a:d8:28:0b:b0:18:a7:23:f4:83:
       56:be:e3:fb:23:6f:5f:a8:dd:84:08:e2:90:ff:17:
       bd:5c:fa:a6:b3:b4:7e:cf:47
   prime2:
       00:dd:73:6d:f2:36:64:f7:f8:9c:a9:b5:fd:1f:2a:
       31:2f:38:d2:be:c7:05:0a:ce:2f:5c:2f:f3:b3:06:
       ae:72:38:80:b5:3f:3d:93:f3:98:0e:7b:58:bc:93:
       06:70:b3:ec:65:a4:6e:ae:05:3e:a5:98:82:44:2d:
       dd:24:e7:d1:72:ba:93:6e:e1:d3:ef:5f:94:83:e8:
       61:aa:77:1e:23:93:d2:af:23:be:2e:b0:67:8e:06:
       88:66:17:4a:61:4c:79:2b:58:a0:71:5e:2c:93:d2:
       84:bc:ce:39:c9:94:49:fc:ca:c2:29:1a:03:b6:f2:
       38:eb:2e:96:87:35:9f:cc:5d
   exponent1:
       00:df:2c:d7:27:4b:42:f3:a6:c4:b6:68:ad:2d:cf:
       26:54:f1:23:32:a9:51:ce:18:cc:63:ee:ab:a1:9d:
       e0:6a:d9:3e:85:6e:22:c3:4f:d4:d5:95:86:86:35:
       9d:23:ef:5b:d0:68:b2:35:f6:a3:ae:6d:6c:a6:6d:
       ab:ad:1f:43:a9:e4:a5:7c:a3:07:5f:e3:e6:df:d7:
       f3:49:68:f2:0e:ce:10:d4:48:88:c3:42:8d:35:59:
       6d:f5:67:d5:c3:49:18:4a:15:39:d6:ce:60:a3:05:
       d7:88:71:a8:f2:cd:fd:74:60:ab:32:71:a0:16:f6:
       52:2d:bb:c6:81:ac:c9:dd:9d
   exponent2:
       00:db:9c:da:7f:27:24:70:aa:33:ab:36:58:e4:ec:
       31:c4:b3:e4:83:df:d9:07:43:3c:c2:7e:a7:7e:76:
       74:cf:bf:6b:1c:d3:af:9c:a7:29:b7:ca:e9:50:71:
       ba:24:50:ba:72:7e:64:68:dd:b8:a7:fe:9b:c9:43:
       76:99:5f:f0:5d:87:dc:28:4d:7a:a1:5c:37:6b:ad:
       2c:16:22:75:58:31:03:f2:3e:4f:1f:fc:3f:66:20:
       e2:69:e4:55:16:33:01:c3:53:ec:21:21:94:b1:b0:
       47:84:fa:3b:62:c6:55:ad:85:e2:91:62:44:26:cd:
       06:57:6d:67:48:85:8c:88:dd
   coefficient:
       3f:85:ff:ac:1c:67:ce:50:5b:c9:c0:53:29:00:dd:
       6a:d2:23:1f:f7:73:00:c6:76:6e:0d:44:67:2d:f1:
       93:99:8d:31:e3:8b:2f:68:8c:c3:83:d4:be:e2:32:
       14:50:ff:79:37:85:4b:22:9f:92:c3:32:9f:eb:c9:
       61:86:c7:8b:88:68:b6:ad:e3:49:22:0b:b4:f8:23:
       ae:83:33:b3:f9:f5:eb:aa:77:3d:f0:d0:f0:fe:55:
       4f:a1:ec:64:a2:be:fb:05:0d:dc:92:52:de:db:34:
       ad:00:51:52:e1:74:c2:5f:5b:10:cd:f1:05:74:6f:
       9a:77:5a:e5:87:d5:4f:01
   ```

   当您的私有密钥不用时，请将其保存在安全位置。

1. 使用上一步中创建的私有密钥生成 X.509 证书。在此示例中，该证书在 365 天后过期，在此日期后它将不能是受信任的。请务必相应地设置到期时间。证书必须仅在预调配过程中有效。预调配完成后，可以从 RIR 的记录中删除证书。`tr -d "\n"` 命令从输出中删除换行符。您需要在出现提示时提供公用名称，但其他字段可以留空。

   ```
   $ openssl req -new -x509 -key private-key.pem -days 365 | tr -d "\n" > certificate.pem
   ```

   这会产生类似于下述信息的输出：

   ```
   Enter pass phrase for private-key.pem: {{xxxxxxx}}
   You are about to be asked to enter information that will be incorporated
   into your certificate request.
   What you are about to enter is what is called a Distinguished Name or a DN.
   There are quite a few fields but you can leave some blank
   For some fields there will be a default value,
   If you enter '.', the field will be left blank.
   -----
   Country Name (2 letter code) []:
   State or Province Name (full name) []:
   Locality Name (eg, city) []:
   Organization Name (eg, company) []:
   Organizational Unit Name (eg, section) []:
   Common Name (eg, fully qualified host name) []:{{example.com}}
   Email Address []:
   ```
**注意**  
AWS 预置不需要公用名。其可以是任何内部或公有域名。

   您可以使用以下命令检查证书：

   ```
   $ cat certificate.pem
   ```

   输出应该是一个没有换行符的 PEM 编码的长字符串，前面是 `-----BEGIN CERTIFICATE-----`，后面是 `-----END CERTIFICATE-----`。

## 将 X.509 证书上传到 RIR 中的 RDAP 记录
<a name="byoip-add-certificate"></a>

将之前创建的证书添加到 RIR 的 RDAP 记录。请务必在编码部分前后包含 `-----BEGIN CERTIFICATE-----` 和 `-----END CERTIFICATE-----` 字符串。所有这些内容必须都在单个长线上。更新 RDAP 的过程取决于您的 RIR：
+ 对于 ARIN，使用[客户经理门户](https://account.arin.net/public/secure/dashboard)，在代表您地址范围的“网络信息”对象的“公共注释”部分中添加证书。请勿将其添加到您组织的注释部分。
+ 对于 RIPE，将证书作为新的“descr”字段添加到代表您地址范围的“inetnum”或“inet6num”对象中。通常可在 [RIPE 数据库门户](https://apps.db.ripe.net/db-web-ui/myresources/overview)的“我的资源”部分中了解到相关信息。请勿将其添加到您所在组织的注释部分或上述对象的“备注”字段中。
+ 对于 APNIC，通过编辑“inetnum”或“inet6num”记录上的备注来添加证书。

完成下方预调配阶段后，可从 RIR 的记录中删除证书。

## 在 RIR 中创建 ROA 对象
<a name="byoip-create-roa-object"></a>

创建 ROA 对象以授权 Amazon ASN 16509 和 14618 来公告您的地址范围，以及当前授权的 ASN 来发布该地址范围。对于 AWS GovCloud (US) Regions，请仅授权 ASN 8987。对于 AWS European Sovereign Cloud，请授权 ASN 16509 和 214101。您必须将最大长度设置为您要引入的 CIDR 的大小。您可以引入的最具体 IPv4 前缀是 /24。对于公开发布的 CIDR，可以引入的最具体 IPv6 地址范围是 /48；对于不公开发布的 CIDR，可以引入的最具体 IPv6 地址范围是 /60。

**重要**  
如果您正在为 Amazon VPC IP Address Manager (IPAM) 创建 ROA 对象，则在创建 ROA 时，对于 IPv4 CIDR，必须将 IP 地址前缀的最大长度设置为 `/24`。对于 IPv6 CIDR，如果要将它们添加到可传播池中，IP 地址前缀的最大长度必须为 `/48`。这可以确保您有充分的灵活性来跨 AWS 区域划分您的公有 IP 地址。IPAM 强制执行您设置的最大长度。有关通向 IPAM 的 BYOIP 地址的更多信息，请参阅*《Amazon VPC IPAM 用户指南》*中的[教程：通向 IPAM 的 BYOIP 地址 CIDR](https://docs.aws.amazon.com/vpc/latest/ipam/tutorials-byoip-ipam.html)。

若要 ROA 可用于 Amazon，可能需要多达 24 小时的时间。有关更多信息，请参阅 RIR：
+ ARIN — [ROA 请求](https://www.arin.net/resources/rpki/roarequest.html)
+ RIPE — [管理 ROA](https://www.ripe.net/manage-ips-and-asns/resource-management/rpki/resource-certification-roa-management/)
+ APNIC - [路由管理](https://www.apnic.net/wp-content/uploads/2017/01/route-roa-management-guide.pdf)

将公告从本地工作负载迁移到 AWS 时，在为 Amazon 的 ASN 创建 ROA 之前，您必须为现有的 ASN 创建 ROA。否则，您可能会看到对现有路由和公告的影响。

**重要**  
为了让 Amazon 能够公告并持续公告您的 IP 地址范围，您使用 Amazon ASN 的 ROA 必须符合上述指南。如果 ROA 无效或不符合上述指南，则 Amazon 保留停止公告您的 IP 地址范围的权利。

**注意**  
不公开发布的 IPv6 地址空间不需要完成此步骤。