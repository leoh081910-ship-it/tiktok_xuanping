import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { keywords, country, timeRange = '3m' } = await req.json();

    if (!keywords || !country) {
      throw new Error('Missing required parameters: keywords and country');
    }

    // 模拟Google Trends数据
    // 实际应用中，这里会调用Google Trends API或使用爬虫
    const trendsData = await fetchGoogleTrends(keywords, country, timeRange);

    return new Response(
      JSON.stringify({
        success: true,
        data: trendsData,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error fetching Google Trends:', error);

    return new Response(
      JSON.stringify({ 
        success: false,
        error: (error as Error).message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

async function fetchGoogleTrends(keywords: string[], country: string, timeRange: string) {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 500));

  // 生成过去3个月的数据点
  const dataPoints = 12; // 12周
  const dates = [];
  const now = new Date();
  
  for (let i = dataPoints - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - (i * 7)); // 每周一个数据点
    dates.push(date.toISOString().split('T')[0]);
  }

  // 为每个关键词生成趋势数据
  const keywordData = keywords.map(keyword => {
    // 基础热度值（根据关键词类型调整）
    const baseValue = getBaseValueForKeyword(keyword, country);
    
    // 生成带有趋势和波动的数据
    const values = dates.map((date, index) => {
      // 添加整体趋势（上升或下降）
      const trend = baseValue * (1 + (index / dataPoints) * getTrendFactor(keyword));
      
      // 添加季节性波动
      const seasonality = Math.sin(index * Math.PI / 6) * baseValue * 0.15;
      
      // 添加随机噪音
      const noise = (Math.random() - 0.5) * baseValue * 0.1;
      
      const value = Math.max(0, Math.min(100, trend + seasonality + noise));
      
      return Math.round(value);
    });

    return {
      keyword,
      data: dates.map((date, index) => ({
        date,
        value: values[index],
      })),
      avgValue: Math.round(values.reduce((a, b) => a + b, 0) / values.length),
      trend: values[values.length - 1] > values[0] ? 'up' : 'down',
      change: Math.round(((values[values.length - 1] - values[0]) / values[0]) * 100),
    };
  });

  // 相关查询（Related Queries）
  const relatedQueries = generateRelatedQueries(keywords, country);

  // 地区分布（Regional Interest）
  const regionalData = generateRegionalData(keywords[0], country);

  return {
    keywords: keywordData,
    relatedQueries,
    regionalData,
    timeRange,
    country,
    lastUpdated: new Date().toISOString(),
  };
}

function getBaseValueForKeyword(keyword: string, country: string): number {
  // 根据关键词和国家返回基础热度值
  const keywordPopularity: Record<string, number> = {
    '包包': 70,
    'handbag': 65,
    'bag': 75,
    '首饰': 60,
    'jewelry': 68,
    'necklace': 55,
    '手表': 72,
    'watch': 78,
    '太阳镜': 58,
    'sunglasses': 62,
    '帽子': 52,
    'hat': 50,
    '围巾': 45,
    'scarf': 48,
    '腰带': 42,
    'belt': 45,
    '发夹': 65,
    'hair clip': 60,
  };

  // 国家因子
  const countryFactor: Record<string, number> = {
    'VN': 1.2, // 越南市场活跃
    'TH': 1.1, // 泰国市场活跃
    'MY': 1.0, // 马来西亚标准
    'SG': 0.9, // 新加坡市场小但精
  };

  const base = keywordPopularity[keyword.toLowerCase()] || 50;
  const factor = countryFactor[country] || 1.0;

  return base * factor;
}

function getTrendFactor(keyword: string): number {
  // 不同关键词的增长趋势
  const growingKeywords = ['发夹', 'hair clip', '首饰', 'jewelry', '包包', 'handbag'];
  const stableKeywords = ['手表', 'watch', '太阳镜', 'sunglasses'];
  
  if (growingKeywords.some(k => keyword.toLowerCase().includes(k.toLowerCase()))) {
    return 0.3; // 30%增长
  } else if (stableKeywords.some(k => keyword.toLowerCase().includes(k.toLowerCase()))) {
    return 0.05; // 5%增长
  } else {
    return 0.15; // 15%增长
  }
}

function generateRelatedQueries(keywords: string[], country: string) {
  const relatedByKeyword: Record<string, string[]> = {
    '包包': ['小包', '单肩包', '手提包', '链条包', 'mini包'],
    'handbag': ['leather bag', 'tote bag', 'shoulder bag', 'crossbody bag', 'clutch'],
    '首饰': ['项链', '耳环', '手链', '戒指', '925银'],
    'jewelry': ['necklace', 'earrings', 'bracelet', 'ring', 'pendant'],
    '手表': ['电子表', '机械表', '运动表', '智能表', '防水表'],
    'watch': ['smartwatch', 'digital watch', 'sports watch', 'waterproof watch', 'fitness watch'],
  };

  const keyword = keywords[0].toLowerCase();
  const related = relatedByKeyword[keyword] || ['fashion accessories', 'online shopping', 'trendy items'];

  return {
    top: related.slice(0, 5).map((query, index) => ({
      query,
      value: 100 - (index * 15),
    })),
    rising: related.slice(2, 7).map((query, index) => ({
      query,
      value: `+${150 - (index * 20)}%`,
    })),
  };
}

function generateRegionalData(keyword: string, country: string) {
  // 根据国家生成地区数据
  const regions: Record<string, string[]> = {
    'VN': ['Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng'],
    'TH': ['Bangkok', 'Chiang Mai', 'Phuket', 'Pattaya', 'Khon Kaen'],
    'MY': ['Kuala Lumpur', 'Penang', 'Johor Bahru', 'Malacca', 'Kota Kinabalu'],
    'SG': ['Central', 'East', 'West', 'North', 'North-East'],
  };

  const countryRegions = regions[country] || ['Region 1', 'Region 2', 'Region 3'];

  return countryRegions.map((region, index) => ({
    region,
    value: 100 - (index * 12),
  }));
}

/*
 * 真实Google Trends API集成示例：
 * 
 * 可以使用以下npm包（需要在Deno中适配）：
 * 1. google-trends-api
 * 2. serpapi (Google Trends API)
 * 
 * 示例代码：
 * 
 * import googleTrends from 'npm:google-trends-api';
 * 
 * const results = await googleTrends.interestOverTime({
 *   keyword: keywords,
 *   startTime: new Date('2024-01-01'),
 *   endTime: new Date(),
 *   geo: country,
 * });
 * 
 * 或使用SerpApi：
 * 
 * const response = await fetch(
 *   `https://serpapi.com/search.json?engine=google_trends&q=${keyword}&geo=${country}&api_key=${API_KEY}`
 * );
 */
