

# 查找 Amazon EC2 资源
<a name="Using_Filtering"></a>

您可以使用 Amazon EC2 控制台获取某些类型的资源的列表。您可以使用相应命令或 API 操作获取每种类型的资源的列表。如果您拥有许多资源，可以筛选结果以仅包含或排除符合特定标准的资源。

**Topics**
+ [控制台步骤](#advancedsearch)
+ [命令行示例](#Filtering_Resources_CLI)
+ [全局视图（跨区域）](#global-view-intro)

## 使用控制台列出并筛选资源
<a name="advancedsearch"></a>

**Contents**
+ [使用控制台列出资源](#listing-resources)
+ [使用控制台筛选资源](#console-filter)
  + [支持的筛选条件](#console-filters)
+ [使用控制台保存筛选条件](#saved-filter-sets-in-the-ec2-console)
  + [主要功能](#saved-filter-sets-key-features)
  + [创建筛选条件集](#create-saved-filter-sets)
  + [修改筛选条件集](#modify-saved-filter-sets)
  + [删除筛选条件集](#delete-saved-filter-sets)

### 使用控制台列出资源
<a name="listing-resources"></a>

您可以使用控制台查看最常用的 Amazon EC2 资源类型。要查看其他资源，请使用命令行界面或 API 操作。

**要使用控制台列出 EC2 资源**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. Amazon EC2 资源是特定于 AWS 区域。在导航栏中，从**区域**选择器中选择一个区域。  
![查看区域。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/EC2_select_region.png)

1. 在导航窗格中，选择与资源类型对应的选项。例如，要列出所有实例，请选择**实例**。

### 使用控制台筛选资源
<a name="console-filter"></a>

**筛选资源列表**

1. 在导航窗格中，选择资源类型 (例如，**Instances**)。

1. 选择搜索字段。

1. 从列表中选择筛选条件。

1. 选择运算符，例如 **=**（等于）。某些属性具有更多可供选择的运算符。请注意，并非所有页面都支持选择运算符。

1. 选择筛选条件值。

1. 要编辑选定的筛选条件，请选择过滤条件令牌（蓝色框），进行所需的编辑，然后选择 **Apply**（应用）。请注意，并非所有页面都支持编辑选定的筛选条件。  
![编辑筛选条件。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/filter-edit.png)

1. 完成后，删除筛选条件。

#### 支持的筛选条件
<a name="console-filters"></a>

Amazon EC2 控制台支持两种类型的筛选。
+ *API 筛选*发生在服务器端。该筛选应用于 API 调用，可减少服务器返回的资源数量。它可以对大型资源集进行快速筛选，并可降低服务器和浏览器之间的数据传输时间和成本。API 筛选支持 **=**（等于）和 **:**（包含）运算符，并且始终区分大小写。
+ *客户端筛选*发生在客户端。它可以对浏览器中现有的数据（也就是 API 已返回的数据）进行筛选。客户端筛选与 API 筛选结合使用，可以在浏览器中筛选出较小的数据集。除 **=**（等于）和 **:**（包含）运算符外，客户端筛选还支持范围运算符 [例如 **>=**（大于等于）] 和否定（反向）运算符 [例如 **\!=**（不等于）]。

Amazon EC2 控制台支持以下类型的搜索：

**按关键字搜索**  
按关键词搜索是一种自由文本搜索，可让您在所有资源属性或标签中搜索特定的值，而无需指定要搜索的属性或标签键。  
所有关键字搜索都使用*客户端筛选*。
要按关键字进行搜索，请在搜索框中输入或粘贴要查找的内容，然后按 **Enter**。例如，搜索 `123` 时将会比对任何属性（例如 IP 地址、实例 ID、VPC ID 或 AMI ID）或任何标签（例如 Name）中包含 *123* 的所有实例。如果自由文本搜索返回不需要的匹配项，请再应用其他筛选条件。

**按属性搜索**  
按属性搜索可让您在所有资源中搜索特定属性。  
属性搜索可以使用 *API 筛选*或*客户端筛选*，具体取决于所选的属性。执行属性搜索时，会相应地对属性进行分组。
例如，您可以搜索所有实例的 **Instance state** 属性，以便仅返回处于 `stopped` 状态的实例。要实现此目的，应按照以下步骤进行：  

1. 在**实例**屏幕上的搜索字段中，开始输入 `Instance state`。输入字符时，**实例状态**将显示两种类型的筛选条件：**API 筛选条件**和**客户端筛选条件**。

1. 要在服务器端进行搜索，请在 **API 筛选条件**下选择** 实例状态**。要在客户端进行搜索，请在**客户端筛选条件**下选择**实例状态（客户端）**。

   这时会显示所选属性的可能运算符列表。

1. 选择 **=**（等于）运算符。

   这时会显示所选属性和运算符的可能值列表。

1. 从列表中选择**已停止**。

**按标签搜索**  
借助按标签搜索功能，您可以按标签键或标签值来筛选当前显示的表中的资源。  
标签搜索使用 *API 筛选*或*客户端筛选*方式，具体取决于 Preferences（首选项）窗口中的设置。  

**确保对标签执行 API 筛选**

1. 打开 **Preferences**（首选项）窗口。

1. 清除**使用正则表达式匹配**复选框。如果选中此复选框，则将执行客户端筛选。

1. 选择**使用区分大小写的匹配**复选框。如果清除此复选框，则将执行客户端筛选。

1. 选择**确认**。
按标签搜索时，您可以使用以下值：  
+ **（空）** – 查找具有指定标签键，但必须不具有标签值的所有资源。
+ **All values**（所有值）– 查找具有指定标签键和任何标签值的所有资源。
+ **Not tagged**（未添加标签）– 搜索不具有指定标签键的所有资源。
+ 显示的值 – 查找具有指定标签键和指定标签值的所有资源。

您可以使用以下技术来增强或优化搜索：

**反向搜索**  
反向搜索可让您搜索与指定的值**不**匹配的资源。在**实例**和 **AMI** 屏幕中，反向搜索的方法是首先选择 **\!=**（不等于）或 **\!:**（不包含）运算符，然后选择一个值。在其他屏幕中，反向搜索可通过在搜索关键词前加上感叹号（\!）字符来执行。  
只有*客户端*筛选条件上的关键字搜索和属性搜索支持反向搜索。API 筛选条件上的属性搜索不支持它。
例如，您可以搜索所有实例的**实例状态**属性，以便包含处于 `terminated` 状态的所有实例。要实现此目的，应按照以下步骤进行：  

1. 在**实例**屏幕上的搜索字段中，开始输入 `Instance state`。输入字符时，**实例状态**将显示两种类型的筛选条件：**API 筛选条件**和**客户端筛选条件**。

1. 在 **Client filters**（客户端筛选条件）下，选择 **Instance state (client)** [实例状态（客户端）]。只有*客户端*筛选条件支持反向搜索。

   这时会显示所选属性的可能运算符列表。

1. 选择 **\!=**（不等于），然后选择 **terminated**（已终止）。
要根据实例状态属性筛选实例，您还可以使用**实例状态**列中的搜索图标 (![Search icon.](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/search.png))。带加号 (**\+**) 的搜索图标将显示与该属性*匹配*的所有实例。带减号 (**-**) 的搜索图标将*排除*与该属性匹配的所有实例。  
以下是使用反向搜索的另一个示例：要列出**未**分配名为 `launch-wizard-1` 的安全组的所有实例，则在 **Client filters**（客户端筛选条件）下，按 **Security group name**（安全组名称）属性进行搜索，然后选择 **\!=** 并在搜索栏中输入 `launch-wizard-1`。

**部分搜索**  
使用部分搜索，可以搜索部分字符串值。要执行部分搜索，请仅输入要搜索的关键字的一部分。在 **Instances**（实例）和 **AMI** 屏幕中，部分搜索只能通过 **:**（包含）运算符来执行。在其他屏幕中，您可以选择该客户端筛选条件属性，然后立即仅输入要搜索的关键词的一部分。例如，在 **Instance type**（实例类型）屏幕上，要搜索所有 `t2.micro`、`t2.small` 和 `t2.medium` 实例，则按 **Instance Type**（实例类型）属性进行搜索，然后输入关键词 `t2`。

**正则表达式搜索**  
要使用正则表达式搜索，必须在**首选项**窗口中选中**使用正则表达式匹配**复选框。  
当需要匹配字段中具有特定模式的值时，可以使用正则表达式。例如，要搜索以 `s` 开头的值，请搜索 `^s`。要搜索以 `xyz` 结尾的值，请搜索 `xyz$`。或者要搜索以数字开头，后跟一个或多个字符的值，请搜索 `[0-9]+.*`。  
只有客户端筛选条件上的关键字搜索和属性搜索支持正则表达式搜索。API 筛选条件上的属性搜索不支持它。

**区分大小写搜索**  
要使用区分大小写搜索，必须在**首选项**窗口中选中**使用区分大小写的匹配**复选框。区分大小写的首选项仅适用于客户端筛选条件和标签筛选条件。  
API 筛选条件始终区分大小写。

**通配符搜索**  
使用 `*` 通配符匹配零个或多个字符。使用 `?` 通配符匹配零个或一个字符。例如，假设您有一个包含值 `prod`、`prods`、和 `production` 的数据集，搜索 `prod*` 将会匹配所有值，而 `prod?` 只匹配 `prod` 和 `prods`。要使用文字值，请使用反斜杠（\\）进行转义。例如，“`prod\*`”将匹配 `prod*`。  
仅 API 筛选条件上的属性和标签搜索支持通配符搜索。客户端筛选条件上的关键词搜索以及属性和标签搜索不支持通配符。

**合并搜索**  
通常，具有相同属性的多个筛选条件会自动以 `OR` 连接。例如，搜索 `Instance State : Running` 和 `Instance State : Stopped` 会返回正在运行或已停止的所有实例。要使用 `AND` 连接搜索，请跨不同的属性进行搜索。例如，搜索 `Instance State : Running` 和 `Instance Type : c4.large` 只会返回为类型为 `c4.large` 且处于运行状态的实例。

### 使用控制台保存筛选条件
<a name="saved-filter-sets-in-the-ec2-console"></a>

*保存的筛选条件集*是一组自定义的筛选条件，您可以创建并重复使用这些筛选条件来高效查看自己的 Amazon EC2 资源。此功能有助于简化您的工作流，实现快速访问特定的资源视图。

保存的筛选条件集仅受 Amazon EC2 控制台支持，并且当前仅适用于**卷**页面。

#### 主要功能
<a name="saved-filter-sets-key-features"></a>
+ **自定义：**创建根据您的需求量身定制的筛选条件集。例如，您可以创建一个筛选条件集来仅显示在指定日期之后创建的 `gp3` 卷。
+ **默认筛选条件：**为某页面设置默认筛选条件集，当您导航到该页面时，系统会自动应用默认筛选条件。如果未设置默认值，则不应用任何筛选条件。
+ **轻松应用：**选择保存的筛选条件集即可立即应用。然后，Amazon EC2 会显示相关资源，其中活动筛选条件用蓝色标记表示。
+ **灵活性：**根据需要创建、修改和删除筛选条件集。

#### 创建筛选条件集
<a name="create-saved-filter-sets"></a>

**创建新的筛选条件集**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Volumes**。
**注意**  
保存的筛选器集目前仅适用于**卷**。

1. 在搜索字段中，为您的筛选条件集选择筛选条件。

1. 选择**清除筛选条件**按钮旁边的箭头，然后选择**保存新的筛选条件集**。

1. 在**保存筛选条件集**窗口中，执行下面的操作：

   1. 对于**筛选条件集名称**，输入筛选条件集的名称。

   1. （可选）对于**筛选条件集描述**，输入筛选条件集的描述。

   1. （可选）要将筛选条件集设置为默认筛选条件，请选中**设为默认值**复选框。
**注意**  
每次您打开控制台页面时，都会自动应用默认筛选条件。

   1. 选择**保存**。

#### 修改筛选条件集
<a name="modify-saved-filter-sets"></a>

**修改筛选条件集**

1. 从**保存的筛选条件集**列表中，选择要修改的筛选条件。

1. 要添加筛选条件，请在搜索字段中选择要添加到筛选条件集中的筛选条件。要删除集中的筛选条件，请选择筛选条件标记上的 **X**。

1. 选择**清除筛选条件**按钮旁边的箭头，然后选择**修改筛选条件集**。

1. 在**修改筛选条件集**窗口中，执行下面的操作：

   1. （可选）要将筛选条件集设置为默认筛选条件，请选中**设为默认值**复选框。
**注意**  
每次您打开控制台页面时，都会自动应用默认筛选条件。

   1. 选择 **Modify**(修改)。

#### 删除筛选条件集
<a name="delete-saved-filter-sets"></a>

**删除筛选条件集**

1. 从**保存的筛选条件集**列表中，选择要删除的筛选条件。

1. 选择**清除筛选条件**按钮旁边的箭头，然后选择**删除筛选条件集**。

1. 在**删除筛选条件集**窗口中，查看筛选条件以确认这是要删除的筛选条件，然后选择**删除**。

## 使用命令行列出并筛选
<a name="Filtering_Resources_CLI"></a>

每个资源类型都有对应的 API 操作，以供您用来描述、列出或获取该类型的资源。生成的资源列表可能很长，因此筛选结果以仅包括符合特定条件的资源可能会更快、更有用。

**筛选注意事项**
+ 在单个请求中，您最多可以指定 50 个筛选条件以及总计 200 个筛选条件值。
+ 筛选条件字符串的长度最多为 255 个字符。
+ 您可以将通配符与筛选值一同使用。星号 (\*) 匹配零个或多个字符，而问号 (?) 匹配零个或一个字符。
+ 筛选值区分大小写。
+ 您的搜索中可包含通配符的字面值；您只需要在字符前用反斜线隔开字符。例如，用 `\*amazon\?\\` 值搜索文字字符串 `*amazon?\`。
+ 您不能将筛选条件值指定为 null，但可以使用客户端筛选。例如，以下命令使用 **--query** 选项，返回在无密钥对的情况下启动之实例的 ID。

  ```
  aws ec2 describe-instances \
      --query 'Reservations[*].Instances[?!not_null(KeyName)].InstanceId' \
      --output text
  ```

------
#### [ AWS CLI ]

**Example 示例：指定单个筛选条件**  
您可以使用 [describe-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instances.html) 列出 Amazon EC2 实例。如果没有筛选条件，响应将包含您的所有资源的信息。您可以使用以下选项，在输出中仅包含正在运行的实例。  

```
--filters Name=instance-state-name,Values=running
```
要仅列出正在运行的实例的实例 ID，请按如下所示添加 `--query` 选项。  

```
--query "Reservations[*].Instances[*].InstanceId"
```

**Example 示例：指定多个筛选条件或筛选条件值**  
如果指定多个筛选条件或多个筛选条件值，则资源必须在与所有筛选条件匹配时才会包含在结果中。  
您可以使用以下选项来列出类型为 `m5.large` 或 `m5d.large` 的所有实例。  

```
--filters Name=instance-type,Values=m5.large,m5d.large
```
您可以使用以下选项来列出类型为 `t2.micro` 的所有已停止实例。  

```
--filters Name=instance-state-name,Values=stopped Name=instance-type,Values=t2.micro
```

**Example 示例：在筛选条件值中使用通配符**  
您可以使用 [describe-snapshots](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-snapshots.html) 和以下选项，从而仅返回描述为“database”的快照。  

```
--filters Name=description,Values=database
```
\* 通配符可与零个或多个字符匹配。您可以使用以下选项，仅返回描述中包含单词 database 的快照。  

```
--filters Name=description,Values=*database*
```
? 通配符完全匹配 1 个字符。您可以使用以下选项，仅返回描述为“database”或“database”并后接一个字符的快照。  

```
--filters Name=description,Values=database?
```
您可以使用以下选项，仅返回描述为“database”并后接不超过四个字符的快照。这会排除包含“database”并后接五个或以上字符的描述。  

```
--filters Name=description,Values=database????
```

**Example 示例：基于日期进行筛选**  
使用 AWS CLI，您可以使用 JMESPath 通过表达式来筛选结果。例如，以下 [describe-snapshots](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-snapshots.html) 命令会显示指定 AWS 账户在指定日期之前创建的所有快照的 ID。如果未指定所有者，则结果将包括所有公有快照。  

```
aws ec2 describe-snapshots \
    --filters Name=owner-id,Values={{123456789012}} \
    --query "Snapshots[?(StartTime<='{{2024-03-31}}')].[SnapshotId]" \
    --output text
```
以下示例会显示在指定日期范围内创建的所有快照的 ID。  

```
aws ec2 describe-snapshots \
    --filters Name=owner-id,Values={{123456789012}} \
    --query "Snapshots[?(StartTime>='{{2024-01-01}}') && (StartTime<='{{2024-12-31}}')].[SnapshotId]" \
    --output text
```

**示例：基于标签进行筛选**  
有关如何根据资源标签筛选资源列表的示例，请参阅[按标签筛选 Amazon EC2 资源](filtering-the-list-by-tag.md)。

------
#### [ PowerShell ]

**Example 示例：指定单个筛选条件**  
您可以使用 [Get-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2Instance.html) 列出 Amazon EC2 实例。如果没有筛选条件，响应将包含您的所有资源的信息。您可以使用以下参数，在输出中仅包含正在运行的实例。  

```
-Filter @{Name="instance-state-name"; Values="running"}
```

以下示例仅会列出正在运行的实例的实例 ID。

```
(Get-EC2Instance -Filter @{Name="instance-state-name"; Values="stopped"}).Instances | Select InstanceId
```

**Example 示例：指定多个筛选条件或筛选条件值**  
如果指定多个筛选条件或多个筛选条件值，则资源必须与所有筛选条件匹配才能包括在结果中。  
您可以使用以下选项来列出类型为 `m5.large` 或 `m5d.large` 的所有实例。  

```
-Filter @{Name="instance-type"; Values="m5.large", "m5d.large"}
```
您可以使用以下选项来列出类型为 `t2.micro` 的所有已停止实例。  

```
-Filter @{Name="instance-state-name"; Values="stopped"}, @{Name="instance-type"; Values="t2.micro"}
```

------

## 使用 AWS 全局视图查看跨区域的资源
<a name="global-view-intro"></a>

通过 AWS 全局视图，您可以在单个控制台中跨单个 AWS 区域或跨多个区域同时查看和搜索资源。有关更多信息，请参阅 [使用 AWS 全局视图查看跨区域的资源](global-view.md)。