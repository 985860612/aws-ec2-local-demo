

# Tutorial: Connect an Amazon EC2 instance to an Amazon RDS database（教程：将 Amazon EC2 实例连接到 Amazon RDS 数据库）
<a name="tutorial-connect-ec2-instance-to-rds-database"></a>

## 教程目标
<a name="tutorial-connect-ec2-rds-objective"></a>

本教程的目标是学习如何使用 AWS 管理控制台 配置 Amazon EC2 实例与 Amazon RDS 数据库之间的安全连接。

有不同的选项用于配置连接。在本教程中，我们将探讨以下三个选项：
+ [选项 1：使用 EC2 控制台将实例自动连接到 RDS 数据库](tutorial-ec2-rds-option1.md)

  使用 EC2 控制台中的自动连接功能自动配置 EC2 实例与 RDS 数据库之间的连接，以允许 EC2 实例与 RDS 数据库之间的流量。
+ [选项 2：使用 RDS 控制台将实例自动连接到 RDS 数据库](tutorial-ec2-rds-option2.md)

  使用 RDS 控制台中的自动连接功能自动配置 EC2 实例与 RDS 数据库之间的连接，以允许 EC2 实例与 RDS 数据库之间的流量。
+ [选项 3：通过创建安全组，将实例手动连接到 RDS 数据库](tutorial-ec2-rds-option3.md)

  通过手动配置和分配安全组来配置 EC2 实例与 RDS 数据库之间的连接，以重现由“选项 1”和“选项 2”中的自动连接功能自动创建的配置。

## 上下文
<a name="tutorial-connect-ec2-rds-context"></a>

作为您为何要在 EC2 实例与 RDS 数据库之间配置连接的背景，让我们考虑以下场景：您的网站向您的用户提供一份表单以供填写。您需要在数据库中捕获表单数据。您可以在已配置为 Web 服务器的 EC2 实例上托管您的网站，也可以在 RDS 数据库中捕获该表单数据。EC2 实例和 RDS 数据库需要相互连接，以便表单数据可以从 EC2 实例传输到 RDS 数据库。本教程介绍如何配置该连接。请注意，这只是连接 EC2 实例与 RDS 数据库的使用案例的一个示例。

## 架构
<a name="tutorial-connect-ec2-rds-architecture"></a>

下图显示了创建的资源以及完成本教程中的所有步骤后生成的架构配置。

![本教程中创建的 EC2 实例和 RDS 数据库的架构。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/ec2-rds-tutorial-architecture.png)


该图说明了您将创建的以下资源：
+ 您将在同一 AWS 区域、VPC 和可用区中创建 EC2 实例及 RDS 数据库。
+ 您将在公有子网中创建 EC2 实例。
+ 您将在私有子网中创建 RDS 数据库。

  当您使用 RDS 控制台创建 RDS 数据库并自动连接 EC2 实例时，将自动选择数据库的 VPC、数据库（DB）子网组和公有访问设置。将在与 EC2 实例相同的 VPC 内的私有子网中自动创建 RDS 数据库。
+ 互联网用户可以通过互联网网关使用 SSH 或 HTTP/HTTPS 连接到 EC2 实例。
+ 互联网用户无法直接连接到 RDS 数据库；只有 EC2 实例连接到 RDS 数据库。
+ 当您使用自动连接功能允许 EC2 实例与 RDS 数据库之间的流量时，将自动创建并添加以下安全组：
  + 将创建安全组 **ec2-rds-{{x}}** 并将其添加到 EC2 实例中。它包含一条出站规则，引用 **rds-ec2-{{x}}** 安全组作为其目标。这将允许来自 EC2 实例的流量通过 **rds-ec2-{{x}}** 安全组到达 RDS 数据库。
  + 将创建安全组 **rds-ec2-{{x}}** 并将其添加到 RDS 数据库中。它包含一条入站规则，引用 **ec2-rds-{{x}}** 安全组作为其来源。这将允许来自 EC2 实例（具有 **ec2-rds-{{x}}** 安全组）的流量到达 RDS 数据库。

  通过使用独立的安全组（一个用于 EC2 实例，一个用于 RDS 数据库），您可以更好地控制实例和数据库的安全性。如果您要在实例和数据库上使用同一安全组，然后将该安全组修改为仅适合（比如）数据库，则该修改将同时影响实例和数据库。换言之，如果您要使用一个安全组，则可能会无意中修改资源（实例或数据库）的安全性，因为您忘记了该安全组已连接到该资源。

  自动创建的安全组也遵循最低权限，因为它们仅允许通过创建特定于工作负载的安全组对，在数据库端口上为此工作负载建立相互连接。

## 注意事项
<a name="tutorial-connect-ec2-rds-considerations"></a>

在完成本教程中的任务时，请注意以下几点：
+ **两个控制台** - 在本教程中，您将使用以下两个控制台：
  + Amazon EC2 控制台 - 您将使用 EC2 控制台启动实例，将 EC2 实例自动连接到 RDS 数据库，以及使用手动选项通过创建安全组来配置连接。
  + Amazon RDS 控制台 - 您将使用 RDS 控制台创建 RDS 数据库，然后将 EC2 实例自动连接到 RDS 数据库。
+ **一个 VPC** - 要使用自动连接功能，EC2 实例和 RDS 数据库必须位于同一 VPC 中。

  如果您要手动配置 EC2 实例与 RDS 数据库之间的连接，可以在一个 VPC 中启动 EC2 实例，在另一个 VPC 中启动 RDS 数据库；但是，您需要设置额外的路由和 VPC 配置。本教程中未涵盖此场景。
+ **一个 AWS 区域** - EC2 实例和 RDS 数据库必须位于同一区域中。
+ **两个安全组** - EC2 实例与 RDS 数据库之间的连接由两个安全组配置 - 一个安全组用于 EC2 实例，一个安全组用于 RDS 数据库。

  当您使用 EC2 控制台或 RDS 控制台中的自动连接功能配置连接（本教程的“选项 1”和“选项 2”）时，将自动创建安全组并将其分配给 EC2 实例和 RDS 数据库。

  如果您不使用自动连接功能，则需要手动创建和分配安全组。您可以在本教程的“选项 3”中执行此操作。

## 完成教程所需的时间
<a name="tutorial-connect-ec2-rds-time"></a>

30 分钟

您可以一口气完成整个教程，也可以一次完成一项任务。

## 成本
<a name="tutorial-connect-ec2-rds-costs"></a>

您在完成本教程过程中创建的 AWS 资源可能会产生费用。

您可以在[免费套餐](https://aws.amazon.com/free/)下使用 Amazon EC2，前提是您的 AWS 账户符合免费套餐的资格，并且您根据免费套餐要求配置资源。有关更多信息，请参阅 [2025 年 7 月 15 日之前和之后的免费套餐权益](ec2-free-tier-usage.md#ec2-free-tier-comparison)。

如果 EC2 实例和 RDS 数据库位于不同的可用区中，则需要支付数据传输费。为了避免产生这些费用，EC2 实例和 RDS 数据库必须位于同一可用区中。有关数据传输费的信息，请参阅“Amazon EC2 On-Demand Pricing”（Amazon EC2 按需定价）页面上的 [Data Transfer](https://aws.amazon.com/ec2/pricing/on-demand/#Data_Transfer)（数据传输）。

为了防止在您完成教程后产生费用，请确保在不再需要资源时将其删除。有关删除资源的步骤，请参阅[任务 4（*可选*）：清理](tutorial-ec2-rds-option3.md#tutorial-ec2-rds-clean-up)。