

# 跨账户 Amazon EC2 专属主机共享
<a name="dh-sharing"></a>

专属主机共享使专属主机拥有者能够与其他AWS账户或在AWS组织内共享其专属主机。这使您能够集中创建和管理专属主机，并跨多个AWS账户或在AWS组织内共享专属主机。

在此模型中，拥有专属主机的AWS账户（*拥有者*）将与其他AWS账户（*使用者*）共享它。使用者可以在与其共享的专属主机上启动实例，所用方式与他们在自己的账户中分配的专属主机上启动实例的方式相同。拥有者负责管理专属主机以及在其上启动的实例。拥有者无法修改使用者在共享的专属主机上启动的实例。使用者负责管理在与其共享的专属主机上启动的实例。使用者无法查看或修改其他使用者或专属主机拥有者所拥有的实例，也无法修改与其共享的专属主机。

专属主机拥有者可与以下对象共享专属主机：
+ 其 AWS 组织内部或外部的特定 AWS 账户
+ 其 AWS 组织内的组织部门
+ 其整个 AWS 组织

**Topics**
+ [共享专属主机的先决条件](#dh-sharing-prereq)
+ [共享专属主机的限制](#dh-sharing-limitation)
+ [相关服务](#dh-sharing-related)
+ [跨可用区共享](#dh-sharing-azs)
+ [共享的专属主机权限](#shared-dh-perms)
+ [计费和计量](#shared-dh-billing)
+ [专属主机限制](#shared-dh-limits)
+ [主机恢复和专属主机共享](#dh-sharing-retirement)
+ [共享 专属主机](sharing-dh.md)
+ [取消共享专属主机](unsharing-dh.md)
+ [查看共享的专属主机](identifying-shared-dh.md)

## 共享专属主机的先决条件
<a name="dh-sharing-prereq"></a>
+ 要共享专属主机，您必须在您的AWS账户中拥有它。您无法共享已与您共享的专属主机。
+ 要与您的AWS组织或AWS组织内的组织部门共享专属主机，您必须允许与 AWS Organizations 共享。有关更多信息，请参阅 *AWS RAM 用户指南*中的[允许与 AWS Organizations](https://docs.aws.amazon.com/ram/latest/userguide/getting-started-sharing.html) 共享。

## 共享专属主机的限制
<a name="dh-sharing-limitation"></a>

您无法共享已为以下实例类型分配的专属主机：`u-6tb1.metal`、`u-9tb1.metal`、`u-12tb1.metal`、`u-18tb1.metal` 和 `u-24tb1.metal`。

## 相关服务
<a name="dh-sharing-related"></a>

### AWS Resource Access Manager
<a name="related-ram"></a>

专属主机共享与 AWS Resource Access Manager (AWS RAM) 集成。AWS RAM 是一项服务，允许您与任何AWS账户或通过 AWS Organizations 共享AWS资源。利用 AWS RAM，您可通过创建*资源共享*来共享您拥有的资源。资源共享指定要共享的资源以及与之共享资源的使用者。使用者可以是单个 AWS 账户或 AWS Organizations 中的组织部门或整个组织。

AWS RAM有关 * 的更多信息，请参阅 [AWS RAM](https://docs.aws.amazon.com/ram/latest/userguide/) 用户指南*。

## 跨可用区共享
<a name="dh-sharing-azs"></a>

为确保资源分布在某个区域的各可用区中，可用区会独立映射到每个账户的名称。这可能会导致账户之间的可用区命名差异。例如，您的 `us-east-1a` 账户的可用区 AWS 可能与另一 `us-east-1a` 账户的 AWS 不在同一位置。

要确定专属主机相对于账户的位置，您必须使用*可用区 ID* (AZ ID)。可用区 ID 是跨所有 AWS 账户的可用区的唯一且一致的标识符。例如，`use1-az1` 是 `us-east-1` 区域的可用区 ID，它在每个 AWS 账户中的位置均相同。

**查看账户中的可用区的可用区 ID**

1. 打开 AWS RAM 控制台 ([https://console.aws.amazon.com/ram/home](https://console.aws.amazon.com/ram/home))。

1. 当前区域的可用区 ID 显示在屏幕右侧的 **Your AZ ID (您的 AZ ID)** 面板中。

## 共享的专属主机权限
<a name="shared-dh-perms"></a>

### 拥有者的权限
<a name="shared-dh-perms-owner"></a>

拥有者负责管理其共享的专属主机以及在专属主机上启动的实例。拥有者可以查看在共享专属主机上运行的所有实例，包括使用者启动的实例。但是，拥有者不能对使用者启动的正在运行的实例采取任何操作。

### 使用者的权限
<a name="shared-dh-perms-consumer"></a>

使用者负责管理他们在共享的专属主机上启动的实例。使用者不能以任何方式修改共享的专属主机，也不能查看或修改由其他使用者或专属主机拥有者启动的实例。

## 计费和计量
<a name="shared-dh-billing"></a>

共享专属主机不会产生额外的费用。

拥有者需要为他们共享的专属主机付费。使用者不需要为他们在共享的专属主机上启动的实例付费。

专属主机预留继续为共享的专属主机提供账单折扣。只有专属主机拥有者可以为他们拥有的共享专属主机购买专属主机预留。

## 专属主机限制
<a name="shared-dh-limits"></a>

共享的专属主机仅计入拥有者的专属主机限制。使用者的专属主机限制不受已与他们共享的专属主机的影响。同样，使用者在共享的专属主机上启动的实例不计入其实例限制。

## 主机恢复和专属主机共享
<a name="dh-sharing-retirement"></a>

主机恢复可恢复由专属主机拥有者以及与之共享专属主机的使用者启动的实例。将替换专属主机分配给拥有者的账户。它会添加到与原始专属主机相同的资源共享，并与相同的使用者共享。

有关更多信息，请参阅 [Amazon EC2 专属主机恢复](dedicated-hosts-recovery.md)。