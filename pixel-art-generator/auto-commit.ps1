# 自动Git提交脚本 - 每30分钟执行一次
# 设置项目路径
$projectPath = "f:\AI-Game\Trae Project\UI\pixel-art-generator"

# 进入项目目录
Set-Location $projectPath

# 无限循环执行自动提交
while ($true) {
    Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] 开始自动提交检查..."
    
    try {
        # 1. 拉取远程最新代码（用户要求：先拉取再提交）
        Write-Host "正在拉取远程最新代码..."
        git pull origin main --rebase
        
        # 检查是否有未提交的更改
        $changes = git status --porcelain
        
        if ($changes) {
            Write-Host "检测到未提交的更改，准备提交..."
            
            # 添加所有更改
            git add .
            
            # 创建日期格式的提交信息
            $commitMessage = "$(Get-Date -Format 'yyyy-MM-dd HH:mm') 自动提交 - 30分钟定时更新"
            
            # 执行提交
            git commit -m $commitMessage
            
            # 2. 推送到远程仓库（用户要求：提交后推送）
            Write-Host "正在推送到远程仓库..."
            git push origin main --tags
            
            Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] 提交和推送成功！"
        } else {
            Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] 没有检测到未提交的更改"
        }
    } catch {
        Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] 提交过程中出现错误: $_"
    }
    
    # 等待30分钟
    Write-Host "等待30分钟后进行下一次检查..."
    Start-Sleep -Seconds 1800
}
