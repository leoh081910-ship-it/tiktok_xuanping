import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SupabaseClient {
  from: (table: string) => {
    select: (query: string) => {
      eq: (col: string, val: string | boolean) => Promise<{ data: unknown; error: unknown }>;
      single: () => Promise<{ data: unknown; error: unknown }>;
    };
    upsert: (data: unknown, options?: { onConflict?: string }) => Promise<{ error: unknown }>;
    insert: (data: unknown | unknown[]) => Promise<{ error: unknown }>;
    update: (data: unknown) => { eq: (col: string, val: string) => Promise<{ error: unknown }> };
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    ) as unknown as SupabaseClient;

    const { dataType, country = 'VN' } = await req.json();

    // 查找包含该国家的活跃账号
    const { data: accounts, error: accountError } = await supabase
      .from('tiktok_accounts')
      .select('*')
      .eq('is_active', true);

    if (accountError) {
      throw accountError;
    }

    // 筛选包含目标国家的账号
    const validAccount = (accounts as Array<{ countries: string[]; email: string }>)?.find(
      (acc) => acc.countries && acc.countries.includes(country)
    );

    if (!validAccount) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `${country}站点未配置账号`,
          noAccount: true,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // 模拟登录并切换到目标国家
    console.log(`使用账号 ${validAccount.email} 切换到 ${country} 站点`);
    await loginAndSwitchCountry(validAccount.email, 'password', country);

    let result;
    switch (dataType) {
      case 'opportunities':
        result = await fetchHotOpportunities(country, supabase);
        break;
      case 'rankings':
        result = await fetchProductRankings(country, supabase);
        break;
      case 'keywords':
        result = await fetchHotKeywords(country, supabase);
        break;
      default:
        throw new Error('Invalid data type');
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: result,
        country,
        account: validAccount.email,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('TikTok Shop数据采集错误:', error);

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

async function loginAndSwitchCountry(email: string, password: string, country: string) {
  // 模拟登录TikTok Shop
  await new Promise(resolve => setTimeout(resolve, 300));
  console.log('TikTok Shop登录成功:', email);
  
  // 模拟切换到目标国家站点
  await new Promise(resolve => setTimeout(resolve, 200));
  console.log(`已切换到 ${country} 站点`);
  
  return true;
}

async function fetchHotOpportunities(country: string, supabase: SupabaseClient) {
  await new Promise(resolve => setTimeout(resolve, 800));

  // 时尚配件类目
  const categories = ['hair', 'jewelry', 'watches', 'eyewear', 'wigs', 'accessories'];
  const categoryNames: Record<string, string> = {
    hair: '发饰头饰',
    jewelry: '平价饰品',
    watches: '时尚手表',
    eyewear: '时尚眼镜',
    wigs: '假发发片',
    accessories: '服装配件',
  };

  const opportunities = [];
  for (let i = 0; i < 3; i++) {
    const category = categories[i % categories.length];
    const opp = {
      opportunity_id: `opp_${country}_${Date.now()}_${i}`,
      title: `${categoryNames[category]}新兴趋势 - ${country}`,
      category,
      countries: [country],
      estimated_sales: Math.floor(Math.random() * 200000) + 50000,
      growth_rate: Math.round((Math.random() * 50 + 50) * 10) / 10,
      competition_level: ['low', 'medium'][Math.floor(Math.random() * 2)],
      recommended_price_range: {
        min: Math.floor(Math.random() * 10) + 5,
        max: Math.floor(Math.random() * 30) + 20,
        average: Math.floor(Math.random() * 15) + 15,
      },
      insights: [
        `${country}市场${categoryNames[category]}需求激增`,
        '年轻消费者是主力购买群体',
        '社交媒体营销效果显著',
      ],
      data_source: 'tiktok_official',
    };

    opportunities.push(opp);

    // 保存到数据库
    await supabase
      .from('tiktok_opportunities')
      .upsert(opp, { onConflict: 'opportunity_id' });
  }

  return opportunities;
}

async function fetchProductRankings(country: string, supabase: SupabaseClient) {
  await new Promise(resolve => setTimeout(resolve, 1000));

  const rankingTypes = ['hot_selling', 'trending', 'new_arrivals'];
  const rankings: Record<string, unknown[]> = {};

  const categories = ['hair', 'jewelry', 'watches', 'eyewear', 'wigs', 'accessories'];
  const categoryNames: Record<string, string> = {
    hair: '发饰头饰',
    jewelry: '平价饰品',
    watches: '时尚手表',
    eyewear: '时尚眼镜',
    wigs: '假发发片',
    accessories: '服装配件',
  };

  for (const type of rankingTypes) {
    const products = [];
    for (let rank = 1; rank <= 10; rank++) {
      const category = categories[rank % categories.length];
      const product = {
        ranking_type: type,
        rank,
        product_id: `${type}_${country}_${rank}_${Date.now()}`,
        product_name: `${categoryNames[category]} ${country}爆款 ${rank}`,
        category,
        country,
        sales_volume: Math.floor(Math.random() * 50000) + 10000,
        price: Math.round((Math.random() * 40 + 10) * 100) / 100,
        growth_rate: Math.round((Math.random() * 100 - 20) * 10) / 10,
        image_url: `https://via.placeholder.com/300x300/gradient/FFF?text=Rank${rank}`,
        shop_name: `${country}精品店${rank}`,
        data_date: new Date().toISOString().split('T')[0],
      };

      products.push(product);
    }

    rankings[type] = products;

    // 批量保存到数据库
    await supabase
      .from('tiktok_rankings')
      .insert(products);
  }

  return rankings;
}

async function fetchHotKeywords(country: string, supabase: SupabaseClient) {
  await new Promise(resolve => setTimeout(resolve, 800));

  const baseKeywords = [
    '发夹', '项链', '手表', '墨镜', '假发',
    '围巾', '手套', '帽子', '口罩', '腰带'
  ];

  const keywords = [];
  for (let i = 0; i < 5; i++) {
    const keyword = baseKeywords[i];
    const kwData = {
      keyword: `${keyword} ${country}`,
      country,
      search_volume: Math.floor(Math.random() * 500000) + 100000,
      growth_rate: Math.round((Math.random() * 100 - 10) * 10) / 10,
      competition_score: Math.floor(Math.random() * 100),
      related_keywords: [
        `${keyword}推荐`,
        `${keyword}热卖`,
        `${keyword}爆款`,
        `${country}${keyword}`,
      ],
      suggested_products: [
        `${keyword}套装`,
        `${keyword}礼盒`,
        `时尚${keyword}`,
      ],
      data_date: new Date().toISOString().split('T')[0],
    };

    keywords.push(kwData);

    // 保存到数据库
    await supabase
      .from('tiktok_keywords')
      .insert(kwData);
  }

  return keywords;
}
