

# 将数据与您自己的操作员隔离
<a name="isolate-data-operators"></a>

AWS Nitro System 有[零操作员访问权限](https://docs.aws.amazon.com/whitepapers/latest/security-design-of-aws-nitro-system/no-aws-operator-access.html)。任何 AWS 系统或人员都无法登录 Amazon EC2 Nitro 主机、访问 EC2 实例的内存，或访问存储在本地加密实例存储或远程加密 Amazon EBS 卷上的任何客户数据。

处理高度敏感数据时，您可以考虑限制对这些数据的访问，甚至阻止自己的操作员访问 EC2 实例。

您可以创建自定义可证明的 AMI，并将其配置为提供隔离的计算环境。AMI 配置取决于您的工作负载和应用程序要求。在构建 AMI 以创建隔离计算环境时，请考虑以下最佳实践。
+ **移除所有交互式访问权限**，以阻止您的操作员或用户访问该实例。
+ **确保 AMI 中仅包含可信软件和代码**。
+ 在实例内**配置网络防火墙**以阻止访问。
+ **确保所有存储和文件系统为只读和不可变状态**。
+ 将**实例访问限制**为经过身份验证、已授权和已记录的 API 调用。