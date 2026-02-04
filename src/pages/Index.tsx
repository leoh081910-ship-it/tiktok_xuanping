import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Package, 
  Globe,
  ArrowRight,
  BarChart3,
  Database,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { COUNTRIES } from '@/lib/constants';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface Product {
  id: string;
  name: string;
  price: Record<string, unknown>;
  sales: Record<string, unknown>;
  growth: Record<string, unknown>;
  images: string[];
  data_source: string;
}

const Index = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    hotProducts: 0,
    avgGrowth: 42,
    countries: Object.keys(COUNTRIES).length,
  });
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();

    // 实时监听商品数据变化
    const channel = supabase
      .channel('products_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'tiktok_products' }, 
        () => {
          loadData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadData = async () => {
    try {
      // 加载商品统计
      const { count: totalCount } = await supabase
        .from('tiktok_products')
        .select('*', { count: 'exact', head: true });

      // 加载增长商品数
      const { data: growthData } = await supabase
        .from('tiktok_products')
        .select('growth');

      const hotCount = growthData?.filter(p => {
        const growth = p.growth as Record<string, unknown>;
        return growth?.trend === 'up';
      }).length || 0;

      // 计算平均增长率
      const avgGrowth = growthData && growthData.length > 0
        ? Math.round(
            growthData.reduce((acc, p) => {
              const growth = p.growth as Record<string, unknown>;
              return acc + (Number(growth?.rate) || 0);
            }, 0) / growthData.length
          )
        : 42;

      setStats({
        totalProducts: totalCount || 0,
        hotProducts: hotCount,
        avgGrowth,
        countries: Object.keys(COUNTRIES).length,
      });

      // 加载趋势商品
      const { data: products } = await supabase
        .from('tiktok_products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);

      setTrendingProducts(products || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-8 md:p-12 text-white">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              v1.0.0
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              东南亚市场
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            东南亚TikTok选品工具
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8">
            基于EchoTik和FastMoss真实数据，帮助您在越南、泰国、马来西亚、新加坡市场找到最具潜力的爆款商品
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/products">
              <Button size="lg" variant="secondary" className="group">
                开始选品
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/data-collection">
              <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Database className="mr-2 h-4 w-4" />
                数据采集
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              商品总数
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
            )}
            <p className="text-xs text-muted-foreground">
              涵盖8大类目
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              热门商品
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{stats.hotProducts}</div>
            )}
            <p className="text-xs text-muted-foreground">
              增长趋势向上
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              平均增长率
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{stats.avgGrowth}%</div>
            )}
            <p className="text-xs text-muted-foreground">
              月度增长率
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              覆盖市场
            </CardTitle>
            <Globe className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.countries}</div>
            <p className="text-xs text-muted-foreground">
              东南亚核心国家
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
          <Link to="/products">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>浏览商品数据</CardTitle>
              <CardDescription>
                查看热门商品，应用筛选条件，找到最适合的产品
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
          <Link to="/market-insights">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>市场洞察分析</CardTitle>
              <CardDescription>
                了解各国市场特征，把握类目趋势和机会
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
          <Link to="/data-collection">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                <Database className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>数据采集配置</CardTitle>
              <CardDescription>
                配置EchoTik和FastMoss API，开始采集数据
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>
      </div>

      {/* Trending Products */}
      {trendingProducts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold">最新商品</h2>
              <p className="text-muted-foreground mt-1">
                最近采集的商品数据
              </p>
            </div>
            <Link to="/products">
              <Button variant="outline">
                查看全部
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingProducts.map((product) => {
              const price = product.price as Record<string, unknown>;
              const sales = product.sales as Record<string, unknown>;
              const growth = product.growth as Record<string, unknown>;
              const images = product.images as string[];
              
              return (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-muted to-muted/50">
                    {images && images.length > 0 ? (
                      <img 
                        src={images[0]} 
                        alt={product.name}
                        className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `
                              <div class="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                                <svg class="h-16 w-16 text-muted-foreground mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                                <div class="text-sm font-medium text-muted-foreground line-clamp-2">${product.name}</div>
                              </div>
                              <div class="absolute top-3 right-3">
                                <span class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                                  growth?.trend === 'up' ? 'bg-green-600 text-white' : 
                                  growth?.trend === 'down' ? 'bg-red-600 text-white' : 'bg-gray-600 text-white'
                                }">
                                  ${growth?.rate > 0 ? '+' : ''}${growth?.rate}%
                                </span>
                              </div>
                              <div class="absolute top-3 left-3">
                                <span class="inline-flex items-center rounded-md bg-blue-600 px-2 py-1 text-xs font-medium text-white">
                                  ${product.data_source === 'echotik' ? 'EchoTik' : 'FastMoss'}
                                </span>
                              </div>
                            `;
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                        <Package className="h-16 w-16 text-muted-foreground mb-2" />
                        <div className="text-sm font-medium text-muted-foreground line-clamp-2">{product.name}</div>
                      </div>
                    )}
                    {growth?.rate && (
                      <Badge className={`absolute top-3 right-3 ${
                        growth.trend === 'up' ? 'bg-green-600' : 
                        growth.trend === 'down' ? 'bg-red-600' : 'bg-gray-600'
                      }`}>
                        {growth.rate > 0 ? '+' : ''}{growth.rate}%
                      </Badge>
                    )}
                    <Badge className="absolute top-3 left-3 bg-blue-600">
                      {product.data_source === 'echotik' ? 'EchoTik' : 'FastMoss'}
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-2 text-base">
                      {product.name}
                    </CardTitle>
                    <div className="flex items-center justify-between mt-2">
                      <div>
                        <div className="text-2xl font-bold">
                          ${price?.value || 0}
                        </div>
                        {price?.originalPrice && (
                          <div className="text-sm text-muted-foreground line-through">
                            ${price.originalPrice}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">月销量</div>
                        <div className="font-semibold">{sales?.monthly || 0}</div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && trendingProducts.length === 0 && (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <Database className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">暂无商品数据</h3>
            <p className="text-muted-foreground mb-6">
              请先配置API密钥并开始数据采集
            </p>
            <Link to="/data-collection">
              <Button>
                <Database className="mr-2 h-4 w-4" />
                开始采集数据
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
      
      {/* Country Flags */}
      <Card>
        <CardHeader>
          <CardTitle>目标市场</CardTitle>
          <CardDescription>
            覆盖东南亚4个核心电商市场
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.values(COUNTRIES).map((country) => (
              <div 
                key={country.code}
                className="flex flex-col items-center p-4 rounded-lg border hover:border-primary transition-colors cursor-pointer"
              >
                <div className="text-4xl mb-2">{country.flag}</div>
                <div className="font-semibold">{country.name}</div>
                <div className="text-sm text-muted-foreground">{country.nameEn}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
