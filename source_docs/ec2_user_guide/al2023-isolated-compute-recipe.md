

# 示例 Amazon Linux 2023 映像描述
<a name="al2023-isolated-compute-recipe"></a>

示例 Amazon Linux 2023 映像描述具有以下特性：

1. **统一内核映像（UKI）启动**：使用单个带签名的二进制文件启动，该二进制文件将内核、`initrd` 和启动参数组合成一个不可变的映像。

1. **只读根文件系统**：使用带有 dm-verity 保护功能的增强型只读文件系统 (`erofs`)，确保根文件系统无法进行修改并保持加密完整性验证。

1. **临时覆盖文件系统**：创建一个临时覆盖文件系统，允许临时写入 `/etc`、`/run` 和 `/var` 等目录。由于此覆盖文件系统仅存在于内存中，因此当实例重启时，所有更改都会自动丢失，从而确保系统恢复到其原始可信状态。

1. **禁用远程访问方法**：移除以下远程访问机制以防止远程访问：    
[See the AWS documentation website for more details](http://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/al2023-isolated-compute-recipe.html)

   \* 有关更多信息，请参阅 [Image Description Elements](https://osinside.github.io/kiwi/image_description/elements.html#packages-ignore)。