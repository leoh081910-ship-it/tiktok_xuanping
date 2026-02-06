# 🚀 Vercel 部署指南 - TikTok 选品系统

## 📋 部署前检查清单

### ✅ 已完成的项目准备

- [x] 代码已推送到 GitHub
  - 仓库：https://github.com/leoh081910-ship-it/tiktok_xuanping
  - 分支：main
- [x] 项目已配置 Vite
- [x] 环境变量已确认
- [x] AI 助手已验证正常

### 🔍 部署前最后检查

在开始部署前，请确认：

```bash
# 1. 确认项目目录
cd E:\04-Claude\Projects\tiktok_xuanping

# 2. 检查 git 状态
git status
# 应该显示：nothing to commit, working tree clean

# 3. 确认远程仓库
git remote -v
# 应该显示：origin https://github.com/leoh081910-ship-it/tiktok_xuanping.git

# 4. 确认最新代码已推送
git log --oneline -3
# 应该显示最近的提交记录
```

---

## 📝 步骤 1：导入项目到 Vercel（5 分钟）

### 1.1 访问 Vercel

1. 打开浏览器，访问：https://vercel.com
2. 点击右上角 **"Sign Up"** 或 **"Login"**
3. 使用 **GitHub 账号**登录（推荐）
4. 授权 Vercel 访问你的 GitHub

### 1.2 导入项目

1. 登录后，点击 **"Add New..."** → **"Project"**
2. 在 **"Import Git Repository"** 部分：
   - 找到 `tiktok_xuanping` 仓库
   - 点击右侧的 **"Import"** 按钮

### 1.3 Vercel 自动检测配置

Vercel 会自动检测到你的项目配置：

```
✅ Framework Preset: Vite
✅ Root Directory: ./
✅ Build Command: npm run build
✅ Output Directory: dist
✅ Install Command: npm install
```

**如果没有自动检测到，手动配置**：
- Framework Preset: **Vite**
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

---

## 📝 步骤 2：配置环境变量（3 分钟）

### 2.1 添加环境变量

在 Vercel 项目配置页面，找到 **"Environment Variables"** 部分，点击 **"Add New"** 添加以下变量：

#### 必需的环境变量（2 个）

| 名称 | 值 | 说明 |
|------|-----|------|
| `VITE_SUPABASE_URL` | `https://cqsqedvhhnyhwxakujyf.supabase.co` | Supabase 项目 URL |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Supabase 匿名密钥（见下方） |

#### VITE_SUPABASE_ANON_KEY 完整值

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxc3FlZHZoaG55aHd4YWt1anlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMjM5NjEsImV4cCI6MjA4NTY5OTk2MX0.4xJbf6fTBqsd4xagMcUuibW7XAeT-vf5UZWXAXvyhds
```

### 2.2 配置环境变量

1. 在 **Environment Variables** 部分：
   - Name: `VITE_SUPABASE_URL`
   - Value: `https://cqsqedvhhnyhwxakujyf.supabase.co`
   - 点击 **Add**

2. 再次点击 **"Add New"**：
   - Name: `VITE_SUPABASE_ANON_KEY`
   - Value: （粘贴上面的完整密钥）
   - 点击 **Add**

⚠️ **重要提示**：
- 确保变量名以 `VITE_` 开头（Vite 要求）
- 不要勾选 "Sensitive"（可选，但建议勾选）
- 选择适用环境：**Production**, **Preview**, **Development**（全部勾选）

---

## 📝 步骤 3：开始部署（2 分钟）

### 3.1 点击部署按钮

1. 确认配置无误后，滚动到页面底部
2. 点击 **"Deploy"** 按钮
3. 等待部署完成（通常需要 2-3 分钟）

### 3.2 部署过程

Vercel 会显示部署进度：

```
✅ Cloning repository
✅ Installing dependencies
✅ Building application
✅ Uploading artifacts
✅ Deployment complete
```

### 3.3 部署完成

