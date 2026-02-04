# ⚡ 5分钟快速配置指南

## 您需要准备的信息

### 1. ScraperAPI密钥
```
您的密钥: _____________________________________
（从 https://www.scraperapi.com/ Dashboard获取）
```

### 2. Supabase项目信息
```
项目URL: _____________________________________
（例如: https://xxx.supabase.co）

或

项目ID: _____________________________________
```

---

## 🚀 三步完成配置

### 步骤1: 配置API密钥（1分钟）

**在Supabase Dashboard操作**：

```
1. 打开 https://supabase.com/dashboard
2. 选择您的项目
3. Settings → Edge Functions → Secrets
4. 点击 "Add new secret"
5. 填写:
   Name: SCRAPERAPI_KEY
   Value: [您的ScraperAPI密钥]
6. 点击 Save
```

✅ 完成！密钥已安全保存。

---

### 步骤2: 创建数据库表（2分钟）

**在Supabase Dashboard操作**：

```
1. SQL Editor → New query
2. 复制粘贴以下完整SQL
3. 点击 Run
```

**SQL代码**（复制整段）：
```sql
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

CREATE INDEX IF NOT EXISTS idx_api_usage_log_service ON api_usage_log(service);
CREATE INDEX IF NOT EXISTS idx_api_usage_log_created_at ON api_usage_log(created_at);

ALTER TABLE api_usage_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to view api usage"
ON api_usage_log FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow service role to insert api usage"
ON api_usage_log FOR INSERT TO service_role WITH CHECK (true);
```

✅ 看到"Success"消息表示完成！

---

### 步骤3: 部署Edge Function（2分钟）

**方式A - 使用Dashboard**（推荐）：

```
1. Edge Functions → Create a new function
2. Name: smart-api-router
3. 复制项目中的文件内容:
   supabase/functions/smart-api-router/index.ts
4. 粘贴到编辑器
5. 点击 Deploy
```

**方式B - 使用CLI**（如果您熟悉命令行）：

```bash
cd /workspace/thread
supabase functions deploy smart-api-router
```

✅ 看到部署成功消息！

---

## 🧪 立即测试

### 在浏览器中测试：

```
1. 打开项目
2. 进入"数据采集"页面
3. 点击"真实API采集"标签
4. 输入: jewelry
5. 选择: VN（越南）
6. 点击"开始采集"
7. 等待5-10秒
8. 看到成功消息！🎉
```

**成功标志**：
- ✅ 提示"采集成功"
- ✅ 显示采集到的商品数量
- ✅ 显示剩余配额
- ✅ 显示成本（前1000次应该是¥0）

---

## ❓ 遇到问题？

### 问题1: 提示"未配置密钥"
**解决**：
- 返回步骤1，确认密钥已正确保存
- Edge Function需要重新部署才能读取新密钥

### 问题2: 提示"数据库表不存在"
**解决**：
- 返回步骤2，重新执行SQL
- 在SQL Editor检查表是否存在

### 问题3: 部署Edge Function失败
**解决**：
```bash
# 查看详细错误
supabase functions logs smart-api-router

# 重新部署
supabase functions deploy smart-api-router
```

---

## ✅ 配置完成！

现在您可以：
- ✅ 采集真实TikTok商品数据
- ✅ 每月1000次免费使用
- ✅ 超出仅¥0.01/次
- ✅ 智能成本控制

---

## 📊 监控配额

### 查看剩余配额：

**方式1 - 前端查看**：
```
数据采集页面 → 真实API采集
页面会显示:
• ScraperAPI: XXX/1000 剩余
```

**方式2 - SQL查询**：
```sql
SELECT 
  'ScraperAPI' as service,
  1000 - COALESCE(SUM(count), 0) as remaining
FROM api_usage_log
WHERE service = 'scraperapi'
  AND created_at >= DATE_TRUNC('month', NOW());
```

---

## 🎯 配置成功的标志

如果您完成了以上三步，并且：
- ✅ 能在前端成功采集数据
- ✅ 能看到配额显示
- ✅ 能在数据库中看到api_usage_log记录

**恭喜！配置完全成功！** 🎉

---

## 📞 还需要帮助？

查看完整文档：
- `SETUP_INSTRUCTIONS.md` - 详细操作指南
- `API_SETUP_GUIDE.md` - API配置说明
- `INTEGRATION_COMPLETE.md` - 集成完整指南

或在项目中查看日志：
```bash
supabase functions logs smart-api-router --tail
```

祝您使用愉快！🚀
