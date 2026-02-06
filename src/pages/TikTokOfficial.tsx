import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  TrendingUp,
  Trophy,
  Search,
  Lightbulb,
  Settings,
  AlertCircle,
  CheckCircle,
  Loader2,
  Sparkles,
  Target,
} from 'lucide-react';
import { COUNTRIES } from '@/lib/constants';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function TikTokOfficial() {
  const [selectedCountry, setSelectedCountry] = useState('VN');
  const [opportunities, setOpportunities] = useState<Record<string, unknown>[]>([]);
  const [rankings, setRankings] = useState<Record<string, Record<string, unknown>[]>>({});
  const [keywords, setKeywords] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(false);
  const [configuredAccounts, setConfiguredAccounts] = useState<Record<string, boolean>>({});
  const [checkingAccount, setCheckingAccount] = useState(true);
  const [dataCollected, setDataCollected] = useState({
    opportunities: false,
    rankings: false,
    keywords: false,
  });

  // 检查所有国家的TikTok账号配置
  useEffect(() => {
    checkTikTokAccounts();
  }, []);

  // 切换国家时清空数据状态
  useEffect(() => {
    setDataCollected({
      opportunities: false,
      rankings: false,
      keywords: false,
    });
    setOpportunities([]);
    setRankings({});
    setKeywords([]);
  }, [selectedCountry]);

  const checkTikTokAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from('tiktok_accounts')
        .select('countries, is_active')
        .eq('is_active', true);

      if (!error && data) {
        const accounts: Record<string, boolean> = {};
        // 遍历所有账号，将其支持的国家标记为已配置
        data.forEach((acc: { countries: string[]; is_active: boolean }) => {
          if (acc.countries && Array.isArray(acc.countries)) {
            acc.countries.forEach((country: string) => {
              accounts[country] = acc.is_active;
            });
          }
        });
        setConfiguredAccounts(accounts);
      }
    } catch (error) {
      console.error('Check accounts error:', error);
    } finally {
      setCheckingAccount(false);
    }
  };

  // 加载热门商机
  const loadOpportunities = async () => {
    setLoading(true);
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://cqsqedvhhnyhwxakujyf.supabase.co";
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxc3FlZHZoaG55aHd4YWt1anlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMjM5NjEsImV4cCI6MjA4NTY5OTk2MX0.4xJbf6fTBqsd4xagMcUuibW7XAeT-vf5UZWXAXvyhds";

      const response = await fetch(`${supabaseUrl}/functions/v1/tiktok-shop-official`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dataType: 'opportunities', country: selectedCountry })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      if (data?.noAccount) {
        setOpportunities([]);
        setDataCollected(prev => ({ ...prev, opportunities: false }));
        toast.warning(`${selectedCountry}站点未配置账号`);
        return;
      }

      if (data?.success) {
        setOpportunities(data.data);
        setDataCollected(prev => ({ ...prev, opportunities: true }));
        toast.success('热门商机数据已更新');
      } else {
        throw new Error(data?.error || '未知错误');
      }
    } catch (error) {
      toast.error((error as Error).message || '加载热门商机失败');
    } finally {
      setLoading(false);
    }
  };

  // 加载商品榜单
  const loadRankings = async () => {
    setLoading(true);
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://cqsqedvhhnyhwxakujyf.supabase.co";
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxc3FlZHZoaG55aHd4YWt1anlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMjM5NjEsImV4cCI6MjA4NTY5OTk2MX0.4xJbf6fTBqsd4xagMcUuibW7XAeT-vf5UZWXAXvyhds";

      const response = await fetch(`${supabaseUrl}/functions/v1/tiktok-shop-official`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dataType: 'rankings', country: selectedCountry })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      if (data?.noAccount) {
        setRankings({});
        setDataCollected(prev => ({ ...prev, rankings: false }));
        toast.warning(`${selectedCountry}站点未配置账号`);
        return;
      }

      if (data?.success) {
        setRankings(data.data);
        setDataCollected(prev => ({ ...prev, rankings: true }));
        toast.success('商品榜单数据已更新');
      } else {
        throw new Error(data?.error || '未知错误');
      }
    } catch (error) {
      toast.error((error as Error).message || '加载商品榜单失败');
    } finally {
      setLoading(false);
    }
  };

  // 加载热门关键词
  const loadKeywords = async () => {
    setLoading(true);
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://cqsqedvhhnyhwxakujyf.supabase.co";
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxc3FlZHZoaG55aHd4YWt1anlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMjM5NjEsImV4cCI6MjA4NTY5OTk2MX0.4xJbf6fTBqsd4xagMcUuibW7XAeT-vf5UZWXAXvyhds";

      const response = await fetch(`${supabaseUrl}/functions/v1/tiktok-shop-official`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dataType: 'keywords', country: selectedCountry })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      if (data?.noAccount) {
        setKeywords([]);
        setDataCollected(prev => ({ ...prev, keywords: false }));
        toast.warning(`${selectedCountry}站点未配置账号`);
        return;
      }

      if (data?.success) {
        setKeywords(data.data);
        setDataCollected(prev => ({ ...prev, keywords: true }));
        toast.success('热门关键词数据已更新');
      } else {
        throw new Error(data?.error || '未知错误');
      }
    } catch (error) {
      toast.error((error as Error).message || '加载热门关键词失败');
    } finally {
      setLoading(false);
    }
  };

  // 账号管理对话框 - 支持多国家配置
  const AccountManagementDialog = () => {
    const [accounts, setAccounts] = useState<Array<{
      id: string;
      countries: string[];
      email: string;
      account_name?: string;
      is_active: boolean;
    }>>([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
      countries: ['VN'] as string[],
      accountName: '',
      email: '',
      password: '',
    });
    const [saving, setSaving] = useState(false);
    const [loadingAccounts, setLoadingAccounts] = useState(true);

    const loadAccounts = async () => {
      setLoadingAccounts(true);
      try {
        const { data, error } = await supabase
          .from('tiktok_accounts')
          .select('id, countries, email, account_name, is_active')
          .order('created_at', { ascending: false });

        if (!error && data) {
          setAccounts(data);
        }
      } catch (error) {
        console.error('Load accounts error:', error);
      } finally {
        setLoadingAccounts(false);
      }
    };

    const toggleCountry = (country: string) => {
      setFormData(prev => ({
        ...prev,
        countries: prev.countries.includes(country)
          ? prev.countries.filter(c => c !== country)
          : [...prev.countries, country]
      }));
    };

    const saveAccount = async () => {
      if (!formData.email || !formData.password || formData.countries.length === 0) {
        toast.error('请填写完整信息并至少选择一个国家');
        return;
      }

      setSaving(true);
      try {
        const { error } = await supabase
          .from('tiktok_accounts')
          .insert({
            countries: formData.countries,
            account_name: formData.accountName || `多国家账号`,
            email: formData.email,
            password_encrypted: formData.password, // 实际应用中需要加密
            is_active: true,
          });

        if (error) {
          if (error.message.includes('unique_active_account_email')) {
            toast.error('该邮箱已存在活跃账号');
          } else {
            throw error;
          }
          return;
        }

        toast.success('TikTok账号添加成功');
        setShowAddForm(false);
        setFormData({ countries: ['VN'], accountName: '', email: '', password: '' });
        loadAccounts();
        checkTikTokAccounts();
      } catch (error) {
        toast.error((error as Error).message || '配置失败');
      } finally {
        setSaving(false);
      }
    };

    const toggleAccountStatus = async (id: string, currentStatus: boolean) => {
      try {
        const { error } = await supabase
          .from('tiktok_accounts')
          .update({ is_active: !currentStatus })
          .eq('id', id);

        if (error) throw error;

        toast.success(currentStatus ? '账号已停用' : '账号已启用');
        loadAccounts();
        checkTikTokAccounts();
      } catch (error) {
        toast.error((error as Error).message || '操作失败');
      }
    };

    return (
      <Dialog onOpenChange={(open) => open && loadAccounts()}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            账号管理
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>TikTok Shop账号管理</DialogTitle>
            <DialogDescription>
              配置TikTok Shop商家账号，一个账号可管理多个国家站点
            </DialogDescription>
          </DialogHeader>

          {/* 已配置账号列表 */}
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">已配置账号</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddForm(!showAddForm)}
              >
                {showAddForm ? '取消' : '+ 添加账号'}
              </Button>
            </div>

            {loadingAccounts ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : accounts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">暂无配置账号</p>
              </div>
            ) : (
              <div className="space-y-2">
                {accounts.map((account) => {
                  return (
                    <div
                      key={account.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          {account.countries && account.countries.map((country: string) => {
                            const countryInfo = COUNTRIES[country as keyof typeof COUNTRIES];
                            return (
                              <Badge key={country} variant={account.is_active ? 'default' : 'secondary'}>
                                {countryInfo?.flag} {countryInfo?.name || country}
                              </Badge>
                            );
                          })}
                          {account.account_name && (
                            <span className="text-sm font-medium text-muted-foreground">
                              ({account.account_name})
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{account.email}</p>
                      </div>
                      <Button
                        variant={account.is_active ? 'destructive' : 'default'}
                        size="sm"
                        onClick={() => toggleAccountStatus(account.id, account.is_active)}
                      >
                        {account.is_active ? '停用' : '启用'}
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 添加账号表单 */}
            {showAddForm && (
              <div className="border rounded-lg p-4 space-y-4 bg-muted/50">
                <h4 className="text-sm font-medium">添加新账号</h4>
                
                <div className="space-y-2">
                  <Label>选择可访问的国家站点 * (可多选)</Label>
                  <div className="grid grid-cols-2 gap-2 p-3 border rounded-md bg-background">
                    {Object.entries(COUNTRIES).map(([code, info]) => (
                      <label
                        key={code}
                        className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                          formData.countries.includes(code)
                            ? 'bg-primary/10 border-2 border-primary'
                            : 'bg-muted/50 border-2 border-transparent hover:bg-muted'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.countries.includes(code)}
                          onChange={() => toggleCountry(code)}
                          className="h-4 w-4"
                        />
                        <span className="text-lg">{info.flag}</span>
                        <span className="text-sm font-medium">{info.name}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    已选择 {formData.countries.length} 个国家站点
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountName">账号名称（可选）</Label>
                  <Input
                    id="accountName"
                    placeholder="例如：主账号、测试账号"
                    value={formData.accountName}
                    onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">邮箱/用户名 *</Label>
                  <Input
                    id="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">密码 *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium">账号说明</p>
                      <ul className="text-xs mt-1 space-y-1 list-disc list-inside">
                        <li>一个TikTok账号可以管理多个国家站点</li>
                        <li>在TikTok Shop后台可以切换国家查看不同站点数据</li>
                        <li>建议使用测试账号，确保账号安全</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={saveAccount}
                  disabled={!formData.email || !formData.password || formData.countries.length === 0 || saving}
                  className="w-full"
                >
                  {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  保存账号
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  if (checkingAccount) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground mt-4">检查账号配置...</p>
        </div>
      </div>
    );
  }

  // 检查当前国家是否配置账号
  const currentCountryConfigured = configuredAccounts[selectedCountry];

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            TikTok Shop官方数据
          </h1>
          <p className="text-muted-foreground mt-1">
            实时获取TikTok Shop官方推荐的热门商机和商品榜单
          </p>
        </div>
        <div className="flex items-center gap-2">
          {currentCountryConfigured ? (
            <Badge variant="outline" className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-green-600" />
              {selectedCountry}站点已配置
            </Badge>
          ) : (
            <Badge variant="secondary" className="flex items-center gap-1">
              <AlertCircle className="h-3 w-3 text-orange-600" />
              {selectedCountry}站点未配置
            </Badge>
          )}
          <AccountManagementDialog />
        </div>
      </div>

      {/* 国家选择 */}
      <Tabs value={selectedCountry} onValueChange={setSelectedCountry} className="mb-6">
        <TabsList>
          {Object.entries(COUNTRIES).map(([code, country]) => (
            <TabsTrigger key={code} value={code} className="flex items-center gap-2">
              <span className="text-xl">{country.flag}</span>
              <span>{country.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.keys(COUNTRIES).map(code => (
          <TabsContent key={code} value={code} className="space-y-6">
            <Tabs defaultValue="opportunities" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="opportunities">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  热门商机
                </TabsTrigger>
                <TabsTrigger value="rankings">
                  <Trophy className="h-4 w-4 mr-2" />
                  商品榜单
                </TabsTrigger>
                <TabsTrigger value="keywords">
                  <Search className="h-4 w-4 mr-2" />
                  热门关键词
                </TabsTrigger>
              </TabsList>

              {/* 热门商机 */}
              <TabsContent value="opportunities" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>TikTok推荐商机</CardTitle>
                        <CardDescription>
                          官方推荐的高潜力商品机会
                        </CardDescription>
                      </div>
                      <Button 
                        onClick={loadOpportunities} 
                        disabled={loading || !currentCountryConfigured}
                      >
                        {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        加载数据
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <Skeleton key={i} className="h-48" />
                        ))}
                      </div>
                    ) : opportunities.length > 0 && dataCollected.opportunities ? (
                      <div className="space-y-4">
                        {opportunities.map((opp, index) => (
                          <Card key={index} className="border-l-4 border-l-primary">
                            <CardHeader>
                              <div className="flex items-start justify-between">
                                <div>
                                  <CardTitle className="text-lg">{opp.title}</CardTitle>
                                  <div className="flex gap-2 mt-2">
                                    <Badge>{opp.category}</Badge>
                                    <Badge variant={
                                      opp.competition_level === 'low' ? 'default' :
                                      opp.competition_level === 'medium' ? 'secondary' : 'outline'
                                    }>
                                      {opp.competition_level === 'low' && '低竞争'}
                                      {opp.competition_level === 'medium' && '中竞争'}
                                      {opp.competition_level === 'high' && '高竞争'}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-2xl font-bold text-green-600">+{opp.growth_rate}%</div>
                                  <div className="text-sm text-muted-foreground">增长率</div>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                                    <Target className="h-4 w-4" />
                                    市场数据
                                  </h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">预估月销量</span>
                                      <span className="font-medium">{opp.estimated_sales.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">建议价格</span>
                                      <span className="font-medium">
                                        ${opp.recommended_price_range.min} - ${opp.recommended_price_range.max}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                                    <Lightbulb className="h-4 w-4" />
                                    官方洞察
                                  </h4>
                                  <ul className="space-y-1 text-sm">
                                    {opp.insights.slice(0, 3).map((insight: string, i: number) => (
                                      <li key={i} className="flex items-start gap-2">
                                        <span className="text-primary mt-1">•</span>
                                        <span className="text-muted-foreground">{insight}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                        <h3 className="text-lg font-semibold mb-2">未采集数据</h3>
                        <p className="text-muted-foreground">
                          点击"加载数据"按钮获取热门商机
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 商品榜单 */}
              <TabsContent value="rankings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>TikTok商品榜单</CardTitle>
                        <CardDescription>
                          热销榜、趋势榜、新品榜Top10
                        </CardDescription>
                      </div>
                      <Button 
                        onClick={loadRankings} 
                        disabled={loading || !currentCountryConfigured}
                      >
                        {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        加载数据
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {!currentCountryConfigured ? (
                      <div className="text-center py-12">
                        <AlertCircle className="h-12 w-12 mx-auto text-orange-500 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">未配置账号</h3>
                        <p className="text-muted-foreground mb-6">
                          {COUNTRIES[selectedCountry as keyof typeof COUNTRIES]?.name}站点未配置TikTok Shop账号
                        </p>
                        <AccountManagementDialog />
                      </div>
                    ) : loading ? (
                      <Skeleton className="h-96" />
                    ) : Object.keys(rankings).length > 0 && dataCollected.rankings ? (
                      <Tabs defaultValue="hot_selling">
                        <TabsList className="w-full">
                          <TabsTrigger value="hot_selling" className="flex-1">热销榜</TabsTrigger>
                          <TabsTrigger value="trending" className="flex-1">趋势榜</TabsTrigger>
                          <TabsTrigger value="new_arrivals" className="flex-1">新品榜</TabsTrigger>
                        </TabsList>
                        {Object.entries(rankings).map(([type, products]: [string, Record<string, unknown>[]]) => (
                          <TabsContent key={type} value={type} className="mt-4">
                            <div className="space-y-2">
                              {products?.map((product: Record<string, unknown>, index: number) => (
                                <div key={index} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50">
                                  <div className={`text-2xl font-bold ${
                                    index < 3 ? 'text-yellow-600' : 'text-muted-foreground'
                                  }`}>
                                    #{product.rank}
                                  </div>
                                  <div className="flex-1">
                                    <div className="font-medium">{product.product_name}</div>
                                    <div className="text-sm text-muted-foreground">{product.shop_name}</div>
                                  </div>
                                  <Badge>{product.category}</Badge>
                                  <div className="text-right">
                                    <div className="font-bold">${product.price.toFixed(2)}</div>
                                    <div className="text-sm text-muted-foreground">
                                      {product.sales_volume.toLocaleString()}销量
                                    </div>
                                  </div>
                                  <Badge variant="outline" className="flex items-center gap-1">
                                    <TrendingUp className="h-3 w-3" />
                                    +{product.growth_rate.toFixed(1)}%
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </TabsContent>
                        ))}
                      </Tabs>
                    ) : (
                      <div className="text-center py-12">
                        <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                        <h3 className="text-lg font-semibold mb-2">未采集数据</h3>
                        <p className="text-muted-foreground">
                          点击"加载数据"按钮获取商品榜单
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 热门关键词 */}
              <TabsContent value="keywords" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>热门搜索关键词</CardTitle>
                        <CardDescription>
                          TikTok用户搜索量最高的配件关键词
                        </CardDescription>
                      </div>
                      <Button 
                        onClick={loadKeywords} 
                        disabled={loading || !currentCountryConfigured}
                      >
                        {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        加载数据
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {!currentCountryConfigured ? (
                      <div className="text-center py-12">
                        <AlertCircle className="h-12 w-12 mx-auto text-orange-500 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">未配置账号</h3>
                        <p className="text-muted-foreground mb-6">
                          {COUNTRIES[selectedCountry as keyof typeof COUNTRIES]?.name}站点未配置TikTok Shop账号
                        </p>
                        <AccountManagementDialog />
                      </div>
                    ) : loading ? (
                      <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Skeleton key={i} className="h-32" />
                        ))}
                      </div>
                    ) : keywords.length > 0 && dataCollected.keywords ? (
                      <div className="space-y-3">
                        {keywords.map((kw, index) => (
                          <Card key={index}>
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">{kw.keyword}</CardTitle>
                                <div className="flex items-center gap-4">
                                  <div className="text-right">
                                    <div className="text-sm text-muted-foreground">搜索量</div>
                                    <div className="font-bold">{kw.search_volume.toLocaleString()}</div>
                                  </div>
                                  <Badge variant="default" className="flex items-center gap-1">
                                    <TrendingUp className="h-3 w-3" />
                                    +{kw.growth_rate}%
                                  </Badge>
                                  <Badge variant="outline">
                                    竞争度: {kw.competition_score}
                                  </Badge>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="text-sm font-semibold mb-2">相关关键词</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {kw.related_keywords.map((rel: string, i: number) => (
                                      <Badge key={i} variant="secondary">{rel}</Badge>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <h4 className="text-sm font-semibold mb-2">推荐商品</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {kw.suggested_products.map((prod: string, i: number) => (
                                      <Badge key={i} variant="outline">{prod}</Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                        <h3 className="text-lg font-semibold mb-2">未采集数据</h3>
                        <p className="text-muted-foreground">
                          点击"加载数据"按钮获取热门关键词
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
