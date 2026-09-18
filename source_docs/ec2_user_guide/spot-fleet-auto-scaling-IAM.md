

# 竞价型实例集自动扩展所需的 IAM 权限
<a name="spot-fleet-auto-scaling-IAM"></a>

通过结合使用 Amazon EC2、Amazon CloudWatch 和 Application Auto Scaling API 可实现竞价型实例集的自动扩展。通过 Amazon EC2 可创建竞价型实例集请求，通过 CloudWatch 可创建警报，通过 Application Auto Scaling 可创建扩展策略。除[使用竞价型实例集所需的 IAM 权限](spot-fleet-prerequisites.md#spot-fleet-iam-users)和 Amazon EC2 外，访问实例集扩展设置的用户必须具有使用支持自动扩缩的服务的适当权限。

要对竞价型实例集使用自动扩展，用户必须具有使用以下示例策略中所示操作的权限。

------
#### [ JSON ]

****  

```
{
    "Version":"2012-10-17",		 	 	 
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "application-autoscaling:*",
                "ec2:DescribeSpotFleetRequests",
                "ec2:ModifySpotFleetRequest",
                "cloudwatch:DeleteAlarms",
                "cloudwatch:DescribeAlarmHistory",
                "cloudwatch:DescribeAlarms",
                "cloudwatch:DescribeAlarmsForMetric",
                "cloudwatch:GetMetricStatistics",
                "cloudwatch:ListMetrics",
                "cloudwatch:PutMetricAlarm",
                "cloudwatch:DisableAlarmActions",
                "cloudwatch:EnableAlarmActions",
                "iam:CreateServiceLinkedRole",
                "sns:CreateTopic",
                "sns:Subscribe",
                "sns:Get*",
                "sns:List*"
            ],
            "Resource": "*"
        }
    ]
}
```

------

您还可以创建自己的 IAM 策略，从而使 Application Auto Scaling API 调用获得更精细的权限。有关更多信息，请参阅《Application Auto Scaling User Guide》**中的 [Identity and Access Management for Application Auto Scaling](https://docs.aws.amazon.com/autoscaling/application/userguide/auth-and-access-control.html)。

Application Auto Scaling 服务还需要描述竞价型实例集和 CloudWatch 警报的权限，以及代表您修改竞价型实例集目标容量的权限。如果您为竞价型实例集启用自动扩展功能，它将创建一个名为 `AWSServiceRoleForApplicationAutoScaling_EC2SpotFleetRequest` 的服务相关角色。此服务相关角色授予 Application Auto Scaling 权限，以描述策略警报、监控实例集的当前容量以及修改实例集的容量。Application Auto Scaling 的原托管竞价型实例集角色为 `aws-ec2-spot-fleet-autoscale-role`，但今后已不再需要。此服务相关角色是 Application Auto Scaling 的默认角色。有关更多信息，请参阅《Application Auto Scaling 用户指南》**中的 [Application Auto Scaling 的服务相关角色](https://docs.aws.amazon.com/autoscaling/application/userguide/application-auto-scaling-service-linked-roles.html)。