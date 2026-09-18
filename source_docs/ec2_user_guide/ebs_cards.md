

# EBS 卡
<a name="ebs_cards"></a>

大多数实例类型都支持一个 EBS 卡。支持多个 EBS 卡的实例类型在 EBS 吞吐量和 IOPS 方面均可提供更高的 EBS 优化性能。您的 Amazon EC2 实例的最大性能在每个 EBS 卡上平均分配。例如，在通过 2 个 EBS 卡支持总共 `1,000,000` 个 IOPS 的 EC2 实例上，每个 EBS 卡最多可以支持 `500,000` 个 IOPS。有关您的 Amazon EC2 实例支持的 Amazon EBS 性能的信息，请参阅 [Amazon EBS 优化的实例类型](ebs-optimized.md)。

在将 Amazon EBS 卷附加到支持多个 EBS 卡的实例时，可以通过指定 EBS 卡索引为该卷选择 EBS 卡。根卷必须附加到 EBS 卡索引 0。

## 具有多个 EBS 卡的实例类型
<a name="instance-types-multiple-EBS-cards"></a>

以下实例类型支持多个 EBS 卡。有关实例类型支持的 Amazon EBS 卷数量的信息，请参阅 [Amazon EC2 实例的 Amazon EBS 卷限制](volume_limits.md)。


<table>
<thead>
  <tr><th>实例类型</th><th>EBS 卡的数量</th></tr>
</thead>
<tbody>
  <tr><td colspan="2"><b>通用</b></td></tr>
  <tr><td>m8gb.48xlarge</td><td>2</td></tr>
  <tr><td>m8gb.metal-48xl</td><td>2</td></tr>
  <tr><td>m8gn.48xlarge</td><td>2</td></tr>
  <tr><td>m8gn.metal-48xl</td><td>2</td></tr>
  <tr><td>m8in.96xlarge</td><td>2</td></tr>
  <tr><td>m8in.metal-96xl</td><td>2</td></tr>
  <tr><td>m8idn.96xlarge</td><td>2</td></tr>
  <tr><td>m8idn.metal-96xl</td><td>2</td></tr>
  <tr><td>m8ib.96xlarge</td><td>2</td></tr>
  <tr><td>m8ib.metal-96xl</td><td>2</td></tr>
  <tr><td>m8idb.96xlarge</td><td>2</td></tr>
  <tr><td>m8idb.metal-96xl</td><td>2</td></tr>
  <tr><td colspan="2"><b>计算优化</b></td></tr>
  <tr><td>c8gb.48xlarge</td><td>2</td></tr>
  <tr><td>c8gb.metal-48xl</td><td>2</td></tr>
  <tr><td>c8gn.48xlarge</td><td>2</td></tr>
  <tr><td>c8gn.metal-48xl</td><td>2</td></tr>
  <tr><td>c8in.96xlarge</td><td>2</td></tr>
  <tr><td>c8in.metal-96xl</td><td>2</td></tr>
  <tr><td>c8ib.96xlarge</td><td>2</td></tr>
  <tr><td>c8ib.metal-96xl</td><td>2</td></tr>
  <tr><td colspan="2"><b>内存优化</b></td></tr>
  <tr><td>r8gb.48xlarge</td><td>2</td></tr>
  <tr><td>r8gb.metal-48xl</td><td>2</td></tr>
  <tr><td>r8gn.48xlarge</td><td>2</td></tr>
  <tr><td>r8gn.metal-48xl</td><td>2</td></tr>
  <tr><td>r8in.96xlarge</td><td>2</td></tr>
  <tr><td>r8in.metal-96xl</td><td>2</td></tr>
  <tr><td>r8idn.96xlarge</td><td>2</td></tr>
  <tr><td>r8idn.metal-96xl</td><td>2</td></tr>
  <tr><td>r8ib.96xlarge</td><td>2</td></tr>
  <tr><td>r8ib.metal-96xl</td><td>2</td></tr>
  <tr><td>r8idb.96xlarge</td><td>2</td></tr>
  <tr><td>r8idb.metal-96xl</td><td>2</td></tr>
  <tr><td colspan="2"><b>加速计算</b></td></tr>
  <tr><td>g7.48xlarge</td><td>2</td></tr>
</tbody>
</table>
