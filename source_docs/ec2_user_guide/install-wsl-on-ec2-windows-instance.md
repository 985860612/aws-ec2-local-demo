

# 在 EC2 Windows 实例上安装适用于 Linux 的 Windows 子系统
<a name="install-wsl-on-ec2-windows-instance"></a>

适用于 Linux 的 Windows 子系统（WSL）是 Microsoft Windows 的一项功能。通过在 EC2 Windows 实例上安装 WSL，您可以直接在 Windows 实例上运行本机 Linux 工具。

适用于 Linux 的 Windows 子系统（WSL）有两个版本：WSL 1 和 WSL 2。有关更多信息，请参阅 Microsoft 网站上[适用于 Linux 的 Windows 子系统文档](https://learn.microsoft.com/en-us/windows/wsl/)。

**要求**
+ 操作系统必须是 Windows Server 2019 或更高版本。
+ 您只能在虚拟化的 Windows 实例上安装 WSL 1（实例大小不为 `.metal` 或不支持嵌套虚拟化）。
+ 您可以在支持嵌套虚拟化并启用了 `NestedVirtualization` CPU 选项的实例上安装 WSL 1 或 WSL 2。
+ 您可以在裸机实例（实例大小为 `.metal`）上安装 WSL 1 或 WSL 2。裸机实例默认为嵌套虚拟化提供所需的支持。

有关 EC2 的嵌套虚拟化的更多信息，请参阅 [利用嵌套虚拟化在 Amazon EC2 实例中运行虚拟机监控程序](amazon-ec2-nested-virtualization.md)。

## 在 Windows 实例上安装 WSL
<a name="install-wsl-steps"></a>

**安装 WSL 1**

1. 安装 WSL。您将使用的过程取决于实例上运行的 Windows Server 版本。
   + **Windows Server 2022 及更高版本**：在您的 EC2 实例上运行以下标准安装命令。

     ```
     wsl --install --enable-wsl1 --no-launch
     ```
   + **Windows Server 2019**：启用 WSL，然后如 Microsoft 网站上的[在早期版本的 Windows Server 上安装 WSL](https://learn.microsoft.com/en-us/windows/wsl/install-on-server#install-wsl-on-previous-versions-of-windows-server) 中所述安装 WSL。

1. 重新启动您的 EC2 实例。

   ```
   shutdown -r -t 20
   ```

1. 要将 WSL 配置为使用 WSL 1，请在您的实例上运行以下命令。虚拟化实例需要执行此步骤（实例大小不为 `.metal` 或未针对嵌套虚拟化进行配置）。

   ```
   wsl --set-default-version 1
   ```

1. 安装默认发行版。

   ```
   wsl --install
   ```

**要安装 WSL 2（.metal 或启用了嵌套虚拟化的实例）**  
在您的 EC2 实例上运行以下标准安装命令。默认情况下会安装 WSL 2。

```
wsl --install
```