import { Link, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
import { 
  Search, 
  Menu,
  TrendingUp,
  Package,
  BarChart3,
  Lightbulb,
  Heart,
} from 'lucide-react';
import { Input } from '../ui/input';

export function Header() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: '首页', icon: TrendingUp },
    { path: '/products', label: '商品数据', icon: Package },
    { path: '/market-insights', label: '市场洞察', icon: BarChart3 },
    { path: '/recommendations', label: '智能推荐', icon: Lightbulb },
    { path: '/favorites', label: '收藏夹', icon: Heart },
  ];
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 mr-8">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg hidden sm:inline-block">
            TikTok选品工具
          </span>
        </Link>
        
        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`transition-colors hover:text-foreground/80 ${
                  location.pathname === item.path
                    ? 'text-foreground'
                    : 'text-foreground/60'
                }`}
              >
                <span className="flex items-center gap-1">
                  {Icon && <Icon className="w-4 h-4" />}
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
        
        {/* Search */}
        <div className="hidden lg:flex items-center space-x-4 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="搜索商品..."
              className="pl-10 w-full"
            />
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center space-x-4 ml-auto">
          <Button variant="outline" size="sm" className="hidden md:inline-flex">
            数据采集
          </Button>
          
          {/* Mobile menu */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
