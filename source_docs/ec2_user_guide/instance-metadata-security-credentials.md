

# 从实例元数据中检索安全凭证
<a name="instance-metadata-security-credentials"></a>

实例上的应用程序通过实例元数据条目 `iam/security-credentials/`*role-name* 检索角色提供的安全证书。该应用程序具有使用您通过与角色关联的安全凭证为其定义的操作和资源的权限。这些安全凭证是临时的，我们会自动更换它们。我们会在旧凭证过期前至少五分钟提供可用的新凭证。

有关实例元数据的更多信息，请参阅 [使用实例元数据管理 EC2 实例](ec2-instance-metadata.md)。

**警告**  
如果您使用的服务采用了带有 IAM 角色的实例元数据，请确保服务代表您进行 HTTP 调用时不会泄露您的凭证。可能泄露您的凭证的服务类型包括 HTTP 代理、HTML/CSS 验证程序服务和支持 XML 包含的 XML 处理程序。

对于您的 Amazon EC2 工作负载，我们建议您使用下述方法检索会话凭证。借助这些凭证，您的工作负载能够发出 AWS API 请求，而无需使用 `sts:AssumeRole` 来代入已与实例关联的相同角色。除非您需要为基于属性的访问权限控制 (ABAC) 传递会话标签或传递会话策略以进一步限制角色的权限，否则您无需调用角色代入，因为此操作会创建一组新的相同临时角色会话凭证。

如果您的工作负载使用某个角色代入自己，则必须创建明确允许该角色代入自己的信任策略。如果您没有创建信任策略，您会收到 `AccessDenied` 错误。有关更多信息，请参阅《IAM 用户指南》**中[更新角色信任策略](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_update-role-trust-policy.html)。

------
#### [ IMDSv2 ]

**Linux**  
从 Linux 实例运行以下命令，检索某个 IAM 角色的安全凭证。

```
TOKEN=`curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"` \
    && curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/iam/security-credentials/{{role-name}}
```

**Windows**  
从 Windows 实例运行以下 cmdlet，检索某个 IAM 角色的安全凭证。

```
[string]$token = Invoke-RestMethod `
    -Headers @{"X-aws-ec2-metadata-token-ttl-seconds" = "21600"} `
    -Method PUT -Uri http://169.254.169.254/latest/api/token
```

```
Invoke-RestMethod `
    -Headers @{"X-aws-ec2-metadata-token" = $token} `
    -Method GET -Uri http://169.254.169.254/latest/meta-data/iam/security-credentials/{{role-name}}
```

------
#### [ IMDSv1 ]

**Linux**  
从 Linux 实例运行以下命令，检索某个 IAM 角色的安全凭证。

```
curl http://169.254.169.254/latest/meta-data/iam/security-credentials/{{role-name}}
```

**Windows**  
从 Windows 实例运行以下 cmdlet，检索某个 IAM 角色的安全凭证。

```
Invoke-RestMethod -uri http://169.254.169.254/latest/meta-data/iam/security-credentials/{{role-name}}
```

------

下面是示例输出。如果您无法检索安全凭证，请参阅《IAM 用户指南》**中的[我无法访问我的 EC2 实例的临时安全凭证](https://docs.aws.amazon.com/IAM/latest/UserGuide/troubleshoot_iam-ec2.html#troubleshoot_iam-ec2_no-keys)。

```
{
  "Code" : "Success",
  "LastUpdated" : "2012-04-26T16:39:16Z",
  "Type" : "AWS-HMAC",
  "AccessKeyId" : "ASIAIOSFODNN7EXAMPLE",
  "SecretAccessKey" : "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
  "Token" : "token",
  "Expiration" : "2017-05-17T15:09:54Z"
}
```

对于实例上运行的应用程序、AWS CLI 和 Tools for Windows PowerShell 命令，您无需显式获取临时安全凭证 – AWS开发工具包、AWS CLI 和 Windows PowerShell 工具会自动从 EC2 实例元数据服务中获取凭证并使用这些凭证。要使用临时安全凭证在实例外部发出调用 (例如，为了测试 IAM 策略)，您必须提供访问密钥、私有密钥和会话令牌。有关更多信息，请参阅 *IAM 用户指南*中的[使用临时安全凭证以请求对 AWS 资源的访问权限](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp_use-resources.html)。