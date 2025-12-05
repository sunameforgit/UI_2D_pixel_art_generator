# 自动Git提交脚本使用指南

## 脚本功能

`auto-commit.ps1`是一个PowerShell脚本，用于实现每30分钟自动检查并提交Git仓库中的更改。

主要功能：
- 每30分钟自动检查项目目录中的Git更改
- 如果有未提交的更改，自动执行`git add .`和`git commit`
- 使用"日期+变更内容"格式的提交信息：`yyyy-MM-dd HH:mm 自动提交 - 30分钟定时更新`
- 持续运行，直到手动停止

## 启动脚本

### 方法1：直接运行（适用于临时使用）

1. 打开PowerShell窗口
2. 导航到项目目录：
   ```powershell
   cd "f:\AI-Game\Trae Project\UI\pixel-art-generator"
   ```
3. 运行脚本：
   ```powershell
   .\auto-commit.ps1
   ```

### 方法2：后台运行（适用于长期使用）

1. 打开PowerShell窗口
2. 运行以下命令：
   ```powershell
   Start-Job -FilePath "f:\AI-Game\Trae Project\UI\pixel-art-generator\auto-commit.ps1" -Name "AutoGitCommit"
   ```

## 停止脚本

### 方法1：直接运行的脚本

- 在运行脚本的PowerShell窗口中按 `Ctrl + C`

### 方法2：后台运行的脚本

1. 列出所有后台作业：
   ```powershell
   Get-Job
   ```
2. 停止名为"AutoGitCommit"的作业：
   ```powershell
   Stop-Job -Name "AutoGitCommit"
   ```
3. （可选）删除作业：
   ```powershell
   Remove-Job -Name "AutoGitCommit"
   ```

## 配置系统自启动（可选）

如果需要在Windows系统启动时自动运行此脚本，可以创建计划任务：

1. 按 `Win + R` 打开运行窗口，输入 `taskschd.msc` 并按回车
2. 在任务计划程序中，点击"创建基本任务"
3. 输入任务名称（如"AutoGitCommit"）和描述
4. 选择"计算机启动时"作为触发器
5. 选择"启动程序"作为操作
6. 在"程序/脚本"中输入 `powershell.exe`
7. 在"添加参数"中输入：
   ```
   -ExecutionPolicy Bypass -File "f:\AI-Game\Trae Project\UI\pixel-art-generator\auto-commit.ps1"
   ```
8. 完成任务创建，确保选中"当我点击完成时打开此任务属性的对话框"
9. 在属性对话框中，切换到"条件"选项卡，取消勾选"只有在计算机使用交流电源时才启动此任务"
10. 点击"确定"保存设置

## 注意事项

1. **脚本权限**：确保PowerShell允许运行脚本。如果遇到权限问题，以管理员身份运行PowerShell并执行：
   ```powershell
   Set-ExecutionPolicy RemoteSigned
   ```

2. **Git配置**：确保Git已正确配置用户名和邮箱：
   ```powershell
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

3. **网络连接**：如果需要推送到远程仓库，确保网络连接正常，且已配置好SSH密钥或凭据。

4. **脚本修改**：如需调整提交间隔，修改脚本中的`Start-Sleep -Seconds 1800`（1800秒=30分钟）。

5. **日志查看**：直接运行脚本时，可在PowerShell窗口查看运行日志；后台运行时，使用以下命令查看日志：
   ```powershell
   Receive-Job -Name "AutoGitCommit"
   ```

6. **数据安全**：自动提交可能包含未完成的工作，请确保项目中没有敏感信息。

## 手动触发提交

如果需要在30分钟间隔内手动触发一次自动提交，只需再次运行脚本即可，脚本会立即检查并提交更改，然后继续按照30分钟间隔运行。
