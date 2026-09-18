

# 在 Amazon EC2 启动模板中存储实例启动参数
<a name="ec2-launch-templates"></a>

您可以使用 Amazon EC2 *启动模板*来存储实例启动参数，以便无需在每次启动 Amazon EC2 实例时都指定这些参数。例如，您可以创建一个启动模板，其中存储您通常用于启动实例的 AMI ID、实例类型和网络设置。在使用 Amazon EC2 控制台、AWS SDK 或命令行工具启动实例时，您可以指定要使用的启动模板，而无需再次输入参数。

对于每个启动模板，您可以创建一个或多个编号的*启动模板版本*。每个版本可能具有不同的启动参数。在通过启动模板启动实例时，您可以使用任何版本的启动模板。如果未指定版本，则使用默认版本。您可以将任何启动模板版本设置为默认版本 — 默认情况下，这是启动模板的第一个版本。

下图显示了具有三个版本的启动模板。第一个版本指定用于启动实例的实例类型、AMI ID、子网和密钥对。第二个版本基于第一个版本，并且还为实例指定了一个安全组。第三个版本在某些参数中使用不同的值。版本 2 设置为默认版本。如果通过该启动模板启动实例，并且未指定任何其他版本，则使用版本 2 中的启动参数。

![启动具有三个版本的模板。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/launch-template-diagram.png)


**Topics**
+ [Amazon EC2 启动模板的限制](launch-template-restrictions.md)
+ [Amazon EC2 启动模板所需的 IAM 权限](permissions-for-launch-templates.md)
+ [使用 Amazon EC2 启动模板控制启动 Amazon EC2 实例](use-launch-templates-to-control-launching-instances.md)
+ [创建 Amazon EC2 启动模板](create-launch-template.md)
+ [修改启动模板（管理启动模板版本）](manage-launch-template-versions.md)
+ [删除启动模板或启动模板版本](delete-launch-template.md)