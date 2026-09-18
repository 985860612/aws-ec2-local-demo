

# 监控 Amazon EC2 上的 Elastic Fabric Adapter
<a name="efa-working-monitor"></a>

您可以使用以下功能监控 Elastic Fabric Adapters 的性能。

**Topics**
+ [Amazon EC2 实例的 EFA 驱动程序指标](#efa-driver-metrics)
+ [Amazon VPC 流日志](#efa-flowlog)
+ [Amazon CloudWatch](#efa-cloudwatch)

## Amazon EC2 实例的 EFA 驱动程序指标
<a name="efa-driver-metrics"></a>

Elastic Fabric Adapter（EFA）驱动程序实时发布来自已挂载 EFA 接口的实例的多个指标。您可以使用这些指标来排查应用程序性能和网络问题、为工作负载选择合适的集群大小、主动计划扩缩活动以及对应用程序进行基准测试，以确定是否最大限度利用了实例上可用的 EFA 性能。

**Topics**
+ [可用的 EFA 驱动程序指标](#available-efa-metrics)
+ [检索实例的 EFA 驱动程序指标](#view-efa-driver-metrics)

### 可用的 EFA 驱动程序指标
<a name="available-efa-metrics"></a>

ENA 驱动程序会实时向实例发布以下指标。这些指标提供了自实例启动或上次驱动程序重置以来的累计错误数、连接事件数以及所挂载 EFA 设备发送、接收、重新传输或丢弃的数据包数。


| 指标 | 说明 | 支持的实例类型 | 
| --- | --- | --- | 
| tx\_bytes | 传输的字节数。<br />单位：字节 | 支持 EFA 的所有实例类型 | 
| rx\_bytes | 收到的字节数。<br />单位：字节 | 支持 EFA 的所有实例类型 | 
| tx\_pkts | 传输的数据包数。<br />单位：计数 | 支持 EFA 的所有实例类型 | 
| rx\_pkts | 收到的数据包数。<br />单位：计数 | 支持 EFA 的所有实例类型 | 
| rx\_drops | 收到但随后丢弃的数据包数。<br />单位：计数 | 支持 EFA 的所有实例类型 | 
| send\_bytes | 使用发送操作发送的字节数。<br />单位：字节 | 支持 EFA 的所有实例类型 | 
| recv\_bytes | 通过发送操作收到的字节数。<br />单位：字节 | 支持 EFA 的所有实例类型 | 
| send\_wrs | 使用发送操作发送的数据包数。<br />单位：计数 | 支持 EFA 的所有实例类型 | 
| recv\_wrs | 通过发送操作收到的数据包数。<br />单位：计数 | 支持 EFA 的所有实例类型 | 
| rdma\_write\_wrs | 已完成的 rdma 写入操作数。<br />单位：计数 | 支持 EFA 的所有实例类型 | 
| rdma\_read\_wrs | 已完成的 rdma 读取操作数。<br />单位：计数 | 支持 EFA 的所有实例类型 | 
| rdma\_write\_bytes | 其他实例通过 rdma 写入操作写入的字节数。<br />单位：字节 | 支持 EFA 的所有实例类型 | 
| rdma\_read\_bytes | 通过 rdma 读取操作收到的字节数。<br />单位：字节 | 支持 EFA 的所有实例类型 | 
| rdma\_write\_wr\_err | 出现本地或远程错误的 rdma 写入操作数。<br />单位：计数 | 支持 EFA 的所有实例类型 | 
| rdma\_read\_wr\_err | 出现本地或远程错误的 rdma 读取操作数。<br />单位：计数 | 支持 EFA 的所有实例类型 | 
| rdma\_read\_resp\_bytes | 为响应 rdma 读取操作而发送的字节数。<br />单位：字节 | 支持 EFA 的所有实例类型 | 
| rdma\_write\_recv\_bytes | 通过 rdma 写入操作收到的字节数。<br />单位：字节 | 支持 EFA 的所有实例类型 | 
| retrans\_bytes | 重新传输的 EFA SRD 字节数。<br />单位：计数 | 支持 EFA 的 Nitro v4 及更高版本的实例类型 | 
| retrans\_pkts | 重新传输的 EFA SRD 数据包数。<br />单位：字节 | 支持 EFA 的 Nitro v4 及更高版本的实例类型 | 
| retrans\_timeout\_events | EFA SRD 流量超时并导致网络路径更改的次数。<br />单位：计数 | 支持 EFA 的 Nitro v4 及更高版本的实例类型 | 
| impaired\_remote\_conn\_events | EFA SRD 连接进入受损状态，从而导致吞吐速率限制降低的次数。<br />单位：计数 | 支持 EFA 的 Nitro v4 及更高版本的实例类型 | 
| unresponsive\_remote\_events | EFA SRD 远程连接无响应的次数。<br />单位：计数 | 支持 EFA 的 Nitro v4 及更高版本的实例类型 | 

有关支持 EFA 的实例类型的更多信息，请参阅[支持的实例类型](efa.md#efa-instance-types)。

### 检索实例的 EFA 驱动程序指标
<a name="view-efa-driver-metrics"></a>

您可以使用 [rdma-tool](https://man7.org/linux/man-pages/man8/rdma.8.html) 命令行工具来检索挂载到实例的所有 EFA 接口的指标，如下所示：

```
$ rdma -p statistic show
link rdmap0s31/1 
    tx_bytes 0 
    tx_pkts 0 
    rx_bytes 0 
    rx_pkts 0 
    rx_drops 0 
    send_bytes 0 
    send_wrs 0 
    recv_bytes 0 
    recv_wrs 0 
    rdma_read_wrs 0 
    rdma_read_bytes 0 
    rdma_read_wr_err 0 
    rdma_read_resp_bytes 0 
    rdma_write_wrs 0 
    rdma_write_bytes 0 
    rdma_write_wr_err 0
    retrans_bytes 0
    retrans_pkts 0
    retrans_timeout_events 0
    unresponsive_remote_events 0
    impaired_remote_conn_events 0
```

您也可以使用以下命令从 sys 文件中检索挂载到实例的每个 EFA 接口的指标。

```
$ more /sys/class/infiniband/{{device_number}}/ports/{{port_number}}/hw_counters/* | cat
```

例如

```
$ more /sys/class/infiniband/rdmap0s31/ports/1/hw_counters/* | cat
::::::::::::::
/sys/class/infiniband/rdmap0s31/ports/1/hw_counters/lifespan
::::::::::::::
12
::::::::::::::
/sys/class/infiniband/rdmap0s31/ports/1/hw_counters/rdma_read_bytes
::::::::::::::
0
::::::::::::::
/sys/class/infiniband/rdmap0s31/ports/1/hw_counters/rdma_read_resp_bytes
::::::::::::::
0
::::::::::::::
/sys/class/infiniband/rdmap0s31/ports/1/hw_counters/rdma_read_wr_err
::::::::::::::
0
::::::::::::::
/sys/class/infiniband/rdmap0s31/ports/1/hw_counters/rdma_read_wrs
::::::::::::::
0
::::::::::::::
/sys/class/infiniband/rdmap0s31/ports/1/hw_counters/rdma_write_bytes
::::::::::::::
0
::::::::::::::
/sys/class/infiniband/rdmap0s31/ports/1/hw_counters/rdma_write_recv_bytes
::::::::::::::
0
::::::::::::::
/sys/class/infiniband/rdmap0s31/ports/1/hw_counters/rdma_write_wr_err
::::::::::::::
0
::::::::::::::
/sys/class/infiniband/rdmap0s31/ports/1/hw_counters/rdma_write_wrs
::::::::::::::
0
::::::::::::::
/sys/class/infiniband/rdmap0s31/ports/1/hw_counters/recv_bytes
::::::::::::::
0
::::::::::::::
/sys/class/infiniband/rdmap0s31/ports/1/hw_counters/recv_wrs
::::::::::::::
0
::::::::::::::
/sys/class/infiniband/rdmap0s31/ports/1/hw_counters/rx_bytes
::::::::::::::
0
::::::::::::::
/sys/class/infiniband/rdmap0s31/ports/1/hw_counters/rx_drops
::::::::::::::
0
::::::::::::::
/sys/class/infiniband/rdmap0s31/ports/1/hw_counters/rx_pkts
::::::::::::::
0
::::::::::::::
/sys/class/infiniband/rdmap0s31/ports/1/hw_counters/send_bytes
::::::::::::::
0
::::::::::::::
/sys/class/infiniband/rdmap0s31/ports/1/hw_counters/send_wrs
::::::::::::::
0
::::::::::::::
/sys/class/infiniband/rdmap0s31/ports/1/hw_counters/tx_bytes
::::::::::::::
0
::::::::::::::
/sys/class/infiniband/rdmap0s31/ports/1/hw_counters/tx_pkts
::::::::::::::
0
::::::::::::::
/sys/class/infiniband/rdmap0s31/ports/1/hw_counters/retrans_bytes
::::::::::::::
0
/sys/class/infiniband/rdmap0s31/ports/1/hw_counters/retrans_pkts
::::::::::::::
0
/sys/class/infiniband/rdmap0s31/ports/1/hw_counters/retrans_timeout_events
::::::::::::::
0
/sys/class/infiniband/rdmap0s31/ports/1/hw_counters/unresponsive_remote_events
::::::::::::::
0
/sys/class/infiniband/rdmap0s31/ports/1/hw_counters/impaired_remote_conn_events
::::::::::::::
0
```

## Amazon VPC 流日志
<a name="efa-flowlog"></a>

您可以创建 Amazon VPC 流日志以捕获有关进出 EFA 的流量的信息。流日志数据可以发布到 Amazon CloudWatch Logs 和 Amazon S3。在创建流日志后，您可以在所选的目标中检索和查看其数据。有关更多信息，请参阅 *Amazon VPC 用户指南* 中的 [VPC 流日志](https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html)。

您可以使用为弹性网络接口创建流日志的相同方式为 EFA 创建流日志。有关更多信息，请参阅《*Amazon VPC 用户指南*》中的[创建流日志](https://docs.aws.amazon.com/vpc/latest/userguide/working-with-flow-logs.html#create-flow-log)。

在流日志条目中，EFA 流量由 `srcAddress` 和 `destAddress` 标识，二者都格式化为 MAC 地址，如以下示例中所示。

```
version accountId  eniId        srcAddress        destAddress       sourcePort destPort protocol packets bytes start      end        action log-status
2       3794735123 eni-10000001 01:23:45:67:89:ab 05:23:45:67:89:ab -          -        -        9       5689  1521232534 1524512343 ACCEPT OK
```

## Amazon CloudWatch
<a name="efa-cloudwatch"></a>

如果在 Amazon EKS 集群中使用 EFA，则可以使用 CloudWatch Container Insights 监控您的 EFA。Amazon CloudWatch Container Insights 支持所有 [EFA 驱动指标](#efa-driver-metrics)，以下指标除外：`retrans_bytes`、`retrans_pkts`、`retrans_timeout_events`、`unresponsive_remote_events` 和 `impaired_remote_conn_events`。

有关更多信息，请参阅《Amazon CloudWatch 用户指南》中的 [Amazon EKS 和 Kubernetes Container Insights 指标](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-metrics-enhanced-EKS.html#Container-Insights-metrics-EFA)**。