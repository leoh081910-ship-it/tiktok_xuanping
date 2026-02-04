# 🔒 安全配置指南

## ⚠️ 重要安全提示

**您的API密钥应该：**
- ✅ 只存储在Supabase Secrets中
- ✅ 只由您自己配置
- ✅ 不要分享给任何人（包括AI助手）
- ✅ 不要提交到Git仓库

---

## 🚀 完整配置步骤（您独立完成）

### 第1步：配置ScraperAPI密钥

**操作位置**：Supabase Dashboard

```
1. 打开浏览器，访问您的Supabase项目
   https://supabase.com/dashboard/project/YOUR_PROJECT_ID

2. 左侧菜单 → Settings → Edge Functions

3. 找到 "Secrets" 或 "Environment Variables" 区域

4. 点击 "Add new secret" 按钮

5. 填写表单：
   ┌─────────────────────────────────────┐
   │ Secret name                         │
   │ SCRAPERAPI_KEY                      │
   │                                     │
   │ Secret value                        │
   │ [从ScraperAPI Dashboard复制的密钥]  │
   │                                     │
   │ [ Cancel ]        [ Add/Save ]      │
   └─────────────────────────────────────┘

6. 点击保存
```

✅ **完成标志**：在Secrets列表中看到 `SCRAPERAPI_KEY`

---

### 第2步：创建数据库表

**操作位置**：Supabase SQL Editor

```
1. 左侧菜单 → SQL Editor

2. 点击 "+ New query" 按钮

3. 复制粘贴以下完整SQL：
```

```sql
-- API使用记录表
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

-- 索引
CREATE INDEX IF NOT EXISTS idx_api_usage_log_service 
ON api_usage_log(service);

CREATE INDEX IF NOT EXISTS idx_api_usage_log_created_at 
ON api_usage_log(created_at);

-- 配额汇总视图
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

-- 行级安全（RLS）
ALTER TABLE api_usage_log ENABLE ROW LEVEL SECURITY;

-- RLS策略：允许认证用户查看
CREATE POLICY "Allow authenticated users to view api usage"
ON api_usage_log FOR SELECT
TO authenticated
USING (true);

-- RLS策略：允许服务角色插入
CREATE POLICY "Allow service role to insert api usage"
ON api_usage_log FOR INSERT
TO service_role
WITH CHECK (true);
```

```
4. 点击 "Run" 或 ▶️ 按钮

5. 等待执行完成，看到 "Success" 消息
```

✅ **完成标志**：
- 看到绿色成功提示
- 在Table Editor中能找到 `api_usage_log` 表

---

### 第3步：部署Edge Function

**方式A - 使用Supabase Dashboard**（推荐）：

```
1. 左侧菜单 → Edge Functions

2. 点击 "Create a new function" 或 "+ New function"

3. 填写表单：
   Function name: smart-api-router

4. 在编辑器中粘贴代码：
   • 打开项目文件：
     supabase/functions/smart-api-router/index.ts
   • 复制全部内容
   • 粘贴到Supabase编辑器

5. 点击 "Deploy" 或 "Save and deploy"
```

**方式B - 使用Supabase CLI**：

```bash
# 在项目目录中执行
cd /workspace/thread

# 部署函数
supabase functions deploy smart-api-router

# 验证部署
supabase functions list
```

✅ **完成标志**：
- 在Edge Functions列表中看到 `smart-api-router`
- 状态显示为 "Active" 或绿色点

---

## ✅ 验证配置是否成功

### 检查1：密钥是否配置

```
Supabase Dashboard → Settings → Edge Functions → Secrets

应该看到：
┌──────────────────┬─────────────┐
│ Name             │ Value       │
├──────────────────┼─────────────┤
│ SCRAPERAPI_KEY   │ *********** │
└──────────────────┴─────────────┘
```

### 检查2：数据库表是否创建

```
Supabase Dashboard → Table Editor

应该看到表：
• api_usage_log
```

或执行SQL：
```sql
SELECT COUNT(*) FROM api_usage_log;
-- 应该返回结果（即使是0）
```

### 检查3：Edge Function是否部署

