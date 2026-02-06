import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Heart,
  Trash2,
  Package,
  AlertCircle,
} from 'lucide-react';
import { COUNTRIES } from '@/lib/constants';
import { toast } from 'sonner';

interface FavoriteProduct {
  id: string;
  name: string;
  price: number;
  sales: number;
  growth: number;
  image: string;
  countries: string[];
  data_source: string;
  profit_margin: number;
}

export default function Favorites() {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    setLoading(true);
    try {
      // 从 localStorage 读取收藏
      const stored = localStorage.getItem('tiktok_favorites');
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      toast.error('加载收藏失败');
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = (id: string) => {
    try {
      const updated = favorites.filter(f => f.id !== id);
      setFavorites(updated);
      localStorage.setItem('tiktok_favorites', JSON.stringify(updated));
      toast.success('已取消收藏');
    } catch (error) {
      toast.error('操作失败');
    }
  };

  const clearAll = () => {
    if (confirm('确定要清空所有收藏吗？')) {
      setFavorites([]);
      localStorage.removeItem('tiktok_favorites');
      toast.success('已清空所有收藏');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-80" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Heart className="h-8 w-8 text-red-500" />
            收藏夹
          </h1>
          <p className="text-muted-foreground mt-1">
            {favorites.length} 个收藏商品
          </p>
        </div>
        {favorites.length > 0 && (
          <Button variant="outline" onClick={clearAll}>
            <Trash2 className="h-4 w-4 mr-2" />
            清空收藏
          </Button>
        )}
      </div>

      {favorites.length === 0 ? (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">暂无收藏商品</h3>
            <p className="text-muted-foreground mb-6">
              在商品列表中点击心形图标，即可收藏感兴趣的商品
            </p>
            <Button asChild>
              <a href="/products">浏览商品</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {favorites.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-muted to-muted/50">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}

                {/* Badge */}
                <Badge className="absolute top-3 left-3 bg-blue-600">
                  {product.data_source === 'echotik' ? 'EchoTik' : 'FastMoss'}
                </Badge>

                {/* Remove Button */}
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-3 right-3 h-8 w-8"
                  onClick={() => removeFavorite(product.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold leading-tight mb-2">
                  {product.name}
                </CardTitle>

                {/* Countries */}
                <div className="flex gap-1 mb-3">
                  {product.countries.map(code => (
                    <span key={code} className="text-lg">
                      {COUNTRIES[code]?.flag}
                    </span>
                  ))}
                </div>

                {/* Price & Sales */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      ${product.price.toFixed(2)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">月销量</div>
                    <div className="font-semibold">{product.sales.toLocaleString()}</div>
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
          ))}
        </div>
      )}
    </div>
  );
}
