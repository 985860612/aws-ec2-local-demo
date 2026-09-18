

# STIG 强化脚本下载
<a name="ec2-stig-downloads"></a>

Amazon 将 STIG 强化脚本组合成适合每个版本的操作系统相关捆绑包。捆绑包是适用于其下载和运行的目标操作系统的归档文件。Linux 脚本捆绑包存储为 TAR 文件（文件扩展名为 .tgz）。Windows 脚本捆绑包存储为 ZIP 文件（文件扩展名为 .zip）。

Amazon 将脚本捆绑包存储在每个 AWS 区域的 EC2 Windows S3 `STIG` 存储桶中。Linux 捆绑包没有单独的存储桶。使用 SSL/TLS 与 AWS 资源进行通信。我们要求使用 TLS 1.2，建议使用 TLS 1.3。

**Topics**
+ [STIG 下载捆绑包详细信息](#ec2-stig-download-details)
+ [Linux STIG 版本历史记录](#ec2-linux-version-hist)
+ [Windows STIG 版本历史](#ec2-windows-version-hist)

## STIG 下载捆绑包详细信息
<a name="ec2-stig-download-details"></a>

**重要**  
除少数例外情况外，Systems Manager 文档下载的 STIG 强化脚本不会安装第三方软件包。如果实例上已经安装了第三方软件包，或 `InstallPackage` 参数设置为 `yes`，则会应用 Amazon EC2 支持该软件包的相关 STIG。

当您 AWS CLI 从中运行以下命令时，Amazon S3 会从存储桶中下载最新的 STIG 强化脚本捆绑包文件。

```
aws s3 cp s3://aws-windows-downloads-{{region}}/STIG/{{operating system}}/Latest/{{bundle-name}} {{destination-directory}}
```

**示例：下载到临时目录**  
此示例显示下载到 `/tmp` 目录的 Linux 捆绑包

```
aws s3 cp s3://aws-windows-downloads-{{us-east-1}}/STIG/{{Linux}}/Latest/{{LinuxAWSConfigureSTIG.tgz}} {{/tmp}}
```

下载文件存储路径和捆绑包文件名的模式和示例如下所示：

**下载文件存储路径**  
`s3://aws-windows-downloads-{{<region>}}/STIG/{{<operating system>}}/Latest/{{<bundle file name>}}`下载路径变量

**region**  
AWS 区域（每个区域都有自己的下载存储桶。）

**operating system**  
应用 STIG 的实例的操作系统平台：`Linux` 或 `Windows`。

**bundle file name**  
格式为 {{<os bundle name>}}.{{<file extension>}}。    
**os bundle name**  
操作系统捆绑包的标准名称前缀为 `LinuxAWSConfigureSTIG` 或 `AWSConfigureSTIG`。为保持向后兼容性，Windows 版的下载不包含平台前缀。  
**file extension**  
压缩文件格式 `tgz` (Linux) 或 `zip` (Windows)。

**捆绑包文件名示例**
+ `LinuxAWSConfigureSTIG.tgz`
+ `AWSConfigureSTIG.zip`

## Linux STIG 版本历史记录
<a name="ec2-linux-version-hist"></a>

本节记录每季度更新的 Linux 脚本捆绑包的版本历史记录。要查看一个季度的变化和发布的版本，请选择其标题以展开信息。如果该季度没有任何变化，您将在标题中看到相应标注。

### 2026 年第一季度更改：2026 年 4 月 7 日：
<a name="2026-q1-linux"></a>

添加了对 RHEL 10 操作系统的支持，更新了以下 STIG 版本，并对 2026 年第一季度发行版的所有合规性级别（低/中/高）应用了 STIG：

**STIG-Build-Linux 版本 1.0.x**
+ RHEL 8 STIG 版本 2 发行版 6
+ RHEL 9 STIG 版本 2 发行版 7
+ RHEL 10 STIG 版本 1 发行版 1
+ Amazon Linux 2023 STIG 版本 1 发行版 2
+ SLES 12 STIG 版本 3 发行版 4
+ SLES 15 STIG 版本 2 发行版 6
+ Ubuntu 20.04 STIG 版本 2 发行版 4
+ Ubuntu 22.04 STIG 版本 2 发行版 7
+ Ubuntu 24.04 STIG 版本 1 发行版 4

### 2025 年第三季度更改 - 2025 年 9 月 4 日：
<a name="2025-q3-linux"></a>

添加了对 SUSE Linux Enterprise Server（SLES）操作系统和 Amazon Linux 2023 的支持。更新了以下 STIG 版本，并对 2025 年第三季度发行版的所有合规性级别（低/中/高）应用了 STIG：

**STIG-Build-Linux 版本 1.0.x**
+ RHEL 7 STIG 版本 3 发行版 15
+ RHEL 8 STIG 版本 2 发行版 4
+ RHEL 9 STIG 版本 2 发行版 5
+ Amazon Linux 2023 STIG 版本 1 发行版 1
+ SLES 12 STIG 版本 3 发行版 3
+ SLES 15 STIG 版本 2 发行版 5
+ Ubuntu 18.04 STIG 版本 2 发行版 15
+ Ubuntu 20.04 STIG 版本 2 发行版 3
+ Ubuntu 22.04 STIG 版本 2 发行版 5
+ Ubuntu 24.04 STIG 版本 1 发行版 2

### 2025 年第二季度更改 - 2025 年 6 月 26 日：
<a name="2025-q2-linux"></a>

更新了以下 STIG 版本，并对 2025 年第二季度发行版应用了 STIG：

**Linux STIG 低（第三类）**
+ RHEL 7 STIG 版本 3 发行版 15
+ RHEL 8 STIG 版本 2 发行版 3
+ RHEL 9 STIG 版本 2 发行版 4
+ Ubuntu 18.04 STIG 版本 2 发行版 15
+ Ubuntu 20.04 STIG 版本 2 发行版 2
+ Ubuntu 22.04 STIG 版本 2 发行版 4
+ Ubuntu 24.04 STIG 版本 1 发行版 1

**Linux STIG 中等（第二类）**
+ RHEL 7 STIG 版本 3 发行版 15
+ RHEL 8 STIG 版本 2 发行版 3
+ RHEL 9 STIG 版本 2 发行版 4
+ Ubuntu 18.04 STIG 版本 2 发行版 15
+ Ubuntu 20.04 STIG 版本 2 发行版 2
+ Ubuntu 22.04 STIG 版本 2 发行版 4
+ Ubuntu 24.04 STIG 版本 1 发行版 1

**Linux STIG 高（第一类）**
+ RHEL 7 STIG 版本 3 发行版 15
+ RHEL 8 STIG 版本 2 发行版 3
+ RHEL 9 STIG 版本 2 发行版 4
+ Ubuntu 18.04 STIG 版本 2 发行版 15
+ Ubuntu 20.04 STIG 版本 2 发行版 2
+ Ubuntu 22.04 STIG 版本 2 发行版 4
+ Ubuntu 24.04 STIG 版本 1 发行版 1

### 2025 年第一季度更改 - 2025 年 4 月 11 日：
<a name="2025-q1-linux"></a>

更新了以下 STIG 版本，对 2025 年第一季度发行版应用了 STIG，并添加了对 Ubuntu 24.04 的支持：

**Linux STIG 低（第三类）**
+ RHEL 7 STIG 版本 3 发行版 15
+ RHEL 8 STIG 版本 2 发行版 2
+ RHEL 9 STIG 版本 2 发行版 3
+ Ubuntu 18.04 STIG 版本 2 发行版 15
+ Ubuntu 20.04 STIG 版本 2 发行版 2
+ Ubuntu 22.04 STIG 版本 2 发行版 3
+ Ubuntu 24.04 STIG 版本 1 发行版 1

**Linux STIG 中等（第二类）**
+ RHEL 7 STIG 版本 3 发行版 15
+ RHEL 8 STIG 版本 2 发行版 2
+ RHEL 9 STIG 版本 2 发行版 3
+ Ubuntu 18.04 STIG 版本 2 发行版 15
+ Ubuntu 20.04 STIG 版本 2 发行版 2
+ Ubuntu 22.04 STIG 版本 2 发行版 3
+ Ubuntu 24.04 STIG 版本 1 发行版 1

**Linux STIG 高（第一类）**
+ RHEL 7 STIG 版本 3 发行版 15
+ RHEL 8 STIG 版本 2 发行版 2
+ RHEL 9 STIG 版本 2 发行版 3
+ Ubuntu 18.04 STIG 版本 2 发行版 15
+ Ubuntu 20.04 STIG 版本 2 发行版 2
+ Ubuntu 22.04 STIG 版本 2 发行版 3
+ Ubuntu 24.04 STIG 版本 1 发行版 1

### 2024 年第四季度更改 - 2024 年 12 月 10 日：
<a name="2024-q4-linux"></a>

更新了以下 STIG 版本，对 2024 年第四季度发行版应用了 STIG，并添加了有关 Linux 组件的两个新输入参数的信息：

**Linux STIG 低（第三类）**
+ RHEL 7 STIG 版本 3 发行版 15
+ RHEL 8 STIG 版本 2 发行版 1
+ RHEL 9 STIG 版本 2 发行版 2
+ Ubuntu 18.04 STIG 版本 2 发行版 15
+ Ubuntu 20.04 STIG 版本 2 发行版 1
+ Ubuntu 22.04 STIG 版本 2 发行版 2

**Linux STIG 中等（第二类）**
+ RHEL 7 STIG 版本 3 发行版 15
+ RHEL 8 STIG 版本 2 发行版 1
+ RHEL 9 STIG 版本 2 发行版 2
+ Ubuntu 18.04 STIG 版本 2 发行版 15
+ Ubuntu 20.04 STIG 版本 2 发行版 1
+ Ubuntu 22.04 STIG 版本 2 发行版 2

**Linux STIG 高（第一类）**
+ RHEL 7 STIG 版本 3 发行版 15
+ RHEL 8 STIG 版本 2 发行版 1
+ RHEL 9 STIG 版本 2 发行版 2
+ Ubuntu 18.04 STIG 版本 2 发行版 15
+ Ubuntu 20.04 STIG 版本 2 发行版 1
+ Ubuntu 22.04 STIG 版本 2 发行版 2

### 2024 年第三季度更改 - 2024 年 10 月 4 日（无更改）：
<a name="2024-q3-linux"></a>

2024 年第三季度发行版的 Linux 组件 STIG 无更改。

### 2024 年第二季度更改 - 2024 年 5 月 10 日：
<a name="2024-q2-linux"></a>

更新了 STIG 版本，并对 2024 年第二季度发行版应用了 STIG。还新增了对 RHEL 9、CentOS Stream 9 和 Ubuntu 22.04 的支持，如下所示：

**Linux STIG 低（第三类）**
+ RHEL 7 STIG 版本 3 发行版 14
+ RHEL 8 STIG 版本 1 发行版 14
+ RHEL 9 STIG 版本 1 发行版 3
+ Ubuntu 18.04 STIG 版本 2 发行版 14
+ Ubuntu 20.04 STIG 版本 1 发行版 12
+ Ubuntu 22.04 STIG 版本 1 发行版 1

**Linux STIG 中等（第二类）**
+ RHEL 7 STIG 版本 3 发行版 14
+ RHEL 8 STIG 版本 1 发行版 14
+ RHEL 9 STIG 版本 1 发行版 3
+ Ubuntu 18.04 STIG 版本 2 发行版 14
+ Ubuntu 20.04 STIG 版本 1 发行版 12
+ Ubuntu 22.04 STIG 版本 1 发行版 1

**Linux STIG 高（第一类）**
+ RHEL 7 STIG 版本 3 发行版 14
+ RHEL 8 STIG 版本 1 发行版 14
+ RHEL 9 STIG 版本 1 发行版 3
+ Ubuntu 18.04 STIG 版本 2 发行版 14
+ Ubuntu 20.04 STIG 版本 1 发行版 12
+ Ubuntu 22.04 STIG 版本 1 发行版 1

### 2024 年第一季度更改 - 2024 年 2 月 6 日：
<a name="2024-q1-linux"></a>

更新了 STIG 版本，并对 2024 年第一季度发行版应用了 STIG，如下所示：

**Linux STIG 低（第三类）**
+ RHEL 7 STIG 版本 3 发行版 14
+ RHEL 8 STIG 版本 1 发行版 13
+ Ubuntu 18.04 STIG 版本 2 发行版 13
+ Ubuntu 20.04 STIG 版本 1 发行版 11

**Linux STIG 中等（第二类）**
+ RHEL 7 STIG 版本 3 发行版 14
+ RHEL 8 STIG 版本 1 发行版 13
+ Ubuntu 18.04 STIG 版本 2 发行版 13
+ Ubuntu 20.04 STIG 版本 1 发行版 11

**Linux STIG 高（第一类）**
+ RHEL 7 STIG 版本 3 发行版 14
+ RHEL 8 STIG 版本 1 发行版 13
+ Ubuntu 18.04 STIG 版本 2 发行版 13
+ Ubuntu 20.04 STIG 版本 1 发行版 11

### 2023 年第四季度更改 - 2023 年 12 月 7 日：
<a name="2023-q4-linux"></a>

更新了 STIG 版本，并对 2023 年第四季度发行版应用了 STIG，如下所示：

**Linux STIG 低（第三类）**
+ RHEL 7 STIG 版本 3 发行版 13
+ RHEL 8 STIG 版本 1 发行版 12
+ Ubuntu 18.04 STIG 版本 2 发行版 12
+ Ubuntu 20.04 STIG 版本 1 发行版 10

**Linux STIG 中等（第二类）**
+ RHEL 7 STIG 版本 3 发行版 13
+ RHEL 8 STIG 版本 1 发行版 12
+ Ubuntu 18.04 STIG 版本 2 发行版 12
+ Ubuntu 20.04 STIG 版本 1 发行版 10

**Linux STIG 高（第一类）**
+ RHEL 7 STIG 版本 3 发行版 13
+ RHEL 8 STIG 版本 1 发行版 12
+ Ubuntu 18.04 STIG 版本 2 发行版 12
+ Ubuntu 20.04 STIG 版本 1 发行版 10

### 2023 年第三季度更改 — 2023 年 10 月 4 日：
<a name="2023-q3-linux"></a>

更新了 STIG 版本，并对 2023 年第三季度发行版应用了 STIG，如下所示：

**Linux STIG 低（第三类）**
+ RHEL 7 STIG 版本 3 发行版 12
+ RHEL 8 STIG 版本 1 发行版 11
+ Ubuntu 18.04 STIG 版本 2 发行版 11
+ Ubuntu 20.04 STIG 版本 1 发行版 9

**Linux STIG 中等（第二类）**
+ RHEL 7 STIG 版本 3 发行版 12
+ RHEL 8 STIG 版本 1 发行版 11
+ Ubuntu 18.04 STIG 版本 2 发行版 11
+ Ubuntu 20.04 STIG 版本 1 发行版 9

**Linux STIG 高（第一类）**
+ RHEL 7 STIG 版本 3 发行版 12
+ RHEL 8 STIG 版本 1 发行版 11
+ Ubuntu 18.04 STIG 版本 2 发行版 11
+ Ubuntu 20.04 STIG 版本 1 发行版 9

### 2023 年第二季度更改 — 2023 年 5 月 3 日：
<a name="2023-q2-linux"></a>

更新了 STIG 版本，并对 2023 年第二季度发行版应用了 STIG，如下所示：

**Linux STIG 低（第三类）**
+ RHEL 7 STIG 版本 3 发行版 11
+ RHEL 8 STIG 版本 1 发行版 10
+ Ubuntu 18.04 STIG 版本 2 发行版 11
+ Ubuntu 20.04 STIG 版本 1 发行版 8

**Linux STIG 中等（第二类）**
+ RHEL 7 STIG 版本 3 发行版 11
+ RHEL 8 STIG 版本 1 发行版 10
+ Ubuntu 18.04 STIG 版本 2 发行版 11
+ Ubuntu 20.04 STIG 版本 1 发行版 8

**Linux STIG 高（第一类）**
+ RHEL 7 STIG 版本 3 发行版 11
+ RHEL 8 STIG 版本 1 发行版 10
+ Ubuntu 18.04 STIG 版本 2 发行版 11
+ Ubuntu 20.04 STIG 版本 1 发行版 8

### 2023 年第一季度更改 — 2023 年 3 月 27 日：
<a name="2023-q1-linux"></a>

更新了 STIG 版本，并对 2023 年第一季度发行版应用了 STIG，如下所示：

**Linux STIG 低（第三类）**
+ RHEL 7 STIG 版本 3 发行版 10
+ RHEL 8 STIG 版本 1 发行版 9
+ Ubuntu 18.04 STIG 版本 2 发行版 10
+ Ubuntu 20.04 STIG 版本 1 发行版 7

**Linux STIG 中等（第二类）**
+ RHEL 7 STIG 版本 3 发行版 10
+ RHEL 8 STIG 版本 1 发行版 9
+ Ubuntu 18.04 STIG 版本 2 发行版 10
+ Ubuntu 20.04 STIG 版本 1 发行版 7

**Linux STIG 高（第一类）**
+ RHEL 7 STIG 版本 3 发行版 10
+ RHEL 8 STIG 版本 1 发行版 9
+ Ubuntu 18.04 STIG 版本 2 发行版 10
+ Ubuntu 20.04 STIG 版本 1 发行版 7

### 2022 年第四季度更改 — 2023 年 2 月 1 日：
<a name="2022-q4-linux"></a>

更新了 STIG 版本，并对 2022 年第四季度发行版应用了 STIG，如下所示：

**Linux STIG 低（第三类）**
+ RHEL 7 STIG 版本 3 发行版 9
+ RHEL 8 STIG 版本 1 发行版 8
+ Ubuntu 18.04 STIG 版本 2 发行版 9
+ Ubuntu 20.04 STIG 版本 1 发行版 6

**Linux STIG 中等（第二类）**
+ RHEL 7 STIG 版本 3 发行版 9
+ RHEL 8 STIG 版本 1 发行版 8
+ Ubuntu 18.04 STIG 版本 2 发行版 9
+ Ubuntu 20.04 STIG 版本 1 发行版 6

**Linux STIG 高（第一类）**
+ RHEL 7 STIG 版本 3 发行版 9
+ RHEL 8 STIG 版本 1 发行版 8
+ Ubuntu 18.04 STIG 版本 2 发行版 9
+ Ubuntu 20.04 STIG 版本 1 发行版 6

### 2022 年第三季度更改 — 2022 年 9 月 30 日（无更改）：
<a name="2022-q3-linux"></a>

2022 年第三季度发行版的 Linux 组件 STIGS 无更改。

### 2022 年第二季度更改 — 2022 年 8 月 2 日：
<a name="2022-q2-linux"></a>

引入了 Ubuntu 支持，更新了 STIG 版本，并对 2022 年第二季度发行版应用了 STIGS，如下所示：

**Linux STIG 低（第三类）**
+ RHEL 7 STIG 版本 3 发行版 7
+ RHEL 8 STIG 版本 1 发行版 6
+ Ubuntu 18.04 STIG 版本 2 发行版 6（全新）
+ Ubuntu 20.04 STIG 版本 1 发行版 4（全新）

**Linux STIG 中等（第二类）**
+ RHEL 7 STIG 版本 3 发行版 7
+ RHEL 8 STIG 版本 1 发行版 6
+ Ubuntu 18.04 STIG 版本 2 发行版 6（全新）
+ Ubuntu 20.04 STIG 版本 1 发行版 4（全新）

**Linux STIG 高（第一类）**
+ RHEL 7 STIG 版本 3 发行版 7
+ RHEL 8 STIG 版本 1 发行版 6
+ Ubuntu 18.04 STIG 版本 2 发行版 6（全新）
+ Ubuntu 20.04 STIG 版本 1 发行版 4（全新）

### 2022 年第一季度更改 — 2022 年 4 月 26 日：
<a name="2022-q1-linux"></a>

已重构以包括对容器更好的支持。将之前的 AL2 脚本与 RHEL 7 结合起来。更新了 STIG 版本，并对 2022 年第一季度发行版应用了 STIG，如下所示：

**Linux STIG 低（第三类）**
+ RHEL 7 STIG 版本 3 发行版 6
+ RHEL 8 STIG 版本 1 发行版 5

**Linux STIG 中等（第二类）**
+ RHEL 7 STIG 版本 3 发行版 6
+ RHEL 8 STIG 版本 1 发行版 5

**Linux STIG 高（第一类）**
+ RHEL 7 STIG 版本 3 发行版 6
+ RHEL 8 STIG 版本 1 发行版 5

### 2021 年第四季度更改 — 2021 年 12 月 20 日：
<a name="2021-q4-linux"></a>

更新了 STIG 版本，并对 2021 年第四季度发行版应用了 STIG，如下所示：

**Linux STIG 低（第三类）**
+ RHEL 7 STIG 版本 3 发行版 5
+ RHEL 8 STIG 版本 1 发行版 4

**Linux STIG 中等（第二类）**
+ RHEL 7 STIG 版本 3 发行版 5
+ RHEL 8 STIG 版本 1 发行版 4

**Linux STIG 高（第一类）**
+ RHEL 7 STIG 版本 3 发行版 5
+ RHEL 8 STIG 版本 1 发行版 4

### 2021 年第三季度更改 — 2021 年 9 月 30 日：
<a name="2021-q3-linux"></a>

更新了 STIG 版本，并对 2021 年第三季度发行版应用了 STIG，如下所示：

**Linux STIG 低（第三类）**
+ RHEL 7 STIG 版本 3 发行版 4
+ RHEL 8 STIG 版本 1 发行版 3

**Linux STIG 中等（第二类）**
+ RHEL 7 STIG 版本 3 发行版 4
+ RHEL 8 STIG 版本 1 发行版 3

**Linux STIG 高（第一类）**
+ RHEL 7 STIG 版本 3 发行版 4
+ RHEL 8 STIG 版本 1 发行版 3

## Windows STIG 版本历史
<a name="ec2-windows-version-hist"></a>

本节记录每季度更新的 Windows 脚本捆绑包的版本历史记录。要查看一个季度的变化和发布的版本，请选择其标题以展开信息。如果该季度没有任何变化，您将在标题中看到相应标注。

### 2026 年第一季度更改：2026 年 4 月 7 日：
<a name="2026-q1-windows"></a>

添加了对 Windows Server 2025 操作系统的支持，更新了以下 STIG 版本，并对 2026 年第一季度发行版的所有合规性级别（低/中/高）应用了 STIG：

**STIG-Build-Windows-Low 版本 1.0.x**
+ Windows Server 2025 STIG 版本 1 发行版 1
+ Windows Server 2022 STIG 版本 2 发行版 7
+ Windows Server 2019 STIG 版本 3 发行版 7
+ Microsoft .NET Framework 4.0 STIG 版本 2 发行版 7
+ Windows Firewall STIG 版本 2 发行版 2
+ Internet Explorer 11 STIG 版本 2 发行版 6
+ Microsoft Edge STIG 版本 2 发行版 4（仅限 Windows Server 2022 和 2025）

### 2025 年第四季度更改：2025 年 12 月 10 日（无更改）：
<a name="2025-q4-windows"></a>

在 2025 年第四季度发行版中，Windows 组件 STIGS 无更改。

### 2025 年第三季度更改 - 2025 年 9 月 4 日（无更改）：
<a name="2025-q3-windows"></a>

2025 年第三季度发行版的 Windows 组件 STIG 无更改。

### 2025 年第二季度更改 - 2025 年 6 月 26 日：
<a name="2025-q2-windows"></a>

更新了 STIG 版本并对 2025 年第二季度发行版应用了 STIG，如下所示：

**Windows STIG 低（第三类）**
+ Windows Server 2022 STIG 版本 2 发行版 4
+ Windows Server 2019 STIG 版本 3 发行版 4
+ Windows Server 2016 STIG 版本 2 发行版 10
+ Windows Server 2012 R2 MS STIG 版本 3 发行版 5
+ Microsoft .NET Framework 4.0 STIG 版本 2 发行版 6
+ Windows Firewall STIG 版本 2 发行版 2
+ Internet Explorer 11 STIG 版本 2 发行版 5
+ Microsoft Edge STIG 版本 2 发行版 2（仅限 Windows Server 2022）

**Windows STIG 中等（第二类）**
+ Windows Server 2022 STIG 版本 2 发行版 4
+ Windows Server 2019 STIG 版本 3 发行版 4
+ Windows Server 2016 STIG 版本 2 发行版 10
+ Windows Server 2012 R2 MS STIG 版本 3 发行版 5
+ Microsoft .NET Framework 4.0 STIG 版本 2 发行版 6
+ Windows Firewall STIG 版本 2 发行版 2
+ Internet Explorer 11 STIG 版本 2 发行版 5
+ Microsoft Edge STIG 版本 2 发行版 2（仅限 Windows Server 2022）
+ Defender STIG 版本 2 发行版 4

**Windows STIG 高（第一类）**
+ Windows Server 2022 STIG 版本 2 发行版 4
+ Windows Server 2019 STIG 版本 3 发行版 4
+ Windows Server 2016 STIG 版本 2 发行版 10
+ Windows Server 2012 R2 MS STIG 版本 3 发行版 5
+ Microsoft .NET Framework 4.0 STIG 版本 2 发行版 6
+ Windows Firewall STIG 版本 2 发行版 2
+ Internet Explorer 11 STIG 版本 2 发行版 5
+ Microsoft Edge STIG 版本 2 发行版 2（仅限 Windows Server 2022）
+ Defender STIG 版本 2 发行版 4

### 2025 年第一季度更改 - 2025 年 5 月 4 日：
<a name="2025-q1-windows"></a>

更新了针对 Internet Explorer 11 STIG 版本 2 发行版 5 的 STIG，适用于 2025 年第一季度发行版的所有 STIG 组件。

### 2024 年第四季度更改 - 2024 年 12 月 10 日：
<a name="2024-q4-windows"></a>

更新了 STIG 版本并对 2024 年第四季度发行版应用了 STIG，如下所示：

**Windows STIG 低（第三类）**
+ Windows Server 2022 STIG 版本 2 发行版 2
+ Windows Server 2019 STIG 版本 3 发行版 2
+ Windows Server 2016 STIG 版本 2 发行版 9
+ Windows Server 2012 R2 MS STIG 版本 3 发行版 5
+ Microsoft .NET Framework 4.0 STIG 版本 2 发行版 2
+ Windows Firewall STIG 版本 2 发行版 2
+ Internet Explorer 11 STIG 版本 2 发行版 5
+ Microsoft Edge STIG 版本 2 发行版 2（仅限 Windows Server 2022）

**Windows STIG 中等（第二类）**
+ Windows Server 2022 STIG 版本 2 发行版 2
+ Windows Server 2019 STIG 版本 3 发行版 2
+ Windows Server 2016 STIG 版本 2 发行版 9
+ Windows Server 2012 R2 MS STIG 版本 3 发行版 5
+ Microsoft .NET Framework 4.0 STIG 版本 2 发行版 2
+ Windows Firewall STIG 版本 2 发行版 2
+ Internet Explorer 11 STIG 版本 2 发行版 5
+ Microsoft Edge STIG 版本 2 发行版 2（仅限 Windows Server 2022）
+ Defender STIG 版本 2 发行版 4

**Windows STIG 高（第一类）**
+ Windows Server 2022 STIG 版本 2 发行版 2
+ Windows Server 2019 STIG 版本 3 发行版 2
+ Windows Server 2016 STIG 版本 2 发行版 9
+ Windows Server 2012 R2 MS STIG 版本 3 发行版 5
+ Microsoft .NET Framework 4.0 STIG 版本 2 发行版 2
+ Windows Firewall STIG 版本 2 发行版 2
+ Internet Explorer 11 STIG 版本 2 发行版 5
+ Microsoft Edge STIG 版本 2 发行版 2（仅限 Windows Server 2022）
+ Defender STIG 版本 2 发行版 4

### 2024 年第三季度更改 - 2024 年 10 月 4 日（无更改）：
<a name="2024-q3-windows"></a>

2024 年第三季度发行版的 Windows 组件 STIG 无更改。

### 2024 年第二季度更改 - 2024 年 5 月 10 日（无更改）：
<a name="2024-q2-windows"></a>

在 2024 年第二季度发行版中，Windows 组件 STIGS 无更改。

### 2024 年第一季度更改 - 2024 年 2 月 23 日（无更改）：
<a name="2024-q1-windows"></a>

在 2024 年第一季度发行版中，Windows 组件 STIGS 无更改。

### 2023 年第四季度更改 - 2023 年 12 月 7 日（无更改）：
<a name="2023-q4-windows"></a>

在 2023 年第四季度发行版中，Windows 组件 STIGS 无更改。

### 2023 年第三季度更改 — 2023 年 10 月 4 日（无更改）：
<a name="2023-q3-windows"></a>

在 2023 年第三季度发行版中，Windows 组件 STIGS 无更改。

### 2023 年第二季度更改 — 2023 年 5 月 3 日（无更改）：
<a name="2023-q2-windows"></a>

在 2023 年第二季度发行版中，Windows 组件 STIGS 无更改。

### 2023 年第一季度更改 — 2023 年 3 月 27 日（无更改）：
<a name="2023-q1-windows"></a>

在 2023 年第一季度发行版中，Windows 组件 STIGS 无更改。

### 2022 年第四季度更改 — 2023 年 2 月 1 日：
<a name="2022-q4-windows"></a>

更新了 STIG 版本并对 2022 年第四季度发行版应用了 STIG，如下所示：

**Windows STIG 低（第三类）**
+ Windows Server 2022 STIG 版本 1 发行版 1
+ Windows Server 2019 STIG 版本 2 发行版 5
+ Windows Server 2016 STIG 版本 2 发行版 5
+ Windows Server 2012 R2 MS STIG 版本 3 发行版 5
+ Microsoft .NET Framework 4.0 STIG 版本 2 发行版 2
+ Windows Firewall STIG 版本 2 发行版 1
+ Internet Explorer 11 STIG 版本 2 发行版 3
+ Microsoft Edge STIG 版本 1 发行版 6（仅限 Windows Server 2022）

**Windows STIG 中等（第二类）**
+ Windows Server 2022 STIG 版本 1 发行版 1
+ Windows Server 2019 STIG 版本 2 发行版 5
+ Windows Server 2016 STIG 版本 2 发行版 5
+ Windows Server 2012 R2 MS STIG 版本 3 发行版 5
+ Microsoft .NET Framework 4.0 STIG 版本 2 发行版 2
+ Windows Firewall STIG 版本 2 发行版 1
+ Internet Explorer 11 STIG 版本 2 发行版 3
+ Microsoft Edge STIG 版本 1 发行版 6（仅限 Windows Server 2022）
+ Defender STIG 版本 2 发行版 4（仅限 Windows Server 2022）

**Windows STIG 高（第一类）**
+ Windows Server 2022 STIG 版本 1 发行版 1
+ Windows Server 2019 STIG 版本 2 发行版 5
+ Windows Server 2016 STIG 版本 2 发行版 5
+ Windows Server 2012 R2 MS STIG 版本 3 发行版 5
+ Microsoft .NET Framework 4.0 STIG 版本 2 发行版 2
+ Windows Firewall STIG 版本 2 发行版 1
+ Internet Explorer 11 STIG 版本 2 发行版 3
+ Microsoft Edge STIG 版本 1 发行版 6（仅限 Windows Server 2022）
+ Defender STIG 版本 2 发行版 4（仅限 Windows Server 2022）

### 2022 年第三季度更改 — 2022 年 9 月 30 日（无更改）：
<a name="2022-q3-windows"></a>

在 2022 年第三季度发行版中，Windows 组件 STIGS 无更改。

### 2022 年第二季度更改 — 2022 年 8 月 2 日：
<a name="2022-q2-windows"></a>

更新了 STIG 版本，并对 2022 年第二季度发行版应用了 STIG。

**Windows STIG 低（第三类）**
+ Windows Server 2019 STIG 版本 2 发行版 4
+ Windows Server 2016 STIG 版本 2 发行版 4
+ Windows Server 2012 R2 MS STIG 版本 3 发行版 3
+ Microsoft .NET Framework 4.0 STIG 版本 2 发行版 1
+ Windows Firewall STIG 版本 2 发行版 1
+ Internet Explorer 11 STIG 版本 1 发行版 19

**Windows STIG 中等（第二类）**
+ Windows Server 2019 STIG 版本 2 发行版 4
+ Windows Server 2016 STIG 版本 2 发行版 4
+ Windows Server 2012 R2 MS STIG 版本 3 发行版 3
+ Microsoft .NET Framework 4.0 STIG 版本 2 发行版 1
+ Windows Firewall STIG 版本 2 发行版 1
+ Internet Explorer 11 STIG 版本 1 发行版 19

**Windows STIG 高（第一类）**
+ Windows Server 2019 STIG 版本 2 发行版 4
+ Windows Server 2016 STIG 版本 2 发行版 4
+ Windows Server 2012 R2 MS STIG 版本 3 发行版 3
+ Microsoft .NET Framework 4.0 STIG 版本 2 发行版 1
+ Windows Firewall STIG 版本 2 发行版 1
+ Internet Explorer 11 STIG 版本 1 发行版 19

### 2022 年第一季度更改 — 2022 年 2 月 8 日（无更改）：
<a name="2022-q1-windows"></a>

在 2022 年第一季度发行版中，Windows 组件 STIGS 无更改。

### 2021 年第四季度更改 — 2021 年 12 月 20 日：
<a name="2021-q4-windows"></a>

更新了 STIG 版本，并对 2021 年第四季度发行版应用了 STIG。

**Windows STIG 低（第三类）**
+ Windows Server 2019 STIG 版本 2 发行版 3
+ Windows Server 2016 STIG 版本 2 发行版 3
+ Windows Server 2012 R2 MS STIG 版本 3 发行版 3
+ Microsoft .NET Framework 4.0 STIG 版本 2 发行版 1
+ Windows Firewall STIG 版本 2 发行版 1
+ Internet Explorer 11 STIG 版本 1 发行版 19

**Windows STIG 中等（第二类）**
+ Windows Server 2019 STIG 版本 2 发行版 3
+ Windows Server 2016 STIG 版本 2 发行版 3
+ Windows Server 2012 R2 MS STIG 版本 3 发行版 3
+ Microsoft .NET Framework 4.0 STIG 版本 2 发行版 1
+ Windows Firewall STIG 版本 2 发行版 1
+ Internet Explorer 11 STIG 版本 1 发行版 19

**Windows STIG 高（第一类）**
+ Windows Server 2019 STIG 版本 2 发行版 3
+ Windows Server 2016 STIG 版本 2 发行版 3
+ Windows Server 2012 R2 MS STIG 版本 3 发行版 3
+ Microsoft .NET Framework 4.0 STIG 版本 2 发行版 1
+ Windows Firewall STIG 版本 2 发行版 1
+ Internet Explorer 11 STIG 版本 1 发行版 19

### 2021 年第三季度更改 — 2021 年 9 月 30 日：
<a name="2021-q3-windows"></a>

更新了 STIG 版本，并对 2021 年第三季度发行版应用了 STIG。

**Windows STIG 低（第三类）**
+ Windows Server 2019 STIG 版本 2 发行版 2
+ Windows Server 2016 STIG 版本 2 发行版 2
+ Windows Server 2012 R2 MS STIG 版本 3 发行版 2
+ Microsoft .NET Framework 4.0 STIG 版本 2 发行版 1
+ Windows Firewall STIG 版本 1 发行版 7
+ Internet Explorer 11 STIG 版本 1 发行版 19

**Windows STIG 中等（第二类）**
+ Windows Server 2019 STIG 版本 2 发行版 2
+ Windows Server 2016 STIG 版本 2 发行版 2
+ Windows Server 2012 R2 MS STIG 版本 3 发行版 2
+ Microsoft .NET Framework 4.0 STIG 版本 2 发行版 1
+ Windows Firewall STIG 版本 1 发行版 7
+ Internet Explorer 11 STIG 版本 1 发行版 19

**Windows STIG 高（第一类）**
+ Windows Server 2019 STIG 版本 2 发行版 2
+ Windows Server 2016 STIG 版本 2 发行版 2
+ Windows Server 2012 R2 MS STIG 版本 3 发行版 2
+ Microsoft .NET Framework 4.0 STIG 版本 2 发行版 1
+ Windows Firewall STIG 版本 1 发行版 7
+ Internet Explorer 11 STIG 版本 1 发行版 19