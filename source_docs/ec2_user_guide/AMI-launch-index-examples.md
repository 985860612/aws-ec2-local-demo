

# 识别在单个请求中启动的每个实例
<a name="AMI-launch-index-examples"></a>

本示例演示如何使用用户数据和实例元数据来配置 Amazon EC2 实例。

**注意**  
本部分中的示例使用 IMDS 的 IPv4 地址：`169.254.169.254`。如果要通过 IPv6 地址检索 EC2 实例的实例元数据，请确保启用并改用 IPv6 地址：`[fd00:ec2::254]`。IMDS 的 IPv6 地址与 IMDSv2 命令兼容。IPv6 地址仅可在[支持 IPv6 的子网](https://docs.aws.amazon.com/vpc/latest/userguide/configure-subnets.html#subnet-ip-address-range)（双栈或仅 IPv6）中[基于 Nitro 的实例](instance-types.md#instance-hypervisor-type)上访问。

Alice 想要启动她最喜欢的数据库 AMI 的四个实例，第一个实例用作原始实例，其余三个用作副本。当她启动它们时，她想为每个副本添加有关复制策略的用户数据。她知道这些数据将对所有四个实例都可用，因此她所采用的用户数据构建方式必须能够让每个实例识别出哪些部分适用于自己。她可通过 `ami-launch-index` 实例元数据值来实现这一点，该值对每个实例都是唯一的。如果她同时启动多个实例，则 `ami-launch-index` 表示实例启动的顺序。第一个启动的实例的值是 `0`。

以下是 Alice 构建的用户数据。

```
replicate-every=1min | replicate-every=5min | replicate-every=10min
```

`replicate-every=1min` 数据定义第一个副本的配置，`replicate-every=5min` 定义第二个副本的配置，以此类推。Alice 决定以 ASCII 字符串形式提供这些数据，用竖线符号 (`|`) 来分隔每个实例的数据。

Alice 使用 [run-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/run-instances.html) 命令启动 4 个实例，并指定用户数据。

```
aws ec2 run-instances \
    --image-id {{ami-0abcdef1234567890}} \
    --count 4 \
    --instance-type t2.micro \
    --user-data "replicate-every=1min | replicate-every=5min | replicate-every=10min"
```

实例启动之后，所有实例都有以下用户数据和常用元数据的副本：
+ AMI ID：ami-0abcdef1234567890
+ 预留 ID：r-1234567890abcabc0
+ 公有密钥：无 
+ 安全组名称：默认值
+ 实例类型：t2.micro

但是，每个实例都有唯一的元数据，如下表所示。


| 元数据 | 值 | 
| --- | --- | 
| instance-id | i-1234567890abcdef0 | 
| ami-launch-index | 0 | 
| public-hostname | ec2-203-0-113-25.compute-1.amazonaws.com | 
| public-ipv4 | 67.202.51.223 | 
| local-hostname | ip-10-251-50-12.ec2.internal | 
| local-ipv4 | 10.251.50.35 | 


| 元数据 | 值 | 
| --- | --- | 
| instance-id | i-0598c7d356eba48d7 | 
| ami-launch-index | 1 | 
| public-hostname | ec2-67-202-51-224.compute-1.amazonaws.com | 
| public-ipv4 | 67.202.51.224 | 
| local-hostname | ip-10-251-50-36.ec2.internal | 
| local-ipv4 | 10.251.50.36 | 


| 元数据 | 值 | 
| --- | --- | 
| instance-id | i-0ee992212549ce0e7 | 
| ami-launch-index | 2 | 
| public-hostname | ec2-67-202-51-225.compute-1.amazonaws.com | 
| public-ipv4 | 67.202.51.225 | 
| local-hostname | ip-10-251-50-37.ec2.internal | 
| local-ipv4 | 10.251.50.37 | 


| 元数据 | 值 | 
| --- | --- | 
| instance-id | i-1234567890abcdef0 | 
| ami-launch-index | 3 | 
| public-hostname | ec2-67-202-51-226.compute-1.amazonaws.com | 
| public-ipv4 | 67.202.51.226 | 
| local-hostname | ip-10-251-50-38.ec2.internal | 
| local-ipv4 | 10.251.50.38 | 

Alice 可以使用 `ami-launch-index` 值确定用户数据的哪个部分适用于特定实例。

1. 她连接到其中一个实例并检索该实例的 `ami-launch-index`，以确保该实例是副本之一：

------
#### [ IMDSv2 ]

   ```
   [ec2-user ~]$ TOKEN=`curl -X PUT "http://169.254.169.254/latest/meta-data/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"` \
   && curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/ami-launch-index
   2
   ```

   对于以下步骤，IMDSv2 请求使用前面的 IMDSv2 命令中存储的令牌，并假设令牌尚未过期。

------
#### [ IMDSv1 ]

   ```
   [ec2-user ~]$ curl http://169.254.169.254/latest/meta-data/ami-launch-index
   2
   ```

------

1. 她将 `ami-launch-index` 保存为一个变量。

------
#### [ IMDSv2 ]

   ```
   [ec2-user ~]$ ami_launch_index=`curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/ami-launch-index`
   ```

------
#### [ IMDSv1 ]

   ```
   [ec2-user ~]$ ami_launch_index=`curl http://169.254.169.254/latest/meta-data/ami-launch-index`
   ```

------

1. 她将用户数据保存为一个变量。

------
#### [ IMDSv2 ]

   ```
   [ec2-user ~]$ user_data=`curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/user-data`
   ```

------
#### [ IMDSv1 ]

   ```
   [ec2-user ~]$ user_data=`curl http://169.254.169.254/latest/user-data`
   ```

------

1. 最后，Alice 使用 **cut** 命令提取适用于该实例的用户数据部分。

------
#### [ IMDSv2 ]

   ```
   [ec2-user ~]$ echo $user_data | cut -d"|" -f"$ami_launch_index"
   replicate-every=5min
   ```

------
#### [ IMDSv1 ]

   ```
   [ec2-user ~]$ echo $user_data | cut -d"|" -f"$ami_launch_index"
   replicate-every=5min
   ```

------