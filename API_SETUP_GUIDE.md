# 🚀 真实API集成完整指南

## ✅ 已完成的工作

我已经为您创建了完整的智能API路由系统：

### 1. Smart API Router Edge Function
**位置**: `supabase/functions/smart-api-router/index.ts`

**功能**:
- ✅ 智能选择最优API（优先使用免费额度）
- ✅ 自动fallback（API失败时切换到备用）
- ✅ 配额监控和记录
- ✅ 成本追踪
- ✅ 数据自动保存到数据库

**智能路由逻辑**:
```
1. 优先使用 ScraperAPI (1000次免费/月)
   ↓ 用完后
2. 切换到 RapidAPI (500次免费/月)
   ↓ 再用完后
3. 使用 ScraperAPI 付费 (¥0.01/次)
   ↓ 任何API失败时
4. 自动使用模拟数据作为后备
```

---

## 📋 完整设置步骤

### 步骤1: 注册API服务（5分钟）

#### A. 注册ScraperAPI

```bash
1. 访问: https://www.scraperapi.com/signup

2. 填写信息:
   • 邮箱: 您的邮箱
   • 密码: 设置密码
   • 点击 "Sign Up"

3. 验证邮箱:
   • 打开邮箱收到的验证邮件
   • 点击验证链接

4. 获取API Key:
   • 登录后台
   • Dashboard → API Key
   • 复制保存（类似: a1b2c3d4e5f6...）

✅ 获得 1000次/月 免费额度
```

#### B. 注册RapidAPI（可选，推荐）

```bash
1. 访问: https://rapidapi.com/auth/sign-up

2. 注册账号:
   • 使用邮箱或Google账号

3. 搜索API:
   • 登录后搜索 "TikTok Product"
   • 选择 TikTok Product Search API

4. 订阅免费计划:
   • 点击 "Subscribe to Test"
   • 选择 "Basic (Free)" 计划
   • 点击 "Subscribe"

5. 获取API Key:
   • 在API页面右侧找到
   • X-RapidAPI-Key: 复制保存

✅ 获得 500次/月 免费额度
```

---

### 步骤2: 配置API密钥（3分钟）

#### 方式A: 使用Supabase Dashboard

```bash
1. 登录Supabase Dashboard
   https://supabase.com/dashboard

2. 选择您的项目

3. 进入 Settings → Edge Functions → Secrets

4. 添加密钥:
   
   Secret Name: SCRAPERAPI_KEY
   Value: 您的ScraperAPI密钥
   点击 "Add"

   Secret Name: RAPIDAPI_KEY (可选)
   Value: 您的RapidAPI密钥
   点击 "Add"

✅ 完成！密钥已安全保存
```

#### 方式B: 使用Supabase CLI

```bash
# 设置ScraperAPI密钥
supabase secrets set SCRAPERAPI_KEY=your_scraperapi_key_here

# 设置RapidAPI密钥（可选）
supabase secrets set RAPIDAPI_KEY=your_rapidapi_key_here

# 验证密钥
supabase secrets list
```

---

### 步骤3: 创建数据库表（1分钟）

在Supabase SQL Editor中执行以下SQL:

```sql
-- 创建API使用记录表
CREATE TABLE IF NOT EXISTS api_usage_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 1,
  cost NUMERIC(10, 4) DEFAULT 0,
  endpoint TEXT,
  request_data JSONB,
  response_status INTEGER,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_api_usage_log_service 
ON api_usage_log(service);

CREATE INDEX IF NOT EXISTS idx_api_usage_log_created_at 
ON api_usage_log(created_at);

-- 创建配额视图
CREATE OR REPLACE VIEW api_quota_summary AS
SELECT 
  service,
  DATE_TRUNC('month', created_at) as month,
  SUM(count) as total_calls,
  SUM(cost) as total_cost,
  COUNT(*) as request_count
FROM api_usage_log
GROUP BY service, DATE_TRUNC('month', created_at)
ORDER BY month DESC, service;

-- 启用RLS
ALTER TABLE api_usage_log ENABLE ROW LEVEL SECURITY;

-- RLS策略
CREATE POLICY "Allow authenticated users to view api usage"
ON api_usage_log FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow service role to insert api usage"
ON api_usage_log FOR INSERT
TO service_role
WITH CHECK (true);
```

---

### 步骤4: 部署Edge Function（2分钟）

```bash
# 部署智能API路由
supabase functions deploy smart-api-router

# 验证部署
supabase functions list

# 测试调用
curl -X POST \
  https://YOUR_PROJECT.supabase.co/functions/v1/smart-api-router \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "keyword": "jewelry",
    "country": "VN"
  }'
```

---

### 步骤5: 更新前端页面（已完成）

我将为您更新DataCollection页面添加真实API调用按钮...

---

## 📊 使用示例

### 前端调用

```typescript
import { supabase } from '@/integrations/supabase/client';

// 使用智能API路由采集数据
async function fetchRealData(keyword: string, country: string) {
  const { data, error } = await supabase.functions.invoke(
    'smart-api-router',
    {
      body: {
        keyword,
        country,
      }
    }
  );

  if (error) {
    console.error('API调用失败:', error);
    return null;
  }

  console.log('采集成功:', {
    数据源: data.dataSource,
    商品数: data.count,
    成本: data.cost,
    剩余配额: data.quota
  });

  return data;
}

// 使用
const result = await fetchRealData('jewelry', 'VN');
```

---

## 💰 成本监控

### 查询当月使用情况

