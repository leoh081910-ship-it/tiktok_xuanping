import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Sparkles,
  TrendingUp,
  DollarSign,
  Target,
  Trophy,
  Star,
  ArrowRight,
  Package,
  AlertCircle,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { COUNTRIES } from '@/lib/constants';
import { toast } from 'sonner';

interface Product {
  id: string;
  product_id: string;
  name: string;
  price: Record<string, unknown>;
  sales: Record<string, unknown>;
  growth: Record<string, unknown>;
  competition: Record<string, unknown>;
  category: Record<string, unknown>;
  images: string[];
  countries: string[];
  profit_margin: number;
}

interface Recommendation {
  product: Product;
  score: number;
  reasons: string[];
  targetMarkets: string[];
  estimatedProfit: number;
}

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState<Record<string, Recommendation[]>>({
    highProfit: [],
    lowCompetition: [],
    trending: [],
    aiPicks: [],
  });
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('aiPicks');

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      // 从数据库获取所有商品
      const { data: products, error } = await supabase
        .from('tiktok_products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!products || products.length === 0) {
        setLoading(false);
        return;
      }

      // 计算各类推荐
      const allProducts = products as Product[];

      setRecommendations({
        highProfit: calculateHighProfitRecommendations(allProducts),
        lowCompetition: calculateLowCompetitionRecommendations(allProducts),
        trending: calculateTrendingRecommendations(allProducts),
        aiPicks: calculateAIPicks(allProducts),
      });
    } catch (error) {
      console.error('Error loading recommendations:', error);
      toast.error('加载推荐失败');
    } finally {
      setLoading(false);
    }
  };

  // 高利润商品推荐
  const calculateHighProfitRecommendations = (products: Product[]): Recommendation[] => {
    return products
      .filter(p => p.profit_margin > 30)
      .sort((a, b) => b.profit_margin - a.profit_margin)
      .slice(0, 10)
      .map(product => {
        const price = product.price as Record<string, unknown>;
        const sales = product.sales as Record<string, unknown>;
        const profit = (Number(price.value) || 0) * (product.profit_margin / 100) * (Number(sales.monthly) || 0);

        return {
          product,
          score: product.profit_margin,
          reasons: [
            `利润率高达 ${product.profit_margin}%`,
            `月利润估算 $${profit.toFixed(0)}`,
            '市场需求稳定',
          ],
          targetMarkets: product.countries,
          estimatedProfit: profit,
        };
      });
  };

  // 低竞争商品推荐
  const calculateLowCompetitionRecommendations = (products: Product[]): Recommendation[] => {
    return products
      .filter(p => {
        const competition = p.competition as Record<string, unknown>;
        return competition.level === 'low' || competition.level === 'medium';
      })
      .sort((a, b) => {
        const growthA = a.growth as Record<string, unknown>;
        const growthB = b.growth as Record<string, unknown>;
        return Number(growthB.rate) - Number(growthA.rate);
      })
      .slice(0, 10)
      .map(product => {
        const competition = product.competition as Record<string, unknown>;
        const growth = product.growth as Record<string, unknown>;

        return {
          product,
          score: Number(growth.rate) || 0,
          reasons: [
            `${competition.level === 'low' ? '低' : '中等'}竞争度`,
            `增长率 +${growth.rate}%`,
            '市场空间大',
          ],
          targetMarkets: product.countries,
          estimatedProfit: 0,
        };
      });
  };

  // 热门趋势商品推荐
  const calculateTrendingRecommendations = (products: Product[]): Recommendation[] => {
    return products
      .filter(p => {
        const growth = p.growth as Record<string, unknown>;
        return growth.trend === 'up' && Number(growth.rate) > 30;
      })
      .sort((a, b) => {
        const salesA = a.sales as Record<string, unknown>;
        const salesB = b.sales as Record<string, unknown>;
        return Number(salesB.monthly) - Number(salesA.monthly);
      })
      .slice(0, 10)
      .map(product => {
        const growth = product.growth as Record<string, unknown>;
        const sales = product.sales as Record<string, unknown>;

        return {
          product,
          score: Number(growth.rate) || 0,
          reasons: [
            `快速增长 +${growth.rate}%`,
            `月销量 ${(sales.monthly as number).toLocaleString()}`,
            '热门趋势',
          ],
          targetMarkets: product.countries,
          estimatedProfit: 0,
        };
      });
  };

  // AI智能选品（综合评分）
  const calculateAIPicks = (products: Product[]): Recommendation[] => {
    return products
      .map(product => {
        const price = product.price as Record<string, unknown>;
        const sales = product.sales as Record<string, unknown>;
        const growth = product.growth as Record<string, unknown>;
        const competition = product.competition as Record<string, unknown>;

        // 综合评分算法
        let score = 0;

        // 利润率权重 (30%)
        score += (product.profit_margin / 100) * 30;

        // 销量权重 (25%)
        const monthlySales = Number(sales.monthly) || 0;
        score += Math.min(monthlySales / 1000, 1) * 25;

        // 增长率权重 (25%)
        const growthRate = Number(growth.rate) || 0;
        score += Math.min(growthRate / 100, 1) * 25;

        // 竞争度权重 (20%)
        if (competition.level === 'low') score += 20;
        else if (competition.level === 'medium') score += 10;

        const profit = (Number(price.value) || 0) * (product.profit_margin / 100) * monthlySales;

        return {
          product,
          score: Math.round(score),
          reasons: [
            `综合评分 ${Math.round(score)}/100`,
            `利润率 ${product.profit_margin}%`,
            `月销量 ${monthlySales.toLocaleString()}`,
            growth.trend === 'up' ? `增长趋势 +${growthRate}%` : '稳定',
            competition.level === 'low' ? '低竞争' : competition.level === 'medium' ? '中等竞争' : '高竞争',
          ].slice(0, 3),
          targetMarkets: product.countries,
          estimatedProfit: profit,
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  };

  const renderRecommendationCard = (item: Recommendation) => {
    const { product, score, reasons, targetMarkets } = item;
    const price = product.price as Record<string, unknown>;
    const sales = product.sales as Record<string, unknown>;
    const growth = product.growth as Record<string, unknown>;
    const competition = product.competition as Record<string, unknown>;

    return (
      <Card key={product.id} className="hover:shadow-lg transition-shadow">
        <CardContent className="p-4">
          <div className="flex gap-4">
            {/* 商品图片 */}
            <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* 商品信息 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="font-semibold line-clamp-2">{product.name}</h4>
                <Badge className="flex-shrink-0">
                  {score >= 80 ? '强烈推荐' : score >= 60 ? '推荐' : '可考虑'}
                </Badge>
              </div>

              {/* 推荐理由 */}
              <div className="space-y-1 mb-3">
                {reasons.map((reason, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Star className="h-3 w-3 text-yellow-500 flex-shrink-0" />
                    <span className="text-muted-foreground">{reason}</span>
                  </div>
                ))}
              </div>

              {/* 底部信息 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-primary">
                    ${Number(price.value).toFixed(2)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    月销量 {Number(sales.monthly).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {targetMarkets.slice(0, 3).map(code => (
                    <span key={code} className="text-lg">
                      {COUNTRIES[code]?.flag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-6 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  // 检查是否有数据
  const hasData = Object.values(recommendations).some(list => list.length > 0);

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
          <Sparkles className="h-8 w-8 text-primary" />
          智能推荐
        </h1>
        <p className="text-muted-foreground">
          基于AI算法和数据分析，为您推荐最具潜力的商品
        </p>
      </div>

      {!hasData ? (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <AlertCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">暂无推荐数据</h3>
            <p className="text-muted-foreground mb-6">
              请先采集商品数据，AI将基于数据为您生成智能推荐
            </p>
            <Button asChild>
              <a href="/data-collection">开始采集数据</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="aiPicks" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              AI精选
            </TabsTrigger>
            <TabsTrigger value="highProfit" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              高利润
            </TabsTrigger>
            <TabsTrigger value="lowCompetition" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              低竞争
            </TabsTrigger>
            <TabsTrigger value="trending" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              热门趋势
            </TabsTrigger>
          </TabsList>

          {/* AI精选推荐 */}
          <TabsContent value="aiPicks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>AI智能精选</CardTitle>
                <CardDescription>
                  综合利润率、销量、增长率、竞争度等多维度分析，为您精选最佳商品
                </CardDescription>
              </CardHeader>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.aiPicks.map(item => renderRecommendationCard(item))}
            </div>
          </TabsContent>

          {/* 高利润推荐 */}
          <TabsContent value="highProfit" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>高利润商品</CardTitle>
                <CardDescription>
                  利润率超过30%的商品，帮助您实现更高的盈利空间
                </CardDescription>
              </CardHeader>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.highProfit.map(item => renderRecommendationCard(item))}
            </div>
          </TabsContent>

          {/* 低竞争推荐 */}
          <TabsContent value="lowCompetition" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>低竞争蓝海商品</CardTitle>
                <CardDescription>
                  竞争度低且增长快速的商品，更容易获得成功
                </CardDescription>
              </CardHeader>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.lowCompetition.map(item => renderRecommendationCard(item))}
            </div>
          </TabsContent>

          {/* 热门趋势推荐 */}
          <TabsContent value="trending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>热门趋势商品</CardTitle>
                <CardDescription>
                  增长率超过30%的快速上升商品，抓住市场机遇
                </CardDescription>
              </CardHeader>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.trending.map(item => renderRecommendationCard(item))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
