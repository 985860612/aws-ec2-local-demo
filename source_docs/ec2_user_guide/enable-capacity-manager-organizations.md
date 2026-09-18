

# 使用 AWS Organizations 启用 EC2 容量管理器
<a name="enable-capacity-manager-organizations"></a>

您可以使用 AWS Organizations 启用 EC2 容量管理器，从而对所有成员账户的容量进行组织级别的查看和管理。这种集成使您能够从一个集中位置监控、分析和管理容量使用情况。

管理账户负责实现组织级别的访问权限设置，并管理整个组织的容量。

使用 AWS Organizations 启用容量管理器具有以下优势：
+ **集中式容量可见性**：通过一个单一控制面板查看您组织内所有成员账户的容量使用情况，该控制面板支持跨账户和跨区域聚合。
+ **组织范围的优化**：识别您的组织内所有账户中未使用的容量预留以及优化机会。
+ **委派管理员**：允许特定的成员账户来管理组织的容量管理器，同时保持适当的访问控制。

如果您未启用与 AWS Organizations 的集成，则只能监控启用了容量管理器的单个 AWS 账户中的资源。

## 先决条件
<a name="organizations-prerequisites"></a>
+ 您必须拥有包含一个管理账户和一个或多个成员账户的 AWS Organizations 设置。有关账户类型的更多信息，请参阅 *AWS Organizations 用户指南*中的[术语和概念](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_getting-started_concepts.html)。
+ 管理账户必须具有以下 IAM 操作的权限：
  + `organizations:EnableAwsServiceAccess`
  + `organizations:RegisterDelegatedAdministrator`（如果使用委派管理）
  + `iam:CreateServiceLinkedRole`
+ 您必须使用 **AWSEC2CapacityManagerServiceRolePolicy** 使用案例创建一个服务相关角色，以便为 AWS Organization 提供访问权限。有关更多信息，请参阅[创建 License Manager 的服务相关角色](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-service-linked-roles-cm.html#create-slr)。

## 使用 AWS Organizations 启用容量管理器
<a name="enable-organization-integration"></a>

使用管理账户，在容量管理器中启用组织访问权限。

------
#### [ Console ]

**在容量管理器中启用组织访问权限**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**容量管理器**。

1. 选择**设置**选项卡。

1. 在**可信访问权限**部分，选择**管理可信访问权限**。

1. 在出现的提示中，选择**启用可信访问权限**。然后，选择**保存**。

------
#### [ AWS CLI ]

**在容量管理器中启用组织访问权限**

1. 创建服务相关角色

   ```
   aws iam create-service-linked-role --aws-service-name ec2.capacitymanager.amazonaws.com
   ```

1. 启用 AWS Organization 访问权限

   ```
   aws organizations enable-aws-service-access --service-principal ec2.capacitymanager.amazonaws.com
   ```

1. 使用 AWS Organization 启用容量管理器 

   ```
   aws ec2 enable-capacity-manager --organizations-access
   ```

要更新现有容量管理器的组织访问权限，请运行以下命令：

```
aws ec2 update-capacity-manager-organizations-access --organizations-access
```

------
#### [ PowerShell ]

**在容量管理器中启用组织访问权限**

1. 使用 [New-IAMServiceLinkedRole](https://docs.aws.amazon.com/powershell/latest/reference/items/New-IAMServiceLinkedRole.html) cmdlet 创建服务相关角色。

   ```
   New-IAMServiceLinkedRole -AWSServiceName "ec2.capacitymanager.amazonaws.com"
   ```

1. 使用 [Enable-ORGAWSServiceAccess](https://docs.aws.amazon.com/powershell/latest/reference/items/Enable-ORGAWSServiceAccess.html) cmdlet 启用 AWS 组织访问权限。

   ```
   Enable-ORGAWSServiceAccess -ServicePrincipal "ec2.capacitymanager.amazonaws.com"
   ```

1. 使用 [Enable-EC2CapacityManager](https://docs.aws.amazon.com/powershell/latest/reference/items/Enable-EC2CapacityManager.html) cmdlet 对 AWS 组织启用容量管理器。

   ```
   Enable-EC2CapacityManager -OrganizationsAccess $true
   ```

要更新现有容量管理器的组织访问权限，请运行以下 [Update-EC2CapacityManagerOrganizationsAccess](https://docs.aws.amazon.com/powershell/latest/reference/items/Update-EC2CapacityManagerOrganizationsAccess.html) cmdlet：

```
Update-EC2CapacityManagerOrganizationsAccess -OrganizationsAccess $true
```

------

## 验证您的组织是否已启用容量管理器
<a name="verify-organization-integration"></a>

------
#### [ Console ]

**要验证您的组织是否已启用容量管理器**

1. 在容量管理器控制台中，选择**设置**。

1. 在**可信访问权限**部分，确认**组织访问权限**显示为**已启用**。

1. 检查**组织 ID** 是否显示您的组织 ID。

------
#### [ AWS CLI ]

**要验证您的组织是否已启用容量管理器**  
运行以下命令：

```
aws ec2 get-capacity-manager-attributes
```

输出应显示：

```
{
    "CapacityManagerStatus": "enabled",
    "OrganizationsAccess": true,
    "IngestionStatus": "initial-ingestion-pending",
    "IngestionStatusMessage": "Capacity Manager is collecting historical data from 2025-10-01T00:00:00Z. Data collection is in progress and may take several hours to complete."
}
```

------
#### [ PowerShell ]

**要验证您的组织是否已启用容量管理器**  
使用 [Get-EC2CapacityManagerAttribute](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2CapacityManagerAttribute.html) cmdlet。

```
Get-EC2CapacityManagerAttribute
```

输出应显示：

```
CapacityManagerStatus      : enabled
DataExportCount            : 0
EarliestDatapointTimestamp :
IngestionStatus            : initial-ingestion-in-progress
IngestionStatusMessage     : Capacity Manager is collecting historical data from
                              2026-03-17T16:00:00Z. Data collection is in progress and may take
                              several hours to complete.
LatestDatapointTimestamp   :
OrganizationsAccess        : True
```

------

## 注意事项
<a name="organizations-considerations"></a>
+ **创建服务相关角色：**当您通过控制台启用组织访问权限时，容量管理器会自动在所有成员账户中创建 AWSServiceRoleForEC2CapacityManager 服务相关角色。如果您通过 AWS CLI 启用，则必须手动调用 `createServiceLinkedRole`。
+ **数据聚合：**启用组织访问权限后，容量管理器会回填所有成员账户中的 14 天历史数据。该过程通常需要花费几分钟的时间才能完成。
+ **区域限制：**对于每个组织，您只能在一个区域启用容量管理器，但该服务会聚合来自所有商业区域的数据。
+ **权限：**成员账户无需采取任何操作。容量管理器使用服务相关角色自动发现各账户中的资源。