```
Supabase Dashboard → Edge Functions

应该看到：
┌───────────────────┬────────┬─────────────────┐
│ Name              │ Status │ Last deployed   │
├───────────────────┼────────┼─────────────────┤
│ smart-api-router  │ Active │ Just now        │
└───────────────────┴────────┴─────────────────┘
```

---

## 🧪 测试API功能

### 在前端测试：

```
1. 打开项目浏览器
2. 进入 "数据采集" 页面
3. 点击 "真实API采集" 标签
4. 填写：
   • 关键词: jewelry
   • 国家: VN
5. 点击 "开始采集"
6. 等待 5-10 秒

预期结果：
✅ 显示 "采集成功"
✅ 显示采集商品数量
✅ 显示配额使用情况
✅ 显示成本（前1000次应为¥0）
```

### 查看API调用记录：

```sql
-- 在SQL Editor中执行
SELECT 
  service,
  count,
  cost,
  response_status,
  created_at
FROM api_usage_log
ORDER BY created_at DESC
LIMIT 10;
```

应该能看到刚才的调用记录。

---

## 📊 监控配额使用

### 查看本月使用情况：

```sql
SELECT * FROM api_quota_summary
WHERE month = DATE_TRUNC('month', NOW());
```

### 查看剩余配额：

```sql
SELECT 
  'ScraperAPI' as service,
  1000 - COALESCE(SUM(count), 0) as remaining,
  COALESCE(SUM(count), 0) as used
FROM api_usage_log
WHERE service = 'scraperapi'
  AND created_at >= DATE_TRUNC('month', NOW());
```

---

## ❓ 常见问题

### Q1: Edge Function读取不到密钥？
**A**: 
1. 确认密钥名称准确：`SCRAPERAPI_KEY`（区分大小写）
2. 重新部署Edge Function：
   ```bash
   supabase functions deploy smart-api-router
   ```

### Q2: API调用返回401错误？
**A**: 
1. ScraperAPI密钥可能不正确
2. 登录ScraperAPI Dashboard验证密钥
3. 重新在Supabase中配置密钥

### Q3: 显示"剩余配额0"但刚注册？
**A**: 
1. 检查api_usage_log表是否有历史记录
2. 可能是测试数据，清空后重试：
   ```sql
   DELETE FROM api_usage_log WHERE service = 'scraperapi';
   ```

### Q4: 前端显示"未配置API"？
**A**: 
1. 确认所有3个步骤都已完成
2. 刷新页面重试
3. 查看浏览器Console是否有错误

---

## 🔐 安全最佳实践

### ✅ 应该做的：
- 密钥只存在Supabase Secrets
- 定期检查API使用情况
- 设置配额上限避免超支
- 定期轮换API密钥

### ❌ 不应该做的：
- 不要在代码中硬编码密钥
- 不要提交密钥到Git
- 不要分享密钥给他人
- 不要在不安全的地方存储密钥

---

## 📞 需要帮助？

### 查看日志

**Edge Function日志**：
```bash
supabase functions logs smart-api-router --tail
```

**SQL查询最近的错误**：
```sql
SELECT * FROM api_usage_log
WHERE error_message IS NOT NULL
ORDER BY created_at DESC
LIMIT 10;
```

### 重新开始

如果需要重新配置：

```sql
-- 1. 清空API使用记录
TRUNCATE TABLE api_usage_log;

-- 2. 重新部署函数
-- 在CLI执行：
-- supabase functions deploy smart-api-router

-- 3. 测试
```

---

## 🎉 配置完成

当您完成以上3个步骤并测试成功后：

✅ 您的系统已配置完成
✅ 可以采集真实TikTok商品数据
✅ 每月1000次ScraperAPI免费调用
✅ 超出部分仅¥0.01/次
✅ 完整的配额监控和成本追踪

祝您使用愉快！🚀

---

## 📚 参考文档

- `QUICK_CONFIG.md` - 5分钟快速配置
- `SETUP_INSTRUCTIONS.md` - 详细操作指南
- `API_SETUP_GUIDE.md` - API配置说明
- `INTEGRATION_COMPLETE.md` - 集成完整说明

所有文档都在项目根目录中。
