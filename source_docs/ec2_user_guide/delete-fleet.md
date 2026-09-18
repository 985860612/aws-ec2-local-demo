

# 删除 EC2 实例集请求和实例集中的实例
<a name="delete-fleet"></a>

如果不再需要某个 EC2 实例集请求，可以将其删除。删除实例集请求后，将取消与实例集关联的所有竞价型实例请求，避免启动任何新的竞价型实例。

删除 EC2 实例集请求后，您还必须指定是否要终止其所有实例。包括按需型实例和竞价型实例。对于 `instant` 实例集，EC2 实例集必须在删除实例集时终止实例。不支持包含正在运行实例的已删除 `instant` 实例集。

**警告**  
**终止实例是永久且不可逆转的。**  
终止一个实例后，您将无法再连接到该实例，而且也无法对其进行恢复操作。被配置为在终止后删除的所有连接的 Amazon EBS 卷也将被永久删除并且无法恢复。实例存储卷中存储的所有数据将永久丢失。有关更多信息，请参阅 [实例终止的工作原理](how-ec2-instance-termination-works.md)。  
在终止实例之前，请务必确保已将需要在终止后保留的所有数据备份到持久存储中。

如果您指定在实例集请求删除后必须终止实例，则实例集请求会进入 `deleted_terminating` 状态。否则，实例集会进入 `deleted_running` 状态，并且实例会继续运行，直到遇到中断或您手动将其终止。

**限制**
+ 在单次操作中，最多可以删除 25 个 `instant` 类型的实例集。
+ 在单次操作中，最多可以删除 100 个 `maintain` 或 `request` 类型的实例集。
+ 在单次操作中，最多可以删除 125 个实例集，前提是不超过上述指定的各类实例集的限额。
+ 如果要删除的实例集超过指定数量，将不会删除任何实例集。
+ 不支持包含正在运行实例的已删除 `instant` 实例集。当您删除 `instant` 实例集时，Amazon EC2 会自动终止其所有实例。对于具有超过 1000 个实例的 `instant` 实例集，删除请求可能会失败。如果您的实例集有超过 1000 个实例，请先手动终止大多数实例，留下 1000 个或更少的实例。然后删除实例集，剩余的实例将自动终止。

------
#### [ AWS CLI ]

