import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Settings,
  Key,
  Save,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    echotikApiKey: '',
    fastmossApiKey: '',
    scraperApiKey: '',
    supabaseUrl: '',
    supabaseAnonKey: '',
  });
  const [connectionStatus, setConnectionStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      // 从 localStorage 加载设置
      const stored = localStorage.getItem('tiktok_settings');
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings(parsed);
      }

      // 加载环境变量
      setSettings(prev => ({
        ...prev,
        supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
        supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
      }));

      // 检查 Supabase 连接
      const { error } = await supabase.from('tiktok_products').select('id').limit(1);
      setConnectionStatus(prev => ({
        ...prev,
        supabase: !error,
      }));
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      // 保存到 localStorage
      localStorage.setItem('tiktok_settings', JSON.stringify(settings));

      // 验证 API 连接
      await validateConnections();

      toast.success('设置已保存');
    } catch (error) {
      toast.error('保存失败');
    } finally {
      setSaving(false);
    }
  };

  const validateConnections = async () => {
    // 这里可以添加 API 验证逻辑
    // 目前只验证 Supabase 连接
    const { error } = await supabase.from('tiktok_products').select('id').limit(1);
    setConnectionStatus(prev => ({
      ...prev,
      supabase: !error,
    }));
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="max-w-2xl space-y-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Settings className="h-8 w-8" />
          系统设置
        </h1>
        <p className="text-muted-foreground mt-1">
          配置 API 密钥和系统参数
        </p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* API Keys */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              API 密钥配置
            </CardTitle>
            <CardDescription>
              配置第三方 API 密钥以启用数据采集功能
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* EchoTik API */}
            <div className="space-y-2">
              <Label htmlFor="echotik">EchoTik API Key</Label>
              <Input
                id="echotik"
                type="password"
                value={settings.echotikApiKey}
                onChange={(e) => setSettings({ ...settings, echotikApiKey: e.target.value })}
                placeholder="输入 EchoTik API Key"
              />
              <p className="text-sm text-muted-foreground">
                用于采集 TikTok 商品数据。访问 https://echotik.io/ 获取 API Key
              </p>
            </div>

            {/* FastMoss API */}
            <div className="space-y-2">
              <Label htmlFor="fastmoss">FastMoss API Key</Label>
              <Input
                id="fastmoss"
                type="password"
                value={settings.fastmossApiKey}
                onChange={(e) => setSettings({ ...settings, fastmossApiKey: e.target.value })}
                placeholder="输入 FastMoss API Key"
              />
              <p className="text-sm text-muted-foreground">
                用于采集 TikTok Shop 官方数据。访问 https://fastmoss.com/ 获取 API Key
              </p>
            </div>

            {/* ScraperAPI */}
            <div className="space-y-2">
              <Label htmlFor="scraper">ScraperAPI Key</Label>
              <Input
                id="scraper"
                type="password"
                value={settings.scraperApiKey}
                onChange={(e) => setSettings({ ...settings, scraperApiKey: e.target.value })}
                placeholder="输入 ScraperAPI Key"
              />
              <p className="text-sm text-muted-foreground">
                用于网页数据采集。访问 https://scraperapi.com/ 获取 API Key
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Supabase Config */}
        <Card>
          <CardHeader>
            <CardTitle>Supabase 配置</CardTitle>
            <CardDescription>
              数据库连接配置（自动从环境变量读取）
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>连接状态</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {connectionStatus.supabase ? '已连接' : '连接失败'}
                </p>
              </div>
              <Badge variant={connectionStatus.supabase ? 'default' : 'destructive'}>
                {connectionStatus.supabase ? (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    正常
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-3 w-3 mr-1" />
                    异常
                  </>
                )}
              </Badge>
            </div>

            <div className="space-y-2">
              <Label>Supabase URL</Label>
              <Input
                value={settings.supabaseUrl}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label>Supabase Anon Key</Label>
              <Input
                value={settings.supabaseAnonKey ? '已配置 (hidden)' : ''}
                disabled
                className="bg-muted"
                type="password"
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-end">
              <Button onClick={saveSettings} disabled={saving}>
                {saving ? (
                  '保存中...'
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    保存设置
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info */}
        <Card>
          <CardHeader>
            <CardTitle>使用说明</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• API 密钥将保存在浏览器本地存储中</p>
            <p>• 配置 API Key 后，前往"数据采集"页面开始采集数据</p>
            <p>• 建议使用 EchoTik API，数据准确性高且稳定</p>
            <p>• 如需帮助，请查看项目文档或联系技术支持</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
