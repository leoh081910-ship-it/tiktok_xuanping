import type { Product } from '../lib/types';

// 模拟商品数据 - 基于真实东南亚市场特征生成
export const mockProducts: Product[] = [
  {
    id: 'prod_001',
    name: '防晒喷雾 SPF50+ 清爽不油腻',
    nameEn: 'Sunscreen Spray SPF50+ Non-Greasy',
    description: '专为热带气候设计的防晒喷雾，防水防汗，清爽不油腻，适合东南亚炎热天气',
    images: [
      'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400',
    ],
    price: {
      value: 15.99,
      currency: 'USD',
      originalPrice: 24.99,
      discount: 36,
    },
    sales: {
      total: 12580,
      daily: 245,
      weekly: 1680,
      monthly: 6890,
    },
    growth: {
      rate: 45.2,
      trend: 'up',
    },
    competition: {
      level: 'medium',
      score: 68,
      competitors: 42,
    },
    category: {
      primary: 'beauty',
      secondary: '防晒护肤',
      tags: ['防晒', '喷雾', '防水', '热带适用'],
    },
    countries: ['VN', 'TH', 'MY', 'SG'],
    profitMargin: 55,
    supplier: {
      name: '美妆工厂直供',
      platform: '1688',
      rating: 4.8,
      minOrder: 50,
    },
    logistics: {
      shippingTime: '3-5天',
      warehouseLocation: '深圳',
      shippingCost: 3.5,
    },
    tiktokData: {
      videoCount: 1280,
      totalViews: 5600000,
      engagement: 8.5,
      hashtags: ['#防晒', '#sunscreen', '#热带防晒'],
    },
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-01-18T04:00:00Z',
  },
  {
    id: 'prod_002',
    name: 'Hijab时尚头巾 - 透气速干款',
    nameEn: 'Fashion Hijab - Breathable Quick Dry',
    description: '采用高科技面料，透气速干，适合热带气候，多种颜色可选',
    images: [
      'https://images.unsplash.com/photo-1583391733981-d3fd959e3f05?w=400',
      'https://images.unsplash.com/photo-1601762603339-fd61e28b698a?w=400',
    ],
    price: {
      value: 8.99,
      currency: 'USD',
      originalPrice: 12.99,
      discount: 31,
    },
    sales: {
      total: 8960,
      daily: 185,
      weekly: 1250,
      monthly: 5120,
    },
    growth: {
      rate: 38.5,
      trend: 'up',
    },
    competition: {
      level: 'low',
      score: 35,
      competitors: 18,
    },
    category: {
      primary: 'fashion',
      secondary: '穆斯林服饰',
      tags: ['Hijab', '头巾', '透气', '速干'],
    },
    countries: ['MY', 'SG'],
    profitMargin: 62,
    supplier: {
      name: '穆斯林服饰厂',
      platform: '1688',
      rating: 4.9,
      minOrder: 100,
    },
    logistics: {
      shippingTime: '4-6天',
      warehouseLocation: '广州',
      shippingCost: 2.8,
    },
    tiktokData: {
      videoCount: 850,
      totalViews: 3200000,
      engagement: 9.2,
      hashtags: ['#hijabfashion', '#muslimah', '#modestfashion'],
    },
    createdAt: '2025-01-08T10:30:00Z',
    updatedAt: '2025-01-18T03:30:00Z',
  },
  {
    id: 'prod_003',
    name: '便携式USB小风扇 带喷雾',
    nameEn: 'Portable USB Fan with Mist Spray',
    description: '降温神器，风扇+喷雾二合一，适合热带气候，USB充电',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
      'https://images.unsplash.com/photo-1527385352018-3c26dd6c3916?w=400',
    ],
    price: {
      value: 12.50,
      currency: 'USD',
      originalPrice: 18.99,
      discount: 34,
    },
    sales: {
      total: 15240,
      daily: 320,
      weekly: 2150,
      monthly: 8760,
    },
    growth: {
      rate: 52.3,
      trend: 'up',
    },
    competition: {
      level: 'high',
      score: 82,
      competitors: 65,
    },
    category: {
      primary: 'home',
      secondary: '降温用品',
      tags: ['风扇', '喷雾', '便携', '降温'],
    },
    countries: ['VN', 'TH', 'MY', 'SG'],
    profitMargin: 58,
    supplier: {
      name: '小家电批发',
      platform: '1688',
      rating: 4.7,
      minOrder: 30,
    },
    logistics: {
      shippingTime: '3-5天',
      warehouseLocation: '义乌',
      shippingCost: 4.2,
    },
    tiktokData: {
      videoCount: 2150,
      totalViews: 8900000,
      engagement: 7.8,
      hashtags: ['#便携风扇', '#降温神器', '#portablefan'],
    },
    createdAt: '2025-01-12T14:20:00Z',
    updatedAt: '2025-01-18T04:15:00Z',
  },
  {
    id: 'prod_004',
    name: '清真认证营养软糖 维生素C+E',
    nameEn: 'Halal Vitamin C+E Gummies',
    description: '清真认证，美味营养，提高免疫力，适合全家食用',
    images: [
      'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400',
      'https://images.unsplash.com/photo-1550572017-4a0c0d6f0e37?w=400',
    ],
    price: {
      value: 16.99,
      currency: 'USD',
      originalPrice: 22.99,
      discount: 26,
    },
    sales: {
      total: 7850,
      daily: 165,
      weekly: 1120,
      monthly: 4580,
    },
    growth: {
      rate: 41.8,
      trend: 'up',
    },
    competition: {
      level: 'medium',
      score: 55,
      competitors: 32,
    },
    category: {
      primary: 'food',
      secondary: '保健食品',
      tags: ['清真', 'Halal', '维生素', '软糖'],
    },
    countries: ['MY', 'SG'],
    profitMargin: 48,
    supplier: {
      name: '保健品工厂',
      platform: '1688',
      rating: 4.6,
      minOrder: 50,
    },
    logistics: {
      shippingTime: '5-7天',
      warehouseLocation: '上海',
      shippingCost: 5.5,
    },
    tiktokData: {
      videoCount: 680,
      totalViews: 2800000,
      engagement: 8.9,
      hashtags: ['#halal', '#vitamins', '#健康食品'],
    },
    createdAt: '2025-01-09T09:15:00Z',
    updatedAt: '2025-01-18T02:45:00Z',
  },
  {
    id: 'prod_005',
    name: '婴儿防蚊贴 天然植物配方',
    nameEn: 'Baby Mosquito Repellent Patches - Natural',
    description: '天然植物配方，温和不刺激，有效防蚊12小时，适合热带地区',
    images: [
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400',
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400',
    ],
    price: {
      value: 9.99,
      currency: 'USD',
      originalPrice: 14.99,
      discount: 33,
    },
    sales: {
      total: 11200,
      daily: 235,
      weekly: 1590,
      monthly: 6480,
    },
    growth: {
      rate: 48.6,
      trend: 'up',
    },
    competition: {
      level: 'medium',
      score: 62,
      competitors: 38,
    },
    category: {
      primary: 'baby',
      secondary: '婴儿护理',
      tags: ['防蚊', '婴儿', '天然', '热带'],
    },
    countries: ['VN', 'TH', 'MY', 'SG'],
    profitMargin: 65,
    supplier: {
      name: '母婴用品厂',
      platform: '1688',
      rating: 4.8,
      minOrder: 100,
    },
    logistics: {
      shippingTime: '3-5天',
      warehouseLocation: '广州',
      shippingCost: 3.2,
    },
    tiktokData: {
      videoCount: 920,
      totalViews: 4100000,
      engagement: 9.5,
      hashtags: ['#防蚊', '#婴儿用品', '#mosquitorepellent'],
    },
    createdAt: '2025-01-11T11:40:00Z',
    updatedAt: '2025-01-18T03:50:00Z',
  },
  {
    id: 'prod_006',
    name: '摩托车头盔 带蓝牙耳机',
    nameEn: 'Motorcycle Helmet with Bluetooth',
    description: '安全认证，内置蓝牙耳机，可接听电话和听音乐，适合摩托车大国',
    images: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=400',
      'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=400',
    ],
    price: {
      value: 45.99,
      currency: 'USD',
      originalPrice: 69.99,
      discount: 34,
    },
    sales: {
      total: 6540,
      daily: 145,
      weekly: 980,
      monthly: 3990,
    },
    growth: {
      rate: 35.2,
      trend: 'up',
    },
    competition: {
      level: 'low',
      score: 42,
      competitors: 25,
    },
    category: {
      primary: 'auto',
      secondary: '摩托车配件',
      tags: ['头盔', '蓝牙', '摩托车', '安全'],
    },
    countries: ['VN', 'TH'],
    profitMargin: 42,
    supplier: {
      name: '摩托车配件厂',
      platform: '1688',
      rating: 4.7,
      minOrder: 20,
    },
    logistics: {
      shippingTime: '5-7天',
      warehouseLocation: '深圳',
      shippingCost: 8.5,
    },
    tiktokData: {
      videoCount: 450,
      totalViews: 1800000,
      engagement: 7.2,
      hashtags: ['#motorcyclehelmet', '#bluetooth', '#骑行装备'],
    },
    createdAt: '2025-01-07T15:30:00Z',
    updatedAt: '2025-01-18T01:20:00Z',
  },
  {
    id: 'prod_007',
    name: '宠物降温垫 冰感凝胶垫',
    nameEn: 'Pet Cooling Mat - Gel Technology',
    description: '冰感凝胶技术，无需制冷即可降温，适合热带气候宠物使用',
    images: [
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400',
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400',
    ],
    price: {
      value: 18.99,
      currency: 'USD',
      originalPrice: 28.99,
      discount: 34,
    },
    sales: {
      total: 9820,
      daily: 205,
      weekly: 1390,
      monthly: 5670,
    },
    growth: {
      rate: 58.3,
      trend: 'up',
    },
    competition: {
      level: 'low',
      score: 38,
      competitors: 22,
    },
    category: {
      primary: 'pet',
      secondary: '宠物降温',
      tags: ['宠物', '降温垫', '凝胶', '热带适用'],
    },
    countries: ['TH', 'MY', 'SG'],
    profitMargin: 61,
    supplier: {
      name: '宠物用品批发',
      platform: '1688',
      rating: 4.8,
      minOrder: 30,
    },
    logistics: {
      shippingTime: '4-6天',
      warehouseLocation: '义乌',
      shippingCost: 4.8,
    },
    tiktokData: {
      videoCount: 780,
      totalViews: 3500000,
      engagement: 9.8,
      hashtags: ['#petcooling', '#宠物降温', '#热带宠物'],
    },
    createdAt: '2025-01-13T13:25:00Z',
    updatedAt: '2025-01-18T04:30:00Z',
  },
  {
    id: 'prod_008',
    name: '无线蓝牙耳机 TWS运动款',
    nameEn: 'TWS Bluetooth Earbuds - Sports Edition',
    description: '防水防汗，低延迟，超长续航，适合运动和日常使用',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400',
      'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400',
    ],
    price: {
      value: 28.99,
      currency: 'USD',
      originalPrice: 45.99,
      discount: 37,
    },
    sales: {
      total: 14580,
      daily: 310,
      weekly: 2090,
      monthly: 8520,
    },
    growth: {
      rate: 42.7,
      trend: 'up',
    },
    competition: {
      level: 'high',
      score: 85,
      competitors: 78,
    },
    category: {
      primary: 'electronics',
      secondary: '音频设备',
      tags: ['蓝牙', '耳机', '运动', '防水'],
    },
    countries: ['VN', 'TH', 'MY', 'SG'],
    profitMargin: 52,
    supplier: {
      name: '电子产品工厂',
      platform: '1688',
      rating: 4.6,
      minOrder: 50,
    },
    logistics: {
      shippingTime: '3-5天',
      warehouseLocation: '深圳',
      shippingCost: 3.8,
    },
    tiktokData: {
      videoCount: 1850,
      totalViews: 7200000,
      engagement: 8.1,
      hashtags: ['#bluetooth', '#earbuds', '#无线耳机'],
    },
    createdAt: '2025-01-14T16:10:00Z',
    updatedAt: '2025-01-18T04:20:00Z',
  },
];