部署成功后，Vercel 会显示：

```
🎉 Congratulations!
Your deployment is ready.

🔗 Deployment URL: https://tiktok-xuanping-xxx.vercel.app
```

---

## 📝 步骤 4：配置 Supabase CORS（2 分钟）

### 4.1 获取 Vercel 域名

从部署结果页面复制你的 Vercel 域名，例如：
```
https://tiktok-xuanping-xxx.vercel.app
```

### 4.2 配置 Supabase Site URL

1. 访问 Supabase Dashboard：
   https://supabase.com/dashboard/project/cqsqedvhhnyhwxakujyf

2. 左侧菜单：**Authentication** → **URL Configuration**

3. 在 **"Site URL"** 部分：
   - 输入你的 Vercel 域名：`https://tiktok-xuanping-xxx.vercel.app`
   - 点击 **Save**

### 4.3 配置允许的重定向 URL（可选）

在同一页面，**"Redirect URLs"** 部分，添加：
```
https://tiktok-xuanping-xxx.vercel.app/**
```

---

## 📝 步骤 5：验证部署（5 分钟）

### 5.1 访问部署的网站

点击 Vercel 提供的部署 URL，或直接访问：
```
https://tiktok-xuanping-xxx.vercel.app
```

### 5.2 功能验证清单

请逐项检查以下功能：

#### 基础功能
- [ ] 首页正常显示
- [ ] 页面样式正常（无错乱）
- [ ] 导航菜单可以正常切换
- [ ] 响应式布局正常（手机/平板）

#### 核心功能
- [ ] **数据采集**：可以添加商品 URL
- [ ] **Products 页面**：商品列表正常显示
- [ ] **数据来源标识**：正确显示 EchoTik/FastMoss/Google Shopping
- [ ] **筛选功能**：可以按国家、类目、价格筛选
- [ ] **AI 助手**：可以正常对话
  - 点击右下角聊天图标
  - 发送测试消息："你好"
  - 检查是否正常回复

#### 数据连接
- [ ] Supabase 数据库连接正常
- [ ] Edge Function 调用正常（AI 助手）
- [ ] 无控制台错误（按 F12 查看）

### 5.3 浏览器控制台检查

按 **F12** 打开浏览器控制台：

1. **Console 标签**：
   - 应该没有红色错误
   - 可以忽略黄色警告（如果有）

2. **Network 标签**：
   - 检查 API 请求是否成功（状态码 200）
   - 特别是 Supabase 请求

---

## 🔧 常见问题排查

### 问题 1：部署失败 - Build Error

**错误信息**：
```
Error: Build failed with exit code 1
```

**解决方案**：
1. 检查 Build Command 是否为 `npm run build`
2. 检查 Output Directory 是否为 `dist`
3. 查看完整错误日志，找出具体错误

---

### 问题 2：页面空白 - 404 Error

**错误信息**：访问页面显示 404

**解决方案**：
1. 检查 vite.config.ts 中的 base 配置
2. 确认 dist 目录包含 index.html
3. 检查路由配置

---

### 问题 3：API 请求失败 - CORS Error

**错误信息**（控制台）：
```
Access to fetch at '...' has been blocked by CORS policy
```

**解决方案**：
1. 确认 Supabase Site URL 已配置
2. 检查 Supabase Redirect URLs
3. 确认 Edge Function 的 CORS 配置

---

### 问题 4：AI 助手无法连接

**错误信息**：
```
DeepSeek API 未配置
```

**解决方案**：
1. 这是正常的 - Edge Function 的环境变量在 Supabase 端配置
2. 前端不需要 DEEPSEEK_API_KEY
3. 确认 Supabase Edge Function 已部署

---

### 问题 5：环境变量未生效

**症状**：页面显示 "Supabase URL not configured"

**解决方案**：
1. 确认变量名以 `VITE_` 开头
2. 重新部署项目（环境变量更改后需要重新部署）
3. 清除浏览器缓存

