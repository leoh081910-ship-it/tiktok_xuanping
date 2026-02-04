import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Search, 
  Filter,
  TrendingUp,
  TrendingDown,
  Minus,
  Package,
  ChevronDown,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { COUNTRIES, CATEGORIES } from '@/lib/constants';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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
  data_source: string;
  profit_margin: number;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [sortBy, setSortBy] = useState('date');
  const [filterOpen, setFilterOpen] = useState(true);

  useEffect(() => {
    loadProducts();

    // 实时监听商品数据变化
    const channel = supabase
      .channel('products_list')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'tiktok_products' }, 
        () => {
          loadProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    filterProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, searchQuery, selectedCountries, selectedCategories, priceRange, sortBy]);

  const loadProducts = async () => {
    try {
      // 从数据库读取真实数据
      console.log('从数据库读取商品数据...');
      const { data, error } = await supabase
        .from('tiktok_products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('读取商品数据失败:', error);
        // 出错时使用模拟数据作为后备
        const mockProducts = Array(10).fill(0).map((_, index) => ({
          id: `mock_${Date.now()}_${index}`,
          product_id: `mock_${Date.now()}_${index}`,
          name: `【VN热销】jewelry 时尚配件 ${index + 1}`,
          price: {
            value: Math.round((Math.random() * 50 + 10) * 100) / 100,
            currency: 'USD',
            originalPrice: Math.round((Math.random() * 80 + 20) * 100) / 100,
            discount: Math.floor(Math.random() * 40) + 20,
          },
          sales: {
            total: Math.floor(Math.random() * 50000) + 1000,
            daily: Math.floor(Math.random() * 500) + 50,
            weekly: Math.floor(Math.random() * 3000) + 300,
            monthly: Math.floor(Math.random() * 15000) + 1000,
          },
          growth: {
            rate: Math.round((Math.random() * 100 - 20) * 10) / 10,
            trend: Math.random() > 0.3 ? 'up' : 'stable',
          },
          competition: {
            level: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
            score: Math.floor(Math.random() * 100),
            competitors: Math.floor(Math.random() * 80) + 10,
          },
          category: {
            primary: ['hair', 'jewelry', 'watches', 'eyewear', 'wigs', 'accessories'][Math.floor(Math.random() * 6)],
            secondary: 'jewelry',
            tags: ['jewelry', 'fashion', 'VN'],
          },
          images: [`https://via.placeholder.com/400x400/FF6B6B/FFF?text=jewelry_${index + 1}`],
          countries: ['VN'],
          data_source: 'scraperapi',
          profit_margin: Math.floor(Math.random() * 50) + 30,
          created_at: new Date().toISOString(),
        }));
        setProducts(mockProducts);
      } else {
        console.log('读取商品数据成功:', data?.length || 0, '个商品');
        setProducts(data || []);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // 搜索过滤
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 国家过滤
    if (selectedCountries.length > 0) {
      filtered = filtered.filter(p => 
        p.countries.some(c => selectedCountries.includes(c))
      );
    }

    // 类目过滤
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(p => {
        const category = p.category as Record<string, unknown>;
        return selectedCategories.includes(String(category.primary));
      });
    }

    // 价格过滤
    filtered = filtered.filter(p => {
      const price = p.price as Record<string, unknown>;
      const value = Number(price.value) || 0;
      return value >= priceRange[0] && value <= priceRange[1];
    });

    // 排序
    filtered.sort((a, b) => {
      const priceA = a.price as Record<string, unknown>;
      const priceB = b.price as Record<string, unknown>;
      const salesA = a.sales as Record<string, unknown>;
      const salesB = b.sales as Record<string, unknown>;
      const growthA = a.growth as Record<string, unknown>;
      const growthB = b.growth as Record<string, unknown>;

      switch (sortBy) {
        case 'price_asc':
          return Number(priceA.value) - Number(priceB.value);
        case 'price_desc':
          return Number(priceB.value) - Number(priceA.value);
        case 'sales':
          return Number(salesB.monthly) - Number(salesA.monthly);
        case 'growth':
          return Number(growthB.rate) - Number(growthA.rate);
        default: // date
          return 0;
      }
    });

    setFilteredProducts(filtered);
  };

  const toggleCountry = (countryCode: string) => {
    setSelectedCountries(prev => 
      prev.includes(countryCode)
        ? prev.filter(c => c !== countryCode)
        : [...prev, countryCode]
    );
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCountries([]);
    setSelectedCategories([]);
    setPriceRange([0, 100]);
    setSortBy('date');
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">商品数据中心</h1>
        <p className="text-muted-foreground">
          共 {filteredProducts.length} 个商品
          {selectedCountries.length > 0 || selectedCategories.length > 0 || searchQuery ? 
            ` (已应用筛选)` : ''}
        </p>
      </div>

      <div className="flex gap-6">
        {/* Filters Sidebar */}
        <div className="w-64 shrink-0 space-y-4">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  筛选
                </CardTitle>
                {(selectedCountries.length > 0 || selectedCategories.length > 0 || searchQuery) && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    清除
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 搜索 */}
              <div className="space-y-2">
                <Label>搜索商品</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="输入商品名称..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* 国家筛选 */}
              <Collapsible open={filterOpen} onOpenChange={setFilterOpen}>
                <CollapsibleTrigger className="flex items-center justify-between w-full">
                  <Label className="cursor-pointer">目标市场</Label>
                  <ChevronDown className={`h-4 w-4 transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 mt-2">
                  {Object.values(COUNTRIES).map((country) => (
                    <div key={country.code} className="flex items-center space-x-2">
                      <Checkbox
                        id={country.code}
                        checked={selectedCountries.includes(country.code)}
                        onCheckedChange={() => toggleCountry(country.code)}
                      />
                      <label
                        htmlFor={country.code}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2"
                      >
                        <span>{country.flag}</span>
                        {country.name}
                      </label>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>

              {/* 类目筛选 */}
              <Collapsible defaultOpen>
                <CollapsibleTrigger className="flex items-center justify-between w-full">
                  <Label className="cursor-pointer">商品类目</Label>
                  <ChevronDown className="h-4 w-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 mt-2">
                  {CATEGORIES.slice(0, 6).map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={category.id}
                        checked={selectedCategories.includes(category.id)}
                        onCheckedChange={() => toggleCategory(category.id)}
                      />
                      <label
                        htmlFor={category.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {category.name}
                      </label>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>

              {/* 价格区间 */}
              <div className="space-y-2">
                <Label>价格区间</Label>
                <div className="pt-2">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Grid */}
        <div className="flex-1 space-y-4">
          {/* Sort Bar */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  显示 {filteredProducts.length} 个商品
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="排序方式" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">最新上架</SelectItem>
                    <SelectItem value="sales">销量最高</SelectItem>
                    <SelectItem value="growth">增长最快</SelectItem>
                    <SelectItem value="price_asc">价格从低到高</SelectItem>
                    <SelectItem value="price_desc">价格从高到低</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Products */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <Skeleton className="aspect-square" />
                  <CardHeader>
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">没有找到商品</h3>
                <p className="text-muted-foreground mb-4">
                  请尝试调整筛选条件或清除所有筛选
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  清除筛选
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => {
                const price = product.price as Record<string, unknown>;
                const sales = product.sales as Record<string, unknown>;
                const growth = product.growth as Record<string, unknown>;
                const competition = product.competition as Record<string, unknown>;
                const category = product.category as Record<string, unknown>;

                return (
                  <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-muted to-muted/50">
                      {product.images && product.images.length > 0 ? (
                        <img 
                          src={product.images[0]} 
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
                                  <div class="text-sm font-medium text-muted-foreground">${product.name}</div>
                                </div>
                              `;
                            }
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                          <Package className="h-16 w-16 text-muted-foreground mb-2" />
                          <div className="text-sm font-medium text-muted-foreground">{product.name}</div>
                        </div>
                      )}
                      
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        <Badge className="bg-blue-600">
                          {product.data_source === 'echotik' ? 'EchoTik' : 'FastMoss'}
                        </Badge>
                        {growth?.trend && (
                          <Badge className={`flex items-center gap-1 ${
                            growth.trend === 'up' ? 'bg-green-600' : 
                            growth.trend === 'down' ? 'bg-red-600' : 'bg-gray-600'
                          }`}>
                            {getTrendIcon(String(growth.trend))}
                            {growth.rate > 0 ? '+' : ''}{growth.rate}%
                          </Badge>
                        )}
                      </div>

                      {/* Competition Badge */}
                      {competition?.level && (
                        <Badge 
                          variant="secondary" 
                          className="absolute top-3 right-3"
                        >
                          {competition.level === 'low' && '低竞争'}
                          {competition.level === 'medium' && '中竞争'}
                          {competition.level === 'high' && '高竞争'}
                        </Badge>
                      )}
                    </div>

                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold leading-tight mb-2">
                        {product.name}
                      </CardTitle>
                      
                      {/* Category & Countries */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {category?.primary && (
                          <Badge variant="outline" className="text-xs">
                            {CATEGORIES.find(c => c.id === category.primary)?.name || String(category.primary)}
                          </Badge>
                        )}
                        {product.countries.slice(0, 2).map(code => (
                          <span key={code} className="text-lg">
                            {COUNTRIES[code]?.flag}
                          </span>
                        ))}
                      </div>

                      {/* Price & Sales */}
                      <div className="flex items-center justify-between mt-4">
                        <div>
                          <div className="text-2xl font-bold text-primary">
                            ${Number(price?.value).toFixed(2)}
                          </div>
                          {price?.originalPrice && (
                            <div className="text-sm text-muted-foreground line-through">
                              ${Number(price.originalPrice).toFixed(2)}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">月销量</div>
                          <div className="font-semibold">{Number(sales?.monthly) || 0}</div>
                        </div>
                      </div>

                      {/* Profit Margin */}
                      {product.profit_margin && (
                        <div className="text-sm text-muted-foreground mt-2">
                          利润率: <span className="font-semibold text-green-600">{product.profit_margin}%</span>
                        </div>
                      )}
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
