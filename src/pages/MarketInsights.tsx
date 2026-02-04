import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { TrendingUp, Users, DollarSign, ShoppingBag, Globe, Target, Search, ArrowUp, ArrowDown, RefreshCw } from 'lucide-react';
import { COUNTRIES, CATEGORIES } from '@/lib/constants';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TrendData {
  keyword: string;
  data: Array<{ date: string; value: number }>;
  avgValue: number;
  trend: string;
  change: number;
}

interface GoogleTrendsData {
  keywords: TrendData[];
  relatedQueries: {
    top: Array<{ query: string; value: number }>;
    rising: Array<{ query: string; value: string }>;
  };
  regionalData: Array<{ region: string; value: number }>;
}

export default function MarketInsights() {
  const [selectedCountry, setSelectedCountry] = useState('VN');
  const [trendsData, setTrendsData] = useState<GoogleTrendsData | null>(null);
  const [trendsLoading, setTrendsLoading] = useState(false);

  // 加载Google Trends数据
  const loadGoogleTrends = useCallback(async (country: string) => {
    setTrendsLoading(true);
    try {
      const keywords = getKeywordsForCountry(country);
      
      const { data, error } = await supabase.functions.invoke('google-trends', {
        body: {
          keywords,
          country,
          timeRange: '3m',
        },
      });

      if (error) throw error;

      if (data?.success) {
        setTrendsData(data.data);
        toast.success('Google搜索趋势数据已更新');
      }
    } catch (error) {
      console.error('Failed to load Google Trends:', error);
      toast.error('加载搜索趋势数据失败');
    } finally {
      setTrendsLoading(false);
    }
  }, []);

  // 当国家改变时加载趋势数据
  useEffect(() => {
    loadGoogleTrends(selectedCountry);
  }, [selectedCountry, loadGoogleTrends]);

  // 根据国家获取关键词
  const getKeywordsForCountry = (country: string) => {
    const keywordsByCountry: Record<string, string[]> = {
      'VN': ['túi xách', 'trang sức', 'đồng hồ'], // 越南语
      'TH': ['กระเป๋า', 'เครื่องประดับ', 'นาฬิกา'], // 泰语
      'MY': ['handbag', 'jewelry', 'watch'], // 马来西亚（英语）
      'SG': ['handbag', 'jewelry', 'watch'], // 新加坡（英语）
    };
    return keywordsByCountry[country] || ['handbag', 'jewelry', 'watch'];
  };

  // 国家市场数据
  const countryData = {
    VN: {
      name: '越南',
      flag: '🇻🇳',
      population: 98000000,
      internetPenetration: 78,
      ecommerceGrowth: 25,
      avgOrderValue: 22,
      fashionAccessoriesMarket: 850000000,
      topCategories: [
        { name: '包包手袋', value: 28, growth: 72 },
        { name: '首饰饰品', value: 25, growth: 68 },
        { name: '发饰头饰', value: 18, growth: 75 },
        { name: '帽子头饰', value: 15, growth: 55 },
        { name: '其他配件', value: 14, growth: 52 },
      ],
      keyInsights: [
        '年轻人口占比高，18-35岁是主力消费群体',
        '社交电商增长迅速，TikTok Shop渗透率领先',
        '对韩国、日本时尚品牌认可度高',
        '价格敏感度中等，追求性价比',
        '摩托车文化盛行，相关配件需求大',
      ],
      popularPayments: ['现金支付', 'MoMo', 'ZaloPay', 'VNPay'],
      bestSellingTimes: [
        { month: '1-2月', reason: '春节购物季' },
        { month: '6-8月', reason: '夏季促销' },
        { month: '11-12月', reason: '双11、圣诞' },
      ],
    },
    TH: {
      name: '泰国',
      flag: '🇹🇭',
      population: 70000000,
      internetPenetration: 82,
      ecommerceGrowth: 22,
      avgOrderValue: 28,
      fashionAccessoriesMarket: 920000000,
      topCategories: [
        { name: '太阳眼镜', value: 30, growth: 62 },
        { name: '包包手袋', value: 26, growth: 72 },
        { name: '手表腕表', value: 20, growth: 58 },
        { name: '首饰饰品', value: 14, growth: 68 },
        { name: '其他配件', value: 10, growth: 45 },
      ],
      keyInsights: [
        '炎热气候，防晒配件需求旺盛',
        '时尚意识强，追求品牌和设计感',
        '本土电商平台发达，Shopee、Lazada市占率高',
        '旅游业带动时尚配件消费',
        '佛教文化影响，宗教饰品市场独特',
      ],
      popularPayments: ['信用卡', 'PromptPay', 'TrueMoney', 'Rabbit LINE Pay'],
      bestSellingTimes: [
        { month: '4月', reason: '泼水节' },
        { month: '7-8月', reason: '暑期旅游季' },
        { month: '12月', reason: '新年购物季' },
      ],
    },
    MY: {
      name: '马来西亚',
      flag: '🇲🇾',
      population: 33000000,
      internetPenetration: 90,
      ecommerceGrowth: 28,
      avgOrderValue: 35,
      fashionAccessoriesMarket: 780000000,
      topCategories: [
        { name: '围巾丝巾', value: 32, growth: 48 },
        { name: '首饰饰品', value: 28, growth: 68 },
        { name: '包包手袋', value: 22, growth: 72 },
        { name: '手表腕表', value: 10, growth: 58 },
        { name: '其他配件', value: 8, growth: 42 },
      ],
      keyInsights: [
        '穆斯林市场占主导，Hijab和清真产品需求大',
        '多元文化，华人、马来人、印度人审美差异大',
        '购买力较强，中高端产品市场潜力大',
        '英语普及率高，国际品牌接受度高',
        '电商基础设施完善，物流效率高',
      ],
      popularPayments: ['在线银行', 'Touch n Go', 'Boost', 'GrabPay'],
      bestSellingTimes: [
        { month: '3-4月', reason: '斋月和开斋节' },
        { month: '8月', reason: '国庆促销' },
        { month: '11-12月', reason: '双11、双12' },
      ],
    },
    SG: {
      name: '新加坡',
      flag: '🇸🇬',
      population: 6000000,
      internetPenetration: 98,
      ecommerceGrowth: 18,
      avgOrderValue: 65,
      fashionAccessoriesMarket: 420000000,
      topCategories: [
        { name: '手表腕表', value: 35, growth: 58 },
        { name: '包包手袋', value: 30, growth: 72 },
        { name: '首饰饰品', value: 20, growth: 68 },
        { name: '太阳眼镜', value: 10, growth: 62 },
        { name: '其他配件', value: 5, growth: 45 },
      ],
      keyInsights: [
        '高收入市场，对品质和品牌要求高',
        '时尚潮流敏感度极高，追求国际大牌',
        '小而精致的市场，竞争激烈',
        '跨境购物习惯成熟，对物流要求高',
        '多元文化融合，产品需国际化',
      ],
      popularPayments: ['PayNow', '信用卡', 'GrabPay', 'Shopee Pay'],
      bestSellingTimes: [
        { month: '5-7月', reason: 'GST促销季' },
        { month: '9-10月', reason: '大型购物节' },
        { month: '11-12月', reason: '圣诞新年' },
      ],
    },
  };

  const currentMarket = countryData[selectedCountry as keyof typeof countryData];

  // 类目增长趋势数据
  const categoryTrendData = CATEGORIES.map(cat => ({
    name: cat.name,
    market: cat.marketSize / 1000000,
    growth: cat.growthRate,
  }));

  // 颜色方案
  const COLORS = ['#4E54C8', '#8F94FB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">市场洞察分析</h1>
        <p className="text-muted-foreground">
          深入了解东南亚时尚配件市场特征和趋势
        </p>
      </div>

      {/* 国家选择标签 */}
      <Tabs value={selectedCountry} onValueChange={setSelectedCountry} className="mb-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          {Object.entries(COUNTRIES).map(([code, country]) => (
            <TabsTrigger key={code} value={code} className="flex items-center gap-2">
              <span className="text-xl">{country.flag}</span>
              <span className="hidden sm:inline">{country.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.keys(COUNTRIES).map(code => (
          <TabsContent key={code} value={code} className="space-y-6">
            {/* 市场概览 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">人口规模</CardTitle>
                  <Users className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(currentMarket.population / 1000000).toFixed(0)}M
                  </div>
                  <p className="text-xs text-muted-foreground">总人口数</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">互联网普及率</CardTitle>
                  <Globe className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{currentMarket.internetPenetration}%</div>
                  <Progress value={currentMarket.internetPenetration} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">电商增长率</CardTitle>
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    +{currentMarket.ecommerceGrowth}%
                  </div>
                  <p className="text-xs text-muted-foreground">年度增长</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">平均客单价</CardTitle>
                  <DollarSign className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${currentMarket.avgOrderValue}</div>
                  <p className="text-xs text-muted-foreground">配件类目</p>
                </CardContent>
              </Card>
            </div>

            {/* Google Trends 搜索趋势 */}
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="h-5 w-5 text-primary" />
                      Google搜索趋势
                    </CardTitle>
                    <CardDescription>
                      时尚配件关键词在{currentMarket.name}的搜索热度变化
                    </CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => loadGoogleTrends(selectedCountry)}
                    disabled={trendsLoading}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${trendsLoading ? 'animate-spin' : ''}`} />
                    刷新数据
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {trendsLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-64 w-full" />
                    <div className="grid grid-cols-3 gap-4">
                      <Skeleton className="h-24" />
                      <Skeleton className="h-24" />
                      <Skeleton className="h-24" />
                    </div>
                  </div>
                ) : trendsData ? (
                  <div className="space-y-6">
                    {/* 关键词趋势对比 */}
                    <div>
                      <h4 className="font-semibold mb-4">搜索热度趋势（过去3个月）</h4>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              dataKey="date" 
                              type="category"
                              allowDuplicatedCategory={false}
                            />
                            <YAxis domain={[0, 100]} label={{ value: '搜索热度', angle: -90, position: 'insideLeft' }} />
                            <Tooltip />
                            <Legend />
                            {trendsData.keywords.map((keyword, index) => (
                              <Line
                                key={keyword.keyword}
                                data={keyword.data}
                                type="monotone"
                                dataKey="value"
                                name={keyword.keyword}
                                stroke={COLORS[index % COLORS.length]}
                                strokeWidth={2}
                                dot={false}
                              />
                            ))}
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* 关键词统计卡片 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {trendsData.keywords.map((keyword, index) => (
                        <Card key={keyword.keyword} className="border-l-4" style={{ borderLeftColor: COLORS[index % COLORS.length] }}>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-base">{keyword.keyword}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">平均热度</span>
                                <span className="text-2xl font-bold">{keyword.avgValue}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">趋势变化</span>
                                <Badge variant={keyword.trend === 'up' ? 'default' : 'secondary'} className="flex items-center gap-1">
                                  {keyword.trend === 'up' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                                  {keyword.change > 0 ? '+' : ''}{keyword.change}%
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* 相关查询和地区分布 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* 相关热门查询 */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">热门相关搜索</CardTitle>
                          <CardDescription>用户同时搜索的关键词</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {trendsData.relatedQueries.top.map((query, index) => (
                              <div key={index} className="flex items-center justify-between">
                                <span className="text-sm">{query.query}</span>
                                <div className="flex items-center gap-2">
                                  <Progress value={query.value} className="w-24 h-2" />
                                  <span className="text-sm text-muted-foreground w-8">{query.value}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* 上升搜索 */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-green-600" />
                            快速上升搜索
                          </CardTitle>
                          <CardDescription>搜索量增长最快的关键词</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {trendsData.relatedQueries.rising.map((query, index) => (
                              <div key={index} className="flex items-center justify-between">
                                <span className="text-sm">{query.query}</span>
                                <Badge variant="default" className="bg-green-600">
                                  {query.value}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* 地区分布 */}
                      <Card className="lg:col-span-2">
                        <CardHeader>
                          <CardTitle className="text-base">地区搜索分布</CardTitle>
                          <CardDescription>{currentMarket.name}各地区搜索热度对比</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {trendsData.regionalData.map((region, index) => (
                              <div key={index} className="flex items-center gap-4">
                                <span className="text-sm font-medium w-32">{region.region}</span>
                                <Progress value={region.value} className="flex-1" />
                                <span className="text-sm text-muted-foreground w-12 text-right">{region.value}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="text-xs text-muted-foreground text-center pt-4 border-t">
                      数据来源：Google Trends • 最后更新：{new Date().toLocaleString('zh-CN')}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    点击"刷新数据"按钮加载Google搜索趋势
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 热门类目 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    热门配件类目
                  </CardTitle>
                  <CardDescription>
                    {currentMarket.name}市场时尚配件类目分布
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={currentMarket.topCategories}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name} ${value}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {currentMarket.topCategories.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    {currentMarket.topCategories.map((cat, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="text-sm">{cat.name}</span>
                        </div>
                        <Badge variant={cat.growth > 60 ? 'default' : 'secondary'}>
                          +{cat.growth}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 关键洞察 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    市场关键洞察
                  </CardTitle>
                  <CardDescription>
                    {currentMarket.name}时尚配件市场特征
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">市场规模</h4>
                      <div className="text-2xl font-bold text-primary">
                        ${(currentMarket.fashionAccessoriesMarket / 1000000).toFixed(0)}M
                      </div>
                      <p className="text-sm text-muted-foreground">时尚配件年度市场</p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">核心洞察</h4>
                      <ul className="space-y-2">
                        {currentMarket.keyInsights.map((insight, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <span className="text-primary mt-1">•</span>
                            <span>{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 支付方式和最佳销售时间 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>主流支付方式</CardTitle>
                  <CardDescription>消费者偏好的支付渠道</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {currentMarket.popularPayments.map((payment, index) => (
                      <Badge key={index} variant="outline" className="text-sm">
                        {payment}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>最佳销售时间</CardTitle>
                  <CardDescription>抓住促销节点提升销量</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentMarket.bestSellingTimes.map((time, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold">{time.month}</div>
                          <div className="text-sm text-muted-foreground">{time.reason}</div>
                        </div>
                        <Badge>热门</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* 类目对比分析 */}
      <Card>
        <CardHeader>
          <CardTitle>时尚配件类目对比</CardTitle>
          <CardDescription>8大配件类目市场规模与增长率分析</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis yAxisId="left" orientation="left" stroke="#4E54C8" />
                <YAxis yAxisId="right" orientation="right" stroke="#10B981" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="market" fill="#4E54C8" name="市场规模 ($M)" />
                <Bar yAxisId="right" dataKey="growth" fill="#10B981" name="增长率 (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
