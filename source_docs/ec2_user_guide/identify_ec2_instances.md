

# 检测主机是否为 EC2 实例
<a name="identify_ec2_instances"></a>

您可能需要了解您的应用程序或网站是否在 EC2 实例上运行，尤其是在您拥有混合计算环境的情况下。您可以使用以下选项之一确定您的应用程序或网站的主机是否为 EC2 实例。

**Topics**
+ [检查 实例身份文档](#inspect-instance-identity-document)
+ [检查系统 UUID](#inspect-uuid)
+ [检查系统虚拟机生成标识符](#vm-generation-id)

## 检查 实例身份文档
<a name="inspect-instance-identity-document"></a>

每个实例都有一个签名的实例身份文档，您可以通过加密方式验证该文档。您可以使用实例元数据服务（IMDS）查找这些文档。

有关更多信息，请参阅 [实例身份文档](instance-identity-documents.md)。

## 检查系统 UUID
<a name="inspect-uuid"></a>

您可以获取系统 UID 并查看 `EC2` 的 UID 开头的八位字节（在 Linux 中，这可能是小写的 `ec2`）。此方法速度快，但可能不准确，因为不是 EC2 实例的系统也有很小的几率使用以这些字符开头的 UUID。此外，某些版本的 SMBIOS 使用*小端序*格式，在 UUID 的开头不包含 `EC2`。对于使用 SMBIOS 2.4 for Windows 的 EC2 实例，或除 Amazon Linux（具有自己的 SMBIOS 实现）之外的 Linux 发行版，可能就是这种情况。

**Linux 示例：从 DMI 获取 UUID（仅限 HVM AMI）**  
通过以下命令使用桌面管理界面 (DMI) 获取 UUID：

```
[ec2-user ~]$ sudo dmidecode --string system-uuid
```

在以下示例输出中，UUID 以“EC2”开头，表示该系统可能是 EC2 实例。

```
EC2E1916-9099-7CAF-FD21-012345ABCDEF
```

在以下示例输出中，UUID 以 little-endian 格式表示。

```
45E12AEC-DCD1-B213-94ED-012345ABCDEF
```

或者，对于在 Nitro 系统上构建的实例，您可以使用以下命令：

```
[ec2-user ~]$ cat /sys/devices/virtual/dmi/id/board_asset_tag
```

如果输出是实例 ID，如下面的示例输出所示，则说明系统是 EC2 实例：

```
i-0af01c0123456789a
```

**Linux 示例：从管理程序获取 UUID（仅限 PV AMI）**  
使用以下命令从管理程序获取 UUID：

```
[ec2-user ~]$ cat /sys/hypervisor/uuid
```

在以下示例输出中，UUID 以“ec2”开头，表示该系统可能是 EC2 实例。

```
ec2e1916-9099-7caf-fd21-012345abcdef
```

**Windows 示例：使用 WMI 或 Windows PowerShell 获取 UUID**  
使用如下 Windows Management Instrumentation 命令行 (WMIC)：

```
wmic path win32_computersystemproduct get uuid
```

或者，如果您使用 Windows PowerShell，则可使用 **Get-WmiObject** cmdlet，如下所示：

```
PS C:\> Get-WmiObject -query "select uuid from Win32_ComputerSystemProduct" | Select UUID
```

在以下示例输出中，UUID 以“EC2”开头，表示该系统可能是 EC2 实例。

```
EC2AE145-D1DC-13B2-94ED-012345ABCDEF
```

对于使用 SMBIOS 2.4 的实例，可能用 little-endian 格式表示 UUID，例如：

```
45E12AEC-DCD1-B213-94ED-012345ABCDEF
```

## 检查系统虚拟机生成标识符
<a name="vm-generation-id"></a>

虚拟机生成标识符由被解释为加密随机整数标识符的 128 位的唯一缓冲区组成。您可以检索虚拟机生成标识符来识别 Amazon Elastic Compute Cloud 实例。生成标识符通过 ACPI 表条目在实例的来宾操作系统中公开。如果您的计算机被克隆、复制或导入到 AWS，例如使用 [VM Import/Export](https://docs.aws.amazon.com/vm-import/latest/userguide/what-is-vmimport.html)，该值将改变。

**示例：从 Linux 中检索虚拟机生成标识符**  
您可以使用以下命令从运行 Linux 的实例中检索虚拟机生成标识符。

------
#### [ Amazon Linux 2 ]

1. 根据需要，使用以下命令更新现有软件包：

   ```
   sudo yum update
   ```

1. 如有必要，使用以下命令获取 busybox 软件包：

   ```
   sudo curl https://www.rpmfind.net/linux/epel/next/8/Everything/x86_64/Packages/b/busybox-1.35.0-2.el8.next.x86_64.rpm --output busybox.rpm
   ```

1. 如有必要，使用以下命令安装必备软件包：

   ```
   sudo yum install busybox.rpm iasl -y
   ```

1. 运行以下 `iasl` 命令从 ACPI 表中生成输出：

   ```
   sudo iasl -p ./SSDT2 -d /sys/firmware/acpi/tables/SSDT2
   ```

1. 运行以下命令以查看 `iasl` 命令的输出：

   ```
   cat SSDT2.dsl
   ```

   输出应该产生检索虚拟机生成标识符所需的地址空间：

   ```
   Intel ACPI Component Architecture
   ASL+ Optimizing Compiler/Disassembler version 20190509
   Copyright (c) 2000 - 2019 Intel Corporation
   
   File appears to be binary: found 32 non-ASCII characters, disassembling
   Binary file appears to be a valid ACPI table, disassembling
   Input file /sys/firmware/acpi/tables/SSDT2, Length 0x7B (123) bytes
   ACPI: SSDT 0x0000000000000000 00007B (v01 AMAZON AMZNSSDT 00000001 AMZN 00000001)
   Pass 1 parse of [SSDT]
   Pass 2 parse of [SSDT]
   Parsing Deferred Opcodes (Methods/Buffers/Packages/Regions)
   
   Parsing completed
   Disassembly completed
   ASL Output:    ./SSDT2.dsl - 1065 bytes
   $
   /*
   * Intel ACPI Component Architecture
   * AML/ASL+ Disassembler version 20190509 (64-bit version)
   * Copyright (c) 2000 - 2019 Intel Corporation
   *
   * Disassembling to symbolic ASL+ operators
   *
   * Disassembly of /sys/firmware/acpi/tables/SSDT2, Tue Mar 29 16:15:14 2022
   *
   * Original Table Header:
   *     Signature        "SSDT"
   *     Length           0x0000007B (123)
   *     Revision         0x01
   *     Checksum         0xB8
   *     OEM ID           "AMAZON"
   *     OEM Table ID     "AMZNSSDT"
   *     OEM Revision     0x00000001 (1)
   *     Compiler ID      "AMZN"
   *     Compiler Version 0x00000001 (1)
   */
   DefinitionBlock ("", "SSDT", 1, "AMAZON", "AMZNSSDT", 0x00000001)
   {
   Scope (\_SB)
   {
       Device (VMGN)
       {
           Name (_CID, "VM_Gen_Counter")  // _CID: Compatible ID
           Name (_DDN, "VM_Gen_Counter")  // _DDN: DOS Device Name
           Name (_HID, "AMZN0000")  // _HID: Hardware ID
           Name (ADDR, Package (0x02)
           {
               {{0xFED01000}},
               Zero
           })
       }
   }
   }
   ```

1. （可选）使用以下命令提升终端对剩余步骤的权限：

   ```
   sudo -s
   ```

1. 使用以下命令存储以前收集的地址空间：

   ```
   VMGN_ADDR={{0xFED01000}}
   ```

1. 使用以下命令迭代地址空间并构建虚拟机生成标识符：

   ```
   for offset in 0x0 0x4 0x8 0xc; do busybox devmem $(($VMGN_ADDR + $offset)) | sed 's/0x//' | sed -z '$ s/\n$//' >> vmgenid; done
   ```

1. 使用以下命令从输出文件中检索虚拟机生成标识符：

   ```
   cat vmgenid ; echo
   ```

   您的输出应类似于以下内容：

   ```
   EC2F335D979132C4165896753E72BD1C
   ```

------
#### [ Ubuntu ]

1. 根据需要，使用以下命令更新现有软件包：

   ```
   sudo apt update
   ```

1. 如有必要，使用以下命令安装必备软件包：

   ```
   sudo apt install busybox iasl -y
   ```

1. 运行以下 `iasl` 命令从 ACPI 表中生成输出：

   ```
   sudo iasl -p ./SSDT2 -d /sys/firmware/acpi/tables/SSDT2
   ```

1. 运行以下命令以查看 `iasl` 命令的输出：

   ```
   cat SSDT2.dsl
   ```

   输出应该产生检索虚拟机生成标识符所需的地址空间：

   ```
   Intel ACPI Component Architecture
   ASL+ Optimizing Compiler/Disassembler version 20190509
   Copyright (c) 2000 - 2019 Intel Corporation
   
   File appears to be binary: found 32 non-ASCII characters, disassembling
   Binary file appears to be a valid ACPI table, disassembling
   Input file /sys/firmware/acpi/tables/SSDT2, Length 0x7B (123) bytes
   ACPI: SSDT 0x0000000000000000 00007B (v01 AMAZON AMZNSSDT 00000001 AMZN 00000001)
   Pass 1 parse of [SSDT]
   Pass 2 parse of [SSDT]
   Parsing Deferred Opcodes (Methods/Buffers/Packages/Regions)
   
   Parsing completed
   Disassembly completed
   ASL Output:    ./SSDT2.dsl - 1065 bytes
   $
   /*
   * Intel ACPI Component Architecture
   * AML/ASL+ Disassembler version 20190509 (64-bit version)
   * Copyright (c) 2000 - 2019 Intel Corporation
   *
   * Disassembling to symbolic ASL+ operators
   *
   * Disassembly of /sys/firmware/acpi/tables/SSDT2, Tue Mar 29 16:15:14 2022
   *
   * Original Table Header:
   *     Signature        "SSDT"
   *     Length           0x0000007B (123)
   *     Revision         0x01
   *     Checksum         0xB8
   *     OEM ID           "AMAZON"
   *     OEM Table ID     "AMZNSSDT"
   *     OEM Revision     0x00000001 (1)
   *     Compiler ID      "AMZN"
   *     Compiler Version 0x00000001 (1)
   */
   DefinitionBlock ("", "SSDT", 1, "AMAZON", "AMZNSSDT", 0x00000001)
   {
   Scope (\_SB)
   {
       Device (VMGN)
       {
           Name (_CID, "VM_Gen_Counter")  // _CID: Compatible ID
           Name (_DDN, "VM_Gen_Counter")  // _DDN: DOS Device Name
           Name (_HID, "AMZN0000")  // _HID: Hardware ID
           Name (ADDR, Package (0x02)
           {
               {{0xFED01000}},
               Zero
           })
       }
   }
   }
   ```

1. （可选）使用以下命令提升终端对剩余步骤的权限：

   ```
   sudo -s
   ```

1. 使用以下命令存储以前收集的地址空间：

   ```
   VMGN_ADDR={{0xFED01000}}
   ```

1. 使用以下命令迭代地址空间并构建虚拟机生成标识符：

   ```
   for offset in 0x0 0x4 0x8 0xc; do busybox devmem $(($VMGN_ADDR + $offset)) | sed 's/0x//' | sed -z '$ s/\n$//' >> vmgenid; done
   ```

1. 使用以下命令从输出文件中检索虚拟机生成标识符：

   ```
   cat vmgenid ; echo
   ```

   您的输出应类似于以下内容：

   ```
   EC2F335D979132C4165896753E72BD1C
   ```

------

**示例：从 Windows 中检索虚拟机生成标识符**  


您可以创建示例应用程序以从运行 Windows 的实例中检索虚拟机生成标识符。有关更多信息，请参阅 Microsoft 文档中的[获取虚拟机生成标识符](https://learn.microsoft.com/en-us/windows/win32/hyperv_v2/virtual-machine-generation-identifier#obtaining-the-virtual-machine-generation-identifier)。