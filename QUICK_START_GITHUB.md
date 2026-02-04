# 🚀 GitHub上传快速指南

只需3步，快速上传项目到GitHub！

## ⚡ 最快方式（推荐）

### 步骤1️⃣：在GitHub创建仓库

访问 https://github.com/new 创建新仓库：
- 仓库名：`tiktok-product-selector`
- 可见性：选择 Private 或 Public
- ⚠️ 不要勾选任何初始化选项

### 步骤2️⃣：运行自动脚本

```bash
chmod +x github-setup.sh
./github-setup.sh
```

### 步骤3️⃣：输入信息

脚本会提示您输入：
1. GitHub仓库URL（从步骤1复制）
2. 确认要提交的文件

完成！🎉

---

## 📋 手动上传（如果脚本失败）

```bash
# 1. 初始化Git（如果需要）
git init

# 2. 添加所有文件
git add .

# 3. 创建提交
git commit -m "feat: initial commit - TikTok product selector"

# 4. 添加远程仓库（替换YOUR_USERNAME和YOUR_REPO）
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# 5. 推送代码
git push -u origin main
```

---

## 🔐 如果遇到认证问题

### 使用Personal Access Token

1. 生成Token: https://github.com/settings/tokens
2. 选择权限：`repo`
3. 复制Token
4. 推送时输入：
   - 用户名：您的GitHub用户名
   - 密码：粘贴Token

### 保存凭据（避免重复输入）

```bash
git config --global credential.helper store
```

---

## ✅ 验证上传成功

访问您的GitHub仓库，应该看到：
- ✅ README.md 正确显示
- ✅ 所有源代码文件
- ✅ 提交历史

---

## 📞 需要详细说明？

查看完整文档：`GITHUB_SETUP.md`

---

## 🎯 项目信息

- **项目名称**: 东南亚TikTok选品工具
- **技术栈**: React 19 + Vite + TypeScript + Supabase
- **目标市场**: 越南、泰国、马来西亚、新加坡
- **类目**: 6大时尚配件类目

祝您上传顺利！🚀
