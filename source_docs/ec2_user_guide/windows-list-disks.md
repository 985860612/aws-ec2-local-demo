

# 将 Amazon EC2 Windows 实例上的非 NVMe 磁盘映射到卷
<a name="windows-list-disks"></a>

对于从使用 AWS PV 或 Citrix PV 驱动程序的 Windows AMI 启动的实例，可以使用本页介绍的关系，将 Windows 磁盘映射到实例存储和 EBS 卷。本主题介绍如何查看您的实例上可用于 Windows 操作系统的**非 NVMe 磁盘**。它还展示了如何将这些非 NVMe 磁盘映射到底层 Amazon EBS 卷以及为 Amazon EC2 使用的块设备映射指定的设备名称。

**注意**  
如果启动实例，并且如果 Windows AMI 使用 Red Hat PV 驱动程序，则可以更新实例来使用 Citrix 驱动程序。有关更多信息，请参阅 [在 EC2 Windows 实例上升级半虚拟化驱动程序](Upgrading_PV_drivers.md)。

**Topics**
+ [列出非 NVMe 磁盘](#windows-disks)
+ [将非 NVMe 磁盘映射到卷](#windows-volume-mapping)

## 列出非 NVMe 磁盘
<a name="windows-disks"></a>

您可以使用磁盘管理工具或 PowerShell 在您的 Windows 实例上查找磁盘。

------
#### [ Disk Management ]

**查找 Windows 实例上的磁盘**

1. 使用远程桌面登录 Windows 实例。有关更多信息，请参阅[使用 RDP 连接到 Windows 实例](connecting_to_windows_instance.md)。

1. 开启磁盘管理实用工具。

   在任务栏上，打开 Windows 徽标的上下文（右键单击）菜单，然后选择**磁盘管理**。

1. 检查磁盘。根卷是一个装载为 `C:\` 的 EBS 卷。如果未显示其他磁盘，表示您在创建 AMI 或启动实例时没有指定其他卷。

   下面的示例介绍了在您启动一个包含实例存储卷（磁盘 2）和其他 EBS 卷（磁盘 1）的 `m3.medium` 实例时可用的磁盘。  
![对一个根卷、一个实例存储卷和一个 EBS 卷的磁盘管理。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/disk_management.png)

1. 打开标记为“磁盘 1”的灰色窗格的上下文（右键单击）菜单，然后选择**属性**。记下**位置**值，并在[将非 NVMe 磁盘映射到卷](#windows-volume-mapping)中的表中查找该值。例如，以下磁盘的位置值为“总线编号 0”、“目标 ID 9”、“LUN 0”。根据 EBS 卷的表，此位置的设备名称为 `xvdj`。  
![EBS 卷的位置。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/disk_1_location.png)

------
#### [ PowerShell ]

以下 PowerShell 脚本列出每个磁盘以及相应的设备名称和卷。

**要求和限制**
+ 需要 Windows 服务器 2012 或更高版本。
+ 需要凭据才能获取 EBS 卷 ID。您可以使用 Tools for PowerShell 配置配置文件，也可以将 IAM 角色附加到实例。
+ 不支持 nVMe 卷。
+ 不支持动态磁盘。

连接到 Windows 实例并运行以下命令以启用 PowerShell 脚本执行。

```
Set-ExecutionPolicy RemoteSigned
```

复制以下脚本并将其保存为 Windows 实例 `mapping.ps1` 上。

```
# List the disks
function Convert-SCSITargetIdToDeviceName {
  param([int]$SCSITargetId)
  If ($SCSITargetId -eq 0) {
    return "sda1"
  }
  $deviceName = "xvd"
  If ($SCSITargetId -gt 25) {
    $deviceName += [char](0x60 + [int]($SCSITargetId / 26))
  }
  $deviceName += [char](0x61 + $SCSITargetId % 26)
  return $deviceName
}

[string[]]$array1 = @()
[string[]]$array2 = @()
[string[]]$array3 = @()
[string[]]$array4 = @()

Get-WmiObject Win32_Volume | Select-Object Name, DeviceID | ForEach-Object {
  $array1 += $_.Name
  $array2 += $_.DeviceID
}

$i = 0
While ($i -ne ($array2.Count)) {
  $array3 += ((Get-Volume -Path $array2[$i] | Get-Partition | Get-Disk).SerialNumber) -replace "_[^ ]*$" -replace "vol", "vol-"
  $array4 += ((Get-Volume -Path $array2[$i] | Get-Partition | Get-Disk).FriendlyName)
  $i ++
}

[array[]]$array = $array1, $array2, $array3, $array4

Try {
  $InstanceId = Get-EC2InstanceMetadata -Category "InstanceId"
  $Region = Get-EC2InstanceMetadata -Category "Region" | Select-Object -ExpandProperty SystemName
}
Catch {
  Write-Host "Could not access the instance Metadata using AWS Get-EC2InstanceMetadata CMDLet.
Verify you have AWSPowershell SDK version '3.1.73.0' or greater installed and Metadata is enabled for this instance." -ForegroundColor Yellow
}
Try {
  $BlockDeviceMappings = (Get-EC2Instance -Region $Region -Instance $InstanceId).Instances.BlockDeviceMappings
  $VirtualDeviceMap = (Get-EC2InstanceMetadata -Category "BlockDeviceMapping").GetEnumerator() | Where-Object { $_.Key -ne "ami" }
}
Catch {
  Write-Host "Could not access the AWS API, therefore, VolumeId is not available.
Verify that you provided your access keys or assigned an IAM role with adequate permissions." -ForegroundColor Yellow
}

Get-disk | ForEach-Object {
  $DriveLetter = $null
  $VolumeName = $null
  $VirtualDevice = $null
  $DeviceName = $_.FriendlyName

  $DiskDrive = $_
  $Disk = $_.Number
  $Partitions = $_.NumberOfPartitions
  $EbsVolumeID = $_.SerialNumber -replace "_[^ ]*$" -replace "vol", "vol-"
  if ($Partitions -ge 1) {
    $PartitionsData = Get-Partition -DiskId $_.Path
    $DriveLetter = $PartitionsData.DriveLetter | Where-object { $_ -notin @("", $null) }
    $VolumeName = (Get-PSDrive | Where-Object { $_.Name -in @($DriveLetter) }).Description | Where-object { $_ -notin @("", $null) }
  }
  If ($DiskDrive.path -like "*PROD_PVDISK*") {
    $BlockDeviceName = Convert-SCSITargetIdToDeviceName((Get-WmiObject -Class Win32_Diskdrive | Where-Object { $_.DeviceID -eq ("\\.\PHYSICALDRIVE" + $DiskDrive.Number) }).SCSITargetId)
    $BlockDeviceName = "/dev/" + $BlockDeviceName
    $BlockDevice = $BlockDeviceMappings | Where-Object { $BlockDeviceName -like "*" + $_.DeviceName + "*" }
    $EbsVolumeID = $BlockDevice.Ebs.VolumeId
    $VirtualDevice = ($VirtualDeviceMap.GetEnumerator() | Where-Object { $_.Value -eq $BlockDeviceName }).Key | Select-Object -First 1
  }
  ElseIf ($DiskDrive.path -like "*PROD_AMAZON_EC2_NVME*") {
    $BlockDeviceName = (Get-EC2InstanceMetadata -Category "BlockDeviceMapping")."ephemeral$((Get-WmiObject -Class Win32_Diskdrive | Where-Object { $_.DeviceID -eq ("\\.\PHYSICALDRIVE" + $DiskDrive.Number) }).SCSIPort - 2)"
    $BlockDevice = $null
    $VirtualDevice = ($VirtualDeviceMap.GetEnumerator() | Where-Object { $_.Value -eq $BlockDeviceName }).Key | Select-Object -First 1
  }
  ElseIf ($DiskDrive.path -like "*PROD_AMAZON*") {
    if ($DriveLetter -match '[^a-zA-Z0-9]') {
      $i = 0
      While ($i -ne ($array3.Count)) {
        if ($array[2][$i] -eq $EbsVolumeID) {
          $DriveLetter = $array[0][$i]
          $DeviceName = $array[3][$i]
        }
        $i ++
      }
    }
    $BlockDevice = ""
    $BlockDeviceName = ($BlockDeviceMappings | Where-Object { $_.ebs.VolumeId -eq $EbsVolumeID }).DeviceName
  }
  ElseIf ($DiskDrive.path -like "*NETAPP*") {
    if ($DriveLetter -match '[^a-zA-Z0-9]') {
      $i = 0
      While ($i -ne ($array3.Count)) {
        if ($array[2][$i] -eq $EbsVolumeID) {
          $DriveLetter = $array[0][$i]
          $DeviceName = $array[3][$i]
        }
        $i ++
      }
    }
    $EbsVolumeID = "FSxN Volume"
    $BlockDevice = ""
    $BlockDeviceName = ($BlockDeviceMappings | Where-Object { $_.ebs.VolumeId -eq $EbsVolumeID }).DeviceName
  }
  Else {
    $BlockDeviceName = $null
    $BlockDevice = $null
  }
  New-Object PSObject -Property @{
    Disk          = $Disk;
    Partitions    = $Partitions;
    DriveLetter   = If ($DriveLetter -eq $null) { "N/A" } Else { $DriveLetter };
    EbsVolumeId   = If ($EbsVolumeID -eq $null) { "N/A" } Else { $EbsVolumeID };
    Device        = If ($BlockDeviceName -eq $null) { "N/A" } Else { $BlockDeviceName };
    VirtualDevice = If ($VirtualDevice -eq $null) { "N/A" } Else { $VirtualDevice };
    VolumeName    = If ($VolumeName -eq $null) { "N/A" } Else { $VolumeName };
    DeviceName    = If ($DeviceName -eq $null) { "N/A" } Else { $DeviceName };
  }
} | Sort-Object Disk | Format-Table -AutoSize -Property Disk, Partitions, DriveLetter, EbsVolumeId, Device, VirtualDevice, DeviceName, VolumeName
```

按如下方式编辑脚本：

```
PS C:\> .\mapping.ps1
```

下面是示例输出。

```
Disk  Partitions  DriveLetter   EbsVolumeId             Device      VirtualDevice   DeviceName              VolumeName
----  ----------  -----------   -----------             ------      -------------   ----------              ----------
   0           1            C   vol-0561f1783298efedd   /dev/sda1   N/A             NVMe Amazon Elastic B   N/A
   1           1            D   vol-002a9488504c5e35a   xvdb        N/A             NVMe Amazon Elastic B   N/A
   2           1            E   vol-0de9d46fcc907925d   xvdc        N/A             NVMe Amazon Elastic B   N/A
```

如果您没有在 Windows 实例上提供凭据，则脚本将无法获取 EBS 卷 ID，并会在 `EbsVolumeId` 列中使用 N/A。

------

## 将非 NVMe 磁盘映射到卷
<a name="windows-volume-mapping"></a>

在装载卷时，实例的块储存设备驱动程序将分配实际卷名称。

**Topics**
+ [实例存储卷](#instance-store-volume-map)
+ [EBS 卷](#ebs-volume-map)

### 实例存储卷
<a name="instance-store-volume-map"></a>

下表描述了 Citrix PV 和 AWS PV 驱动程序是如何将非 NVMe 实例存储卷映射到 Windows 卷的。可用的实例存储卷数量由实例类型决定。有关更多信息，请参阅[EC2 实例的实例存储卷限制](instance-store-volumes.md)。


| 位置 | 设备名称 | 
| --- | --- | 
| 总线编号 0，目标 ID 78，LUN 0 | xvdca | 
| 总线编号 0，目标 ID 79，LUN 0 | xvdcb | 
| 总线编号 0，目标 ID 80，LUN 0 | xvdcc | 
| 总线编号 0，目标 ID 81，LUN 0 | xvdcd | 
| 总线编号 0，目标 ID 82，LUN 0 | xvdce | 
| 总线编号 0，目标 ID 83，LUN 0 | xvdcf | 
| 总线编号 0，目标 ID 84，LUN 0 | xvdcg | 
| 总线编号 0，目标 ID 85，LUN 0 | xvdch | 
| 总线编号 0，目标 ID 86，LUN 0 | xvdci | 
| 总线编号 0，目标 ID 87，LUN 0 | xvdcj | 
| 总线编号 0，目标 ID 88，LUN 0 | xvdck | 
| 总线编号 0，目标 ID 89，LUN 0 | xvdcl | 

### EBS 卷
<a name="ebs-volume-map"></a>

下表描述了 Citrix PV 和 AWS PV 驱动程序是如何将非 NVME EBS 卷映射到 Windows 卷的。


| 位置 | 设备名称 | 
| --- | --- | 
| 总线编号 0，目标 ID 0，LUN 0 | /dev/sda1 | 
| 总线编号 0，目标 ID 1，LUN 0 | xvdb | 
| 总线编号 0，目标 ID 2，LUN 0 | xvdc | 
| 总线编号 0，目标 ID 3，LUN 0 | xvdd | 
| 总线编号 0，目标 ID 4，LUN 0 | xvde | 
| 总线编号 0，目标 ID 5，LUN 0 | xvdf | 
| 总线编号 0，目标 ID 6，LUN 0 | xvdg | 
| 总线编号 0，目标 ID 7，LUN 0 | xvdh | 
| 总线编号 0，目标 ID 8，LUN 0 | xvdi | 
| 总线编号 0，目标 ID 9，LUN 0 | xvdj | 
| 总线编号 0，目标 ID 10，LUN 0 | xvdk | 
| 总线编号 0，目标 ID 11，LUN 0 | xvdl | 
| 总线编号 0，目标 ID 12，LUN 0 | xvdm | 
| 总线编号 0，目标 ID 13，LUN 0 | xvdn | 
| 总线编号 0，目标 ID 14，LUN 0 | xvdo | 
| 总线编号 0，目标 ID 15，LUN 0 | xvdp | 
| 总线编号 0，目标 ID 16，LUN 0 | xvdq | 
| 总线编号 0，目标 ID 17，LUN 0 | xvdr | 
| 总线编号 0，目标 ID 18，LUN 0 | xvds | 
| 总线编号 0，目标 ID 19，LUN 0 | xvdt | 
| 总线编号 0，目标 ID 20，LUN 0 | xvdu | 
| 总线编号 0，目标 ID 21，LUN 0 | xvdv | 
| 总线编号 0，目标 ID 22，LUN 0 | xvdw | 
| 总线编号 0，目标 ID 23，LUN 0 | xvdx | 
| 总线编号 0，目标 ID 24，LUN 0 | xvdy | 
| 总线编号 0，目标 ID 25，LUN 0 | xvdz | 