**删除 EC2 实例集请求并终止其实例**  
使用带 `--terminate-instances` 选项的 [delete-fleets](https://docs.aws.amazon.com/cli/latest/reference/ec2/delete-fleets.html) 命令。

```
aws ec2 delete-fleets \
    --fleet-ids {{fleet-73fbd2ce-aa30-494c-8788-1cee4EXAMPLE}} \
    --terminate-instances
```

下面是示例输出。

```
{
    "UnsuccessfulFleetDeletions": [], 
    "SuccessfulFleetDeletions": [
        {
            "CurrentFleetState": "deleted_terminating", 
            "PreviousFleetState": "active", 
            "FleetId": "fleet-73fbd2ce-aa30-494c-8788-1cee4EXAMPLE"
        }
    ]
}
```

**删除 EC2 实例集请求但不终止其实例**  
通过改用 `--no-terminate-instances` 选项修改上一个示例。请注意，`instant` 实例集不支持 `--no-terminate-instances`。

```
aws ec2 delete-fleets \
    --fleet-ids {{fleet-73fbd2ce-aa30-494c-8788-1cee4EXAMPLE}} \
    --no-terminate-instances
```

下面是示例输出。

```
{
    "UnsuccessfulFleetDeletions": [], 
    "SuccessfulFleetDeletions": [
        {
            "CurrentFleetState": "deleted_running", 
            "PreviousFleetState": "active", 
            "FleetId": "fleet-4b8aaae8-dfb5-436d-a4c6-3dafa4c6b7dcEXAMPLE"
        }
    ]
}
```

------
#### [ PowerShell ]

**删除 EC2 实例集请求并终止其实例**  
使用带 `-TerminateInstance` 参数的 [Remove-EC2Fleet](https://docs.aws.amazon.com/powershell/latest/reference/items/Remove-EC2Fleet.html) cmdlet。

```
Remove-EC2Fleet `
    -FleetId "{{fleet-73fbd2ce-aa30-494c-8788-1cee4EXAMPLE}}" `
    -TerminateInstance $true
```

**删除 EC2 实例集请求但不终止其实例**  
通过更改 `-TerminateInstance` 参数的值修改上一个示例。

```
Remove-EC2Fleet `
    -FleetId "{{fleet-73fbd2ce-aa30-494c-8788-1cee4EXAMPLE}}" `
    -TerminateInstance $false
```

------

## 实例集无法删除时进行故障排除
<a name="troubleshoot-delete-fleet"></a>

如果 EC2 实例集请求无法删除，则输出中的 `UnsuccessfulFleetDeletions` 将返回 EC2 实例集请求的 ID、错误代码和错误消息。

错误代码为：
+ `ExceededInstantFleetNumForDeletion`
+ `fleetIdDoesNotExist`
+ `fleetIdMalformed`
+ `fleetNotInDeletableState`
+ `NoTerminateInstancesNotSupported`
+ `UnauthorizedOperation`
+ `unexpectedError`

**`ExceededInstantFleetNumForDeletion` 问题排查**  
如果您尝试在单个请求中删除超过 25 个 `instant` 实例集，则会返回 `ExceededInstantFleetNumForDeletion` 错误。下面是此错误的示例输出。

```
{
    "UnsuccessfulFleetDeletions": [
     {
          "FleetId": " fleet-5d130460-0c26-bfd9-2c32-0100a098f625",
          "Error": {
                  "Message": "Can’t delete more than 25 instant fleets in a single request.",
                  "Code": "ExceededInstantFleetNumForDeletion"
           }
     },
     {
           "FleetId": "fleet-9a941b23-0286-5bf4-2430-03a029a07e31",
           "Error": {
                  "Message": "Can’t delete more than 25 instant fleets in a single request.",
                  "Code": "ExceededInstantFleetNumForDeletion"
            }
     }
     .
     .
     .
     ],
     "SuccessfulFleetDeletions": []
}
```

**`NoTerminateInstancesNotSupported` 问题排查**  
如果您指定在删除 `instant` 实例集时不得终止该实例集中的实例，则会返回 `NoTerminateInstancesNotSupported` 错误。`--no-terminate-instances` 实例集不支持 `instant`。下面是此错误的示例输出。

```
{
      "UnsuccessfulFleetDeletions": [
            {
                  "FleetId": "fleet-5d130460-0c26-bfd9-2c32-0100a098f625",
                  "Error": {
                          "Message": "NoTerminateInstances option is not supported for instant fleet",
                          "Code": "NoTerminateInstancesNotSupported"
                   }
            }
       ],
       "SuccessfulFleetDeletions": []
}
```

**`UnauthorizedOperation` 问题排查**  
如果您没有终止实例的权限，则在删除必须终止其实例的实例集时会收到 `UnauthorizedOperation` 错误。下面是错误响应。

```
<Response><Errors><Error><Code>UnauthorizedOperation</Code><Message>You are not authorized to perform this 
operation. Encoded authorization failure message: VvuncIxj7Z_CPGNYXWqnuFV-YjByeAU66Q9752NtQ-I3-qnDLWs6JLFd
KnSMMiq5s6cGqjjPtEDpsnGHzzyHasFHOaRYJpaDVravoW25azn6KNkUQQlFwhJyujt2dtNCdduJfrqcFYAjlEiRMkfDHt7N63SKlweKUl
BHturzDK6A560Y2nDSUiMmAB1y9UNtqaZJ9SNe5sNxKMqZaqKtjRbk02RZu5V2vn9VMk6fm2aMVHbY9JhLvGypLcMUjtJ76H9ytg2zRlje
VPiU5v2s-UgZ7h0p2yth6ysUdhlONg6dBYu8_y_HtEI54invCj4CoK0qawqzMNe6rcmCQHvtCxtXsbkgyaEbcwmrm2m01-EMhekLFZeJLr
DtYOpYcEl4_nWFX1wtQDCnNNCmxnJZAoJvb3VMDYpDTsxjQv1PxODZuqWHs23YXWVywzgnLtHeRf2o4lUhGBw17mXsS07k7XAfdPMP_brO
PT9vrHtQiILor5VVTsjSPWg7edj__1rsnXhwPSu8gI48ZLRGrPQqFq0RmKO_QIE8N8s6NWzCK4yoX-9gDcheurOGpkprPIC9YPGMLK9tug
</Message></Error></Errors><RequestID>89b1215c-7814-40ae-a8db-41761f43f2b0</RequestID></Response>
```

为了解决错误，您必须将 `ec2:TerminateInstances` 操作添加到 IAM policy，如下例中所示。