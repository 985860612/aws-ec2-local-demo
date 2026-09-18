

# Amazon EC2 上防撕裂写入的块大小
<a name="supported-block-sizes"></a>

撕裂写防护支持 4 KiB、8 KiB 和 16 KiB 数据块的写入操作。数据块起始逻辑块地址（LBA）必须与 4 KiB、8 KiB 或 16 KiB 的相应块的边界大小对齐。例如，对于 16 KiB 写入操作，数据块起始 LBA 必须与 16 KiB 的块边界大小对齐。

下表显示了跨存储和实例类型的支持。


<table>
<thead>
  <tr><th> </th><th>4 KiB 块</th><th>8 KiB 块</th><th>16 KiB 块</th></tr>
</thead>
<tbody>
  <tr><td><b>实例存储卷</b></td><td>所有 NVMe 实例存储卷都附加到当前 I 代新系列实例。</td><td colspan="2">AWS Nitro SSD 支持的 I4i、Im4gn、Is4gen、I7i、I7ie、I8g 和 I8ge 实例。</td></tr>
  <tr><td><b>Amazon EBS 卷</b></td><td colspan="3">挂载到<a href="instance-types.md#instance-hypervisor-type">基于 nitro 的实例</a>的所有 Amazon EBS 卷。</td></tr>
</tbody>
</table>


要确认您的实例和卷是否支持撕裂写防护，请查询以检查该实例是否支持撕裂写防护以及其他详细信息，例如支持的块和边界大小。有关更多信息，请参阅 [检查 Amazon EC2 实例对防撕裂写入的支持](twp-namespace.md)。