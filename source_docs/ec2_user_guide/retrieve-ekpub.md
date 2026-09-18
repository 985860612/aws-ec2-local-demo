

# 检索 EC2 实例的公有认可密钥
<a name="retrieve-ekpub"></a>

您可以随时安全地检索实例的公有认可密钥。

------
#### [ AWS CLI ]

**检索实例的公有认可密钥**  
使用 [get-instance-tpm-ek-pub](https://docs.aws.amazon.com/cli/latest/reference/ec2/get-instance-tpm-ek-pub.html) 命令。

**示例 1**  
以下示例以 `tpmt` 格式获取指定实例的 `rsa-2048` 公有认可密钥。

```
aws ec2 get-instance-tpm-ek-pub \
    --instance-id {{i-1234567890abcdef0}} \
    --key-format tpmt \ 
    --key-type rsa-2048
```

下面是示例输出。

```
{
    "InstanceId": "i-01234567890abcdef",
    "KeyFormat": "tpmt",
    "KeyType": "rsa-2048",
    "KeyValue": "AAEACwADALIAIINxl2dEhLEXAMPLEUal1yT9UtduBlILZPKh2hszFGmqAAYAgABDA
    EXAMPLEAAABAOiRd7WmgtdGNoV1h/AxmW+CXExblG8pEUfNm0LOLiYnEXAMPLERqApiFa/UhvEYqN4
    Z7jKMD/usbhsQaAB1gKA5RmzuhSazHQkax7EXAMPLEzDthlS7HNGuYn5eG7qnJndRcakS+iNxT8Hvf
    0S1ZtNuItMs+Yp4SO6aU28MT/JZkOKsXIdMerY3GdWbNQz9AvYbMEXAMPLEPyHfzgVO0QTTJVGdDxh
    vxtXCOu9GYf0crbjEXAMPLEd4YTbWdDdgOKWF9fjzDytJSDhrLAOUctNzHPCd/92l5zEXAMPLEOIFA
    Ss50C0/802c17W2pMSVHvCCa9lYCiAfxH/vYKovAAE="
}
```

**示例 2**  
以下示例以 `der` 格式获取指定实例的 `rsa-2048` 公有认可密钥。

```
aws ec2 get-instance-tpm-ek-pub \
    --instance-id {{i-1234567890abcdef0}} \
    --key-format der \ 
    --key-type rsa-2048
```

下面是示例输出。

```
{
    "InstanceId": "i-1234567890abcdef0",
    "KeyFormat": "der",
    "KeyType": "rsa-2048",
    "KeyValue": "MIIBIjANBgEXAMPLEw0BAQEFAAOCAQ8AMIIBCgKCAQEA6JF3taEXAMPLEXWH8DGZb4
    JcTFuUbykRR82bQs4uJifaKSOv5NGoEXAMPLEG8Rio3hnuMowP+6xuGxBoAHWAoDlGbO6FJrMdEXAMP
    LEnYUHvMO2GVLsc0a5ifl4buqcmd1FxqRL6I3FPwe9/REXAMPLE0yz5inhI7ppTbwxP8lmQ4qxch0x6
    tjcZ1Zs1DP0EXAMPLERUYLQ/Id/OBU7RBNMlUZ0PGG/G1cI670Zh/RytuOdx9iEXAMPLEtZ0N2A4pYX
    1+PMPK0lIOGssA5Ry03Mc8J3/3aXnOD2/ASRQ4gUBKznQLT/zTZEXAMPLEJUe8IJr2VgKIB/Ef+9gqi
    8AAQIDAQAB"
}
```

------
#### [ PowerShell ]

**检索实例的公有认可密钥**  
使用 [Get-EC2InstanceTpmEkPub](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2InstanceTpmEkPub.html) cmdlet。

**示例 1**  
以下示例以 `tpmt` 格式获取指定实例的 `rsa-2048` 公有认可密钥。

```
Get-EC2InstanceTpmEkPub `
    -InstanceId {{i-1234567890abcdef0}} `
    -KeyFormat tpmt `
    -KeyType rsa-2048
```

**示例 2**  
以下示例以 `der` 格式获取指定实例的 `rsa-2048` 公有认可密钥。

```
Get-EC2InstanceTpmEkPub `
    -InstanceId {{i-1234567890abcdef0}} `
    -KeyFormat der `
    -KeyType rsa-2048
```

------