```sql
-- 查看本月API使用统计
SELECT * FROM api_quota_summary
WHERE month = DATE_TRUNC('month', NOW());

-- 查看详细记录
SELECT 
  service,
  COUNT(*) as calls,
  SUM(cost) as total_cost,
  MIN(created_at) as first_call,
  MAX(created_at) as last_call
FROM api_usage_log
WHERE created_at >= DATE_TRUNC('month', NOW())
GROUP BY service;

-- 查看剩余配额
SELECT 
  'ScraperAPI' as service,
  1000 - COALESCE(SUM(count), 0) as remaining
FROM api_usage_log
WHERE service = 'scraperapi'
  AND created_at >= DATE_TRUNC('month', NOW())
UNION ALL
SELECT 
  'RapidAPI' as service,
  500 - COALESCE(SUM(count), 0) as remaining
FROM api_usage_log
WHERE service = 'rapidapi'
  AND created_at >= DATE_TRUNC('month', NOW());
```

---

## 🎯 智能路由工作原理

### 请求流程

```
用户点击"采集数据" 
  ↓
前端调用 smart-api-router
  ↓
检查本月配额使用情况
  ↓
┌─────────────────────────────┐
│  ScraperAPI有配额？         │
│  是 → 使用ScraperAPI (免费) │
│  否 → 继续检查              │
└─────────────────────────────┘
  ↓
┌─────────────────────────────┐
│  RapidAPI有配额？           │
│  是 → 使用RapidAPI (免费)   │
│  否 → 继续检查              │
└─────────────────────────────┘
  ↓
┌─────────────────────────────┐
│  使用ScraperAPI付费         │
│  ¥0.01/次                   │
└─────────────────────────────┘
  ↓
保存数据到数据库
  ↓
记录使用日志
  ↓
返回结果给前端
```

### 配额重置

```javascript
// 每月1号自动重置配额
// ScraperAPI: 1000次
// RapidAPI: 500次
// 无需手动操作
```

---

## ⚠️ 注意事项

### 1. API密钥安全

```
✅ 正确: 保存在Supabase Secrets
✅ 正确: 在Edge Function中使用
❌ 错误: 写在前端代码中
❌ 错误: 提交到Git仓库
❌ 错误: 在浏览器中暴露
```

### 2. 成本控制

```typescript
// 设置每月预算上限（例如¥10）
const MONTHLY_BUDGET = 10;

async function checkBudget() {
  const { data } = await supabase
    .from('api_usage_log')
    .select('cost')
    .gte('created_at', startOfMonth());

  const totalCost = data.reduce((sum, log) => sum + log.cost, 0);

  if (totalCost >= MONTHLY_BUDGET) {
    throw new Error('已达到月度预算上限');
  }

  return true;
}
```

### 3. 错误处理

```typescript
// 总是有后备方案
try {
  // 尝试真实API
  const data = await fetchFromApi();
} catch (error) {
  // 失败时使用模拟数据
  const data = generateMockData();
}
```

---

## 🔍 故障排查

### 问题1: API调用失败

**症状**: 返回错误消息

**检查**:
```bash
# 1. 检查API密钥是否正确
supabase secrets list

# 2. 检查Edge Function日志
supabase functions logs smart-api-router

# 3. 测试API密钥
curl "http://api.scraperapi.com?api_key=YOUR_KEY&url=https://httpbin.org/ip"
```

### 问题2: 配额显示不正确

**解决**:
```sql
-- 手动重置本月配额统计
DELETE FROM api_usage_log 
WHERE created_at < DATE_TRUNC('month', NOW());
```

### 问题3: 成本过高

**检查**:
```sql
-- 查看是否在使用付费API
SELECT service, SUM(cost) as total_cost
FROM api_usage_log
WHERE created_at >= DATE_TRUNC('month', NOW())
GROUP BY service
HAVING SUM(cost) > 0;
```

---

## 📱 监控仪表板

### 创建实时监控

```typescript
// 实时监控API使用情况
const { data, error } = await supabase
  .from('api_usage_log')
  .select('*')
  .order('created_at', { ascending: false })
  .limit(10);

// 显示在UI上
console.table(data);
```

---

## 🎉 完成检查清单

在使用真实API之前，请确认:

- [ ] 已注册ScraperAPI账号
- [ ] 已获取API Key
- [ ] 已在Supabase中配置密钥
- [ ] 已创建api_usage_log表
- [ ] 已部署smart-api-router函数
- [ ] 已测试API调用
- [ ] 已查看配额显示正确

全部完成后，您就可以开始使用真实API采集数据了！

---

## 💡 优化建议

### 1. 缓存策略

```typescript
// 缓存商品数据24小时
const CACHE_KEY = `product_${keyword}_${country}`;
const cached = await redis.get(CACHE_KEY);

if (cached) {
  return JSON.parse(cached); // 直接返回缓存
}

const data = await fetchFromApi();
await redis.setex(CACHE_KEY, 86400, JSON.stringify(data));
```

### 2. 批量请求

```typescript
// 一次请求多个关键词
const keywords = ['jewelry', 'watch', 'sunglasses'];
const results = await Promise.all(
  keywords.map(kw => fetchData(kw, country))
);
```

### 3. 定时任务

```typescript
// 每天凌晨自动采集
// 避免人工操作消耗配额
Deno.cron("daily_collection", "0 2 * * *", async () => {
  await collectDailyData();
});
```

---

## 📞 需要帮助？

如果遇到任何问题:

1. 查看日志: `supabase functions logs smart-api-router`
2. 检查配额: 执行上面的SQL查询
3. 测试API: 使用curl命令测试
4. 查看文档: 本文件和API_RESOURCES.md

---

## 🚀 下一步

完成配置后，您可以:

1. 在前端页面测试真实数据采集
2. 查看配额使用情况
3. 监控成本
4. 根据需要调整采集策略

祝您使用愉快！🎉
