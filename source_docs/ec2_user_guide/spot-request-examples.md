

# 竞价型实例请求示例启动规范
<a name="spot-request-examples"></a>

以下示例显示了可与 [request-spot-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/request-spot-instances.html) 命令结合使用来创建竞价型实例请求的启动配置。有关更多信息，请参阅 [管理您的竞价型实例](using-spot-instances-request.md)。

**重要**  
我们强烈反对使用 [request-spot-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/request-spot-instances.html) 命令来请求竞价型实例，因为它是不具有计划投资的旧式 API。有关更多信息，请参阅 [使用哪种竞价型请求方法最好？](spot-best-practices.md#which-spot-request-method-to-use)

**Topics**
+ [示例 1：启动竞价型实例](#spot-launch-specification1)
+ [示例 2：在指定的可用区中启动竞价型实例](#spot-launch-specification2)
+ [示例 3：在指定的子网中启动竞价型实例](#spot-launch-specification3)
+ [示例 4：启动专用竞价型实例](#spot-launch-specification4)

## 示例 1：启动竞价型实例
<a name="spot-launch-specification1"></a>

以下示例不包含可用区或子网。Amazon EC2 会为您选择可用区。Amazon EC2 会在所选可用区的默认子网中启动实例。

```
{
  "ImageId": "ami-0abcdef1234567890",
  "KeyName": "my-key-pair",
  "SecurityGroupIds": [ "sg-1a2b3c4d5e6f7g8h9" ],
  "InstanceType": "m5.medium",
  "IamInstanceProfile": {
      "Arn": "arn:aws:iam::123456789012:instance-profile/my-iam-role"
  }
}
```

## 示例 2：在指定的可用区中启动竞价型实例
<a name="spot-launch-specification2"></a>

以下示例包括一个可用区。Amazon EC2 会在指定可用区的默认子网中启动实例。

```
{
  "ImageId": "ami-0abcdef1234567890",
  "KeyName": "my-key-pair",
  "SecurityGroupIds": [ "sg-1a2b3c4d5e6f7g8h9" ],
  "InstanceType": "m5.medium",
  "Placement": {
    "AvailabilityZone": "us-west-2a"
  },
  "IamInstanceProfile": {
      "Arn": "arn:aws:iam::123456789012:instance-profile/my-iam-role"
  }
}
```

## 示例 3：在指定的子网中启动竞价型实例
<a name="spot-launch-specification3"></a>

以下示例包括子网。Amazon EC2 会在指定子网中启动实例。如果 VPC 是一个非默认 VPC，则默认情况下，该实例不会收到公有 IPv4 地址。

```
{
  "ImageId": "ami-0abcdef1234567890",
  "SecurityGroupIds": [ "sg-1a2b3c4d5e6f7g8h9" ],
  "InstanceType": "m5.medium",
  "SubnetId": "subnet-1a2b3c4d",
  "IamInstanceProfile": {
      "Arn": "arn:aws:iam::123456789012:instance-profile/my-iam-role"
  }
}
```

要将公有 IPv4 地址分配给非默认 VPC 中的实例，请指定 `AssociatePublicIpAddress` 字段，如以下示例所示。指定网络接口时，您必须包含使用网络接口 (而不是使用之前的代码块中所示的 `SubnetId` 和 `SecurityGroupIds` 字段) 的子网 ID 和安全组 ID。

```
{
  "ImageId": "ami-0abcdef1234567890",
  "KeyName": "my-key-pair",
  "InstanceType": "m5.medium",
  "NetworkInterfaces": [
    {
      "DeviceIndex": 0,
      "SubnetId": "subnet-1a2b3c4d5e6f7g8h9",
      "Groups": [ "sg-1a2b3c4d5e6f7g8h9" ],
      "AssociatePublicIpAddress": true
    }
  ],
  "IamInstanceProfile": {
      "Arn": "arn:aws:iam::123456789012:instance-profile/my-iam-role"
  }
}
```

## 示例 4：启动专用竞价型实例
<a name="spot-launch-specification4"></a>

以下示例请求租赁为 `dedicated` 的竞价型实例。专用竞价型实例必须在 VPC 中启动。

```
{
  "ImageId": "ami-0abcdef1234567890",
  "KeyName": "my-key-pair",
  "SecurityGroupIds": [ "sg-1a2b3c4d5e6f7g8h9" ],
  "InstanceType": "c5.8xlarge",
  "SubnetId": "subnet-1a2b3c4d5e6f7g8h9",
  "Placement": {
    "Tenancy": "dedicated"
  }
}
```