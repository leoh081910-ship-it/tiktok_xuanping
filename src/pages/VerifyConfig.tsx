import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'success' | 'error' | 'warning';
  message: string;
  details?: any;
}

export default function VerifyConfig() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [running, setRunning] = useState(false);

  const addResult = (result: TestResult) => {
    setResults(prev => [...prev, result]);
  };

  const verifySERPERConfig = async () => {
    addResult({ name: '[1] 检查 SERPER_API_KEY', status: 'running', message: '正在查询...' });

    try {
      const { data, error } = await supabase
        .from('tiktok_api_configs')
        .select('*')
        .eq('provider', 'serper');

      if (error) {
        addResult({
          name: '[1] 检查 SERPER_API_KEY',
          status: 'error',
          message: `查询失败: ${error.message}`,
          details: error
        });
        return;
      }

      if (data && data.length > 0) {
        addResult({
          name: '[1] 检查 SERPER_API_KEY',
          status: 'success',
          message: `✅ 已配置 (Active: ${data[0].is_active})`,
          details: data
        });
      } else {
        addResult({
          name: '[1] 检查 SERPER_API_KEY',
          status: 'warning',
          message: '⚠️ 未配置，请在"API配置"Tab 中配置',
          details: data
        });
      }
    } catch (error: any) {
      addResult({
        name: '[1] 检查 SERPER_API_KEY',
        status: 'error',
        message: `查询失败: ${error.message}`,
        details: error
      });
    }
  };

  const verifyAllConfigs = async () => {
    addResult({ name: '[2] 检查所有 API 配置', status: 'running', message: '正在查询...' });

    try {
      const { data, error } = await supabase
        .from('tiktok_api_configs')
        .select('*');

      if (error) {
        addResult({
          name: '[2] 检查所有 API 配置',
          status: 'error',
          message: `查询失败: ${error.message}`,
          details: error
        });
        return;
      }

      if (data && data.length > 0) {
        const summary = data.map(c => `${c.provider}: ${c.is_active ? '✅' : '❌'}`).join(', ');
        addResult({
          name: '[2] 检查所有 API 配置',
          status: 'success',
          message: `找到 ${data.length} 个配置 (${summary})`,
          details: data
        });
      } else {
        addResult({
          name: '[2] 检查所有 API 配置',
          status: 'warning',
          message: '⚠️ 未找到任何配置',
          details: data
        });
      }
    } catch (error: any) {
      addResult({
        name: '[2] 检查所有 API 配置',
        status: 'error',
        message: `查询失败: ${error.message}`,
        details: error
      });
    }
  };

  const testEdgeFunction = async () => {
    addResult({ name: '[3] 测试 Edge Function', status: 'running', message: '正在测试...' });

    try {
      const { data, error } = await supabase.functions.invoke('triple-platform-fusion', {
        body: {
          keyword: 'test',
          countries: ['VN'],
          limit: 2
        }
      });

      if (error) {
        addResult({
          name: '[3] 测试 Edge Function',
          status: 'error',
          message: `调用失败: ${error.message}`,
          details: error
        });
        return;
      }

      if (data && data.success) {
        addResult({
          name: '[3] 测试 Edge Function',
          status: 'success',
          message: `✅ 成功 (Google:${data.googleCount}, Shopee:${data.shopeeCount}, 融合:${data.fusedCount})`,
          details: data
        });
      } else {
        addResult({
          name: '[3] 测试 Edge Function',
          status: 'warning',
          message: `⚠️ 业务错误: ${data?.error || '未知错误'}`,
          details: data
        });
      }
    } catch (error: any) {
      addResult({
        name: '[3] 测试 Edge Function',
        status: 'error',
        message: `测试失败: ${error.message}`,
        details: error
      });
    }
  };

  const verifyDatabase = async () => {
    addResult({ name: '[4] 验证数据库约束', status: 'running', message: '正在验证...' });

    try {
      const { data, error } = await supabase
        .from('tiktok_products')
        .select('data_source');

      if (error) {
        addResult({
          name: '[4] 验证数据库约束',
          status: 'error',
          message: `表访问失败: ${error.message}`,
          details: error
        });
        return;
      }

      const stats: Record<string, number> = {};
      data.forEach(item => {
        stats[item.data_source] = (stats[item.data_source] || 0) + 1;
      });

      const hasTripleFusion = stats['google_shopee_tiktok_fusion'] > 0;

      addResult({
        name: '[4] 验证数据库约束',
        status: hasTripleFusion ? 'success' : 'warning',
        message: hasTripleFusion
          ? `✅ 支持三平台融合 (${stats['google_shopee_tiktok_fusion']} 条)`
          : '⚠️ 可能未更新迁移（暂无三平台融合数据）',
        details: stats
      });
    } catch (error: any) {
      addResult({
        name: '[4] 验证数据库约束',
        status: 'error',
        message: `验证失败: ${error.message}`,
        details: error
      });
    }
  };

  const runAllTests = async () => {
    setRunning(true);
    setResults([]);

    await verifySERPERConfig();
    await new Promise(resolve => setTimeout(resolve, 500));

    await verifyAllConfigs();
    await new Promise(resolve => setTimeout(resolve, 500));

    await verifyDatabase();
    await new Promise(resolve => setTimeout(resolve, 500));

    await testEdgeFunction();

    setRunning(false);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'running':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    const variants: Record<string, any> = {
      success: 'bg-green-100 text-green-800',
      error: 'bg-red-100 text-red-800',
      warning: 'bg-yellow-100 text-yellow-800',
      running: 'bg-blue-100 text-blue-800',
      pending: 'bg-gray-100 text-gray-800'
    };

    return variants[status] || variants.pending;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🔍 三平台融合配置验证</CardTitle>
          <CardDescription>
            验证 SERPER_API_KEY 配置和三平台融合功能
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button onClick={verifySERPERConfig} disabled={running}>
              1. 检查 SERPER_API_KEY
            </Button>
            <Button onClick={verifyAllConfigs} disabled={running}>
              2. 检查所有配置
            </Button>
            <Button onClick={testEdgeFunction} disabled={running}>
              3. 测试 Edge Function
            </Button>
            <Button onClick={verifyDatabase} disabled={running}>
              4. 验证数据库
            </Button>
            <Button onClick={runAllTests} disabled={running} className="bg-green-600 hover:bg-green-700">
              {running ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  测试中...
                </>
              ) : (
                '✨ 全部测试'
              )}
            </Button>
          </div>

          {results.length > 0 && (
            <div className="space-y-3 mt-6">
              <h3 className="font-semibold text-lg">测试结果</h3>
              {results.map((result, index) => (
                <Card key={index} className={getStatusBadge(result.status)}>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2 flex-1">
                        {getStatusIcon(result.status)}
                        <div className="flex-1">
                          <p className="font-medium">{result.name}</p>
                          <p className="text-sm mt-1">{result.message}</p>
                          {result.details && (
                            <details className="mt-2">
                              <summary className="text-xs text-muted-foreground cursor-pointer">
                                查看详情
                              </summary>
                              <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto max-h-40">
                                {JSON.stringify(result.details, null, 2)}
                              </pre>
                            </details>
                          )}
                        </div>
                      </div>
                      <Badge variant={result.status === 'success' ? 'default' : 'secondary'}>
                        {result.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
