# 🔧 API配置操作指南

## 第一步：获取您的API密钥

### ScraperAPI密钥获取
1. 登录 https://www.scraperapi.com/
2. 进入Dashboard
3. 找到并复制您的API Key（看起来像：`a1b2c3d4e5f6...`）

---

## 第二步：配置方式选择

您可以选择以下任一方式：

### 方式A：使用Supabase Dashboard（推荐，最简单）

**步骤1：登录Supabase**
```
访问: https://supabase.com/dashboard
登录您的账号
选择您的项目
```

**步骤2：配置密钥**
```
1. 点击左侧菜单: Settings → Edge Functions
2. 找到 "Secrets" 部分
3. 点击 "Add new secret"
4. 填写：
   Name: SCRAPERAPI_KEY
   Value: [粘贴您的API密钥]
5. 点击 "Add" 或 "Save"
```

**步骤3：创建数据库表**
```
1. 点击左侧菜单: SQL Editor
2. 点击 "New query"
3. 复制粘贴以下SQL：
```

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
  SUM(cost) as total_cost
FROM api_usage_log
GROUP BY service, DATE_TRUNC('month', created_at);

-- 启用RLS
ALTER TABLE api_usage_log ENABLE ROW LEVEL SECURITY;

-- RLS策略
CREATE POLICY "Allow authenticated users to view api usage"
ON api_usage_log FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow service role to insert api usage"
ON api_usage_log FOR INSERT TO service_role WITH CHECK (true);
```

```
4. 点击 "Run" 或 "Execute"
5. 看到 "Success" 消息表示完成
```

**步骤4：部署Edge Function**
```
1. 点击左侧菜单: Edge Functions
2. 点击 "Create a new function"
3. Function name: smart-api-router
4. 复制项目文件中的代码：
   supabase/functions/smart-api-router/index.ts
5. 粘贴到编辑器
6. 点击 "Deploy"
```

---

### 方式B：使用Supabase CLI（适合开发者）

**前提条件**：
```bash
# 确保已安装Supabase CLI
supabase --version

# 如果未安装，运行：
npm install -g supabase
```

**配置步骤**：

```bash
# 1. 进入项目目录
cd /workspace/thread

# 2. 链接到您的Supabase项目
supabase link --project-ref YOUR_PROJECT_REF

# 3. 配置API密钥
supabase secrets set SCRAPERAPI_KEY=your_scraperapi_key_here

# 4. 运行数据库迁移
supabase db push

# 5. 部署Edge Function
supabase functions deploy smart-api-router

# 6. 验证部署
supabase functions list
```

---

## 第三步：验证配置

### 检查密钥是否配置成功

**Dashboard方式**：
```
Settings → Edge Functions → Secrets
应该看到: SCRAPERAPI_KEY (已设置)
```

**CLI方式**：
```bash
supabase secrets list
# 应该显示: SCRAPERAPI_KEY
```

### 检查数据库表是否创建

**Dashboard方式**：
```
Table Editor → 查找 api_usage_log
应该能看到这个表
```

**SQL方式**：
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'api_usage_log';
```

### 检查Edge Function是否部署

**Dashboard方式**：
```
Edge Functions 菜单
应该看到: smart-api-router (已部署)
```

**CLI方式**：
```bash
supabase functions list
# 应该显示: smart-api-router
```

---

## 第四步：测试API

### 在前端测试

1. 打开项目浏览器
2. 进入"数据采集"页面
3. 点击"真实API采集"标签
4. 输入关键词：jewelry
5. 选择国家：VN（越南）
6. 点击"开始采集"
7. 等待几秒钟
8. 应该看到成功消息和采集结果

### 查看API调用记录

**SQL查询**：
```sql
-- 查看所有API调用
SELECT * FROM api_usage_log 
ORDER BY created_at DESC 
LIMIT 10;

-- 查看本月配额使用
SELECT * FROM api_quota_summary
WHERE month = DATE_TRUNC('month', NOW());

-- 查看剩余配额
SELECT 
  'ScraperAPI' as service,
  1000 - COALESCE(SUM(count), 0) as remaining
FROM api_usage_log
WHERE service = 'scraperapi'
  AND created_at >= DATE_TRUNC('month', NOW());
```

---

## 🎯 常见问题

### Q1: 密钥配置后Edge Function读取不到？
**A**: Edge Function需要重新部署才能读取新的密钥
```bash
supabase functions deploy smart-api-router
```

### Q2: SQL执行失败？
**A**: 可能是权限问题，确保：
- 使用的是服务角色连接
- 或者在Dashboard的SQL Editor中执行

### Q3: 部署Edge Function失败？
**A**: 检查：
```bash
# 查看详细错误
supabase functions deploy smart-api-router --debug

# 查看日志
supabase functions logs smart-api-router
```

### Q4: API调用失败返回错误？
**A**: 检查：
1. 密钥是否正确配置
2. ScraperAPI账号是否还有配额
3. 查看Edge Function日志：
```bash
supabase functions logs smart-api-router --tail
```

---

## 📞 需要帮助？

### 检查配置状态

```bash
# 完整检查脚本
echo "检查Supabase链接..."
supabase status

echo "\n检查密钥..."
supabase secrets list

echo "\n检查数据库表..."
supabase db diff

echo "\n检查Edge Functions..."
supabase functions list
```

### 查看日志

```bash
# 实时查看Edge Function日志
supabase functions logs smart-api-router --tail

# 查看最近10条日志
supabase functions logs smart-api-router --limit 10
```

---

## ✅ 配置完成检查清单

配置完成后，请确认：

- [ ] ScraperAPI密钥已添加到Supabase Secrets
- [ ] api_usage_log表已创建
- [ ] api_quota_summary视图已创建
- [ ] RLS策略已设置
- [ ] smart-api-router函数已部署
- [ ] 在前端测试采集成功
- [ ] 可以查看API调用记录
- [ ] 配额显示正确

全部完成后，您的系统就可以使用真实API采集数据了！

---

## 🎉 下一步

配置完成后，您可以：

1. **开始采集真实数据**
   - 进入"数据采集"页面
   - 使用"真实API采集"功能

2. **监控使用情况**
   - 查看剩余配额
   - 追踪成本
   - 分析采集结果

3. **优化采集策略**
   - 设置缓存减少重复调用
   - 批量采集提高效率
   - 定时任务自动采集

祝您使用愉快！🚀
