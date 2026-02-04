# 东南亚TikTok选品工具

> 专注于越南、泰国、马来西亚、新加坡市场的时尚配件选品工具

## 🎯 项目概述

这是一个帮助卖家在东南亚TikTok Shop市场选品的数据分析工具，专注于时尚配件类目，提供商品数据、市场洞察、官方推荐等功能。

### 核心特性

- 📊 **商品数据中心** - 实时商品数据，多维度筛选
- 📈 **市场洞察** - 结合Google Trends的市场分析
- 🎯 **TikTok官方数据** - 热门商机、榜单、关键词
- 🤖 **智能采集** - EchoTik API + FastMoss爬虫
- 🌏 **多国家支持** - 一个账号管理多个国家站点

### 技术栈

- **前端**: React 19 + Vite + TypeScript + Tailwind CSS
- **UI组件**: shadcn/ui
- **后端**: Supabase (数据库 + Edge Functions)
- **数据源**: EchoTik API、FastMoss爬虫、Google Trends、TikTok Shop官方

## 🚀 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 启动开发服务器

```bash
pnpm dev
```

### 3. 访问应用

打开浏览器访问 http://localhost:5173

## 📁 项目结构

```
├── src/
│   ├── components/       # UI组件
│   ├── pages/           # 页面组件
│   ├── lib/             # 工具库和类型定义
│   └── integrations/    # Supabase集成
├── supabase/
│   ├── functions/       # Edge Functions (4个)
│   └── migrations/      # 数据库迁移
└── public/              # 静态资源
```

## 🎨 核心功能

### 1. 商品数据中心 (`/products`)
- 商品列表展示（含图片、价格、销量、增长率）
- 筛选功能（国家、类目、价格区间）
- 排序功能（最新、销量、增长、价格）
- 数据来源标识（EchoTik/FastMoss）
- 图片加载失败自动降级处理

### 2. 市场洞察 (`/market-insights`)
- 按国家查看市场数据
- Google Trends趋势图表
- 类目热度饼图
- 相关搜索词和上升搜索
- 区域热度分布

### 3. TikTok官方数据 (`/tiktok-official`)
- **热门商机**: 官方推荐的高潜力商品机会
- **商品榜单**: 热销榜、趋势榜、新品榜 Top 10
- **热门关键词**: 搜索量、增长率、竞争度分析
- **多账号管理**: 一个账号可管理多个国家站点

### 4. 数据采集配置 (`/data-collection`)
- EchoTik API密钥配置
- FastMoss账号密码配置（支持爬虫）
- 采集任务创建和管理
- 实时进度追踪

## 📦 类目配置

### 6大时尚配件类目

| 类目 | 子类目示例 | 市场规模 | 增长率 |
|------|-----------|---------|--------|
| 发饰头饰 | 发夹、发圈、鲨鱼夹、头箍 | $850M | +68% |
| 平价饰品 | 项链、耳环、手链、戒指 | $1.5B | +62% |
| 时尚手表 | 电子表、石英表、智能表 | $2.2B | +48% |
| 时尚眼镜 | 太阳镜、墨镜、偏光镜 | $1.2B | +58% |
| 假发发片 | 长发、短发、发片、造型假发 | $980M | +75% |
| 服装配件 | 围巾、手套、帽子、腰带、口罩 | $1.35B | +52% |

## 🌏 目标市场

- 🇻🇳 **越南** (Vietnam)
- 🇹🇭 **泰国** (Thailand)
- 🇲🇾 **马来西亚** (Malaysia)
- 🇸🇬 **新加坡** (Singapore)

## 🔧 开发命令

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览生产版本
pnpm preview

# 代码检查
pnpm lint

# 类型检查
pnpm type-check
```

## 📊 数据库结构

### 核心表
- `tiktok_products` - 商品数据
- `tiktok_market_data` - 市场数据
- `tiktok_accounts` - TikTok账号（支持多国家）
- `tiktok_opportunities` - 热门商机
- `tiktok_rankings` - 商品榜单
- `tiktok_keywords` - 热门关键词

### 配置表
- `tiktok_api_configs` - API配置
- `tiktok_collection_tasks` - 采集任务
- `scraper_sessions` - 爬虫会话

## 🤖 Edge Functions

### 1. collect-tiktok-data
- 功能：EchoTik API数据采集
- 输入：taskId, provider
- 输出：采集的商品数据

### 2. fastmoss-scraper
- 功能：FastMoss网页爬虫
- 输入：taskId
- 输出：爬取的商品数据

### 3. google-trends
- 功能：Google Trends数据获取
- 输入：country, keywords
- 输出：趋势数据、相关搜索

### 4. tiktok-shop-official
- 功能：TikTok Shop官方数据
- 输入：dataType, country
- 输出：热门商机/榜单/关键词

## 🔒 安全配置

- ✅ 所有表启用RLS（Row Level Security）
- ✅ API密钥存储在Supabase Secrets
- ✅ 密码加密存储
- ✅ 会话管理和自动过期

## 📈 性能优化

- ⚡ Vite快速构建
- 🎨 组件懒加载
- 🖼️ 图片懒加载和错误处理
- 🔄 Supabase实时订阅
- 📄 数据分页加载

## 🐛 故障排查

### 图片无法显示
- 已实现 onError fallback 机制
- 自动显示占位图

### 数据采集失败
- 检查API配置是否正确
- 查看Edge Function日志

### TikTok官方数据无法加载
- 确认已配置对应国家的账号
- 检查账号是否处于活跃状态

## 📝 更新日志

### 2026-01-18 - v1.0.0
- ✅ 项目初始化
- ✅ 6大时尚配件类目配置
- ✅ 4个东南亚国家支持
- ✅ 商品数据中心
- ✅ 市场洞察（含Google Trends）
- ✅ TikTok官方数据集成
- ✅ 多账号多国家管理
- ✅ EchoTik + FastMoss数据采集

## 📄 许可证

本项目为内部测试使用。

## 🤝 贡献

欢迎提交问题和改进建议。

## 📞 支持

如需技术支持，请查看 `DEPLOYMENT.md` 文档。
