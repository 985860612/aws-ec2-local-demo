

# 将 Amazon EC2 Windows 实例上的 NVMe 磁盘映射到卷
<a name="windows-list-disks-nvme"></a>

对于[基于 Nitro 的实例](instance-types.md#instance-hypervisor-type)，EBS 卷显示为 NVMe 设备。本主题介绍如何查看您的实例上可用于 Windows 操作系统的 **NVMe 磁盘**。它还展示了如何将这些 NVMe 磁盘映射到底层 Amazon EBS 卷以及为 Amazon EC2 使用的块设备映射指定的设备名称。

**Topics**
+ [列出 NVMe 磁盘](#windows-disks-nvme)
+ [将 NVMe 磁盘映射到卷](#ebs-nvme-volume-map)

## 列出 NVMe 磁盘
<a name="windows-disks-nvme"></a>

您可以使用磁盘管理工具或 Powershell，在您的 Windows 实例上查找磁盘。

------
#### [ Disk Management ]

**查找 Windows 实例上的磁盘**

1. 使用远程桌面登录 Windows 实例。有关更多信息，请参阅[使用 RDP 连接到 Windows 实例](connecting_to_windows_instance.md)。

1. 启动磁盘管理实用工具。

1. 检查磁盘。根卷是一个装载为 `C:\` 的 EBS 卷。如果未显示其他磁盘，表示您在创建 AMI 或启动实例时没有指定其他卷。

   下面的示例介绍了在您启动一个包含两个其他 EBS 卷的 `r5d.4xlarge` 实例时可用的磁盘。  
![对一个根卷、两个实例存储卷和两个 EBS 卷的磁盘管理。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/disk_management_nvme.png)

------
#### [ PowerShell ]

以下 PowerShell 脚本列出每个磁盘以及相应的设备名称和卷。旨在与[基于 Nitro 的实例](instance-types.md#instance-hypervisor-type)结合使用，此类实例使用 NVMe EBS 和实例存储卷。

连接到 Windows 实例并运行以下命令以启用 PowerShell 脚本执行。

```
Set-ExecutionPolicy RemoteSigned
```

复制以下脚本并将其保存为 Windows 实例 `mapping.ps1` 上。

```
# List the disks for NVMe volumes

function Get-EC2InstanceMetadata {
    param([string]$Path)
    (Invoke-WebRequest -Uri "http://169.254.169.254/latest/$Path").Content 
}

function GetEBSVolumeId {
    param($Path)
    $SerialNumber = (Get-Disk -Path $Path).SerialNumber
    if($SerialNumber -clike 'vol*'){
        $EbsVolumeId = $SerialNumber.Substring(0,20).Replace("vol","vol-")
    }
    else {
       $EbsVolumeId = $SerialNumber.Substring(0,20).Replace("AWS","AWS-")
    }
    return $EbsVolumeId
}

function GetDeviceName{
    param($EbsVolumeId)
    if($EbsVolumeId -clike 'vol*'){
    
        $Device  = ((Get-EC2Volume -VolumeId $EbsVolumeId ).Attachment).Device
        $VolumeName = ""
    }
     else {
        $Device = "Ephemeral"
        $VolumeName = "Temporary Storage"
    }
    Return $Device,$VolumeName
}

function GetDriveLetter{
    param($Path)
    $DiskNumber =  (Get-Disk -Path $Path).Number
    if($DiskNumber -eq 0){
        $VirtualDevice = "root"
        $DriveLetter = "C"
        $PartitionNumber = (Get-Partition -DriveLetter C).PartitionNumber
    }
    else
    {
        $VirtualDevice = "N/A"
        $DriveLetter = (Get-Partition -DiskNumber $DiskNumber).DriveLetter
        if(!$DriveLetter)
        {
            $DriveLetter = ((Get-Partition -DiskId $Path).AccessPaths).Split(",")[0]
        } 
        $PartitionNumber = (Get-Partition -DiskId $Path).PartitionNumber   
    }
    
    return $DriveLetter,$VirtualDevice,$PartitionNumber

}

$Report = @()
foreach($Path in (Get-Disk).Path)
{
    $Disk_ID = ( Get-Partition -DiskId $Path).DiskId
    $Disk = ( Get-Disk -Path $Path).Number
    $EbsVolumeId  = GetEBSVolumeId($Path)
    $Size =(Get-Disk -Path $Path).Size
    $DriveLetter,$VirtualDevice, $Partition = (GetDriveLetter($Path))
    $Device,$VolumeName = GetDeviceName($EbsVolumeId)
    $Disk = New-Object PSObject -Property @{
      Disk          = $Disk
      Partitions    = $Partition
      DriveLetter   = $DriveLetter
      EbsVolumeId   = $EbsVolumeId 
      Device        = $Device 
      VirtualDevice = $VirtualDevice 
      VolumeName= $VolumeName
    }
	$Report += $Disk
} 

$Report | Sort-Object Disk | Format-Table -AutoSize -Property Disk, Partitions, DriveLetter, EbsVolumeId, Device, VirtualDevice, VolumeName
```

按如下方式编辑脚本：

```
PS C:\> .\mapping.ps1
```

以下是具有一个根卷、两个 EBS 卷和两个实例存储卷的实例的输出示例。

```
Disk Partitions DriveLetter EbsVolumeId           Device    VirtualDevice VolumeName
---- ---------- ----------- -----------           ------    ------------- ----------
   0          1 C           vol-03683f1d861744bc7 /dev/sda1 root
   1          1 D           vol-082b07051043174b9 xvdb      N/A
   2          1 E           vol-0a4064b39e5f534a2 xvdc      N/A
   3          1 F           AWS-6AAD8C2AEEE1193F0 Ephemeral N/A           Temporary Storage
   4          1 G           AWS-13E7299C2BD031A28 Ephemeral N/A           Temporary Storage
```

如果您没有在 Windows 实例上为 Tools for Windows PowerShell 提供凭证，则脚本将无法获取 EBS 卷 ID，并会在 `EbsVolumeId` 列中使用 N/A。

------

## 将 NVMe 磁盘映射到卷
<a name="ebs-nvme-volume-map"></a>

您可以使用 [Get-Disk](https://learn.microsoft.com/en-us/powershell/module/storage/get-disk) 命令将 Windows 磁盘编号映射到 Amazon EBS 卷和 Amazon EC2 实例存储卷。

```
PS C:\> Get-Disk
Number Friendly Name Serial Number                    HealthStatus         OperationalStatus      Total Size Partition
                                                                                                             Style
------ ------------- -------------                    ------------         -----------------      ---------- ----------
3      NVMe Amazo... AWS6AAD8C2AEEE1193F0_00000001.   Healthy              Online                   279.4 GB MBR
4      NVMe Amazo... AWS13E7299C2BD031A28_00000001.   Healthy              Online                   279.4 GB MBR
2      NVMe Amazo... vol0a4064b39e5f534a2_00000001.   Healthy              Online                       8 GB MBR
0      NVMe Amazo... vol03683f1d861744bc7_00000001.   Healthy              Online                      30 GB MBR
1      NVMe Amazo... vol082b07051043174b9_00000001.   Healthy              Online                       8 GB MBR
```

您还可以运行 **ebsnvme-id** 命令将 nVMe 磁盘号映射到 EBS 卷 ID 和设备名称。

```
PS C:\> C:\PROGRAMDATA\Amazon\Tools\ebsnvme-id.exe
Disk Number: 0
Volume ID: vol-03683f1d861744bc7
Device Name: sda1

Disk Number: 1
Volume ID: vol-082b07051043174b9
Device Name: xvdb

Disk Number: 2
Volume ID: vol-0a4064b39e5f534a2
Device Name: xvdc
```