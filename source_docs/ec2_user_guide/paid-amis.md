

# AWS Marketplace 中适用于 Amazon EC2 实例的付费 AMI
<a name="paid-amis"></a>

*付费 AMI* 是在 AWS Marketplace 中列出销售的 AMI。AWS Marketplace 是一个在线商店，您可以从中购买在 AWS 上运行的软件，包括可用来启动 EC2 实例的 AMI。AWS Marketplace AMI 分为各种类别（如开发人员工具），您可以根据自己的要求查找产品。有关 AWS Marketplace 的更多信息，请参阅 [AWS Marketplace](https://aws.amazon.com/marketplace) 网站。

您可以在 AWS Marketplace 中从第三方购买 AMI，包括具有 Red Hat 等组织的服务合同的 AMI。您还可以创建 AMI 并在 AWS Marketplace 中将其出售给其他 Amazon EC2 用户。如果遵循一些简单的指导，为公共使用构建安全、可靠、可用的 AMI 的过程可以很简单。有关如何创建和使用共享 AMI 的信息，请参阅[了解 Amazon EC2 中共享 AMI 的使用情况](sharing-amis.md)。

从付费 AMI 启动实例与从任何其他 AMI 启动实例的方式相同。不需要额外参数。实例根据 AMI 拥有者设置的费率以及相关 Web 服务的标准使用费（例如，在 Amazon EC2 中运行 m5.small 实例类型的小时费率）来收费。还可能需要支付其他税款。付费 AMI 拥有者可以确认是否使用该付费 AMI 启动特定实例。

**重要**  
Amazon DevPay 不再接受新的卖家或产品。AWS Marketplace 现在是通过 AWS 销售软件和服务的统一电子商务平台。有关如何从 AWS Marketplace 部署和销售软件的信息，请参阅[在 AWS Marketplace 中出售](https://aws.amazon.com/marketplace/partners/management-tour)。AWS Marketplace 支持受 Amazon EBS 支持的 AMI。

**Topics**
+ [在 AWS Marketplace 中销售您的 AMI](#selling-your-ami)
+ [查找付费 AMI](using-paid-amis-finding-paid-ami.md)
+ [在 AWS Marketplace 中购买付费 AMI](using-paid-amis-purchasing-paid-ami.md)
+ [从您的实例中检索 AWS Marketplace 产品代码](get-product-code.md)
+ [为支持的 AWS Marketplace 产品使用付费支持](using-paid-amis-support.md)
+ [付费和支持 AMI 的账单](#using-paid-amis-bills)
+ [管理您的 AWS Marketplace 订阅](marketplace-manage-subscriptions.md)

## 在 AWS Marketplace 中销售您的 AMI
<a name="selling-your-ami"></a>

您可以使用 AWS Marketplace 销售 AMI。AWS Marketplace 提供组织有序的购物体验。此外，AWS Marketplace 还支持 AWS 功能，如 Amazon EBS-backed AMI、预留实例和竞价型实例。

有关如何在 AWS Marketplace 中出售 AMI 的信息，请参阅[在 AWS Marketplace 中出售](https://aws.amazon.com/marketplace/partners/management-tour)。

## 付费和支持 AMI 的账单
<a name="using-paid-amis-bills"></a>

在每个月月底，您会收到一封电子邮件，邮件里注明了该月因使用任何付费和受支持的 AMI 所产生的信用卡付费金额情况。这个账单与您的常规 Amazon EC2 账单是分开的。有关更多信息，请参阅 *AWS Marketplace 买家指南*中的[为产品付费](https://docs.aws.amazon.com/marketplace/latest/buyerguide/buyer-paying-for-products.html)。