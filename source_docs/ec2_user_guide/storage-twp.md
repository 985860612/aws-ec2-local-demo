

# Amazon EC2 Linux 实例上的防撕裂写入
<a name="storage-twp"></a>

**注意**  
仅 Linux 实例支持防撕裂写入。

撕裂写防护是由 AWS 设计的块存储功能，可提高 I/O 密集型关系数据库工作负载的性能并减少延迟，而不会对数据弹性产生负面影响。使用 InnoDB 或 XtraDB 作为数据库引擎的关系数据库，例如 MySQL 和 MariaDB，将受益于撕裂写防护这一功能。

通常，使用大于存储设备*断电原子性的*页面的关系数据库使用*数据记录*机制来防止撕裂写。MariaDB 和 MySQL 在将数据写入数据表之前使用*双写缓冲区*文件来记录数据。如果写入事务期间由于操作系统崩溃或断电导致写入不完整或撕裂，数据库可以从双写缓冲区恢复数据。与写入双写缓冲区相关的 I/O 额外开销会影响数据库性能和应用程序延迟，并减少每秒可处理的事务数量。有关双写缓冲区的更多信息，请参阅 [MariaDB](https://mariadb.com/kb/en/innodb-doublewrite-buffer/) 和 [MySQL](https://dev.mysql.com/doc/refman/5.7/en/innodb-doublewrite-buffer.html) 文档。

借助*撕裂写防护*功能，可以在*全有或全无*的写入事务中将数据写入存储，这样就无需使用双写缓冲区。这样可以防止在写入事务期间因操作系统崩溃或断电将部分或撕裂的数据写入存储。在不影响工作负载弹性的情况下，每秒处理的事务数量最多可增加 30%，写入延迟最多可减少 50%。

**定价**  
使用撕裂写防护功能不会产生额外费用。

**Topics**
+ [支持的块大小](supported-block-sizes.md)
+ [要求](twp-reqs.md)
+ [检查实例支持](twp-namespace.md)
+ [配置工作负载](configure-twp.md)