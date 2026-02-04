# 东南亚TikTok选品工具 - 部署文档

## 📋 项目信息

- **项目名称**：东南亚TikTok选品工具
- **技术栈**：React 19 + Vite + TypeScript + Tailwind CSS + Supabase
- **目标市场**：越南、泰国、马来西亚、新加坡
- **类目**：时尚配件（发饰、平价饰品、手表、眼镜、假发、服装配件）

## 🚀 快速部署

### 前置要求

- Node.js 18+ 
- pnpm 8+
- Supabase 账号

### 1. 安装依赖

```bash
pnpm install
```

### 2. 环境配置

项目已集成 Supabase，无需额外配置环境变量。

### 3. 数据库初始化

所有数据库迁移已自动应用，包括：

**核心表结构**：
- `tiktok_products` - 商品数据
- `tiktok_market_data` - 市场数据
- `tiktok_api_configs` - API配置
- `tiktok_collection_tasks` - 采集任务
- `tiktok_accounts` - TikTok账号（支持多国家）
- `tiktok_opportunities` - 热门商机
- `tiktok_rankings` - 商品榜单
- `tiktok_keywords` - 热门关键词
- `scraper_sessions` - 爬虫会话

**Edge Functions**：
- `collect-tiktok-data` - EchoTik API数据采集
- `fastmoss-scraper` - FastMoss网页爬虫
- `google-trends` - Google趋势数据
- `tiktok-shop-official` - TikTok Shop官方数据

### 4. 本地开发

```bash
pnpm dev
```

访问 http://localhost:5173

### 5. 生产构建

```bash
pnpm build
```

构建产物在 `dist/` 目录

### 6. 预览生产版本

```bash
pnpm preview
```

## 📁 项目结构

```
├── src/
│   ├── components/          # UI组件
│   │   ├── layout/         # 布局组件（Sidebar等）
│   │   └── ui/             # shadcn/ui组件
│   ├── pages/              # 页面组件
│   │   ├── Index.tsx       # 首页
│   │   ├── Products.tsx    # 商品数据中心
│   │   ├── MarketInsights.tsx  # 市场洞察
│   │   ├── TikTokOfficial.tsx  # TikTok官方数据
│   │   └── DataCollection.tsx  # 数据采集配置
│   ├── lib/                # 工具库
│   │   ├── constants.ts    # 常量配置
│   │   └── types.ts        # TypeScript类型
│   └── integrations/       # 第三方集成
│       └── supabase/       # Supabase配置
├── supabase/
│   ├── functions/          # Edge Functions
│   │   ├── collect-tiktok-data/
│   │   ├── fastmoss-scraper/
│   │   ├── google-trends/
│   │   └── tiktok-shop-official/
│   └── migrations/         # 数据库迁移
└── public/                 # 静态资源
```

## 🎯 核心功能

### 1. 商品数据中心
- 商品列表展示
- 多维度筛选（国家、类目、价格、销量）
- 排序功能（最新、销量、增长、价格）
- 数据来源标识（EchoTik/FastMoss）

### 2. 市场洞察
- 按国家查看市场概况
- Google Trends趋势分析
- 类目热度分布
- 最佳销售时段
- 支付方式分析

### 3. TikTok官方数据
- 热门商机推荐
- 商品榜单（热销榜、趋势榜、新品榜）
- 热门关键词分析
- 支持多账号多国家管理

### 4. 数据采集配置
- EchoTik API密钥配置
- FastMoss账号+爬虫配置
- 采集任务管理

## 🔧 配置说明

### 类目配置

6大时尚配件类目：

1. **发饰头饰** - 发夹、发圈、鲨鱼夹、头箍等
2. **平价饰品** - 项链、耳环、手链、戒指等
3. **时尚手表** - 电子表、石英表、智能表等
4. **时尚眼镜** - 太阳镜、墨镜、偏光镜等
5. **假发发片** - 长发、短发、发片、造型假发等
6. **服装配件** - 围巾、手套、帽子、口罩、腰带等

### 国家配置

4个东南亚国家：
- 🇻🇳 越南 (VN)
- 🇹🇭 泰国 (TH)
- 🇲🇾 马来西亚 (MY)
- 🇸🇬 新加坡 (SG)

### TikTok账号配置

支持一个账号管理多个国家站点：
1. 进入"TikTok官方数据"页面
2. 点击"账号管理"
3. 添加账号并选择可访问的国家
4. 系统会自动根据国家切换站点获取数据

## 📊 数据采集

### EchoTik配置
1. 进入"数据采集配置"页面
2. 输入EchoTik API密钥
3. 创建采集任务
4. 查看采集进度

### FastMoss配置
1. 进入"数据采集配置"页面
2. 输入FastMoss账号和密码
3. 系统会模拟登录并爬取数据
4. Session会自动保存以减少登录次数

## 🔒 安全注意事项

1. **API密钥**：所有API密钥存储在Supabase Secrets中
2. **密码加密**：账号密码需要在实际部署时进行加密处理
3. **RLS策略**：所有数据表都启用了行级安全策略
4. **测试账号**：建议使用测试账号进行数据采集

## 📈 性能优化

- 使用 Vite 进行快速构建
- 组件懒加载
- 图片懒加载和错误处理
- Supabase实时订阅优化
- 数据分页加载

## 🐛 故障排查

### 常见问题

1. **图片无法显示**
   - 检查图片URL是否有效
   - 已实现onError fallback机制

2. **数据采集失败**
   - 检查API配置是否正确
   - 查看Edge Function日志

3. **TikTok官方数据无法加载**
   - 确认已配置对应国家的账号
   - 检查账号是否处于活跃状态

## 📞 技术支持

如需技术支持，请查看：
- 项目代码注释
- Supabase控制台日志
- 浏览器开发者工具控制台

## 📄 许可证

本项目为内部测试使用。

## 🎉 更新日志

### 2026-01-18
- ✅ 初始项目创建
- ✅ 6大时尚配件类目配置
- ✅ 4个东南亚国家支持
- ✅ EchoTik API集成
- ✅ FastMoss爬虫集成
- ✅ Google Trends集成
- ✅ TikTok Shop官方数据集成
- ✅ 多账号多国家管理支持