// 生成更多模拟数据的辅助函数
export function generateMoreMockProducts(count: number = 50): Product[] {
  const additionalProducts: Product[] = [];
  const categories = ['beauty', 'fashion', 'home', 'food', 'baby', 'auto', 'pet', 'electronics'];
  const countries: ('VN' | 'TH' | 'MY' | 'SG')[] = ['VN', 'TH', 'MY', 'SG'];
  const trends: ('up' | 'down' | 'stable')[] = ['up', 'up', 'up', 'stable', 'down']; // 60% up
  const competitions: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'medium', 'high'];
  
  for (let i = 0; i < count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const trend = trends[Math.floor(Math.random() * trends.length)];
    const competition = competitions[Math.floor(Math.random() * competitions.length)];
    const price = Math.random() * 90 + 5; // $5-95
    const sales = Math.floor(Math.random() * 15000) + 1000;
    
    additionalProducts.push({
      id: `prod_${String(i + 100).padStart(3, '0')}`,
      name: `商品${i + 1} - ${category}类`,
      nameEn: `Product ${i + 1} - ${category}`,
      description: `这是一个${category}类目的热销商品，非常适合东南亚市场`,
      images: [
        `https://images.unsplash.com/photo-${1500000000000 + i}?w=400`,
      ],
      price: {
        value: Math.round(price * 100) / 100,
        currency: 'USD',
        originalPrice: Math.round(price * 1.5 * 100) / 100,
        discount: Math.floor(Math.random() * 40) + 20,
      },
      sales: {
        total: sales,
        daily: Math.floor(sales / 30),
        weekly: Math.floor(sales / 4),
        monthly: sales,
      },
      growth: {
        rate: Math.round((Math.random() * 80 - 10) * 10) / 10,
        trend,
      },
      competition: {
        level: competition,
        score: competition === 'low' ? Math.floor(Math.random() * 30) + 10 : 
               competition === 'medium' ? Math.floor(Math.random() * 30) + 40 :
               Math.floor(Math.random() * 20) + 70,
        competitors: Math.floor(Math.random() * 80) + 10,
      },
      category: {
        primary: category,
        secondary: `${category}子类目`,
        tags: [category, '热销', '东南亚'],
      },
      countries: countries.slice(0, Math.floor(Math.random() * 4) + 1),
      profitMargin: Math.floor(Math.random() * 50) + 30,
      supplier: {
        name: '优质供应商',
        platform: '1688',
        rating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10,
        minOrder: Math.floor(Math.random() * 100) + 20,
      },
      logistics: {
        shippingTime: '3-7天',
        warehouseLocation: ['深圳', '广州', '义乌', '上海'][Math.floor(Math.random() * 4)],
        shippingCost: Math.round((Math.random() * 8 + 2) * 10) / 10,
      },
      tiktokData: {
        videoCount: Math.floor(Math.random() * 2000) + 100,
        totalViews: Math.floor(Math.random() * 8000000) + 500000,
        engagement: Math.round((Math.random() * 5 + 5) * 10) / 10,
        hashtags: [`#${category}`, '#trending', '#东南亚'],
      },
      createdAt: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  
  return [...mockProducts, ...additionalProducts];
}

export const allMockProducts = generateMoreMockProducts(200);
