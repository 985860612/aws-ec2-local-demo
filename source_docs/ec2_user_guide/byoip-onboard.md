

# 载入您在 Amazon EC2 中使用的地址范围
<a name="byoip-onboard"></a>

根据您的需求，BYOIP 的载入过程包括以下任务。

**Topics**
+ [在 AWS 中预置公开发布的地址范围](#byoip-provision)
+ [预置不公开发布的 IPv6 地址范围](#byoip-provision-non-public)
+ [通过 AWS 公告地址范围](#byoip-advertise)
+ [取消预配置地址范围](#byoip-deprovision)
+ [验证 BYOIP](#byoip-validation)

## 在 AWS 中预置公开发布的地址范围
<a name="byoip-provision"></a>

预置地址范围与 AWS 配合使用时，您需要确认您控制该地址范围，并授权 Amazon 公告该地址范围。我们还会通过签名授权消息验证您控制该地址范围。该消息是使用在通过 X.509 证书更新 RDAP 记录时使用的自签名 X.509 密钥对签名的。AWS 需要提供给 RIR 的加密签名授权消息。RIR 根据您添加到 RDAP 的证书验证签名，并根据 ROA 检查授权详细信息。

**要预置地址范围**

1. 

**撰写消息**

   撰写明文授权消息。消息的格式如下所示，其中，日期是消息的到期日期：

   ```
   1|aws|{{account}}|{{cidr}}|{{YYYYMMDD}}|SHA256|RSAPSS
   ```

   将账号、地址范围和到期日期替换为您自己的值，以创建类似于以下内容的消息：

   ```
   text_message="1|aws|0123456789AB|198.51.100.0/24|20211231|SHA256|RSAPSS"
   ```

   这不能与外观类似的 ROA 消息混淆。

1. 

**对消息进行签名**

   使用之前创建的私有密钥对明文消息进行签名。此命令返回的签名是一个长字符串，您需要在下一步中使用。
**重要**  
我们建议您复制并粘贴此命令。除消息内容之外，不要修改或替换任何值。

   ```
   signed_message=$( echo -n $text_message | openssl dgst -sha256 -sigopt rsa_padding_mode:pss -sigopt rsa_pss_saltlen:-1 -sign private-key.pem -keyform PEM | openssl base64 | tr -- '+=/' '-_~' | tr -d "\n")
   ```

1. 

**预置地址**

   使用 AWS CLI [provision-byoip-cidr](https://docs.aws.amazon.com/cli/latest/reference/ec2/provision-byoip-cidr.html) 命令预置地址范围。`--cidr-authorization-context` 选项使用之前创建的消息和签名字符串。
**重要**  
如果 BYOIP 范围与 [Configure the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html) `Default region name` 不同，则您必须指定应在其中预置 BYOIP 范围的 AWS 区域。

   ```
   aws ec2 provision-byoip-cidr --cidr {{address-range}} --cidr-authorization-context Message="$text_message",Signature="$signed_message" --region {{us-east-1}}
   ```

   预配置地址范围是一项异步操作，因此该调用会立即返回，但地址范围未准备就绪，直到其状态从 `pending-provision` 更改为 `provisioned` 才可供使用。

1. 

**监控进度**

   虽然大多数预配置将在两小时内完成，但对于公开发布的范围，完成预配置过程可能需要一周时间。使用 [describe-byoip-cidrs](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-byoip-cidrs.html) 命令来监视进度，如下例所示：

   ```
   aws ec2 describe-byoip-cidrs --max-results 5 --region {{us-east-1}}
   ```

   如果在预置过程中出现问题，并且状态变为 `failed-provision`，则您必须在解决问题后再次运行 `provision-byoip-cidr` 命令。

## 预置不公开发布的 IPv6 地址范围
<a name="byoip-provision-non-public"></a>

默认情况下，将预置一个地址范围以公开发布到互联网上。您可以预置不公开发布的 IPv6 地址范围。对于不可公开通告的路由，预置过程通常在几分钟内完成。如果将非公有地址范围的 IPv6 CIDR 块与 VPC 关联，则只能通过支持 IPv6 的混合连接选项（[Direct Connect](https://docs.aws.amazon.com/directconnect/latest/UserGuide/Welcome.html)、[AWS Site-to-Site VPN](https://docs.aws.amazon.com/vpn/latest/s2svpn/VPC_VPN.html) 或 [Amazon VPC Transit Gateway](https://docs.aws.amazon.com/vpc/latest/tgw/what-is-transit-gateway.html)）访问 IPv6 CIDR。

不需要使用 ROA 以预调配非公有地址范围。

**重要**  
只能指定在预置期间是否公开发布地址范围。您以后无法更改可发布状态。
Amazon VPC 不支持[唯一本地地址](https://en.wikipedia.org/wiki/Unique_local_address)（ULA）CIDR。所有 VPC 都必须具有唯一的 IPv6 CIDR。两个 VPC 不能具有相同的 IPv6 网域范围。

要预置不公开发布的 IPv6 地址范围，请使用以下 [provision-byoip-cidr](https://docs.aws.amazon.com/cli/latest/reference/ec2/provision-byoip-cidr.html) 命令。

```
aws ec2 provision-byoip-cidr --cidr {{address-range}} --cidr-authorization-context Message="$text_message",Signature="$signed_message" --no-publicly-advertisable --region {{us-east-1}}
```

## 通过 AWS 公告地址范围
<a name="byoip-advertise"></a>

预配置地址范围后，即可对其进行公告。您必须公告预配置的确切地址范围。您不能只公告预配置的地址范围的一部分。

如果您预置不公告的 IPv6 地址范围，则无需完成该步骤。

在通过 AWS 公告地址范围之前，建议您停止从其他位置公告该地址范围或该范围的任何部分。如果您一直从其他位置公告 IP 地址范围或该范围的任何部分，我们将无法为其提供可靠支持或解决问题。具体来说，我们无法保证到地址范围或该范围的一部分的流量进入我们的网络。

为最大限度地减少停机时间，您可以在公告之前将 AWS 资源配置为使用地址池中的某一地址，然后停止从当前位置公告该地址并同时开始通过 AWS 公告该地址。有关从地址池分配弹性 IP 地址的更多信息，请参阅[分配弹性 IP 地址](working-with-eips.md#using-instance-addressing-eips-allocating)。

**限制**
+ 您最多只能每 10 秒运行一次 **advertise-byoip-cidr** 命令，即使每次指定不同的地址范围也是如此。
+ 您最多只能每 10 秒运行一次 **withdraw-byoip-cidr** 命令，即使每次指定不同的地址范围也是如此。

要公告地址范围，请使用以下 [advertise-byoip-cidr](https://docs.aws.amazon.com/cli/latest/reference/ec2/advertise-byoip-cidr.html) 命令。

```
aws ec2 advertise-byoip-cidr --cidr {{address-range}} --region {{us-east-1}}
```

要停止公告地址范围，请使用以下 [withdraw-byoip-cidr](https://docs.aws.amazon.com/cli/latest/reference/ec2/withdraw-byoip-cidr.html) 命令。

```
aws ec2 withdraw-byoip-cidr --cidr {{address-range}} --region {{us-east-1}}
```

**注意**  
在 `eu-central-1-ist-1` 本地区域中，公告和撤回是异步操作。操作完成之前，地址范围进入 `pending-advertising` 或 `pending-withdrawal` 状态。有关更多信息，请参阅[本地区域可用性](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-byoip.html#byoip-zone-avail)。

## 取消预配置地址范围
<a name="byoip-deprovision"></a>

要停止在 AWS 上使用您的地址范围，请先释放任何弹性 IP 地址，并取消关联仍从地址池中分配的任何 IPv6 CIDR 块。接下来，停止公告该地址范围，并最终取消预置该地址范围。

您无法取消预置地址范围的一部分。如果要在 AWS 上使用更具体的地址范围，请取消预置整个地址范围，并预置一个更具体的地址范围。

(IPv4) 要释放每个弹性 IP 地址，请使用以下 [release-address](https://docs.aws.amazon.com/cli/latest/reference/ec2/release-address.html) 命令。

```
aws ec2 release-address --allocation-id {{eipalloc-12345678abcabcabc}} --region {{us-east-1}}
```

(IPv6) 要取消关联 IPv6 CIDR 块，请使用以下 [disassociate-vpc-cidr-block](https://docs.aws.amazon.com/cli/latest/reference/ec2/disassociate-vpc-cidr-block.html) 命令。

```
aws ec2 disassociate-vpc-cidr-block --association-id {{vpc-cidr-assoc-12345abcd1234abc1}} --region {{us-east-1}}
```

要停止公告地址范围，请使用以下 [withdraw-byoip-cidr](https://docs.aws.amazon.com/cli/latest/reference/ec2/withdraw-byoip-cidr.html) 命令。

```
aws ec2 withdraw-byoip-cidr --cidr {{address-range}} --region {{us-east-1}}
```

要取消预置地址范围，请使用以下 [deprovision-byoip-cidr](https://docs.aws.amazon.com/cli/latest/reference/ec2/deprovision-byoip-cidr.html) 命令。

```
aws ec2 deprovision-byoip-cidr --cidr {{address-range}} --region {{us-east-1}}
```

取消预置地址范围最多可能需要一天的时间。

## 验证 BYOIP
<a name="byoip-validation"></a>

1. 验证自签名 x.509 密钥对

   通过 whois 命令验证证书是否已上传且有效。

   对于 ARIN，使用 `whois -h whois.arin.net r + {{2001:0DB8:6172::/48}}` 查找地址范围的 RDAP 记录。检查命令输出中 `NetRange`（网络范围）的 `Public Comments` 部分。应将证书添加到地址范围的 `Public Comments` 部分。

   您可以使用以下命令检查包含证书的 `Public Comments`：

   ```
   whois -h whois.arin.net r + {{2001:0DB8:6172::/48}} | grep Comments | grep BEGIN
   ```

   这会返回包含密钥内容的输出，应类似于以下内容：

   ```
   Public Comments:
   -----BEGIN CERTIFICATE-----
   MIID1zCCAr+gAwIBAgIUBkRPNSLrPqbRAFP8RDAHSP+I1TowDQYJKoZIhvcNAQE
   LBQAwezELMAkGA1UEBhMCTloxETAPBgNVBAgMCEF1Y2tsYW5kMREwDwYDVQQHDA
   hBdWNrbGFuZDEcMBoGA1UECgwTQW1hem9uIFdlYiBTZXJ2aWNlczETMBEGA1UEC
   wwKQllPSVAgRGVtbzETMBEGA1UEAwwKQllPSVAgRGVtbzAeFw0yMTEyMDcyMDI0
   NTRaFw0yMjEyMDcyMDI0NTRaMHsxCzAJBgNVBAYTAk5aMREwDwYDVQQIDAhBdWN
   rbGFuZDERMA8GA1UEBwwIQXVja2xhbmQxHDAaBgNVBAoME0FtYXpvbiBXZWIgU2
   VydmljZXMxEzARBgNVBAsMCkJZT0lQIERlbW8xEzARBgNVBAMMCkJZT0lQIERlb
   W8wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCfmacvDp0wZ0ceiXXc
   R/q27mHI/U5HKt7SST4X2eAqufR9wXkfNanAEskgAseyFypwEEQr4CJijI/5hp9
   prh+jsWHWwkFRoBRR9FBtwcU/45XDXLga7D3stsI5QesHVRwOaXUdprAnndaTug
   mDPkD0vrl475JWDSIm+PUxGWLy+60aBqiaZq35wU/x+wXlAqBXg4MZK2KoUu27k
   Yt2zhmy0S7Ky+oRfRJ9QbAiSu/RwhQbh5Mkp1ZnVIc7NqnhdeIW48QaYjhMlUEf
   xdaqYUinzz8KpjfADZ4Hvqj9jWZ/eXo/9b2rGlHWkJsbhr0VEUyAGu1bwkgcdww
   3A7NjOxQbAgMBAAGjUzBRMB0GA1UdDgQWBBStFyujN6SYBr2glHpGt0XGF7GbGT
   AfBgNVHSMEGDAWgBStFyujN6SYBr2glHpGt0XGF7GbGTAPBgNVHRMBAf8EBTADA
   QH/MA0GCSqGSIb3DQEBCwUAA4IBAQBX6nn6YLhz521lfyVfxY0t6o3410bQAeAF
   08ud+ICtmQ4IO4A4B7zV3zIVYr0clrOOaFyLxngwMYN0XY5tVhDQqk4/gmDNEKS
   Zy2QkX4Eg0YUWVzOyt6fPzjOvJLcsqc1hcF9wySL507XQz76Uk5cFypBOzbnk35
   UkWrzA9KK97cXckfIESgK/k1N4ecwxwG6VQ8mBGqVpPpey+dXpzzzv1iBKN/VY4
   ydjgH/LBfdTsVarmmy2vtWBxwrqkFvpdhSGCvRDl/qdO/GIDJi77dmZWkh/ic90
   MNk1f38gs1jrCj8lThoar17Uo9y/Q5qJIsoNPyQrJRzqFU9F3FBjiPJF
   -----END CERTIFICATE-----
   ```

   对于 RIPE，使用 `whois -r -h whois.ripe.net {{2001:0DB8:7269::/48}}` 查找地址范围的 RDAP 记录。检查命令输出中 `inetnum` 对象（网络范围）的 `descr` 部分。应将证书添加为地址范围的新 `descr` 字段。

   您可以使用以下命令检查包含证书的 `descr`：

   ```
   whois -r -h whois.ripe.net {{2001:0DB8:7269::/48}} | grep descr | grep BEGIN
   ```

   这会返回包含密钥内容的输出，应类似于以下内容：

   ```
   descr:
   -----BEGIN CERTIFICATE-----MIID1zCCAr+gAwIBAgIUBkRPNSLrPqbRAFP8
   RDAHSP+I1TowDQYJKoZIhvcNAQELBQAwezELMAkGA1UEBhMCTloxETAPBgNVBAg
   MCEF1Y2tsYW5kMREwDwYDVQQHDAhBdWNrbGFuZDEcMBoGA1UECgwTQW1hem9uIF
   dlYiBTZXJ2aWNlczETMBEGA1UECwwKQllPSVAgRGVtbzETMBEGA1UEAwwKQllPS
   VAgRGVtbzAeFw0yMTEyMDcyMDI0NTRaFw0yMjEyMDcyMDI0NTRaMHsxCzAJBgNV
   BAYTAk5aMREwDwYDVQQIDAhBdWNrbGFuZDERMA8GA1UEBwwIQXVja2xhbmQxHDA
   aBgNVBAoME0FtYXpvbiBXZWIgU2VydmljZXMxEzARBgNVBAsMCkJZT0lQIERlbW
   8xEzARBgNVBAMMCkJZT0lQIERlbW8wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwg
   gEKAoIBAQCfmacvDp0wZ0ceiXXcR/q27mHI/U5HKt7SST4X2eAqufR9wXkfNanA
   EskgAseyFypwEEQr4CJijI/5hp9prh+jsWHWwkFRoBRR9FBtwcU/45XDXLga7D3
   stsI5QesHVRwOaXUdprAnndaTugmDPkD0vrl475JWDSIm+PUxGWLy+60aBqiaZq
   35wU/x+wXlAqBXg4MZK2KoUu27kYt2zhmy0S7Ky+oRfRJ9QbAiSu/RwhQbh5Mkp
   1ZnVIc7NqnhdeIW48QaYjhMlUEfxdaqYUinzz8KpjfADZ4Hvqj9jWZ/eXo/9b2r
   GlHWkJsbhr0VEUyAGu1bwkgcdww3A7NjOxQbAgMBAAGjUzBRMB0GA1UdDgQWBBS
   tFyujN6SYBr2glHpGt0XGF7GbGTAfBgNVHSMEGDAWgBStFyujN6SYBr2glHpGt0
   XGF7GbGTAPBgNVHRMBAf8EBTADAQH/MA0GCSqGSIb3DQEBCwUAA4IBAQBX6nn6Y
   Lhz521lfyVfxY0t6o3410bQAeAF08ud+ICtmQ4IO4A4B7zV3zIVYr0clrOOaFyL
   xngwMYN0XY5tVhDQqk4/gmDNEKSZy2QkX4Eg0YUWVzOyt6fPzjOvJLcsqc1hcF9
   wySL507XQz76Uk5cFypBOzbnk35UkWrzA9KK97cXckfIESgK/k1N4ecwxwG6VQ8
   mBGqVpPpey+dXpzzzv1iBKN/VY4ydjgH/LBfdTsVarmmy2vtWBxwrqkFvpdhSGC
   vRDl/qdO/GIDJi77dmZWkh/ic90MNk1f38gs1jrCj8lThoar17Uo9y/Q5qJIsoN
   PyQrJRzqFU9F3FBjiPJF
   -----END CERTIFICATE-----
   ```

   对于 APNIC，使用 `whois -h whois.apnic.net {{2001:0DB8:6170::/48}}` 查找 BYOIP 地址范围的 RDAP 记录。检查命令输出中 `inetnum` 对象（网络范围）的 `remarks` 部分。应将证书添加为地址范围的新 `remarks` 字段。

   您可以使用以下命令检查包含证书的 `remarks`：

   ```
   whois -h whois.apnic.net {{2001:0DB8:6170::/48}} | grep remarks | grep BEGIN
   ```

   这会返回包含密钥内容的输出，应类似于以下内容：

   ```
   remarks:
   -----BEGIN CERTIFICATE-----
   MIID1zCCAr+gAwIBAgIUBkRPNSLrPqbRAFP8RDAHSP+I1TowDQYJKoZIhvcNAQE
   LBQAwezELMAkGA1UEBhMCTloxETAPBgNVBAgMCEF1Y2tsYW5kMREwDwYDVQQHDA
   hBdWNrbGFuZDEcMBoGA1UECgwTQW1hem9uIFdlYiBTZXJ2aWNlczETMBEGA1UEC
   wwKQllPSVAgRGVtbzETMBEGA1UEAwwKQllPSVAgRGVtbzAeFw0yMTEyMDcyMDI0
   NTRaFw0yMjEyMDcyMDI0NTRaMHsxCzAJBgNVBAYTAk5aMREwDwYDVQQIDAhBdWN
   rbGFuZDERMA8GA1UEBwwIQXVja2xhbmQxHDAaBgNVBAoME0FtYXpvbiBXZWIgU2
   VydmljZXMxEzARBgNVBAsMCkJZT0lQIERlbW8xEzARBgNVBAMMCkJZT0lQIERlb
   W8wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCfmacvDp0wZ0ceiXXc
   R/q27mHI/U5HKt7SST4X2eAqufR9wXkfNanAEskgAseyFypwEEQr4CJijI/5hp9
   prh+jsWHWwkFRoBRR9FBtwcU/45XDXLga7D3stsI5QesHVRwOaXUdprAnndaTug
   mDPkD0vrl475JWDSIm+PUxGWLy+60aBqiaZq35wU/x+wXlAqBXg4MZK2KoUu27k
   Yt2zhmy0S7Ky+oRfRJ9QbAiSu/RwhQbh5Mkp1ZnVIc7NqnhdeIW48QaYjhMlUEf
   xdaqYUinzz8KpjfADZ4Hvqj9jWZ/eXo/9b2rGlHWkJsbhr0VEUyAGu1bwkgcdww
   3A7NjOxQbAgMBAAGjUzBRMB0GA1UdDgQWBBStFyujN6SYBr2glHpGt0XGF7GbGT
   AfBgNVHSMEGDAWgBStFyujN6SYBr2glHpGt0XGF7GbGTAPBgNVHRMBAf8EBTADA
   QH/MA0GCSqGSIb3DQEBCwUAA4IBAQBX6nn6YLhz521lfyVfxY0t6o3410bQAeAF
   08ud+ICtmQ4IO4A4B7zV3zIVYr0clrOOaFyLxngwMYN0XY5tVhDQqk4/gmDNEKS
   Zy2QkX4Eg0YUWVzOyt6fPzjOvJLcsqc1hcF9wySL507XQz76Uk5cFypBOzbnk35
   UkWrzA9KK97cXckfIESgK/k1N4ecwxwG6VQ8mBGqVpPpey+dXpzzzv1iBKN/VY4
   ydjgH/LBfdTsVarmmy2vtWBxwrqkFvpdhSGCvRDl/qdO/GIDJi77dmZWkh/ic90
   MNk1f38gs1jrCj8lThoar17Uo9y/Q5qJIsoNPyQrJRzqFU9F3FBjiPJF
   -----END CERTIFICATE-----
   ```

1. 验证 ROA 对象创建

   使用 RIPEstat Data API 验证 ROA 对象是否成功创建。请务必根据 Amazon ASN 16509 和 14618 以及当前授权公告地址范围的 ASN 来测试地址范围。对于 AWS GovCloud (US) Regions，请针对 ASN 8987 进行测试。对于 AWS European Sovereign Cloud，请针对 ASN 16509 和 214101 进行测试。

   您可以使用以下命令，通过地址范围检查不同 Amazon ASN 的 ROA 对象：

   ```
   curl --location --request GET "https://stat.ripe.net/data/rpki-validation/data.json?resource={{ASN}}&prefix={{CIDR}}
   ```

   在此示例输出中，Amazon ASN 16509 的响应结果为 `"status": "valid"`。这表示该地址范围的 ROA 对象已成功创建：

   ```
   {
       "messages": [],
       "see_also": [],
       "version": "0.3",
       "data_call_name": "rpki-validation",
       "data_call_status": "supported",
       "cached": false,
       "data": {
           "validating_roas": [
               {
                   "origin": "16509",
                   "prefix": "2001:0DB8::/32",
                   "max_length": 48,
                   "validity": "valid"
               },
               {
                   "origin": "14618",
                   "prefix": "2001:0DB8::/32",
                   "max_length": 48,
                   "validity": "invalid_asn"
               },
               {
                   "origin": "64496",
                   "prefix": "2001:0DB8::/32",
                   "max_length": 48,
                   "validity": "invalid_asn"
               }
           ],
           "status": "valid",
           "validator": "routinator",
           "resource": "16509",
           "prefix": "2001:0DB8::/32"
       },
       "query_id": "20230224152430-81e6384e-21ba-4a86-852a-31850787105f",
       "process_time": 58,
       "server_id": "app116",
       "build_version": "live.2023.2.1.142",
       "status": "ok",
       "status_code": 200,
       "time": "2023-02-24T15:24:30.773654"
   }
   ```

`“unknown”` 状态表示该地址范围的 ROA 对象尚未创建。`“invalid_asn”` 状态表示该地址范围的 ROA 对象尚未成功创建。