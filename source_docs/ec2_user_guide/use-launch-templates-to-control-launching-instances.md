

# 使用 Amazon EC2 启动模板控制启动 Amazon EC2 实例
<a name="use-launch-templates-to-control-launching-instances"></a>

通过指定用户仅在使用启动模板时才能启动实例，且只能使用特定的启动模板，您可以控制 Amazon EC2 实例的配置。您还可以控制哪些用户能创建、修改、描述和删除启动模板和启动模板版本。

## 使用启动模板控制启动参数
<a name="launch-templates-authorization"></a>

启动模板可以包含在启动时配置实例的全部或部分参数。不过，在使用启动模板启动实例时，您可以覆盖启动模板中指定的参数。或者，也可以指定在启动模板中不包含的额外参数。

**注意**  
您无法在启动期间删除启动模板参数（例如，无法为参数指定空值）。要删除某个参数，请创建不包含该参数的新启动模板版本，并使用该版本启动实例。

要启动实例，用户必须有权使用 `ec2:RunInstances` 操作。用户还必须有权创建或使用已创建或与该实例关联的资源。您可以使用 `ec2:RunInstances` 操作的资源级权限控制用户可以指定的启动参数。或者，您可以为用户授予使用启动模板启动实例的权限。这样，您就可以在启动模板中管理启动参数，而不是在 IAM policy 中管理，并将启动模板作为授权方法以启动实例。例如，您可以指定用户只能使用启动模板启动实例，并且他们只能使用特定的启动模板。您还可以控制用户可以在启动模板中覆盖的启动参数。有关示例策略，请参阅 [启动模板](ExamplePolicies_EC2.md#iam-example-runinstances-launch-templates)。

## 控制启动模板的使用
<a name="launch-template-permissions"></a>

默认情况下， 用户无权使用启动模板。您可以创建一个策略，以便为用户授予创建、修改、描述和删除启动模板和启动模板版本的权限。您还可以将资源级权限应用于某些启动模板操作，以控制用户能否在这些操作中使用特定的资源。有关更多信息，请参阅以下示例策略：[示例：使用启动模板](ExamplePolicies_EC2.md#iam-example-launch-templates)。

在为用户授予使用 `ec2:CreateLaunchTemplate` 和 `ec2:CreateLaunchTemplateVersion` 操作的权限时，应格外小心。您不能使用资源级权限来控制用户可以在启动模板中指定的资源。要限制用于启动实例的资源，请确保仅为相应的管理员授予创建启动模板和启动模板版本的权限。

## 对 EC2 实例集或竞价型实例集使用启动模板时的重要安全问题
<a name="launch-template-security-ec2fleet-spotfleet"></a>

**注意**  
竞价型实例集仍在使用旧版 API，且暂无相关投资计划。建议改用 EC2 实例集或自动扩缩组。有关更多信息，请参阅 [哪种是实例集最佳使用方法？](which-fleet-method-to-use.md)。

要使用启动模板，您必须授予创建、修改、描述和删除启动模板和启动模板版本的权限。您可以通过控制对 `ec2:CreateLaunchTemplate` 和 `ec2:CreateLaunchTemplateVersion` 操作的访问来控制谁可以创建启动模板和启动模板版本。您还可以通过控制 `ec2:ModifyLaunchTemplate` 操作的访问权限来控制哪些用户能修改启动模板。

**重要**  
如果 EC2 实例集或竞价型实例集配置为使用“最新”或“默认”启动模板版本，则实例集不了解稍后是否将“最新”或“默认”更改为指向不同的启动模板版本。将不同的启动模板版本用于“最新”或“默认”时，Amazon EC2 不会在启动新实例以满足实例集的目标容量时重新检查要完成的操作的权限。在向可以创建和管理启动模板版本（尤其是执行允许用户更改“默认”启动模板版本的 `ec2:ModifyLaunchTemplate` 操作）的人员授予权限时，这是一个重要的考虑因素。

向用户授予将 EC2 操作用于启动模板 API 的权限，即是授予该用户（在创建或更新 EC2 实例集或竞价型实例集的情况下）指向包含实例配置文件（IAM 角色的容器）的不同启动模板版本的 `iam:PassRole` 权限。这意味着即使用户没有 `iam:PassRole` 权限，也可以更新启动模板以将 IAM 角色传递给实例。有关更多信息和示例 IAM policy，请参阅《IAM 用户指南》**中的[使用 IAM 角色向在 Amazon EC2 实例上运行的应用程序授予权限](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-ec2.html)。

有关更多信息，请参阅[控制启动模板的使用](#launch-template-permissions)和[示例：使用启动模板](ExamplePolicies_EC2.md#iam-example-launch-templates)。