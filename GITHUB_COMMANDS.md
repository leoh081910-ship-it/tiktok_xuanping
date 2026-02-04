# 🎯 GitHub上传命令速查表

## ⚡ 最快速度（一键上传）

```bash
# 给脚本执行权限并运行（替换YOUR_REPO_URL）
chmod +x UPLOAD_NOW.sh
./UPLOAD_NOW.sh https://github.com/username/tiktok-product-selector.git
```

---

## 📋 分步操作命令

### 第1步：检查状态
```bash
git status
```

### 第2步：提交更改
```bash
git add .
git commit -m "feat: complete TikTok product selector tool"
```

### 第3步：添加远程仓库
```bash
# 替换 YOUR_REPO_URL
git remote add origin YOUR_REPO_URL

# 示例:
# git remote add origin https://github.com/yourusername/tiktok-product-selector.git
```

### 第4步：推送代码
```bash
git push -u origin main
```

### 第5步：验证
```bash
git remote -v
```

---

## 🔧 常用修复命令

### 远程仓库已存在
```bash
git remote remove origin
git remote add origin YOUR_REPO_URL
```

### 更新远程URL
```bash
git remote set-url origin YOUR_REPO_URL
```

### 强制推送（谨慎使用）
```bash
git push -u origin main --force
```

### 推送被拒绝
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### 切换到main分支
```bash
git branch -M main
```

---

## 🔐 认证配置

### 生成Personal Access Token
```bash
# 在浏览器打开
open https://github.com/settings/tokens

# 或访问: https://github.com/settings/tokens
# 点击 "Generate new token (classic)"
# 勾选 "repo" 权限
# 生成并复制Token
```

### 配置Git用户信息
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 保存凭据
```bash
git config --global credential.helper store
```

### 使用SSH（推荐）
```bash
# 生成SSH密钥
ssh-keygen -t ed25519 -C "your.email@example.com"

# 查看公钥
cat ~/.ssh/id_ed25519.pub

# 添加到GitHub: https://github.com/settings/keys
# 使用SSH URL: git@github.com:username/repo.git
```

---

## 📦 项目信息命令

### 查看文件列表
```bash
git ls-files
```

### 统计文件数
```bash
git ls-files | wc -l
```

### 查看提交历史
```bash
git log --oneline
```

### 查看仓库大小
```bash
du -sh .git
```

### 查看分支
```bash
git branch -a
```

---

## 🎯 完整流程（复制整段）

```bash
#!/bin/bash
# 完整上传流程

# 1. 设置变量（修改这里）
REPO_URL="https://github.com/username/tiktok-product-selector.git"

# 2. 提交更改
git add .
git commit -m "feat: complete project"

# 3. 添加远程仓库
git remote add origin $REPO_URL

# 4. 推送
git push -u origin main

echo "✅ 完成！访问: ${REPO_URL%.git}"
```

---

## 📊 项目统计

当前项目包含：
- ✅ **105+** 文件
- ✅ **5** 页面组件
- ✅ **4** Edge Functions
- ✅ **11** 数据库表
- ✅ **6** 类目配置
- ✅ **4** 国家支持

将上传到GitHub的内容：
- ✅ 完整源代码
- ✅ Supabase配置
- ✅ 文档（README、部署指南）
- ✅ 打包脚本

不会上传（已在.gitignore）：
- ❌ node_modules/
- ❌ dist/
- ❌ *.log
- ❌ releases/

---

## 🆘 遇到问题？

### 认证失败
使用Personal Access Token代替密码

### 推送超时
检查网络连接，或使用代理

### 文件过大
检查.gitignore，确保大文件被排除

### 冲突
先pull再push，或使用--force（谨慎）

---

## 📞 快速帮助

```bash
# 查看Git版本
git --version

# 查看配置
git config --list

# 查看远程仓库
git remote -v

# 查看状态
git status

# 查看差异
git diff
```

---

**准备好了？选择一种方式开始上传！** 🚀
