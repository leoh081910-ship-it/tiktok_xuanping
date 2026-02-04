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

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_api_usage_log_service 
ON api_usage_log(service);

CREATE INDEX IF NOT EXISTS idx_api_usage_log_created_at 
ON api_usage_log(created_at);

-- 创建API配额视图（方便查询当月使用情况）
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

-- 启用RLS（行级安全）
ALTER TABLE api_usage_log ENABLE ROW LEVEL SECURITY;

-- 允许认证用户查看API使用记录
CREATE POLICY "Allow authenticated users to view api usage"
ON api_usage_log FOR SELECT
TO authenticated
USING (true);

-- 允许服务角色插入记录
CREATE POLICY "Allow service role to insert api usage"
ON api_usage_log FOR INSERT
TO service_role
WITH CHECK (true);

-- 添加注释
COMMENT ON TABLE api_usage_log IS 'API调用使用记录，用于追踪配额和成本';
COMMENT ON COLUMN api_usage_log.service IS 'API服务名称 (scraperapi, rapidapi, custom)';
COMMENT ON COLUMN api_usage_log.count IS 'API调用次数';
COMMENT ON COLUMN api_usage_log.cost IS '调用成本（人民币元）';
COMMENT ON COLUMN api_usage_log.endpoint IS 'API端点';
COMMENT ON COLUMN api_usage_log.request_data IS '请求数据（JSON格式）';
COMMENT ON COLUMN api_usage_log.response_status IS 'HTTP响应状态码';
COMMENT ON COLUMN api_usage_log.error_message IS '错误信息（如果有）';
