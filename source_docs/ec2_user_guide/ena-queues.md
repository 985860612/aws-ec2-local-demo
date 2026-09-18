

# ENA 实例集数
<a name="ena-queues"></a>

弹性网络适配器（ENA）队列处理 Amazon EC2 网络接口的数据包。每种实例类型都有一定数量的 ENA 队列，这些队列在其弹性网络接口（ENI）之间共享。默认情况下，每个 ENI 都会根据实例类型和大小获得固定的队列计数。

通过可配置的 ENA 队列分配，您可以选择每个 ENI 获得多少个队列。每个 ENI 和每个实例的总数仍然有限制。这有助于您将数据包处理与工作负载相匹配。例如，您可以为流量较大的 ENI 分配更多队列，为流量较小的 ENI 分配更少队列。

**Topics**
+ [EC2 实例类型的 ENA 队列规范](#supported-instances)
+ [配置 ENA 队列分配](#modify)

## EC2 实例类型的 ENA 队列规范
<a name="supported-instances"></a>

下表列出了支持可配置的 ENA 队列分配的实例类型及其默认队列值和最大队列值。

**注意**  
有关所有实例类型（包括不支持可配置的 ENA 队列分配的类型）的 ENA 队列值，请参阅《Amazon EC2 实例类型》**指南中的[网络规格表](https://docs.aws.amazon.com/ec2/latest/instancetypes/ec2-instance-type-specifications.html)。

------
#### [ General purpose ]


| 实例类型 | 每个接口的默认 ENA 实例集 | 每个接口的最大 ENA 实例集数 | 每个实例的最大 ENA 实例集数 | 
| --- | --- | --- | --- | 
| m6i.large | 2 | 2 | 6 | 
| m6i.xlarge | 4 | 4 | 16 | 
| m6i.2xlarge | 8 | 8 | 32 | 
| m6i.4xlarge | 8 | 16 | 64 | 
| m6i.8xlarge | 8 | 32 | 64 | 
| m6i.12xlarge | 8 | 32 | 64 | 
| m6i.16xlarge | 8 | 32 | 120 | 
| m6i.24xlarge | 8 | 32 | 120 | 
| m6i.32xlarge | 8 | 32 | 120 | 
| m6id.large | 2 | 2 | 6 | 
| m6id.xlarge | 4 | 4 | 16 | 
| m6id.2xlarge | 8 | 8 | 32 | 
| m6id.4xlarge | 8 | 16 | 64 | 
| m6id.8xlarge | 8 | 32 | 64 | 
| m6id.12xlarge | 8 | 32 | 64 | 
| m6id.16xlarge | 8 | 32 | 120 | 
| m6id.24xlarge | 8 | 32 | 120 | 
| m6id.32xlarge | 8 | 32 | 120 | 
| m6idn.large | 2 | 2 | 6 | 
| m6idn.xlarge | 4 | 4 | 16 | 
| m6idn.2xlarge | 8 | 8 | 32 | 
| m6idn.4xlarge | 8 | 16 | 64 | 
| m6idn.8xlarge | 16 | 32 | 128 | 
| m6idn.12xlarge | 16 | 32 | 128 | 
| m6idn.16xlarge | 16 | 32 | 240 | 
| m6idn.24xlarge | 32 | 32 | 480 | 
| m6idn.32xlarge | 32 | 32 | 512 | 
| m6in.large | 2 | 2 | 6 | 
| m6in.xlarge | 4 | 4 | 16 | 
| m6in.2xlarge | 8 | 8 | 32 | 
| m6in.4xlarge | 8 | 16 | 64 | 
| m6in.8xlarge | 16 | 32 | 128 | 
| m6in.12xlarge | 16 | 32 | 128 | 
| m6in.16xlarge | 16 | 32 | 240 | 
| m6in.24xlarge | 32 | 32 | 480 | 
| m6in.32xlarge | 32 | 32 | 512 | 
| m8a.medium | 1 | 1 | 3 | 
| m8a.large | 2 | 2 | 6 | 
| m8a.xlarge | 4 | 4 | 16 | 
| m8a.2xlarge | 8 | 8 | 32 | 
| m8a.4xlarge | 8 | 16 | 64 | 
| m8a.8xlarge | 8 | 32 | 128 | 
| m8a.12xlarge | 16 | 64 | 192 | 
| m8a.16xlarge | 16 | 64 | 256 | 
| m8a.24xlarge | 16 | 128 | 384 | 
| m8a.48xlarge | 32 | 128 | 768 | 
| m8a.metal-24xl | 16 | 128 | 384 | 
| m8a.metal-48xl | 32 | 128 | 768 | 
| m8azn.medium | 1 | 1 | 3 | 
| m8azn.large | 2 | 2 | 8 | 
| m8azn.xlarge | 4 | 4 | 16 | 
| m8azn.3xlarge | 4 | 16 | 48 | 
| m8azn.6xlarge | 8 | 32 | 96 | 
| m8azn.12xlarge | 8 | 64 | 192 | 
| m8azn.24xlarge | 16 | 128 | 384 | 
| m8azn.metal-12xl | 8 | 64 | 192 | 
| m8azn.metal-24xl | 16 | 128 | 384 | 
| m8gb.medium | 1 | 1 | 2 | 
| m8gb.large | 2 | 2 | 6 | 
| m8gb.xlarge | 4 | 4 | 16 | 
| m8gb.2xlarge | 8 | 8 | 32 | 
| m8gb.4xlarge | 8 | 16 | 64 | 
| m8gb.8xlarge | 8 | 32 | 128 | 
| m8gb.12xlarge | 16 | 64 | 192 | 
| m8gb.16xlarge | 16 | 64 | 256 | 
| m8gb.24xlarge | 16 | 128 | 384 | 
| m8gb.48xlarge | 32 | 128 | 768 | 
| m8gb.metal-24xl | 32 | 128 | 768 | 
| m8gb.metal-48xl | 32 | 128 | 768 | 
| m8gn.medium | 1 | 1 | 2 | 
| m8gn.large | 2 | 2 | 6 | 
| m8gn.xlarge | 4 | 4 | 16 | 
| m8gn.2xlarge | 8 | 8 | 32 | 
| m8gn.4xlarge | 8 | 16 | 64 | 
| m8gn.8xlarge | 8 | 32 | 128 | 
| m8gn.12xlarge | 16 | 64 | 192 | 
| m8gn.16xlarge | 16 | 64 | 256 | 
| m8gn.24xlarge | 16 | 128 | 384 | 
| m8gn.48xlarge | 32 | 128 | 768 | 
| m8gn.metal-24xl | 32 | 128 | 768 | 
| m8gn.metal-48xl | 32 | 128 | 768 | 
| m8i.large | 2 | 2 | 6 | 
| m8i.xlarge | 4 | 4 | 16 | 
| m8i.2xlarge | 8 | 8 | 32 | 
| m8i.4xlarge | 8 | 16 | 64 | 
| m8i.8xlarge | 8 | 32 | 128 | 
| m8i.12xlarge | 16 | 64 | 192 | 
| m8i.16xlarge | 16 | 64 | 256 | 
| m8i.24xlarge | 16 | 128 | 384 | 
| m8i.32xlarge | 16 | 128 | 512 | 
| m8i.48xlarge | 32 | 128 | 768 | 
| m8i.96xlarge | 32 | 128 | 1536 | 
| m8i.metal-48xl | 32 | 128 | 768 | 
| m8i.metal-96xl | 32 | 128 | 1536 | 
| m8id.large | 2 | 2 | 6 | 
| m8id.xlarge | 4 | 4 | 16 | 
| m8id.2xlarge | 8 | 8 | 32 | 
| m8id.4xlarge | 8 | 16 | 64 | 
| m8id.8xlarge | 8 | 32 | 128 | 
| m8id.12xlarge | 16 | 64 | 192 | 
| m8id.16xlarge | 16 | 64 | 256 | 
| m8id.24xlarge | 16 | 128 | 384 | 
| m8id.32xlarge | 16 | 128 | 512 | 
| m8id.48xlarge | 32 | 128 | 768 | 
| m8id.96xlarge | 32 | 128 | 1536 | 
| m8id.metal-48xl | 32 | 128 | 768 | 
| m8id.metal-96xl | 32 | 128 | 1536 | 
| m8i-flex.large | 1 | 1 | 3 | 
| m8i-flex.xlarge | 2 | 2 | 8 | 
| m8i-flex.2xlarge | 4 | 4 | 16 | 
| m8i-flex.4xlarge | 4 | 8 | 32 | 
| m8i-flex.8xlarge | 4 | 16 | 64 | 
| m8i-flex.12xlarge | 8 | 32 | 96 | 
| m8i-flex.16xlarge | 8 | 32 | 128 | 
| m8in.large | 2 | 2 | 8 | 
| m8in.xlarge | 4 | 4 | 16 | 
| m8in.2xlarge | 8 | 8 | 32 | 
| m8in.4xlarge | 8 | 16 | 64 | 
| m8in.8xlarge | 16 | 32 | 128 | 
| m8in.12xlarge | 16 | 64 | 192 | 
| m8in.16xlarge | 16 | 64 | 256 | 
| m8in.24xlarge | 16 | 128 | 256 | 
| m8in.32xlarge | 32 | 128 | 512 | 
| m8in.48xlarge | 32 | 128 | 768 | 
| m8in.96xlarge | 32 | 128 | 1536 \* | 
| m8in.metal-48xl | 32 | 128 | 768 | 
| m8in.metal-96xl | 32 | 128 | 1536 \* | 
| m8idn.large | 2 | 2 | 8 | 
| m8idn.xlarge | 4 | 4 | 16 | 
| m8idn.2xlarge | 8 | 8 | 32 | 
| m8idn.4xlarge | 8 | 16 | 64 | 
| m8idn.8xlarge | 16 | 32 | 128 | 
| m8idn.12xlarge | 16 | 64 | 192 | 
| m8idn.16xlarge | 16 | 64 | 256 | 
| m8idn.24xlarge | 16 | 128 | 256 | 
| m8idn.32xlarge | 32 | 128 | 512 | 
| m8idn.48xlarge | 32 | 128 | 768 | 
| m8idn.96xlarge | 32 | 128 | 1536 \* | 
| m8idn.metal-48xl | 32 | 128 | 768 | 
| m8idn.metal-96xl | 32 | 128 | 1536 \* | 
| m8ine.large | 2 | 2 | 8 | 
| m8ine.xlarge | 4 | 4 | 16 | 
| m8ine.2xlarge | 8 | 8 | 32 | 
| m8ine.4xlarge | 16 | 16 | 128 | 
| m8ine.8xlarge | 32 | 32 | 256 | 
| m8ine.12xlarge | 32 | 64 | 384 | 
| m8ib.large | 2 | 2 | 8 | 
| m8ib.xlarge | 4 | 4 | 16 | 
| m8ib.2xlarge | 8 | 8 | 32 | 
| m8ib.4xlarge | 8 | 16 | 64 | 
| m8ib.8xlarge | 16 | 32 | 128 | 
| m8ib.12xlarge | 16 | 64 | 192 | 
| m8ib.16xlarge | 16 | 64 | 256 | 
| m8ib.24xlarge | 16 | 128 | 256 | 
| m8ib.32xlarge | 32 | 128 | 512 | 
| m8ib.48xlarge | 32 | 128 | 768 | 
| m8ib.96xlarge | 32 | 128 | 1536 \* | 
| m8ib.metal-48xl | 32 | 128 | 768 | 
| m8ib.metal-96xl | 32 | 128 | 1536 \* | 
| m8idb.large | 2 | 2 | 8 | 
| m8idb.xlarge | 4 | 4 | 16 | 
| m8idb.2xlarge | 8 | 8 | 32 | 
| m8idb.4xlarge | 8 | 16 | 64 | 
| m8idb.8xlarge | 16 | 32 | 128 | 
| m8idb.12xlarge | 16 | 64 | 192 | 
| m8idb.16xlarge | 16 | 64 | 256 | 
| m8idb.24xlarge | 16 | 128 | 256 | 
| m8idb.32xlarge | 32 | 128 | 512 | 
| m8idb.48xlarge | 32 | 128 | 768 | 
| m8idb.96xlarge | 32 | 128 | 1536 \* | 
| m8idb.metal-48xl | 32 | 128 | 768 | 
| m8idb.metal-96xl | 32 | 128 | 1536 \* | 
| m9g.medium | 1 | 1 | 2 | 
| m9g.large | 2 | 2 | 6 | 
| m9g.xlarge | 4 | 4 | 16 | 
| m9g.2xlarge | 8 | 8 | 32 | 
| m9g.4xlarge | 8 | 16 | 64 | 
| m9g.8xlarge | 8 | 32 | 128 | 
| m9g.12xlarge | 16 | 64 | 192 | 
| m9g.16xlarge | 16 | 64 | 256 | 
| m9g.24xlarge | 16 | 128 | 384 | 
| m9g.48xlarge | 32 | 128 | 768 | 
| m9g.metal-48xl | 32 | 128 | 768 | 
| m9gd.medium | 1 | 1 | 2 | 
| m9gd.large | 2 | 2 | 6 | 
| m9gd.xlarge | 4 | 4 | 16 | 
| m9gd.2xlarge | 8 | 8 | 32 | 
| m9gd.4xlarge | 8 | 16 | 64 | 
| m9gd.8xlarge | 8 | 32 | 128 | 
| m9gd.12xlarge | 16 | 64 | 192 | 
| m9gd.16xlarge | 16 | 64 | 256 | 
| m9gd.24xlarge | 16 | 128 | 384 | 
| m9gd.48xlarge | 32 | 128 | 768 | 
| m9gd.metal-48xl | 32 | 128 | 768 | 

------
#### [ Compute optimized ]


| 实例类型 | 每个接口的默认 ENA 实例集 | 每个接口的最大 ENA 实例集数 | 每个实例的最大 ENA 实例集数 | 
| --- | --- | --- | --- | 
| c6i.large | 2 | 2 | 6 | 
| c6i.xlarge | 4 | 4 | 16 | 
| c6i.2xlarge | 8 | 8 | 32 | 
| c6i.4xlarge | 8 | 16 | 64 | 
| c6i.8xlarge | 8 | 32 | 64 | 
| c6i.12xlarge | 8 | 32 | 64 | 
| c6i.16xlarge | 8 | 32 | 120 | 
| c6i.24xlarge | 8 | 32 | 120 | 
| c6i.32xlarge | 8 | 32 | 120 | 
| c6id.large | 2 | 2 | 6 | 
| c6id.xlarge | 4 | 4 | 16 | 
| c6id.2xlarge | 8 | 8 | 32 | 
| c6id.4xlarge | 8 | 16 | 64 | 
| c6id.8xlarge | 8 | 32 | 64 | 
| c6id.12xlarge | 8 | 32 | 64 | 
| c6id.16xlarge | 8 | 32 | 120 | 
| c6id.24xlarge | 8 | 32 | 120 | 
| c6id.32xlarge | 8 | 32 | 120 | 
| c6in.large | 2 | 2 | 6 | 
| c6in.xlarge | 4 | 4 | 16 | 
| c6in.2xlarge | 8 | 8 | 32 | 
| c6in.4xlarge | 8 | 16 | 64 | 
| c6in.8xlarge | 16 | 32 | 128 | 
| c6in.12xlarge | 16 | 32 | 128 | 
| c6in.16xlarge | 16 | 32 | 240 | 
| c6in.24xlarge | 32 | 32 | 480 | 
| c6in.32xlarge | 32 | 32 | 512 | 
| c8a.medium | 1 | 1 | 3 | 
| c8a.large | 2 | 2 | 6 | 
| c8a.xlarge | 4 | 4 | 16 | 
| c8a.2xlarge | 8 | 8 | 32 | 
| c8a.4xlarge | 8 | 16 | 64 | 
| c8a.8xlarge | 8 | 32 | 128 | 
| c8a.12xlarge | 16 | 64 | 192 | 
| c8a.16xlarge | 16 | 64 | 256 | 
| c8a.24xlarge | 16 | 128 | 384 | 
| c8a.48xlarge | 32 | 128 | 768 | 
| c8a.metal-24xl | 16 | 128 | 384 | 
| c8a.metal-48xl | 32 | 128 | 768 | 
| c8gb.medium | 1 | 1 | 2 | 
| c8gb.large | 2 | 2 | 6 | 
| c8gb.xlarge | 4 | 4 | 16 | 
| c8gb.2xlarge | 8 | 8 | 32 | 
| c8gb.4xlarge | 8 | 16 | 64 | 
| c8gb.8xlarge | 8 | 32 | 128 | 
| c8gb.12xlarge | 16 | 64 | 192 | 
| c8gb.16xlarge | 16 | 64 | 256 | 
| c8gb.24xlarge | 16 | 128 | 384 | 
| c8gb.48xlarge | 32 | 128 | 768 | 
| c8gb.metal-24xl | 32 | 128 | 768 | 
| c8gb.metal-48xl | 32 | 128 | 768 | 
| c8gn.medium | 1 | 1 | 2 | 
| c8gn.large | 2 | 2 | 6 | 
| c8gn.xlarge | 4 | 4 | 16 | 
| c8gn.2xlarge | 8 | 8 | 32 | 
| c8gn.4xlarge | 8 | 16 | 64 | 
| c8gn.8xlarge | 8 | 32 | 128 | 
| c8gn.12xlarge | 16 | 64 | 192 | 
| c8gn.16xlarge | 16 | 64 | 256 | 
| c8gn.24xlarge | 16 | 128 | 384 | 
| c8gn.48xlarge | 32 | 128 | 768 | 
| c8gn.metal-24xl | 32 | 128 | 768 | 
| c8gn.metal-48xl | 32 | 128 | 768 | 
| c8i.large | 2 | 2 | 6 | 
| c8i.xlarge | 4 | 4 | 16 | 
| c8i.2xlarge | 8 | 8 | 32 | 
| c8i.4xlarge | 8 | 16 | 64 | 
| c8i.8xlarge | 8 | 32 | 128 | 
| c8i.12xlarge | 16 | 64 | 192 | 
| c8i.16xlarge | 16 | 64 | 256 | 
| c8i.24xlarge | 16 | 128 | 384 | 
| c8i.32xlarge | 16 | 128 | 512 | 
| c8i.48xlarge | 32 | 128 | 768 | 
| c8i.96xlarge | 32 | 128 | 1536 | 
| c8i.metal-48xl | 32 | 128 | 768 | 
| c8i.metal-96xl | 32 | 128 | 1536 | 
| c8id.large | 2 | 2 | 6 | 
| c8id.xlarge | 4 | 4 | 16 | 
| c8id.2xlarge | 8 | 8 | 32 | 
| c8id.4xlarge | 8 | 16 | 64 | 
| c8id.8xlarge | 8 | 32 | 128 | 
| c8id.12xlarge | 16 | 64 | 192 | 
| c8id.16xlarge | 16 | 64 | 256 | 
| c8id.24xlarge | 16 | 128 | 384 | 
| c8id.32xlarge | 16 | 128 | 512 | 
| c8id.48xlarge | 32 | 128 | 768 | 
| c8id.96xlarge | 32 | 128 | 1536 | 
| c8id.metal-48xl | 32 | 128 | 768 | 
| c8id.metal-96xl | 32 | 128 | 1536 | 
| c8i-flex.large | 1 | 1 | 3 | 
| c8i-flex.xlarge | 2 | 2 | 8 | 
| c8i-flex.2xlarge | 4 | 4 | 16 | 
| c8i-flex.4xlarge | 4 | 8 | 32 | 
| c8i-flex.8xlarge | 4 | 16 | 64 | 
| c8i-flex.12xlarge | 8 | 32 | 96 | 
| c8i-flex.16xlarge | 8 | 32 | 128 | 
| c8in.large | 2 | 2 | 8 | 
| c8in.xlarge | 4 | 4 | 16 | 
| c8in.2xlarge | 8 | 8 | 32 | 
| c8in.4xlarge | 8 | 16 | 64 | 
| c8in.8xlarge | 16 | 32 | 128 | 
| c8in.12xlarge | 16 | 64 | 192 | 
| c8in.16xlarge | 16 | 64 | 256 | 
| c8in.24xlarge | 16 | 128 | 256 | 
| c8in.32xlarge | 32 | 128 | 512 | 
| c8in.48xlarge | 32 | 128 | 768 | 
| c8in.96xlarge | 32 | 128 | 1536 \* | 
| c8in.metal-48xl | 32 | 128 | 768 | 
| c8in.metal-96xl | 32 | 128 | 1536 \* | 
| c8ine.large | 2 | 2 | 8 | 
| c8ine.xlarge | 4 | 4 | 16 | 
| c8ine.2xlarge | 8 | 8 | 32 | 
| c8ine.4xlarge | 16 | 16 | 128 | 
| c8ine.8xlarge | 32 | 32 | 256 | 
| c8ine.12xlarge | 32 | 64 | 384 | 
| c8ib.large | 2 | 2 | 8 | 
| c8ib.xlarge | 4 | 4 | 16 | 
| c8ib.2xlarge | 8 | 8 | 32 | 
| c8ib.4xlarge | 8 | 16 | 64 | 
| c8ib.8xlarge | 16 | 32 | 128 | 
| c8ib.12xlarge | 16 | 64 | 192 | 
| c8ib.16xlarge | 16 | 64 | 256 | 
| c8ib.24xlarge | 16 | 128 | 256 | 
| c8ib.32xlarge | 32 | 128 | 512 | 
| c8ib.48xlarge | 32 | 128 | 768 | 
| c8ib.96xlarge | 32 | 128 | 1536 \* | 
| c8ib.metal-48xl | 32 | 128 | 768 | 
| c8ib.metal-96xl | 32 | 128 | 1536 \* | 
| c9g.medium | 1 | 1 | 2 | 
| c9g.large | 2 | 2 | 6 | 
| c9g.xlarge | 4 | 4 | 16 | 
| c9g.2xlarge | 8 | 8 | 32 | 
| c9g.4xlarge | 8 | 16 | 64 | 
| c9g.8xlarge | 8 | 32 | 128 | 
| c9g.12xlarge | 16 | 64 | 192 | 
| c9g.16xlarge | 16 | 64 | 256 | 
| c9g.24xlarge | 16 | 128 | 384 | 
| c9g.48xlarge | 32 | 128 | 768 | 
| c9g.metal-48xl | 32 | 128 | 768 | 
| c9gd.medium | 1 | 1 | 2 | 
| c9gd.large | 2 | 2 | 6 | 
| c9gd.xlarge | 4 | 4 | 16 | 
| c9gd.2xlarge | 8 | 8 | 32 | 
| c9gd.4xlarge | 8 | 16 | 64 | 
| c9gd.8xlarge | 8 | 32 | 128 | 
| c9gd.12xlarge | 16 | 64 | 192 | 
| c9gd.16xlarge | 16 | 64 | 256 | 
| c9gd.24xlarge | 16 | 128 | 384 | 
| c9gd.48xlarge | 32 | 128 | 768 | 
| c9gd.metal-48xl | 32 | 128 | 768 | 

------
#### [ Memory optimized ]


| 实例类型 | 每个接口的默认 ENA 实例集 | 每个接口的最大 ENA 实例集数 | 每个实例的最大 ENA 实例集数 | 
| --- | --- | --- | --- | 
| r6i.large | 2 | 2 | 6 | 
| r6i.xlarge | 4 | 4 | 16 | 
| r6i.2xlarge | 8 | 8 | 32 | 
| r6i.4xlarge | 8 | 16 | 64 | 
| r6i.8xlarge | 8 | 32 | 64 | 
| r6i.12xlarge | 8 | 32 | 64 | 
| r6i.16xlarge | 8 | 32 | 120 | 
| r6i.24xlarge | 8 | 32 | 120 | 
| r6i.32xlarge | 8 | 32 | 120 | 
| r6id.large | 2 | 2 | 6 | 
| r6id.xlarge | 4 | 4 | 16 | 
| r6id.2xlarge | 8 | 8 | 32 | 
| r6id.4xlarge | 8 | 16 | 64 | 
| r6id.8xlarge | 8 | 32 | 64 | 
| r6id.12xlarge | 8 | 32 | 64 | 
| r6id.16xlarge | 8 | 32 | 120 | 
| r6id.24xlarge | 8 | 32 | 120 | 
| r6id.32xlarge | 8 | 32 | 120 | 
| r6idn.large | 2 | 2 | 6 | 
| r6idn.xlarge | 4 | 4 | 16 | 
| r6idn.2xlarge | 8 | 8 | 32 | 
| r6idn.4xlarge | 8 | 16 | 64 | 
| r6idn.8xlarge | 16 | 32 | 128 | 
| r6idn.12xlarge | 16 | 32 | 128 | 
| r6idn.16xlarge | 16 | 32 | 240 | 
| r6idn.24xlarge | 32 | 32 | 480 | 
| r6idn.32xlarge | 32 | 32 | 512 | 
| r6in.large | 2 | 2 | 6 | 
| r6in.xlarge | 4 | 4 | 16 | 
| r6in.2xlarge | 8 | 8 | 32 | 
| r6in.4xlarge | 8 | 16 | 64 | 
| r6in.8xlarge | 16 | 32 | 128 | 
| r6in.12xlarge | 16 | 32 | 128 | 
| r6in.16xlarge | 16 | 32 | 240 | 
| r6in.24xlarge | 32 | 32 | 480 | 
| r6in.32xlarge | 32 | 32 | 512 | 
| r8a.medium | 1 | 1 | 3 | 
| r8a.large | 2 | 2 | 6 | 
| r8a.xlarge | 4 | 4 | 16 | 
| r8a.2xlarge | 8 | 8 | 32 | 
| r8a.4xlarge | 8 | 16 | 64 | 
| r8a.8xlarge | 8 | 32 | 128 | 
| r8a.12xlarge | 16 | 64 | 192 | 
| r8a.16xlarge | 16 | 64 | 256 | 
| r8a.24xlarge | 16 | 128 | 384 | 
| r8a.48xlarge | 32 | 128 | 768 | 
| r8a.metal-24xl | 16 | 128 | 384 | 
| r8a.metal-48xl | 32 | 128 | 768 | 
| r8gb.medium | 1 | 1 | 2 | 
| r8gb.large | 2 | 2 | 6 | 
| r8gb.xlarge | 4 | 4 | 16 | 
| r8gb.2xlarge | 8 | 8 | 32 | 
| r8gb.4xlarge | 8 | 16 | 64 | 
| r8gb.8xlarge | 8 | 32 | 128 | 
| r8gb.12xlarge | 16 | 64 | 192 | 
| r8gb.16xlarge | 16 | 64 | 256 | 
| r8gb.24xlarge | 16 | 128 | 384 | 
| r8gb.48xlarge | 32 | 128 | 768 | 
| r8gb.metal-24xl | 32 | 128 | 768 | 
| r8gb.metal-48xl | 32 | 128 | 768 | 
| r8gn.medium | 1 | 1 | 2 | 
| r8gn.large | 2 | 2 | 6 | 
| r8gn.xlarge | 4 | 4 | 16 | 
| r8gn.2xlarge | 8 | 8 | 32 | 
| r8gn.4xlarge | 8 | 16 | 64 | 
| r8gn.8xlarge | 8 | 32 | 128 | 
| r8gn.12xlarge | 16 | 64 | 192 | 
| r8gn.16xlarge | 16 | 64 | 256 | 
| r8gn.24xlarge | 16 | 128 | 384 | 
| r8gn.48xlarge | 32 | 128 | 768 | 
| r8gn.metal-24xl | 32 | 128 | 768 | 
| r8gn.metal-48xl | 32 | 128 | 768 | 
| r8i.large | 2 | 2 | 6 | 
| r8i.xlarge | 4 | 4 | 16 | 
| r8i.2xlarge | 8 | 8 | 32 | 
| r8i.4xlarge | 8 | 16 | 64 | 
| r8i.8xlarge | 8 | 32 | 128 | 
| r8i.12xlarge | 16 | 64 | 192 | 
| r8i.16xlarge | 16 | 64 | 256 | 
| r8i.24xlarge | 16 | 128 | 384 | 
| r8i.32xlarge | 16 | 128 | 512 | 
| r8i.48xlarge | 32 | 128 | 768 | 
| r8i.96xlarge | 32 | 128 | 1536 | 
| r8i.metal-48xl | 32 | 128 | 768 | 
| r8i.metal-96xl | 32 | 128 | 1536 | 
| r8id.large | 2 | 2 | 6 | 
| r8id.xlarge | 4 | 4 | 16 | 
| r8id.2xlarge | 8 | 8 | 32 | 
| r8id.4xlarge | 8 | 16 | 64 | 
| r8id.8xlarge | 8 | 32 | 128 | 
| r8id.12xlarge | 16 | 64 | 192 | 
| r8id.16xlarge | 16 | 64 | 256 | 
| r8id.24xlarge | 16 | 128 | 384 | 
| r8id.32xlarge | 16 | 128 | 512 | 
| r8id.48xlarge | 32 | 128 | 768 | 
| r8id.96xlarge | 32 | 128 | 1536 | 
| r8id.metal-48xl | 32 | 128 | 768 | 
| r8id.metal-96xl | 32 | 128 | 1536 | 
| r8i-flex.large | 1 | 1 | 3 | 
| r8i-flex.xlarge | 2 | 2 | 8 | 
| r8i-flex.2xlarge | 4 | 4 | 16 | 
| r8i-flex.4xlarge | 4 | 8 | 32 | 
| r8i-flex.8xlarge | 4 | 16 | 64 | 
| r8i-flex.12xlarge | 8 | 32 | 96 | 
| r8i-flex.16xlarge | 8 | 32 | 128 | 
| r8in.large | 2 | 2 | 8 | 
| r8in.xlarge | 4 | 4 | 16 | 
| r8in.2xlarge | 8 | 8 | 32 | 
| r8in.4xlarge | 8 | 16 | 64 | 
| r8in.8xlarge | 16 | 32 | 128 | 
| r8in.12xlarge | 16 | 64 | 192 | 
| r8in.16xlarge | 16 | 64 | 256 | 
| r8in.24xlarge | 16 | 128 | 256 | 
| r8in.32xlarge | 32 | 128 | 512 | 
| r8in.48xlarge | 32 | 128 | 768 | 
| r8in.96xlarge | 32 | 128 | 1536 \* | 
| r8in.metal-48xl | 32 | 128 | 768 | 
| r8in.metal-96xl | 32 | 128 | 1536 \* | 
| r8idn.large | 2 | 2 | 8 | 
| r8idn.xlarge | 4 | 4 | 16 | 
| r8idn.2xlarge | 8 | 8 | 32 | 
| r8idn.4xlarge | 8 | 16 | 64 | 
| r8idn.8xlarge | 16 | 32 | 128 | 
| r8idn.12xlarge | 16 | 64 | 192 | 
| r8idn.16xlarge | 16 | 64 | 256 | 
| r8idn.24xlarge | 16 | 128 | 256 | 
| r8idn.32xlarge | 32 | 128 | 512 | 
| r8idn.48xlarge | 32 | 128 | 768 | 
| r8idn.96xlarge | 32 | 128 | 1536 \* | 
| r8idn.metal-48xl | 32 | 128 | 768 | 
| r8idn.metal-96xl | 32 | 128 | 1536 \* | 
| r8ib.large | 2 | 2 | 8 | 
| r8ib.xlarge | 4 | 4 | 16 | 
| r8ib.2xlarge | 8 | 8 | 32 | 
| r8ib.4xlarge | 8 | 16 | 64 | 
| r8ib.8xlarge | 16 | 32 | 128 | 
| r8ib.12xlarge | 16 | 64 | 192 | 
| r8ib.16xlarge | 16 | 64 | 256 | 
| r8ib.24xlarge | 16 | 128 | 256 | 
| r8ib.32xlarge | 32 | 128 | 512 | 
| r8ib.48xlarge | 32 | 128 | 768 | 
| r8ib.96xlarge | 32 | 128 | 1536 \* | 
| r8ib.metal-48xl | 32 | 128 | 768 | 
| r8ib.metal-96xl | 32 | 128 | 1536 \* | 
| r8idb.large | 2 | 2 | 8 | 
| r8idb.xlarge | 4 | 4 | 16 | 
| r8idb.2xlarge | 8 | 8 | 32 | 
| r8idb.4xlarge | 8 | 16 | 64 | 
| r8idb.8xlarge | 16 | 32 | 128 | 
| r8idb.12xlarge | 16 | 64 | 192 | 
| r8idb.16xlarge | 16 | 64 | 256 | 
| r8idb.24xlarge | 16 | 128 | 256 | 
| r8idb.32xlarge | 32 | 128 | 512 | 
| r8idb.48xlarge | 32 | 128 | 768 | 
| r8idb.96xlarge | 32 | 128 | 1536 \* | 
| r8idb.metal-48xl | 32 | 128 | 768 | 
| r8idb.metal-96xl | 32 | 128 | 1536 \* | 
| r9g.medium | 1 | 1 | 2 | 
| r9g.large | 2 | 2 | 6 | 
| r9g.xlarge | 4 | 4 | 16 | 
| r9g.2xlarge | 8 | 8 | 32 | 
| r9g.4xlarge | 8 | 16 | 64 | 
| r9g.8xlarge | 8 | 32 | 128 | 
| r9g.12xlarge | 16 | 64 | 192 | 
| r9g.16xlarge | 16 | 64 | 256 | 
| r9g.24xlarge | 16 | 128 | 384 | 
| r9g.48xlarge | 32 | 128 | 768 | 
| r9g.metal-48xl | 32 | 128 | 768 | 
| r9gd.medium | 1 | 1 | 2 | 
| r9gd.large | 2 | 2 | 6 | 
| r9gd.xlarge | 4 | 4 | 16 | 
| r9gd.2xlarge | 8 | 8 | 32 | 
| r9gd.4xlarge | 8 | 16 | 64 | 
| r9gd.8xlarge | 8 | 32 | 128 | 
| r9gd.12xlarge | 16 | 64 | 192 | 
| r9gd.16xlarge | 16 | 64 | 256 | 
| r9gd.24xlarge | 16 | 128 | 384 | 
| r9gd.48xlarge | 32 | 128 | 768 | 
| r9gd.metal-48xl | 32 | 128 | 768 | 
| x8aedz.large | 2 | 2 | 8 | 
| x8aedz.xlarge | 4 | 4 | 16 | 
| x8aedz.3xlarge | 4 | 16 | 48 | 
| x8aedz.6xlarge | 8 | 32 | 96 | 
| x8aedz.12xlarge | 8 | 64 | 192 | 
| x8aedz.24xlarge | 16 | 128 | 384 | 
| x8aedz.metal-12xl | 8 | 64 | 192 | 
| x8aedz.metal-24xl | 16 | 128 | 384 | 
| x8i.large | 2 | 2 | 6 | 
| x8i.xlarge | 4 | 4 | 16 | 
| x8i.2xlarge | 8 | 8 | 32 | 
| x8i.4xlarge | 8 | 16 | 64 | 
| x8i.8xlarge | 8 | 32 | 128 | 
| x8i.12xlarge | 16 | 64 | 192 | 
| x8i.16xlarge | 16 | 64 | 256 | 
| x8i.24xlarge | 16 | 128 | 384 | 
| x8i.32xlarge | 16 | 128 | 512 | 
| x8i.48xlarge | 32 | 128 | 768 | 
| x8i.64xlarge | 32 | 128 | 1024 | 
| x8i.96xlarge | 32 | 128 | 1536 | 
| x8i.metal-48xl | 32 | 128 | 768 | 
| x8i.metal-96xl | 32 | 128 | 1536 | 

------
#### [ Storage optimized ]


| 实例类型 | 每个接口的默认 ENA 实例集 | 每个接口的最大 ENA 实例集数 | 每个实例的最大 ENA 实例集数 | 
| --- | --- | --- | --- | 
| i8ge.large | 2 | 2 | 6 | 
| i8ge.xlarge | 4 | 4 | 16 | 
| i8ge.2xlarge | 8 | 8 | 32 | 
| i8ge.3xlarge | 8 | 16 | 48 | 
| i8ge.6xlarge | 8 | 32 | 96 | 
| i8ge.12xlarge | 16 | 64 | 192 | 
| i8ge.18xlarge | 16 | 128 | 288 | 
| i8ge.24xlarge | 16 | 128 | 384 | 
| i8ge.48xlarge | 32 | 128 | 1536 \* | 

------
#### [ Accelerated computing ]


| 实例类型 | 每个接口的默认 ENA 实例集 | 每个接口的最大 ENA 实例集数 | 每个实例的最大 ENA 实例集数 | 
| --- | --- | --- | --- | 
| g7.2xlarge | 8 | 8 | 32 | 
| g7.4xlarge | 8 | 16 | 64 | 
| g7.8xlarge | 8 | 32 | 80 | 
| g7.12xlarge | 16 | 64 | 192 | 
| g7.24xlarge | 16 | 128 | 384 | 
| g7.48xlarge | 32 | 128 | 768 | 

------
#### [ High performance computing ]


| 实例类型 | 每个接口的默认 ENA 实例集 | 每个接口的最大 ENA 实例集数 | 每个实例的最大 ENA 实例集数 | 
| --- | --- | --- | --- | 
| hpc8a.96xlarge | 32 | 128 | 512 | 

------

**注意**  
\* 这些实例类型配备多个网卡。其他实例类型配备单个网卡。有关更多信息，请参阅 [网卡](using-eni.md#network-cards)。

## 配置 ENA 队列分配
<a name="modify"></a>

在支持的实例类型上，您可以为每个 ENI 配置 ENA 队列计数。使用 AWS 管理控制台、AWS CLI 或 PowerShell。在 AWS 管理控制台 中，此设置显示在每个**网络接口**下。

**注意**  
配置 ENA 队列之前，请注意以下要求：  
必须先停止实例，然后才能配置 ENA 队列数量。
ENA 队列的值必须是 2 的幂，例如 1、2、4、8、16 或 32。
任何单个 ENI 上的队列数不能超过实例上的 vCPU 数。

在更改队列计数之前，请使用以下命令检查当前计数。

------
#### [ AWS CLI ]

```
aws ec2 describe-instances --instance-id {{i-1234567890abcdef0}}
```

------
#### [ PowerShell ]

```
(Get-EC2Instance -InstanceId i-{{1234567890abcdef0}}).Instances.NetworkInterfaces |
  Select-Object NetworkInterfaceId,
    @{N='DeviceIndex';E={$_.Attachment.DeviceIndex}},
    @{N='AttachmentId';E={$_.Attachment.AttachmentId}},
    @{N='EnaQueueCount';E={$_.Attachment.EnaQueueCount}}
```

------

### 将网络接口连接至 ENA 实例集
<a name="modify-attach"></a>

以下示例在一个 ENI 上配置了 16 个 ENA 实例集。

------
#### [ AWS CLI ]

**要将网络接口连接至 ENA 实例集**  
使用 [attach-network-interface](https://docs.aws.amazon.com/cli/latest/reference/ec2/attach-network-interface.html) 命令。

```
aws ec2 attach-network-interface \
  --network-interface-id eni-{{abcdef01234567890}} \
  --instance-id {{i-1234567890abcdef0}} \
  --device-index 1 \
  --ena-queue-count 16
```

------
#### [ PowerShell ]

**要将网络接口连接至 ENA 实例集**  
使用 [Add-EC2NetworkInterface](https://docs.aws.amazon.com/powershell/latest/reference/items/Add-EC2NetworkInterface.html) cmdlet。

```
Add-EC2NetworkInterface `
  -NetworkInterfaceId eni-{{abcdef01234567890}} `
  -InstanceId {{i-1234567890abcdef0}} `
  -DeviceIndex 1 `
  -EnaQueueCount 16
```

------

### 启动带 ENA 实例集的实例
<a name="modify-run"></a>

以下示例有 3 个 ENI，每个均配置了 16 个 ENA 实例集。

------
#### [ AWS CLI ]

**要启动带 ENA 实例集的实例**  
可以使用 [run-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/run-instances.html) 命令。

```
aws ec2 run-instances \
  --image-id ami-{{1234567890abcdef0}} \
  --instance-type c8i.4xlarge \
  --network-interfaces \
    "[{\"DeviceIndex\":0,\"SubnetId\":\"subnet-{{abcdef01234567890}}\",\"EnaQueueCount\":16},
      {\"DeviceIndex\":1,\"SubnetId\":\"subnet-{{abcdef01234567890}}\",\"EnaQueueCount\":16},
      {\"DeviceIndex\":2,\"SubnetId\":\"subnet-{{abcdef01234567890}}\",\"EnaQueueCount\":16}]"
```

------
#### [ PowerShell ]

**要启动带 ENA 实例集的实例**  
使用 [New-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2Instance.html) cmdlet。

```
New-EC2Instance `
  -ImageId ami-{{1234567890abcdef0}} `
  -InstanceType c8i.4xlarge `
  -NetworkInterface @(
    @{DeviceIndex=0; SubnetId="subnet-{{abcdef01234567890}}"; EnaQueueCount=16},
    @{DeviceIndex=1; SubnetId="subnet-{{abcdef01234567890}}"; EnaQueueCount=16},
    @{DeviceIndex=2; SubnetId="subnet-{{abcdef01234567890}}"; EnaQueueCount=16}
  )
```

------

### 修改现有网络接口上的 ENA 实例集
<a name="modify-eni-attribute"></a>

以下示例在一个 ENI 上配置了 16 个 ENA 实例集。

------
#### [ AWS CLI ]

**要修改网络接口上的 ENA 实例集**  
使用 [modify-network-interface-attribute](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-network-interface-attribute.html) 命令。

```
aws ec2 modify-network-interface-attribute \
  --network-interface-id eni-{{1234567890abcdef0}} \
  --attachment AttachmentId=eni-attach-{{1234567890abcdef0}},EnaQueueCount=16
```

------
#### [ PowerShell ]

**要修改网络接口上的 ENA 实例集**  
使用 [Edit-EC2NetworkInterfaceAttribute](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2NetworkInterfaceAttribute.html) cmdlet。

```
Edit-EC2NetworkInterfaceAttribute `
  -NetworkInterfaceId eni-{{1234567890abcdef0}} `
  -Attachment_AttachmentId eni-attach-{{1234567890abcdef0}} `
  -Attachment_EnaQueueCount 16
```

------

以下示例将 ENA 数重置为默认值。

------
#### [ AWS CLI ]

```
aws ec2 modify-network-interface-attribute \
  --network-interface-id eni-{{1234567890abcdef0}} \
  --attachment AttachmentId=eni-attach-{{1234567890abcdef0}},DefaultEnaQueueCount=true
```

------
#### [ PowerShell ]

```
Edit-EC2NetworkInterfaceAttribute `
  -NetworkInterfaceId eni-{{1234567890abcdef0}} `
  -Attachment_AttachmentId eni-attach-{{1234567890abcdef0}} `
  -Attachment_DefaultEnaQueueCount $true
```

------