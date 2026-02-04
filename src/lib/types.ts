// ==================== 核心数据类型定义 ====================

// 国家代码
export type CountryCode = 'VN' | 'TH' | 'MY' | 'SG';

// 国家信息
export interface Country {
  code: CountryCode;
  name: string;
  nameEn: string;
  flag: string;
  currency: string;
  currencySymbol: string;
}

// 商品数据
export interface Product {
  id: string;
  name: string;
  nameEn?: string;
  description: string;
  images: string[];
  price: {
    value: number;
    currency: string;
    originalPrice?: number;
    discount?: number;
  };
  sales: {
    total: number;
    daily: number;
    weekly: number;
    monthly: number;
  };
  growth: {
    rate: number; // 增长率百分比
    trend: 'up' | 'down' | 'stable';
  };
  competition: {
    level: 'low' | 'medium' | 'high';
    score: number; // 0-100
    competitors: number;
  };
  category: {
    primary: string;
    secondary: string;
    tags: string[];
  };
  countries: CountryCode[]; // 适用国家
  profitMargin?: number; // 利润率估算
  supplier?: {
    name: string;
    platform: string;
    rating: number;
    minOrder?: number;
  };
  logistics?: {
    shippingTime: string;
    warehouseLocation: string;
    shippingCost?: number;
  };
  tiktokData?: {
    videoCount: number;
    totalViews: number;
    engagement: number;
    hashtags: string[];
  };
  createdAt: string;
  updatedAt: string;
}

// 市场数据
export interface CountryMarket {
  countryCode: CountryCode;
  countryName: string;
  population: number;
  internetPenetration: number; // 百分比
  ecommerceGrowth: number; // 年增长率
  averageOrderValue: number;
  popularPayments: string[];
  culturalNotes: {
    religion: string[];
    festivals: Array<{
      name: string;
      date: string;
      significance: string;
    }>;
    preferences: string[];
  };
  topCategories: Array<{
    name: string;
    marketShare: number;
    growth: number;
    avgPrice: number;
  }>;
  climate: {
    type: string;
    features: string[];
  };
}

// 类目数据
export interface Category {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  parentId?: string;
  level: number;
  marketSize: number;
  growthRate: number;
  competitionLevel: 'low' | 'medium' | 'high';
  priceRange: {
    min: number;
    max: number;
    average: number;
  };
  topProducts?: Product[];
  successCases?: Array<{
    title: string;
    description: string;
    result: string;
    imageUrl?: string;
  }>;
}

// 筛选条件
export interface ProductFilters {
  countries: CountryCode[];
  categories: string[];
  priceRange: {
    min: number;
    max: number;
  };
  salesRange: {
    min: number;
    max: number;
  };
  growthTrend: ('up' | 'down' | 'stable')[];
  competitionLevel: ('low' | 'medium' | 'high')[];
  sortBy: 'sales' | 'price' | 'growth' | 'competition' | 'date';
  sortOrder: 'asc' | 'desc';
  searchQuery?: string;
}

// 推荐参数
export interface RecommendationParams {
  targetCountries: CountryCode[];
  budget: {
    min: number;
    max: number;
  };
  experience: 'beginner' | 'intermediate' | 'expert';
  preferredCategories: string[];
  riskLevel: 'low' | 'medium' | 'high';
  goals: ('profit' | 'volume' | 'longterm' | 'trending')[];
}

// 推荐结果
export interface RecommendationResult {
  product: Product;
  score: number;
  reasons: string[];
  pros: string[];
  cons: string[];
  marketingTips: string[];
  supplierSuggestions?: string[];
}

// 收藏夹
export interface Favorite {
  id: string;
  productId: string;
  product: Product;
  folderId: string;
  note?: string;
  tags: string[];
  addedAt: string;
}

export interface FavoriteFolder {
  id: string;
  name: string;
  description?: string;
  color: string;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

// 统计数据
export interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  averageGrowthRate: number;
  topCountry: CountryCode;
  trendingCategory: string;
  newProductsToday: number;
  newProductsWeek: number;
  hotProductsCount: number;
}

// 趋势数据
export interface TrendData {
  date: string;
  sales: number;
  views: number;
  engagement: number;
}

// API配置
export interface APIConfig {
  echotik?: {
    apiKey: string;
    enabled: boolean;
  };
  fastmoss?: {
    apiKey: string;
    enabled: boolean;
  };
}

// 数据采集任务
export interface CollectionTask {
  id: string;
  type: 'products' | 'market' | 'trends';
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  countries: CountryCode[];
  categories: string[];
  startedAt?: string;
  completedAt?: string;
  error?: string;
  itemsCollected: number;
  itemsTotal: number;
}
