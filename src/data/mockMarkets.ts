import type { CountryMarket } from '../lib/types';

export const mockMarkets: CountryMarket[] = [
  {
    countryCode: 'VN',
    countryName: '越南',
    population: 98000000,
    internetPenetration: 77,
    ecommerceGrowth: 35,
    averageOrderValue: 18.5,
    popularPayments: ['MoMo', 'ZaloPay', 'VNPay', 'COD'],
    culturalNotes: {
      religion: ['佛教', '天主教'],
      festivals: [
        { name: '春节/Tết', date: '农历正月初一', significance: '越南最重要的节日，持续7-10天' },
        { name: '中秋节', date: '农历八月十五', significance: '儿童节日，送月饼和玩具' },
        { name: '国庆节', date: '9月2日', significance: '国家独立日' },
      ],
      preferences: [
        '年轻人口众多，平均年龄32岁',
        '社交媒体使用率极高',
        '喜欢韩国流行文化',
        '价格敏感度高',
        '注重产品性价比',
      ],
    },
    topCategories: [
      { name: '时尚服饰', marketShare: 28, growth: 38, avgPrice: 22 },
      { name: '美妆个护', marketShare: 22, growth: 45, avgPrice: 18 },
      { name: '电子产品', marketShare: 18, growth: 42, avgPrice: 45 },
      { name: '家居生活', marketShare: 15, growth: 35, avgPrice: 28 },
      { name: '食品饮品', marketShare: 10, growth: 30, avgPrice: 12 },
      { name: '母婴儿童', marketShare: 7, growth: 40, avgPrice: 20 },
    ],
    climate: {
      type: '热带季风气候',
      features: ['全年高温', '雨季5-10月', '湿度大', '台风影响'],
    },
  },
  {
    countryCode: 'TH',
    countryName: '泰国',
    population: 70000000,
    internetPenetration: 85,
    ecommerceGrowth: 42,
    averageOrderValue: 25.8,
    popularPayments: ['PromptPay', 'TrueMoney', 'Rabbit LINE Pay', 'COD'],
    culturalNotes: {
      religion: ['佛教（95%）'],
      festivals: [
        { name: '泼水节/宋干节', date: '4月13-15日', significance: '泰国新年，全国性庆祝活动' },
        { name: '水灯节', date: '农历十二月十五', significance: '放水灯祈福' },
        { name: '国王诞辰', date: '7月28日', significance: '父亲节，购物促销高峰' },
      ],
      preferences: [
        '内容创作活跃，TikTok使用率高',
        '喜欢本土品牌',
        '注重产品质量',
        '美妆和时尚消费力强',
        '线上购物习惯成熟',
      ],
    },
    topCategories: [
      { name: '美妆个护', marketShare: 30, growth: 48, avgPrice: 25 },
      { name: '时尚服饰', marketShare: 25, growth: 40, avgPrice: 30 },
      { name: '家居生活', marketShare: 18, growth: 52, avgPrice: 35 },
      { name: '电子产品', marketShare: 15, growth: 38, avgPrice: 50 },
      { name: '食品饮品', marketShare: 8, growth: 35, avgPrice: 15 },
      { name: '宠物用品', marketShare: 4, growth: 60, avgPrice: 18 },
    ],
    climate: {
      type: '热带季风气候',
      features: ['全年高温', '雨季6-10月', '曼谷等城市闷热', '凉季11-2月'],
    },
  },
  {
    countryCode: 'MY',
    countryName: '马来西亚',
    population: 33000000,
    internetPenetration: 92,
    ecommerceGrowth: 38,
    averageOrderValue: 32.5,
    popularPayments: ['Touch n Go', 'GrabPay', 'Boost', 'Online Banking'],
    culturalNotes: {
      religion: ['伊斯兰教（60%）', '佛教', '印度教', '基督教'],
      festivals: [
        { name: '开斋节/Hari Raya', date: '伊斯兰历10月1日', significance: '穆斯林最重要节日，购物高峰期' },
        { name: '春节', date: '农历正月初一', significance: '华人新年，促销旺季' },
        { name: '屠妖节', date: '10-11月', significance: '印度教光明节' },
      ],
      preferences: [
        '多元文化市场',
        '清真认证产品需求大',
        '中高端消费力强',
        '英语和马来语使用',
        '注重品牌和质量',
      ],
    },
    topCategories: [
      { name: '美妆个护', marketShare: 26, growth: 42, avgPrice: 28 },
      { name: '时尚服饰', marketShare: 24, growth: 45, avgPrice: 35 },
      { name: '电子产品', marketShare: 20, growth: 40, avgPrice: 55 },
      { name: '家居生活', marketShare: 15, growth: 38, avgPrice: 38 },
      { name: '食品饮品', marketShare: 10, growth: 35, avgPrice: 18 },
      { name: '母婴儿童', marketShare: 5, growth: 50, avgPrice: 25 },
    ],
    climate: {
      type: '热带雨林气候',
      features: ['全年高温多雨', '湿度80-90%', '无明显旱季', '午后雷雨常见'],
    },
  },
  {
    countryCode: 'SG',
    countryName: '新加坡',
    population: 5900000,
    internetPenetration: 98,
    ecommerceGrowth: 32,
    averageOrderValue: 58.2,
    popularPayments: ['PayNow', 'GrabPay', 'Credit Card', 'PayPal'],
    culturalNotes: {
      religion: ['佛教', '伊斯兰教', '基督教', '印度教'],
      festivals: [
        { name: '春节', date: '农历正月初一', significance: '华人新年，重要购物季' },
        { name: '开斋节', date: '伊斯兰历10月1日', significance: '穆斯林节日' },
        { name: '国庆日', date: '8月9日', significance: '国家庆典，促销季' },
        { name: '屠妖节', date: '10-11月', significance: '印度教节日' },
      ],
      preferences: [
        '高收入市场',
        '品质要求极高',
        '多语言环境（英语、华语、马来语、淡米尔语）',
        '便利性和速度重要',
        '环保意识强',
        '愿意为高品质支付溢价',
      ],
    },
    topCategories: [
      { name: '电子产品', marketShare: 28, growth: 35, avgPrice: 80 },
      { name: '美妆个护', marketShare: 25, growth: 38, avgPrice: 45 },
      { name: '时尚服饰', marketShare: 22, growth: 32, avgPrice: 50 },
      { name: '家居生活', marketShare: 15, growth: 40, avgPrice: 60 },
      { name: '食品饮品', marketShare: 7, growth: 30, avgPrice: 25 },
      { name: '宠物用品', marketShare: 3, growth: 55, avgPrice: 35 },
    ],
    climate: {
      type: '热带雨林气候',
      features: ['全年高温', '雨量充沛', '无明显季节变化', '湿度高'],
    },
  },
];

// 获取特定国家的市场数据
export function getMarketByCountry(countryCode: string): CountryMarket | undefined {
  return mockMarkets.find(market => market.countryCode === countryCode);
}

// 获取所有国家的顶级类目汇总
export function getAggregatedTopCategories() {
  const categoryMap = new Map<string, { totalShare: number, avgGrowth: number, count: number }>();
  
  mockMarkets.forEach(market => {
    market.topCategories.forEach(cat => {
      const existing = categoryMap.get(cat.name) || { totalShare: 0, avgGrowth: 0, count: 0 };
      categoryMap.set(cat.name, {
        totalShare: existing.totalShare + cat.marketShare,
        avgGrowth: existing.avgGrowth + cat.growth,
        count: existing.count + 1,
      });
    });
  });
  
  return Array.from(categoryMap.entries()).map(([name, data]) => ({
    name,
    avgMarketShare: Math.round(data.totalShare / data.count),
    avgGrowth: Math.round(data.avgGrowth / data.count),
    countries: data.count,
  })).sort((a, b) => b.avgMarketShare - a.avgMarketShare);
}
