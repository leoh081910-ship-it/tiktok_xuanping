import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Package, 
  TrendingUp, 
  Lightbulb, 
  Heart,
  Settings,
  Database,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';

const menuItems = [
  {
    title: '主要功能',
    items: [
      { icon: Home, label: '首页', path: '/' },
      { icon: Package, label: '商品数据', path: '/products' },
      { icon: TrendingUp, label: '市场洞察', path: '/market-insights' },
      { icon: Sparkles, label: 'TikTok官方', path: '/tiktok-official' },
      { icon: Lightbulb, label: '智能推荐', path: '/recommendations' },
      { icon: Heart, label: '收藏夹', path: '/favorites' },
    ],
  },
  {
    title: '设置',
    items: [
      { icon: Database, label: '数据采集', path: '/data-collection' },
      { icon: Settings, label: '系统设置', path: '/settings' },
    ],
  },
];

export function Sidebar() {
  const location = useLocation();
  
  return (
    <div className="hidden lg:flex flex-col w-64 border-r bg-background">
      <ScrollArea className="flex-1 px-3 py-4">
        {menuItems.map((section, idx) => (
          <div key={idx} className="mb-6">
            <h4 className="mb-2 px-2 text-sm font-semibold text-muted-foreground">
              {section.title}
            </h4>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link key={item.path} to={item.path}>
                    <Button
                      variant={isActive ? 'secondary' : 'ghost'}
                      className={cn(
                        'w-full justify-start',
                        isActive && 'bg-secondary'
                      )}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}
