

# 为 Amazon EC2 Linux 实例开发 EC2Rescue 模块
<a name="ec2rl_moduledev"></a>

模块使用 YAML 编写，这是一种数据序列化标准。模块的 YAML 文件包括一个文档，用于表示模块及其属性。

## 添加模块属性
<a name="ec2rl-adding-modules"></a>

下表列出了可用的模块属性。


| 属性 | 说明 | 
| --- | --- | 
| name | 模块的名称。该名称长度应少于或等于 18 个字符。 | 
| version | 模块的版本号。 | 
| title | 模块的简短说明性标题。此值的长度应少于或等于 50 个字符。 | 
| helptext | 模块的详细说明。每一行的长度应少于或等于 75 个字符。如果模块使用必需或可选参数，请在 helptext 值中包括这些参数。<br />例如：<pre>helptext: !!str |<br />  Collect output from ps for system analysis<br />  Consumes --times= for number of times to repeat<br />  Consumes --period= for time period between repetition</pre> | 
| placement | 运行模块的阶段。支持的值：+  prediagnostic <br />+  run <br />+  postdiagnostic  | 
| language | 编写模块代码使用的语言。支持的值：+  bash <br />+  python  Python 代码必须同时兼容 Python 2.7.9\+ 和 Python 3.2\+。  | 
| 修复 | 指示模块是否支持修正。支持的值为 `True` 或 `False`。<br />模块默认为 `False`（如果不存在），这使其成为那些不支持修正的模块的可选属性。 | 
| content | 整个脚本代码。 | 
| constraint | 包含限制值的对象的名称。 | 
| 域 | 说明如何分组或分类模块的描述符。所包括的模块组使用以下域：+  application <br />+  net <br />+  os <br />+  performance  | 
| class | 由模块执行的任务类型的描述符。所包括的模块组使用以下类：+  collect (从程序收集输出) <br />+  diagnose (基于一组标准确定通过/失败) <br />+  gather (复制文件并写入特定文件)  | 
| distro | 此模块支持的 Linux 发行版的列表。所包含的模块组使用以下发行版：+  **alami** (Amazon Linux) <br />+  **rhel** <br />+  **ubuntu** <br />+  **suse**  | 
| 必需 | 模块从 CLI 选项使用的必需参数。 | 
| optional | 模块可使用的可选参数。 | 
| 软件 | 模块中使用的软件可执行文件。此属性用于指定默认情况下未安装的软件。EC2Rescue for Linux 逻辑在运行模块之前确保这些程序存在并且可执行。 | 
| 程序包 | 可执行文件的源软件包。此属性用于随软件提供软件包的详细信息，包括用于下载或者获取更多信息的 URL。 | 
| sudo | 指示运行模块是否需要根访问权限。<br />您无需在模块脚本中实施 sudo 检查。如果值为 true，则 EC2Rescue for Linux 逻辑仅在执行用户具有根访问权限时才运行模块。 | 
| perfimpact | 指示模块对其运行环境是否会产生重大性能影响。如果值为 true 并且没有 `--perfimpact=true` 参数，则跳过模块。 | 
| parallelexclusive | 指定需要互斥的程序。例如，所有指定“bpf”的模块以串行方式运行。 | 

## 设置环境变量
<a name="ec2rl_adding_envvars"></a>

下表列出了可用的环境变量。


| 环境变量 | 说明 | 
| --- | --- | 
| `EC2RL_CALLPATH` | ec2rl.py 的路径。此路径可用于定位 lib 目录和使用分发的 Python 模块。 | 
| `EC2RL_WORKDIR` | 诊断工具的主 tmp 目录。<br />默认值：`/var/tmp/ec2rl`。 | 
| `EC2RL_RUNDIR` | 用于存储所有输出的目录。<br />默认值：`/var/tmp/ec2rl/<date&timestamp>`。 | 
| `EC2RL_GATHEREDDIR` | 用于放置收集的模块数据的根目录。<br />默认值：`/var/tmp/ec2rl/<date&timestamp>/mod_out/gathered/`。 | 
| `EC2RL_NET_DRIVER` | 为实例上第一个 (按照字母顺序排序) 非虚拟网络接口使用的驱动程序。<br />示例：+  xen\_netfront <br />+  ixgbevf <br />+  ena  | 
| `EC2RL_SUDO` | 如果 EC2Rescue for Linux 以根身份运行，则为 true；否则为 false。 | 
| `EC2RL_VIRT_TYPE` | 由实例元数据提供的虚拟化类型。<br />示例：+  default-hvm <br />+  default-paravirtual  | 
| `EC2RL_INTERFACES` | 系统上的接口枚举列表。该值为包含名称的字符串，例如 `eth0`、`eth1` 等。这由 `functions.bash` 生成，仅适用于已引用该文件的模块。 | 

## 使用 YAML 语法
<a name="ec2rl_yamlsyntax"></a>

在您构建模块 YAML 文件时，应注意以下事项：
+ 三个连字符 (`---`) 表示文档的明确开始位置。
+ `!ec2rlcore.module.Module` 标签指示 YAML 分析器在从数据流创建对象时调用哪个构造函数。您可在 `module.py` 文件内部查找构造函数。
+ `!!str` 标签告知 YAML 解析器不尝试确定数据的类型，而是将内容解释为字符串文本。
+ 竖线字符 (`|`) 告知 YAML 解析器该值为文字类型的标量。在这种情况下，解析器包括所有空格。对于模块而言这非常重要，因为保留了缩进和换行字符。
+ YAML 标准缩进为两个空格，在下例中可以看到。请确保您为脚本保留了标准缩进 (例如，对于 Python 为四个空格)，然后在模块文件中将全部内容缩进两个空格。

## 模块示例
<a name="ec2rl_example"></a>

示例 1 (`mod.d/ps.yaml`)：

```
--- !ec2rlcore.module.Module
# Module document. Translates directly into an almost-complete Module object
name: !!str ps
path: !!str
version: !!str 1.0
title: !!str Collect output from ps for system analysis
helptext: !!str |
  Collect output from ps for system analysis
  Requires --times= for number of times to repeat
  Requires --period= for time period between repetition
placement: !!str run
package: 
  - !!str
language: !!str bash
content: !!str |
  #!/bin/bash
  error_trap()
  {
      printf "%0.s=" {1..80}
      echo -e "\nERROR:	"$BASH_COMMAND" exited with an error on line ${BASH_LINENO[0]}"
      exit 0
  }
  trap error_trap ERR

  # read-in shared function
  source functions.bash
  echo "I will collect ps output from this $EC2RL_DISTRO box for $times times every $period seconds."
  for i in $(seq 1 $times); do
      ps auxww
      sleep $period
  done
constraint:
  requires_ec2: !!str False
  domain: !!str performance
  class: !!str collect
  distro: !!str alami ubuntu rhel suse
  required: !!str period times
  optional: !!str
  software: !!str
  sudo: !!str False
  perfimpact: !!str False
  parallelexclusive: !!str
```