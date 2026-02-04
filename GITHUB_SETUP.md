# GitHub 设置和上传指南

本指南将帮助您将项目上传到GitHub。

## 📋 前提条件

1. GitHub账号
2. Git已安装（检查：`git --version`）
3. GitHub认证已配置（SSH密钥或Personal Access Token）

## 🚀 方法1：使用自动脚本（推荐）

我已经为您创建了自动化脚本，只需运行：

```bash
# 给脚本添加执行权限
chmod +x github-setup.sh

# 运行脚本（会提示您输入仓库名称）
./github-setup.sh
```

脚本会自动：
- ✅ 初始化Git仓库
- ✅ 添加所有文件
- ✅ 创建初始提交
- ✅ 连接到GitHub远程仓库
- ✅ 推送代码

## 🔧 方法2：手动设置（完整步骤）

### 步骤1：在GitHub上创建新仓库

1. 访问 https://github.com/new
2. 填写仓库信息：
   - **仓库名称**: `tiktok-product-selector` 或您喜欢的名称
   - **描述**: `东南亚TikTok选品工具 - 时尚配件数据分析平台`
   - **可见性**: 选择 Private（私有）或 Public（公开）
   - ⚠️ **不要**勾选 "Add a README file"（我们已经有了）
   - ⚠️ **不要**添加 .gitignore（我们已经有了）
3. 点击 "Create repository"
4. 复制仓库的URL（如：`https://github.com/yourusername/tiktok-product-selector.git`）

### 步骤2：在本地初始化Git（如果还没有）

```bash
# 检查是否已经是Git仓库
git status

# 如果提示"not a git repository"，则初始化
git init
```

### 步骤3：添加文件并创建初始提交

```bash
# 查看当前状态
git status

# 添加所有文件
git add .

# 创建初始提交
git commit -m "feat: initial commit - Southeast Asia TikTok product selector tool

- Complete frontend with React 19 + Vite + TypeScript
- 6 fashion accessory categories
- 4 Southeast Asian countries support
- Supabase integration with Edge Functions
- EchoTik API + FastMoss scraper integration
- Google Trends integration
- TikTok Shop official data support
- Multi-country account management"
```

### 步骤4：连接到GitHub远程仓库

将 `YOUR_GITHUB_USERNAME` 和 `YOUR_REPO_NAME` 替换为实际值：

```bash
# 添加远程仓库
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git

# 验证远程仓库
git remote -v
```

### 步骤5：推送代码到GitHub

```bash
# 推送到main分支（首次推送）
git push -u origin main

# 如果提示使用master分支，则使用：
# git branch -M main
# git push -u origin main
```

### 步骤6：验证上传

访问您的GitHub仓库页面，确认：
- ✅ 所有文件已上传
- ✅ README.md正确显示
- ✅ 提交历史完整

## 🔐 GitHub认证设置

### 选项A：使用HTTPS + Personal Access Token

1. 生成Token：
   - 访问 https://github.com/settings/tokens
   - 点击 "Generate new token (classic)"
   - 选择权限：`repo`（完整仓库访问）
   - 点击 "Generate token"
   - **复制并保存Token**（只显示一次！）

2. 使用Token：
   ```bash
   # 推送时会提示输入用户名和密码
   # 用户名：您的GitHub用户名
   # 密码：粘贴您的Personal Access Token
   git push -u origin main
   ```

3. 保存凭据（可选）：
   ```bash
   # 保存凭据，避免每次输入
   git config --global credential.helper store
   ```

### 选项B：使用SSH密钥（推荐）

1. 生成SSH密钥：
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```

2. 添加到GitHub：
   - 复制公钥：`cat ~/.ssh/id_ed25519.pub`
   - 访问 https://github.com/settings/keys
   - 点击 "New SSH key"
   - 粘贴公钥并保存

3. 使用SSH URL：
   ```bash
   # 如果已经添加了HTTPS远程仓库，切换到SSH
   git remote set-url origin git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git
   
   # 推送
   git push -u origin main
   ```

## 📝 后续提交

完成初始上传后，日常更新流程：

```bash
# 1. 查看修改
git status

# 2. 添加修改的文件
git add .

# 3. 提交更改
git commit -m "feat: add new feature"

# 4. 推送到GitHub
git push
```

## 🌿 分支管理（可选）

创建开发分支：

```bash
# 创建并切换到dev分支
git checkout -b dev

# 推送dev分支
git push -u origin dev

# 回到main分支
git checkout main

# 合并dev到main
git merge dev
```

## 🏷️ 版本标签（可选）

创建版本标签：

```bash
# 创建标签
git tag -a v1.0.0 -m "Release version 1.0.0"

# 推送标签
git push origin v1.0.0

# 推送所有标签
git push --tags
```

## 📊 项目徽章（可选）

在README.md顶部添加徽章：

```markdown
![GitHub last commit](https://img.shields.io/github/last-commit/YOUR_USERNAME/YOUR_REPO_NAME)
![GitHub issues](https://img.shields.io/github/issues/YOUR_USERNAME/YOUR_REPO_NAME)
![GitHub stars](https://img.shields.io/github/stars/YOUR_USERNAME/YOUR_REPO_NAME)
![GitHub license](https://img.shields.io/github/license/YOUR_USERNAME/YOUR_REPO_NAME)
```

## ❗ 常见问题

### 问题1：推送被拒绝
```
! [rejected] main -> main (fetch first)
```

**解决方案**：
```bash
# 先拉取远程更改
git pull origin main --allow-unrelated-histories

# 再推送
git push -u origin main
```

### 问题2：认证失败
```
remote: Support for password authentication was removed
```

**解决方案**：使用Personal Access Token或SSH密钥（见上文）

### 问题3：文件过大
```
remote: error: File X is Y MB; this exceeds GitHub's file size limit
```

**解决方案**：
```bash
# 将大文件添加到.gitignore
echo "large-file.zip" >> .gitignore

# 移除已追踪的大文件
git rm --cached large-file.zip

# 提交更改
git commit -m "chore: remove large file"
```

### 问题4：需要重新开始
```bash
# 删除Git历史
rm -rf .git

# 重新初始化
git init

# 重新添加和提交
git add .
git commit -m "feat: initial commit"
```

## 📦 .gitignore 说明

项目已配置 `.gitignore`，以下内容不会上传：
- ❌ `node_modules/` - 依赖包
- ❌ `dist/` - 构建产物
- ❌ `releases/` - 打包文件
- ❌ `*.log` - 日志文件
- ❌ `.env` - 环境变量
- ❌ `*.zip` - 压缩包

## ✅ 上传检查清单

上传前确认：
- [ ] 已移除敏感信息（API密钥、密码等）
- [ ] README.md内容完整
- [ ] .gitignore配置正确
- [ ] 代码无明显错误
- [ ] 提交信息清晰规范

## 🎯 下一步

1. 完成GitHub上传
2. 设置GitHub Pages（如果需要演示）
3. 配置GitHub Actions（自动部署）
4. 邀请团队成员协作

## 📞 需要帮助？

如遇到问题：
1. 查看GitHub官方文档：https://docs.github.com
2. 检查Git配置：`git config --list`
3. 查看详细错误信息：`git push -v`

祝您上传顺利！🚀
