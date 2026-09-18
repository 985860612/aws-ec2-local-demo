

# 跟踪 Amazon EC2 免费套餐使用情况
<a name="ec2-free-tier-usage"></a>

创建 AWS 账户后，您可以通过 [AWS 免费套餐](https://aws.amazon.com/free)开始免费使用 Amazon EC2。根据您是在 2025 年 7 月 15 日之前创建的账户，还是在 2025 年 7 月 15 日当天或之后创建的账户，免费套餐权益会有所不同。有关更多信息，请参阅《AWS Billing User Guide》**中的 [Explore AWS services with AWS Free Tier](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/free-tier.html)。

## 2025 年 7 月 15 日之前和之后的免费套餐权益
<a name="ec2-free-tier-comparison"></a>

下表根据您的 AWS 账户创建日期比较免费套餐权益：


| 免费套餐权益 | 2025 年 7 月 15 日之前创建的账户 | 2025 年 7 月 15 日当天或之后创建的账户 | 
| --- | --- | --- | 
| 标记为符合免费套餐资格的实例类型 | `t2.micro`, `t3.micro` | `t3.micro`, `t3.small`, `t4g.micro`, `t4g.small`, `c7i-flex.large`, `m7i-flex.large` | 
| 标记为符合免费套餐资格的 Amazon EBS 卷类型 | `standard``st1`、`sc1`、`gp2`、和 `gp3` | `standard``st1`、`sc1`、`gp2`、和 `gp3` | 
| 标记为符合免费套餐资格的 AMI | 检查标记为符合免费套餐资格的 AMI。 | 检查标记为符合免费套餐资格的 AMI。 | 
| 使用量限制 | 有使用量限制，超出之后按实际使用量付费。 | 获得 100 美元的注册服务抵扣金，并可赚取最高 100 美元的额外服务抵扣金。 | 
| 免费套餐时长 | 您的免费套餐自账户创建之日起有效期为 12 个月。在此期间，如果超出免费套餐的使用量限制，将按实际使用量付费。 | 您的免费套餐自账户创建之日起有效期为 6 个月，或直到服务抵扣金用完为止，以先发生者为准。您不能超出免费套餐限制。 | 

**列出符合免费套餐资格的实例类型**  
使用 [describe-instance-types](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instance-types.html) 命令和 `free-tier-eligible` 筛选条件。

```
aws ec2 describe-instance-types \
    --filters Name=free-tier-eligible,Values=true \
    --query "InstanceTypes[*].[InstanceType]" \
    --output text | sort
```

**列出符合免费套餐资格的 AMI**  
使用 [describe-images](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-images.html) 命令和 `free-tier-eligible` 筛选条件。

```
aws ec2 describe-images \
    --filters Name=free-tier-eligible,Values=true \
    --query "Images[*].[ImageId]" \
    --output text | sort
```

## 跟踪 2025 年 7 月 15 日之前创建账户的免费套餐使用情况
<a name="track-ec2-free-tier-usage"></a>

**注意**  
***本部分仅适用于在 2025 年 7 月 15 日之前创建 AWS 账户的免费套餐用户。如果您在 2025 年 7 月 15 日当天或之后创建账户，请参阅《AWS Billing User Guide》中的 [Tracking your AWS Free Tier usage](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/tracking-free-tier-usage.html)。***

如果您是在 2025 年 7 月 15 日之前创建的账户，成为 AWS 客户未满 12 个月，且未超出 AWS Free Tier使用限制，则可以使用 Amazon EC2，而无需支付任何费用。请务必跟踪您的免费套餐使用情况，以防止账单意外超限。如果超出免费套餐限制，则您需要按标准的即用即付费率付费。有关更多信息，请参阅 [AWS Free Tier](https://aws.amazon.com/free/)。

**注意**  
如果您成为 AWS 客户超过 12 个月，则将不再符合免费套餐使用条件，并且看不到如下过程中描述的 **EC2 免费套餐**方框。

**要跟踪您的免费套餐使用情况**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **EC2 控制面板**。

1. 找到（右上角的）**EC2 免费套餐**方框。  
![EC2 控制面板中的“EC2 免费套餐”方框。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/ec2-free-tier-widget.png)

1. 在 **EC2 免费套餐**方框中，选中您的免费套餐使用情况，如下所示：
   + 在**正在使用的 EC2 免费套餐服务**下方，注意以下警告：
     + **月末预测** – 此警告表明，如果您继续当前的使用模式，本月将产生费用。
     + **超出免费套餐** – 此警告表明您已超出免费套餐限制，并且已经产生费用。
   + 在**服务使用情况（每月）**下方，注意您的 Linux 实例、Windows 实例和 EBS 存储空间的使用情况。此百分比表示您本月已使用的数量在免费套餐限制中所占的比重。如果达到 100%，您需要为进一步的使用支付费用。
**注意**  
只有当您创建一个实例之后，才会显示这些信息。不过，使用情况信息不会实时更新，而是每天更新三次。

1. 为避免产生更多费用，请删除所有正在产生费用或者在您超出免费套餐限制使用量之后将会产生费用的资源。
   + 有关删除实例的说明，请参阅 [终止 Amazon EC2 实例](terminating-instances.md)。
   + 要检查您在其他区域是否拥有可能正在产生费用的资源，请在 **EC2 免费套餐**方框中选择**查看全球 EC2 资源**，以打开 **EC2 全球视图**。有关更多信息，请参阅 [使用 AWS 全局视图查看跨区域的资源](global-view.md)。

1. 要在 **EC2 免费套餐**方框底部的 AWS Free Tier 下方查看所有 AWS 服务 的资源使用情况，请选择**查看所有 AWS Free Tier 服务**。有关更多信息，请参阅 *AWS Billing 用户指南*中的 [使用 AWS Free Tier 试用服务](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/billing-free-tier.html)。