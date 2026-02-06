import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Database,
  Key,
  Play,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  RefreshCw,
  Zap,
  DollarSign,
  ShoppingBag,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { COUNTRY_LIST } from '@/lib/constants';
import * as cheerio from 'cheerio';

// 生成具体的商品名称
function generateProductName(keyword: string, country: string, index: number): string {
  const colors = ['黑色', '白色', '金色', '银色', '蓝色', '红色', '绿色', '紫色'];
  const styles = ['经典款', '时尚款', '运动款', '复古款', '奢华款', '简约款', '个性款', '潮流款'];
  const features = ['防紫外线', '偏光', '轻便', '耐用', '舒适', '高清', '时尚', '百搭'];
  
  // 根据关键词生成具体的商品类型
  const getProductType = (kw: string): string => {
    kw = kw.toLowerCase();
    if (kw.includes('sunglass')) return '太阳眼镜';
    if (kw.includes('glass')) return '眼镜';
    if (kw.includes('watch')) return '手表';
    if (kw.includes('jewelry')) return '首饰';
    if (kw.includes('ring')) return '戒指';
    if (kw.includes('necklace')) return '项链';
    if (kw.includes('bracelet')) return '手链';
    if (kw.includes('earring')) return '耳环';
    if (kw.includes('watch')) return '手表';
    if (kw.includes('bag')) return '包包';
    if (kw.includes('shoe')) return '鞋子';
    if (kw.includes('cloth')) return '服装';
    return '时尚配件';
  };
  
  const color = colors[Math.floor(Math.random() * colors.length)];
  const style = styles[Math.floor(Math.random() * styles.length)];
  const feature = features[Math.floor(Math.random() * features.length)];
  const productType = getProductType(keyword);
  
  return `【${country}热销】${color}${style}${feature}${productType} ${index}`;
}

interface APIConfig {
  id: string;
  provider: 'echotik' | 'fastmoss';
  api_key: string;
  is_active: boolean;
  last_used_at: string | null;
}

interface CollectionTask {
  id: string;
  task_type: string;
  status: string;
  progress: number;
  provider: string;
  items_collected: number;
  items_total: number;
  error_message: string | null;
  created_at: string;
}

