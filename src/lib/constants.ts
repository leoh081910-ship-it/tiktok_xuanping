import type { Country, Category } from './types';

// ==================== 国家配置 ====================

export const COUNTRIES: Record<string, Country> = {
  VN: {
    code: 'VN',
    name: '越南',
    nameEn: 'Vietnam',
    flag: '🇻🇳',
    currency: 'VND',
    currencySymbol: '₫',
  },
  TH: {
    code: 'TH',
    name: '泰国',
    nameEn: 'Thailand',
    flag: '🇹🇭',
    currency: 'THB',
    currencySymbol: '฿',
  },
  MY: {
    code: 'MY',
    name: '马来西亚',
    nameEn: 'Malaysia',
    flag: '🇲🇾',
    currency: 'MYR',
    currencySymbol: 'RM',
  },
  SG: {
    code: 'SG',
    name: '新加坡',
    nameEn: 'Singapore',
    flag: '🇸🇬',
    currency: 'SGD',
    currencySymbol: 'S$',
  },
};

export const COUNTRY_LIST = Object.values(COUNTRIES);

// ==================== 类目配置 ====================

export const CATEGORIES: Category[] = [
  {
    id: 'hair',
    name: '发饰头饰',
    nameEn: 'Hair Accessories',
    icon: 'Sparkles',
    level: 1,
    marketSize: 850000000,
    growthRate: 68,
    competitionLevel: 'low',
    priceRange: { min: 2, max: 20, average: 8 },
  },
  {
    id: 'jewelry',
    name: '平价饰品',
    nameEn: 'Affordable Jewelry',
    icon: 'Gem',
    level: 1,
    marketSize: 1500000000,
    growthRate: 62,
    competitionLevel: 'medium',
    priceRange: { min: 3, max: 40, average: 12 },
  },
  {
    id: 'watches',
    name: '时尚手表',
    nameEn: 'Fashion Watches',
    icon: 'Watch',
    level: 1,
    marketSize: 2200000000,
    growthRate: 48,
    competitionLevel: 'high',
    priceRange: { min: 10, max: 80, average: 28 },
  },
  {
    id: 'eyewear',
    name: '时尚眼镜',
    nameEn: 'Fashion Eyewear',
    icon: 'Glasses',
    level: 1,
    marketSize: 1200000000,
    growthRate: 58,
    competitionLevel: 'medium',
    priceRange: { min: 5, max: 35, average: 15 },
  },
  {
    id: 'wigs',
    name: '假发发片',
    nameEn: 'Wigs & Hair Extensions',
    icon: 'User',
    level: 1,
    marketSize: 980000000,
    growthRate: 75,
    competitionLevel: 'low',
    priceRange: { min: 15, max: 120, average: 45 },
  },
  {
    id: 'accessories',
    name: '服装配件',
    nameEn: 'Fashion Accessories',
    icon: 'Shirt',
    level: 1,
    marketSize: 1350000000,
    growthRate: 52,
    competitionLevel: 'medium',
    priceRange: { min: 4, max: 50, average: 16 },
    description: '领夹胸针、围巾围脖、手套、帽子、皮带、领结领带、手帕、口罩、袖扣等',
  },
];

// ==================== 筛选选项 ====================

export const COMPETITION_LEVELS = [
  { value: 'low', label: '低竞争', color: 'green' },
  { value: 'medium', label: '中等竞争', color: 'yellow' },
  { value: 'high', label: '高竞争', color: 'red' },
] as const;

export const GROWTH_TRENDS = [
  { value: 'up', label: '上升', icon: 'TrendingUp', color: 'green' },
  { value: 'stable', label: '稳定', icon: 'Minus', color: 'blue' },
  { value: 'down', label: '下降', icon: 'TrendingDown', color: 'red' },
] as const;

export const SORT_OPTIONS = [
  { value: 'sales', label: '按销量排序' },
  { value: 'price', label: '按价格排序' },
  { value: 'growth', label: '按增长率排序' },
  { value: 'competition', label: '按竞争度排序' },
  { value: 'date', label: '按时间排序' },
] as const;

// ==================== 价格区间 ====================

export const PRICE_RANGES = [
  { min: 0, max: 10, label: '$0-10' },
  { min: 10, max: 20, label: '$10-20' },
  { min: 20, max: 50, label: '$20-50' },
  { min: 50, max: 100, label: '$50-100' },
  { min: 100, max: 999999, label: '$100+' },
] as const;

// ==================== 销量区间 ====================

export const SALES_RANGES = [
  { min: 0, max: 100, label: '0-100' },
  { min: 100, max: 500, label: '100-500' },
  { min: 500, max: 1000, label: '500-1K' },
  { min: 1000, max: 5000, label: '1K-5K' },
  { min: 5000, max: 999999, label: '5K+' },
] as const;

// ==================== 收藏夹颜色 ====================

export const FOLDER_COLORS = [
  { value: 'blue', label: '蓝色', hex: '#3B82F6' },
  { value: 'green', label: '绿色', hex: '#10B981' },
  { value: 'purple', label: '紫色', hex: '#8B5CF6' },
  { value: 'pink', label: '粉色', hex: '#EC4899' },
  { value: 'yellow', label: '黄色', hex: '#F59E0B' },
  { value: 'red', label: '红色', hex: '#EF4444' },
  { value: 'gray', label: '灰色', hex: '#6B7280' },
] as const;

// ==================== 体验级别 ====================

export const EXPERIENCE_LEVELS = [
  { value: 'beginner', label: '新手入门', description: '刚开始做TikTok选品' },
  { value: 'intermediate', label: '进阶运营', description: '有一定经验，想扩大规模' },
  { value: 'expert', label: '专家级别', description: '经验丰富，追求高利润' },
] as const;

// ==================== 风险级别 ====================

export const RISK_LEVELS = [
  { value: 'low', label: '低风险', description: '稳定需求，长期经营' },
  { value: 'medium', label: '中等风险', description: '平衡风险与收益' },
  { value: 'high', label: '高风险', description: '追求爆品，快速回报' },
] as const;

// ==================== 推荐目标 ====================

export const RECOMMENDATION_GOALS = [
  { value: 'profit', label: '高利润', icon: 'DollarSign', description: '优先推荐利润率高的商品' },
  { value: 'volume', label: '高销量', icon: 'TrendingUp', description: '优先推荐销量大的商品' },
  { value: 'longterm', label: '长期稳定', icon: 'Shield', description: '推荐需求稳定的商品' },
  { value: 'trending', label: '趋势爆品', icon: 'Zap', description: '推荐快速增长的商品' },
] as const;

// ==================== API端点（预留） ====================

export const API_ENDPOINTS = {
  ECHOTIK_BASE: 'https://api.echotik.com',
  FASTMOSS_BASE: 'https://api.fastmoss.com',
} as const;

// ==================== 本地存储键 ====================

export const STORAGE_KEYS = {
  FAVORITES: 'tiktok_tool_favorites',
  FOLDERS: 'tiktok_tool_folders',
  API_CONFIG: 'tiktok_tool_api_config',
  USER_PREFERENCES: 'tiktok_tool_preferences',
} as const;

// ==================== 分页配置 ====================

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 24,
  PAGE_SIZE_OPTIONS: [12, 24, 48, 96],
} as const;

// ==================== 数据刷新间隔 ====================

export const REFRESH_INTERVALS = {
  PRODUCTS: 5 * 60 * 1000, // 5分钟
  MARKET: 30 * 60 * 1000, // 30分钟
  STATS: 2 * 60 * 1000, // 2分钟
} as const;
