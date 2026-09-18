

# 按标签筛选 Amazon EC2 资源
<a name="filtering-the-list-by-tag"></a>

添加标签后，即可基于标签键和标签值来筛选 Amazon EC2 资源。

------
#### [ Console ]

**按标签筛选资源**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择资源类型 (例如，**Instances**)。

1. 选择搜索字段。

1. 在列表中的**标签**下，选择标签键。

1. 从列表中选择相应的标签值。

1. 完成后，删除筛选条件。

有关在 Amazon EC2 控制台中使用筛选条件的更多信息，请参阅 [查找 Amazon EC2 资源](Using_Filtering.md)。

------
#### [ AWS CLI ]

**描述具有指定标签键的单个类型的资源**  
将以下筛选条件添加到 `describe` 命令中，来描述具有 Stack 标签的该类型资源，无论标签值为何。

```
--filters Name=tag-key,Values={{Stack}}
```

**描述具有指定标签的单个类型的资源**  
将以下筛选条件添加到 `describe` 命令中，来描述具有标签 Stack=production 的该类型资源。

```
--filters Name=tag:{{Stack}},Values={{production}}
```

**描述具有指定标签值的单个类型的资源**  
将以下筛选条件添加到 `describe` 命令中，来描述具有值为 production 的标签的该类型资源，无论标签键为何。

```
--filters Name=tag-value,Values={{production}}
```

**描述具有指定标签的所有 EC2 资源**  
将以下筛选条件添加到 [describe-tags](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-tags.html) 命令中，来描述具有标签 Stack=test 的所有 EC2 资源。

```
--filters Name=key,Values={{Stack}} Name=value,Values={{test}}
```

------
#### [ PowerShell ]

**按标签键筛选单个类型的资源**  
将以下筛选条件添加到 `Get` cmdlet 中，来描述具有 Stack 标签的该类型资源，无论标签值为何。

```
-Filter @{Name="tag-key"; Values="{{Stack}}"}
```

**按标签筛选单个类型的资源**  
将以下筛选条件添加到 `Get` cmdlet 中，来描述具有标签 Stack=production 的该类型资源。

```
-Filter @{Name="tag:{{Stack}}"; Values="{{production}}"}
```

**按标签值筛选单个类型的资源**  
将以下筛选条件添加到 `Get` 命令中，来描述具有值为 production 的标签的该类型资源，无论标签键的值为何。

```
-Filter @{Name="tag-value"; Values="{{production}}"}
```

**按标签筛选所有 EC2 资源**  
将以下筛选条件添加到 [Get-EC2Tag](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2Tag.html) cmdlet 中，来描述具有标签 Stack=test 的所有 EC2 资源。

```
-Filter @{Name="tag:{{Stack}}"; Values="{{test}}"}
```

------