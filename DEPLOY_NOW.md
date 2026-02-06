# 🚀 Vercel 部署快速参考

## ⚡ 快速开始（3 步完成）

### 1️⃣ 导入项目
访问：https://vercel.com/new
选择：`tiktok_xuanping` 仓库
点击：**Import**

### 2️⃣ 配置环境变量（2 个）

```
VITE_SUPABASE_URL
https://cqsqedvhhnyhwxakujyf.supabase.co

VITE_SUPABASE_ANON_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxc3FlZHZoaG55aHd4YWt1anlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMjM5NjEsImV4cCI6MjA4NTY5OTk2MX0.4xJbf6fTBqsd4xagMcUuibW7XAeT-vf5UZWXAXvyhds
```

### 3️⃣ 点击 Deploy
等待 2-3 分钟 → 完成！✅

---

## 📋 部署后配置（1 步）

### 配置 Supabase Site URL

访问：https://supabase.com/dashboard/project/cqsqedvhhnyhwxakujyf/auth/url-configuration

输入你的 Vercel 域名：
```
https://your-project.vercel.app
```

点击：**Save**

---

## ✅ 验证清单

访问你的 Vercel 域名，检查：

- [ ] 首页正常显示
- [ ] Products 页面商品列表正常
- [ ] AI 助手可以对话（右下角聊天图标）
- [ ] 数据采集功能可用
- [ ] 无控制台错误（F12）

---

## 🔗 重要链接

- **Vercel Dashboard**: https://vercel.com/dashboard
- **GitHub 仓库**: https://github.com/leoh081910-ship-it/tiktok_xuanping
- **Supabase Dashboard**: https://supabase.com/dashboard/project/cqsqedvhhnyhwxakujyf
- **详细指南**: `docs/VERCEL_DEPLOY_GUIDE.md`

---

## 🆘 遇到问题？

### 常见错误速查

| 错误 | 解决方案 |
|------|----------|
| Build failed | 检查 build command: `npm run build` |
| 页面空白 (404) | 检查 output directory: `dist` |
| API 请求失败 | 检查环境变量是否以 `VITE_` 开头 |
| AI 助手无法连接 | 正常现象，Edge Function 在 Supabase 端 |
| 环境变量未生效 | 重新部署（变量更改后需要重新部署） |

---

## 🎯 一句话总结

1. Vercel 导入 GitHub 仓库
2. 添加 2 个环境变量
3. 点击 Deploy
4. 配置 Supabase Site URL
5. 完成！✅

---

**现在就开始部署吧！** 🚀