---

## 🔄 更新部署

### 如何更新代码

```bash
# 1. 修改代码
# 2. 提交到 GitHub
git add .
git commit -m "描述你的修改"
git push origin main

# 3. Vercel 会自动检测并重新部署
# 通常需要 1-2 分钟
```

### 手动触发部署

如果 Vercel 没有自动部署：

1. 访问 Vercel Dashboard
2. 选择你的项目
3. 点击 **"Deployments"** 标签
4. 点击右上角 **"Redeploy"** 按钮

---

## 🌐 自定义域名（可选）

### 在 Vercel 绑定域名

1. **购买域名**（如果还没有）
   - 阿里云：https://wanwang.aliyun.com
   - 腾讯云：https://dnspod.cloud.tencent.com
   - Namecheap：https://www.namecheap.com

2. **在 Vercel 添加域名**
   - Dashboard → Settings → Domains
   - 输入你的域名（如：tiktok.example.com）
   - 点击 **Add**

3. **配置 DNS**
   - Vercel 会提供 DNS 配置
   - 在域名提供商处添加 DNS 记录
   - 等待 DNS 生效（通常 10-30 分钟）

---

## 📊 部署后监控

### Vercel Analytics

Vercel 提供免费的 Analytics：

1. Dashboard → Analytics
2. 查看访问量、页面浏览量
3. 查看性能指标（Web Vitals）

### 查看部署日志

1. Dashboard → Deployments
2. 点击具体的部署记录
3. 查看 Build Logs 和 Deployment Logs

---

## 💰 成本说明

### Vercel 免费计划

✅ **Hobby 计划（免费）**：
- 无限次部署
- 100GB 带宽/月
- 自动 HTTPS
- 自动 CDN
- 100 个 Edge Functions 调用/天

### Supabase 免费计划

✅ **免费计划**：
- 500MB 数据库
- 1GB 文件存储
- 50MB 数据库备份
- 500K API 请求/月
- 2 Edge Functions 调用/天（可能需要升级）

### 总成本

- **Vercel**: $0/月 ✅
- **Supabase**: $0/月 ✅
- **域名**: $10-15/年（可选）
- **总计**: **$0/月** ✅

---

## ✅ 部署完成检查清单

部署完成后，请逐项确认：

### 项目配置
- [ ] 代码已成功推送到 GitHub
- [ ] Vercel 项目已创建
- [ ] 环境变量已配置（VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY）
- [ ] 首次部署成功

### Supabase 配置
- [ ] Site URL 已更新为 Vercel 域名
- [ ] Redirect URLs 已配置（可选）

### 功能验证
- [ ] 首页正常显示
- [ ] Products 页面正常
- [ ] 数据采集功能可用
- [ ] AI 助手正常工作
- [ ] 无控制台错误

### 生产环境
- [ ] HTTPS 自动配置
- [ ] CDN 全球加速
- [ ] 自动部署已启用
- [ ] 域名配置（可选）

---

## 📞 需要帮助？

如果部署过程中遇到问题：

1. **查看 Vercel 部署日志**：
   Dashboard → Deployments → 选择失败的部署 → View Logs

2. **查看浏览器控制台**：
   F12 → Console（检查 JavaScript 错误）

3. **运行诊断脚本**：
   ```bash
   node scripts/diagnose-ai.js
   ```

4. **联系支持**：
   - Vercel: https://vercel.com/support
   - Supabase: https://supabase.com/support

---

## 🎯 部署后下一步

部署成功后，你可以：

1. **分享链接**：将 Vercel URL 分享给他人
2. **绑定域名**：使用自定义域名
3. **监控性能**：查看 Vercel Analytics
4. **持续优化**：根据用户反馈改进功能

---

**祝部署顺利！** 🚀

如有任何问题，请参考上方的常见问题排查部分。

---

**文档版本**：v1.0
**最后更新**：2025-02-06
**状态**：✅ 可用