export default function DataCollection() {
  const [echotikKey, setEchotikKey] = useState('');
  const [fastmossUsername, setFastmossUsername] = useState('');
  const [fastmossPassword, setFastmossPassword] = useState('');
  const [configs, setConfigs] = useState<APIConfig[]>([]);
  const [tasks, setTasks] = useState<CollectionTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingConfig, setSavingConfig] = useState<string | null>(null);
  
  // 真实API相关状态
  const [realApiKeyword, setRealApiKeyword] = useState('jewelry');
  const [realApiCountry, setRealApiCountry] = useState('VN');
  const [realApiLoading, setRealApiLoading] = useState(false);
  const [quota, setQuota] = useState<{ scraperApi: number; rapidApi: number } | null>(null);

  // Shopee+TikTok 融合相关状态
  const [fusionKeyword, setFusionKeyword] = useState('jewelry');
  const [fusionCountries, setFusionCountries] = useState<string[]>(['VN']);
  const [fusionLoading, setFusionLoading] = useState(false);

  // 三平台融合相关状态 (Google + Shopee + TikTok)
  const [tripleKeyword, setTripleKeyword] = useState('sunglasses');
  const [tripleCountries, setTripleCountries] = useState<string[]>(['VN', 'TH']);
  const [tripleLoading, setTripleLoading] = useState(false);
  const [serperKey, setSerperKey] = useState('');

  // 加载API配置
  const loadConfigs = async () => {
    const { data, error } = await supabase
      .from('tiktok_api_configs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading configs:', error);
      return;
    }

    setConfigs(data || []);

    // 填充已保存的配置
    data?.forEach(config => {
      if (config.provider === 'echotik' && config.api_key) {
        setEchotikKey('••••••••••••••••'); // 显示掩码
      }
      if (config.provider === 'serper' && config.api_key) {
        setSerperKey('••••••••••••••••'); // 显示掩码
      }
    });
  };

  // 加载采集任务
  const loadTasks = async () => {
    const { data, error } = await supabase
      .from('tiktok_collection_tasks')
      .select('*')
      .order('created_at', { ascending: false})
      .limit(10);

    if (error) {
      console.error('Error loading tasks:', error);
      return;
    }

    setTasks(data || []);
  };

  // 调用真实API采集数据
  const handleRealApiCollection = async () => {
    if (!realApiKeyword.trim()) {
      toast.error('请输入关键词');
      return;
    }

    setRealApiLoading(true);

    try {
      toast.info('正在采集数据...', {
        description: `关键词: ${realApiKeyword}, 国家: ${realApiCountry}`
      });

      // 使用 fetch 直接调用 Edge Function（绕过 supabase.client 的问题）
      console.log('调用 Edge Function: tiktok-real-collector');
      console.log('参数:', { keyword: realApiKeyword, country: realApiCountry, dataType: 'product' });

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://cqsqedvhhnyhwxakujyf.supabase.co";
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxc3FlZHZoaG55aHd4YWt1anlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMjM5NjEsImV4cCI6MjA4NTY5OTk2MX0.4xJbf6fTBqsd4xagMcUuibW7XAeT-vf5UZWXAXvyhds";

      const response = await fetch(`${supabaseUrl}/functions/v1/tiktok-real-collector`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keyword: realApiKeyword,
          country: realApiCountry,
          dataType: 'product'
        })
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const responseData = await response.json();
      console.log('Edge Function 响应:', responseData);

      if (!responseData.success) {
        throw new Error(responseData.error || '数据采集失败');
      }

      // 更新配额信息
      if (responseData.quota) {
        setQuota(responseData.quota);
      }

      // 显示采集结果
      const dataQualityText = responseData.dataQuality
        ? `标题:${responseData.dataQuality.realTitle ? '✅' : '❌'} 图片:${responseData.dataQuality.realImages ? '✅' : '❌'} 页面:${responseData.dataQuality.realPageData ? '✅' : '❌'}`
        : '';

      toast.success(`采集成功！`, {
        description: `
          获取 ${responseData.count} 个商品
          数据源: ${responseData.dataSource}
          ${dataQualityText}
          ${responseData.message || ''}
        `
      });

      // 刷新任务列表
      await loadTasks();

    } catch (error) {
      console.error('Real API collection error:', error);
      toast.error('采集失败', {
        description: (error as Error).message || '请检查API配置'
      });
    } finally {
      setRealApiLoading(false);
    }
  };

  // 调用 Shopee+TikTok 融合采集
  const handleFusionCollection = async () => {
    if (!fusionKeyword.trim()) {
      toast.error('请输入关键词');
      return;
    }

    if (fusionCountries.length === 0) {
      toast.error('请至少选择一个国家');
      return;
    }

    setFusionLoading(true);

    // 创建任务记录
    let taskId: string | null = null;
    try {
      const { data: taskData, error: taskError } = await supabase
        .from('tiktok_collection_tasks')
        .insert({
          task_type: 'shopee_tiktok_fusion',
          status: 'running',
          progress: 0,
          countries: fusionCountries,
          provider: 'shopee_tiktok',
          started_at: new Date().toISOString(),
          items_collected: 0,
          items_total: fusionCountries.length * 30,  // 每个国家预计30个商品
          keyword: fusionKeyword,
        })
        .select()
        .single();

      if (taskError) {
        console.error('Failed to create task:', taskError);
      } else {
        taskId = taskData.id;
        console.log('Task created:', taskId);
        // 刷新任务列表
        await loadTasks();
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }

    try {
      toast.info('正在融合采集 Shopee + TikTok 数据...', {
        description: `关键词: ${fusionKeyword}, 国家: ${fusionCountries.join(', ')}`
      });

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://cqsqedvhhnyhwxakujyf.supabase.co";
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxc3FlZHZoaG55aHd4YWt1anlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMjM5NjEsImV4cCI6MjA4NTY5OTk2MX0.4xJbf6fTBqsd4xagMcUuibW7XAeT-vf5UZWXAXvyhds";

      const response = await fetch(`${supabaseUrl}/functions/v1/shopee-tiktok-fusion`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keyword: fusionKeyword,
          countries: fusionCountries,
          limit: 30
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const responseData = await response.json();

      if (!responseData.success) {
        throw new Error(responseData.error || '融合采集失败');
      }

      toast.success('融合采集成功!', {
        description: `
          Shopee 商品: ${responseData.shopeeCount} 个
          TikTok 趋势: ${responseData.tiktokTrendsCount} 个
          融合生成: ${responseData.fusedCount} 个商品
          平均评分: ${responseData.avgFusionScore}/100
        `
      });

      // 更新任务记录为完成状态
      if (taskId) {
        try {
          await supabase
            .from('tiktok_collection_tasks')
            .update({
              status: 'completed',
              progress: 100,
              completed_at: new Date().toISOString(),
              items_collected: responseData.fusedCount,
              fusion_score: parseFloat(responseData.avgFusionScore) || 0,
            })
            .eq('id', taskId);
        } catch (error) {
          console.error('Error updating task:', error);
        }
      }

      // 刷新任务列表
      await loadTasks();

    } catch (error) {
      console.error('Fusion collection error:', error);

      // 更新任务记录为失败状态
      if (taskId) {
        try {
          await supabase
            .from('tiktok_collection_tasks')
            .update({
              status: 'failed',
              completed_at: new Date().toISOString(),
              error_message: (error as Error).message || '未知错误',
            })
            .eq('id', taskId);
        } catch (updateError) {
          console.error('Error updating failed task:', updateError);
        }
      }

      toast.error('融合采集失败', {
        description: (error as Error).message || '请稍后重试'
      });
    } finally {
      setFusionLoading(false);
    }
  };

  // 调用三平台融合采集 (Google + Shopee + TikTok)
  const handleTripleFusionCollection = async () => {
    if (!tripleKeyword.trim()) {
      toast.error('请输入关键词');
      return;
    }

    if (tripleCountries.length === 0) {
      toast.error('请至少选择一个国家');
      return;
    }

    // 检查是否配置了 SERPER API
    const serperConfig = configs.find(c => c.provider === 'serper');
    if (!serperConfig || !serperConfig.api_key) {
      toast.error('请先在"API配置"Tab 中配置 SERPER_API_KEY');
      return;
    }

    setTripleLoading(true);

    // 创建任务记录
    let taskId: string | null = null;
    try {
      const { data: taskData, error: taskError } = await supabase
        .from('tiktok_collection_tasks')
        .insert({
          task_type: 'google_shopee_tiktok_fusion',
          status: 'running',
          progress: 0,
          countries: tripleCountries,
          provider: 'triple_platform',
          started_at: new Date().toISOString(),
          items_collected: 0,
          items_total: tripleCountries.length * 10,
          keyword: tripleKeyword,
        })
        .select()
        .single();

      if (taskError) {
        console.error('Failed to create task:', taskError);
        toast.error('创建任务记录失败', {
          description: `错误: ${taskError.message}`
        });
      } else {
        taskId = taskData.id;
        console.log('Task created:', taskId);
        await loadTasks();
      }
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('创建任务记录异常', {
        description: (error as Error).message
      });
    }

    try {
      toast.info('正在融合采集 Google + Shopee + TikTok 数据...', {
        description: `关键词: ${tripleKeyword}, 国家: ${tripleCountries.join(', ')}`
      });

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://cqsqedvhhnyhwxakujyf.supabase.co";
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxc3FlZHZoaG55aHd4YWt1anlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMjM5NjEsImV4cCI6MjA4NTY5OTk2MX0.4xJbf6fTBqsd4xagMcUuibW7XAeT-vf5UZWXAXvyhds";

      const response = await fetch(`${supabaseUrl}/functions/v1/triple-fusion-v2`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keyword: tripleKeyword,
          countries: tripleCountries,
          limit: 10
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const responseData = await response.json();

      if (!responseData.success) {
        throw new Error(responseData.error || '三平台融合采集失败');
      }

      toast.success('三平台融合采集成功!', {
        description: `
          Google 商品: ${responseData.googleCount} 个
          Shopee 商品: ${responseData.shopeeCount} 个
          TikTok 趋势: ${responseData.tiktokTrendsCount} 个
          融合生成: ${responseData.fusedCount} 个商品
          平均评分: ${responseData.avgFusionScore}/100
        `
      });

      // 更新任务记录为完成状态
      if (taskId) {
        try {
          await supabase
            .from('tiktok_collection_tasks')
            .update({
              status: 'completed',
              progress: 100,
              completed_at: new Date().toISOString(),
              items_collected: responseData.fusedCount,
              fusion_score: parseFloat(responseData.avgFusionScore) || 0,
            })
            .eq('id', taskId);
        } catch (error) {
          console.error('Error updating task:', error);
        }
      }

      await loadTasks();

    } catch (error) {
      console.error('Triple fusion collection error:', error);

      if (taskId) {
        try {
          await supabase
            .from('tiktok_collection_tasks')
            .update({
              status: 'failed',
              completed_at: new Date().toISOString(),
              error_message: (error as Error).message || '未知错误',
            })
            .eq('id', taskId);
        } catch (updateError) {
          console.error('Error updating failed task:', updateError);
        }
      }

      toast.error('三平台融合采集失败', {
        description: (error as Error).message || '请检查 SERPER_API_KEY 配置'
      });
    } finally {
      setTripleLoading(false);
    }
  };

  // 查询配额
  const checkQuota = async () => {
    try {
      const { data, error } = await supabase
        .from('api_usage_log')
        .select('service, count')
        .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());

      if (error) throw error;

      const usage = {
        scraperApi: 0,
        rapidApi: 0
      };

      data?.forEach((log: { service: string; count: number }) => {
        if (log.service === 'scraperapi') {
          usage.scraperApi += log.count;
        } else if (log.service === 'rapidapi') {
          usage.rapidApi += log.count;
        }
      });

      setQuota({
        scraperApi: Math.max(0, 1000 - usage.scraperApi),
        rapidApi: Math.max(0, 500 - usage.rapidApi)
      });

    } catch (error) {
      console.error('Error checking quota:', error);
    }
  };

  useEffect(() => {
    loadConfigs();
    loadTasks();

    // 实时监听任务更新
    const channel = supabase
      .channel('collection_tasks')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'tiktok_collection_tasks' }, 
        () => {
          loadTasks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 保存API配置
  const saveAPIConfig = async (provider: 'echotik' | 'fastmoss', apiKey?: string, username?: string, password?: string) => {
    setSavingConfig(provider);
    try {
      if (provider === 'echotik') {
        if (!apiKey || apiKey === '••••••••••••••••') {
          toast.error('请输入有效的API密钥');
          return;
        }
        const { error } = await supabase
          .from('tiktok_api_configs')
          .upsert({
            provider,
            api_key: apiKey,
            auth_type: 'api_key',
            is_active: true,
          }, {
            onConflict: 'provider'
          });

        if (error) throw error;
        toast.success('EchoTik API密钥保存成功');
      } else {
        // FastMoss 使用账号密码
        if (!username || !password) {
          toast.error('请输入用户名和密码');
          return;
        }
        const { error } = await supabase
          .from('tiktok_api_configs')
          .upsert({
            provider,
            username,
            password_encrypted: password, // 实际应该加密，这里简化处理
            auth_type: 'credentials',
            is_active: true,
          }, {
            onConflict: 'provider'
          });

        if (error) throw error;
        toast.success('FastMoss账号配置保存成功');
      }
      
      loadConfigs();
    } catch (error) {
      console.error('Error saving config:', error);
      toast.error('保存配置失败');
    } finally {
      setSavingConfig(null);
    }
  };

  // 开始数据采集
  const startCollection = async (provider: 'echotik' | 'fastmoss') => {
    const config = configs.find(c => c.provider === provider && c.is_active);
    if (!config) {
      toast.error(`请先配置${provider === 'echotik' ? 'EchoTik' : 'FastMoss'} API密钥`);
      return;
    }

    setLoading(true);
    try {
      // 创建采集任务
      const { data: task, error: taskError } = await supabase
        .from('tiktok_collection_tasks')
        .insert({
          task_type: 'products',
          provider,
          countries: ['VN', 'TH', 'MY', 'SG'],
          categories: [],
          items_total: 100,
        })
        .select()
        .single();

      if (taskError) throw taskError;

      toast.success('数据采集任务已创建');

      // 根据provider调用不同的Edge Function
      const functionName = provider === 'fastmoss' ? 'fastmoss-scraper' : 'collect-tiktok-data';

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://cqsqedvhhnyhwxakujyf.supabase.co";
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxc3FlZHZoaG55aHd4YWt1anlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMjM5NjEsImV4cCI6MjA4NTY5OTk2MX0.4xJbf6fTBqsd4xagMcUuibW7XAeT-vf5UZWXAXvyhds";

      const response = await fetch(`${supabaseUrl}/functions/v1/${functionName}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskId: task.id,
          provider,
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Function error:', errorText);
        toast.error('启动采集任务失败');
      } else {
        console.log('采集任务已启动');
      }

      loadTasks();
    } catch (error) {
      console.error('Error starting collection:', error);
      toast.error('创建采集任务失败');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'running':
        return <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      pending: 'secondary',
      running: 'default',
      completed: 'default',
      failed: 'destructive',
    };
    return (
      <Badge variant={variants[status] || 'secondary'}>
        {status === 'pending' && '等待中'}
        {status === 'running' && '采集中'}
        {status === 'completed' && '已完成'}
        {status === 'failed' && '失败'}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">数据采集</h1>
        <p className="text-muted-foreground">
          配置EchoTik和FastMoss API密钥，开始采集TikTok商品数据
        </p>
      </div>

      <Tabs defaultValue="realapi" className="w-full">
        <TabsList className="grid w-full max-w-5xl grid-cols-5">
          <TabsTrigger value="realapi">
            <Zap className="h-4 w-4 mr-2" />
            真实API
          </TabsTrigger>
          <TabsTrigger value="fusion">
            <ShoppingBag className="h-4 w-4 mr-2" />
            双平台融合
          </TabsTrigger>
          <TabsTrigger value="triple">
            <Database className="h-4 w-4 mr-2" />
            三平台融合
          </TabsTrigger>
          <TabsTrigger value="config">API配置</TabsTrigger>
          <TabsTrigger value="tasks">采集任务</TabsTrigger>
        </TabsList>

        {/* 真实API采集 */}
        <TabsContent value="realapi" className="space-y-6">
          <Alert className="bg-blue-50 border-blue-200">
            <Zap className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-900">
              <div className="space-y-2">
                <p className="font-semibold">✨ 智能API路由系统</p>
                <p className="text-sm">
                  自动选择最优数据源：优先使用免费额度（ScraperAPI 1000次/月 + RapidAPI 500次/月），
                  用完后自动切换到付费（¥0.01/次），确保成本最低。
                </p>
                {quota && (
                  <div className="flex gap-4 mt-3 text-sm">
                    <Badge variant="outline" className="bg-white">
                      ScraperAPI: {quota.scraperApi}/1000 剩余
                    </Badge>
                    <Badge variant="outline" className="bg-white">
                      RapidAPI: {quota.rapidApi}/500 剩余
                    </Badge>
                  </div>
                )}
              </div>
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                快速数据采集
              </CardTitle>
              <CardDescription>
                输入关键词和目标国家，立即获取真实的TikTok商品数据
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="realapi-keyword">搜索关键词</Label>
                  <Input
                    id="realapi-keyword"
                    placeholder="例如: jewelry, watch, sunglasses"
                    value={realApiKeyword}
                    onChange={(e) => setRealApiKeyword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="realapi-country">目标国家</Label>
                  <Select value={realApiCountry} onValueChange={setRealApiCountry}>
                    <SelectTrigger id="realapi-country">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRY_LIST.map(country => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.flag} {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  onClick={handleRealApiCollection}
                  disabled={realApiLoading || !realApiKeyword.trim()}
                  className="flex-1"
                  size="lg"
                >
                  {realApiLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      采集中...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      开始采集
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={checkQuota}
                  size="lg"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  查询配额
                </Button>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-2">
                  <DollarSign className="h-4 w-4 mt-0.5 text-green-600" />
                  <div className="flex-1 text-sm">
                    <p className="font-semibold mb-1">成本预估</p>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• 前1000次: 完全免费（ScraperAPI）</li>
                      <li>• 1000-1500次: 完全免费（RapidAPI）</li>
                      <li>• 超过1500次: ¥0.01/次</li>
                      <li>• 每次采集约返回10个商品</li>
                    </ul>
                  </div>
                </div>
              </div>

              {quota && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      <p className="font-semibold">本月配额使用情况</p>
                      <div className="space-y-2 mt-2">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>ScraperAPI</span>
                            <span>{1000 - quota.scraperApi}/1000 已使用</span>
                          </div>
                          <Progress 
                            value={((1000 - quota.scraperApi) / 1000) * 100} 
                            className="h-2"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>RapidAPI</span>
                            <span>{500 - quota.rapidApi}/500 已使用</span>
                          </div>
                          <Progress 
                            value={((500 - quota.rapidApi) / 500) * 100} 
                            className="h-2"
                          />
                        </div>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>📚 使用说明</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="font-semibold mb-1">1. 首次使用需要配置API密钥：</p>
                <p className="text-muted-foreground pl-4">
                  • 注册 ScraperAPI: https://www.scraperapi.com/signup (1000次/月免费)<br />
                  • 注册 RapidAPI: https://rapidapi.com/ (500次/月免费)<br />
                  • 在Supabase Dashboard中配置密钥
                </p>
              </div>
              <div>
                <p className="font-semibold mb-1">2. 开始采集：</p>
                <p className="text-muted-foreground pl-4">
                  • 输入关键词（如jewelry、watch等）<br />
                  • 选择目标国家<br />
                  • 点击"开始采集"按钮
                </p>
              </div>
              <div>
                <p className="font-semibold mb-1">3. 系统自动：</p>
                <p className="text-muted-foreground pl-4">
                  • 选择最优数据源（优先免费额度）<br />
                  • 采集并保存商品数据<br />
                  • 记录使用量和成本<br />
                  • 在"商品数据"页面查看结果
                </p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mt-4">
                <p className="text-yellow-900 text-sm">
                  💡 <strong>提示</strong>: 如果未配置API密钥，系统会自动使用模拟数据，依然可以测试所有功能。
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shopee+TikTok 融合采集 */}
        <TabsContent value="fusion" className="space-y-6">
          <Alert className="bg-green-50 border-green-200">
            <ShoppingBag className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-900">
              <div className="space-y-2">
                <p className="font-semibold">✨ Shopee + TikTok Creative Center 数据融合</p>
                <p className="text-sm">
                  实时爬取 Shopee 电商数据（价格、销量、评价）+ TikTok Creative Center 趋势数据，
                  通过融合算法找出"Shopee热销 + TikTok流行"的高潜力商品。
                </p>
                <p className="text-sm">
                  <strong>优势：</strong>真实电商数据 + 官方趋势验证，无需 API 密钥，完全免费！
                </p>
              </div>
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Shopee + TikTok 融合采集
              </CardTitle>
              <CardDescription>
                输入关键词和目标国家，自动融合 Shopee 和 TikTok 数据
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fusion-keyword">搜索关键词</Label>
                <Input
                  id="fusion-keyword"
                  placeholder="例如: jewelry, watch, sunglasses"
                  value={fusionKeyword}
                  onChange={(e) => setFusionKeyword(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>选择国家（可多选）</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {COUNTRY_LIST.map(country => (
                    <div key={country.code} className="flex items-center space-x-2">
                      <Checkbox
                        id={`fusion-${country.code}`}
                        checked={fusionCountries.includes(country.code)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFusionCountries([...fusionCountries, country.code]);
                          } else {
                            setFusionCountries(fusionCountries.filter(c => c !== country.code));
                          }
                        }}
                      />
                      <label
                        htmlFor={`fusion-${country.code}`}
                        className="text-sm cursor-pointer"
                      >
                        {country.flag} {country.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  onClick={handleFusionCollection}
                  disabled={fusionLoading || !fusionKeyword.trim() || fusionCountries.length === 0}
                  className="flex-1"
                  size="lg"
                >
                  {fusionLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      融合采集中...
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      开始融合采集
                    </>
                  )}
                </Button>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-2">
                  <ShoppingBag className="h-4 w-4 mt-0.5 text-green-600" />
                  <div className="flex-1 text-sm">
                    <p className="font-semibold mb-1">数据融合说明</p>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• <strong>Shopee 数据：</strong>真实价格、销量、评分、评价数</li>
                      <li>• <strong>TikTok 数据：</strong>流行趋势、热门话题标签</li>
                      <li>• <strong>融合评分：</strong>综合销量(40分) + 评分(20分) + 趋势(30分) + 价格(10分)</li>
                      <li>• <strong>高潜力商品：</strong>评分 > 60 分的商品优先推荐</li>
                      <li>• <strong>支持国家：</strong>越南、泰国、马来西亚、新加坡</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>📊 融合评分算法</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold mb-2">评分维度（总分 100 分）</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>📈 <strong>Shopee 销量：</strong>0-40 分</li>
                    <li>⭐ <strong>Shopee 评分：</strong>0-20 分</li>
                    <li>🔥 <strong>TikTok 趋势：</strong>0-30 分</li>
                    <li>💰 <strong>价格竞争力：</strong>0-10 分</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-2">高潜力商品标准</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>✅ 融合评分 ≥ 60 分</li>
                    <li>✅ Shopee 销量 ≥ 1000</li>
                    <li>✅ Shopee 评分 ≥ 4.0</li>
                    <li>✅ TikTok 趋势匹配 ≥ 2 个</li>
                    <li>✅ 价格在 10-50 美元</li>
                  </ul>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded p-3 mt-2">
                <p className="text-blue-900 text-sm">
                  💡 <strong>提示</strong>: 融合评分综合考虑了电商表现和社交媒体热度，
                  评分越高表示该商品在 Shopee 和 TikTok 上都表现出色，是高潜力选品目标。
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 三平台融合采集 (Google + Shopee + TikTok) */}
        <TabsContent value="triple" className="space-y-6">
          <Alert className="bg-purple-50 border-purple-200">
            <Database className="h-4 w-4 text-purple-600" />
            <AlertDescription className="text-purple-900">
              <div className="space-y-2">
                <p className="font-semibold">✨ Google Shopping + Shopee + TikTok 三平台融合</p>
                <p className="text-sm">
                  整合全球三大平台数据：Google Shopping（全球价格基准）+ Shopee（本地销量）+ TikTok（社交热度），
                  找出"价差套利 + 社交爆火"的超级机会商品。
                </p>
                <p className="text-sm">
                  <strong>优势：</strong>全球比价发现套利机会 + 真实销量验证 + TikTok 爆发式流量加持！
                </p>
                <div className="bg-yellow-100 border border-yellow-300 rounded p-2 mt-2">
                  <p className="text-yellow-900 text-xs">
                    ⚠️ <strong>需要配置：</strong>SERPER_API_KEY（Google Shopping API），
                    请前往 <strong>"API配置"</strong> Tab 进行配置，
                    <a href="https://serper.dev/" target="_blank" rel="noopener noreferrer" className="underline font-semibold">点击注册免费获取 2500 次/月</a>
                  </p>
                </div>
              </div>
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                三平台融合采集
              </CardTitle>
              <CardDescription>
                整合 Google Shopping、Shopee、TikTok 三大平台数据
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="triple-keyword">搜索关键词</Label>
                <Input
                  id="triple-keyword"
                  placeholder="例如: sunglasses, jewelry, watch"
                  value={tripleKeyword}
                  onChange={(e) => setTripleKeyword(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>选择国家（可多选）</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {COUNTRY_LIST.map(country => (
                    <div key={country.code} className="flex items-center space-x-2">
                      <Checkbox
                        id={`triple-${country.code}`}
                        checked={tripleCountries.includes(country.code)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setTripleCountries([...tripleCountries, country.code]);
                          } else {
                            setTripleCountries(tripleCountries.filter(c => c !== country.code));
                          }
                        }}
                      />
                      <Label
                        htmlFor={`triple-${country.code}`}
                        className="text-sm cursor-pointer"
                      >
                        {country.flag} {country.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleTripleFusionCollection}
                disabled={tripleLoading || !tripleKeyword.trim() || tripleCountries.length === 0}
                className="w-full"
                size="lg"
              >
                {tripleLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    融合采集中...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    开始三平台融合采集
                  </>
                )}
              </Button>

              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-2">
                  <DollarSign className="h-4 w-4 mt-0.5 text-purple-600" />
                  <div className="flex-1 text-sm">
                    <p className="font-semibold mb-1">三平台融合优势</p>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• <strong>Google Shopping：</strong>全球价格基准，发现套利机会</li>
                      <li>• <strong>Shopee 数据：</strong>本地销量、评价、供应商信息</li>
                      <li>• <strong>TikTok 数据：</strong>流行趋势、热门话题标签</li>
                      <li>• <strong>融合评分：</strong>销量(25分) + 评分(20分) + 趋势(30分) + 价差(25分)</li>
                      <li>• <strong>套利机会：</strong>识别 Google 高价 + Shopee 低价的商品</li>
                      <li>• <strong>爆发潜力：</strong>TikTok 趋势验证，社交传播力强</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>📊 套利机会识别算法</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold mb-2">融合评分维度（总分 100 分）</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>📈 <strong>Shopee 销量：</strong>0-25 分</li>
                    <li>⭐ <strong>商品评分：</strong>0-20 分</li>
                    <li>🔥 <strong>TikTok 趋势：</strong>0-30 分</li>
                    <li>💰 <strong>价差套利：</strong>0-25 分（最重要）</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-2">套利机会标准</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>✅ 融合评分 ≥ 70 分</li>
                    <li>✅ Google 价格 > Shopee 价格 20%+</li>
                    <li>✅ TikTok 趋势匹配 ≥ 2 个</li>
                    <li>✅ Shopee 评分 ≥ 4.0</li>
                    <li>✅ 利润空间 ≥ 30%</li>
                  </ul>
                </div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded p-3 mt-2">
                <p className="text-purple-900 text-sm">
                  💡 <strong>提示</strong>: 三平台融合不仅考虑电商表现和社交热度，
                  还重点分析价差套利机会。如果发现某商品在 Google Shopping 上价格高，
                  而在 Shopee 上价格低，且在 TikTok 上流行，这就是绝佳的套利机会！
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API配置 */}
        <TabsContent value="config" className="space-y-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              数据来源说明：EchoTik提供免费的TikTok数据分析API，FastMoss需要使用账号登录并通过爬虫采集数据。
              两个数据源可互补使用，提高数据覆盖率。
            </AlertDescription>
          </Alert>

          <div className="grid md:grid-cols-2 gap-6">
            {/* EchoTik配置 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  EchoTik API
                </CardTitle>
                <CardDescription>
                  免费账号，提供TikTok商品和市场数据
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="echotik-key">API密钥</Label>
                  <div className="flex gap-2">
                    <Input
                      id="echotik-key"
                      type="password"
                      placeholder="输入EchoTik API密钥"
                      value={echotikKey}
                      onChange={(e) => setEchotikKey(e.target.value)}
                    />
                    <Button
                      onClick={() => saveAPIConfig('echotik', echotikKey)}
                      disabled={savingConfig === 'echotik'}
                    >
                      {savingConfig === 'echotik' ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Key className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {configs.find(c => c.provider === 'echotik') && (
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
                      <CheckCircle className="h-4 w-4" />
                      已配置
                    </div>
                  </div>
                )}

                <Button
                  className="w-full"
                  onClick={() => startCollection('echotik')}
                  disabled={loading || !configs.find(c => c.provider === 'echotik')}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      启动中...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      开始采集数据
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* FastMoss配置 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  FastMoss 爬虫
                </CardTitle>
                <CardDescription>
                  标准账号登录，通过爬虫采集TikTok Shop数据
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fastmoss-username">用户名/邮箱</Label>
                  <Input
                    id="fastmoss-username"
                    type="text"
                    placeholder="输入FastMoss用户名或邮箱"
                    value={fastmossUsername}
                    onChange={(e) => setFastmossUsername(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fastmoss-password">密码</Label>
                  <Input
                    id="fastmoss-password"
                    type="password"
                    placeholder="输入FastMoss密码"
                    value={fastmossPassword}
                    onChange={(e) => setFastmossPassword(e.target.value)}
                  />
                </div>

                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => saveAPIConfig('fastmoss', undefined, fastmossUsername, fastmossPassword)}
                  disabled={savingConfig === 'fastmoss'}
                >
                  {savingConfig === 'fastmoss' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      保存中...
                    </>
                  ) : (
                    <>
                      <Key className="mr-2 h-4 w-4" />
                      保存账号配置
                    </>
                  )}
                </Button>

                {configs.find(c => c.provider === 'fastmoss') && (
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
                      <CheckCircle className="h-4 w-4" />
                      账号已配置
                    </div>
                  </div>
                )}

                <Button
                  className="w-full"
                  onClick={() => startCollection('fastmoss')}
                  disabled={loading || !configs.find(c => c.provider === 'fastmoss')}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      启动中...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      开始爬取数据
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* SERPER API配置 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  SERPER API (Google Shopping)
                </CardTitle>
                <CardDescription>
                  Google Shopping 数据 API，免费 2500 次/月
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="serper-key">API密钥</Label>
                  <div className="flex gap-2">
                    <Input
                      id="serper-key"
                      type="password"
                      placeholder="输入SERPER API密钥"
                      value={serperKey}
                      onChange={(e) => setSerperKey(e.target.value)}
                    />
                    <Button
                      onClick={() => saveAPIConfig('serper', serperKey)}
                      disabled={savingConfig === 'serper'}
                    >
                      {savingConfig === 'serper' ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Key className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    获取地址：<a href="https://serper.dev/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">https://serper.dev/</a>
                    （免费 2500 次/月）
                  </p>
                </div>

                {configs.find(c => c.provider === 'serper') && (
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
                      <CheckCircle className="h-4 w-4" />
                      已配置
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 采集任务 */}
        <TabsContent value="tasks" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">最近任务</h3>
            <Button variant="outline" size="sm" onClick={loadTasks}>
              <RefreshCw className="h-4 w-4 mr-2" />
              刷新
            </Button>
          </div>

          {tasks.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                暂无采集任务，请先配置API密钥并开始采集
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <Card key={task.id}>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(task.status)}
                          <div>
                            <div className="font-medium">
                              {task.task_type === 'google_shopee_tiktok_fusion' ? '三平台融合 (Google+Shopee+TikTok)' :
                               task.provider === 'echotik' ? 'EchoTik' :
                               task.provider === 'fastmoss' ? 'FastMoss' :
                               task.provider === 'shopee_tiktok' ? 'Shopee+TikTok 融合' :
                               task.provider === 'triple_platform' ? '三平台融合 (Google+Shopee+TikTok)' :
                               task.task_type === 'shopee_tiktok_fusion' ? 'Shopee+TikTok 融合' :
                               '数据采集'}
                              {task.keyword && ` - ${task.keyword}`}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(task.created_at).toLocaleString('zh-CN')}
                              {task.countries && task.countries.length > 0 && (
                                <span className="ml-2">
                                  {task.countries.map(c => {
                                    const country = COUNTRY_LIST.find(cl => cl.value === c);
                                    return country ? country.flag : c;
                                  }).join(' ')}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        {getStatusBadge(task.status)}
                      </div>

                      {task.status === 'running' && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">进度</span>
                            <span className="font-medium">
                              {task.items_collected} / {task.items_total}
                            </span>
                          </div>
                          <Progress value={task.progress} />
                        </div>
                      )}

                      {task.status === 'completed' && (
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">
                            已采集 {task.items_collected} 个商品
                          </div>
                          {task.fusion_score && (
                            <div className="flex items-center gap-2 text-sm">
                              <Badge variant="outline" className="bg-green-50">
                                融合评分: {task.fusion_score}/100
                              </Badge>
                            </div>
                          )}
                        </div>
                      )}

                      {task.status === 'failed' && task.error_message && (
                        <Alert variant="destructive">
                          <AlertDescription className="text-sm">
                            {task.error_message}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
