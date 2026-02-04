import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { taskId, provider } = await req.json();

    if (!taskId || !provider) {
      throw new Error('Missing taskId or provider');
    }

    const { data: config, error: configError } = await supabase
      .from('tiktok_api_configs')
      .select('*')
      .eq('provider', provider)
      .eq('is_active', true)
      .single();

    if (configError || !config) {
      throw new Error('API configuration not found');
    }

    await supabase
      .from('tiktok_collection_tasks')
      .update({
        status: 'running',
        started_at: new Date().toISOString(),
      })
      .eq('id', taskId);

    const mockProducts = await collectMockData(provider, config.api_key);

    let savedCount = 0;
    for (const product of mockProducts) {
      const { error } = await supabase
        .from('tiktok_products')
        .upsert({
          product_id: product.product_id,
          name: product.name,
          name_en: product.name_en,
          description: product.description,
          images: product.images,
          price: product.price,
          sales: product.sales,
          growth: product.growth,
          competition: product.competition,
          category: product.category,
          countries: product.countries,
          profit_margin: product.profit_margin,
          supplier: product.supplier,
          logistics: product.logistics,
          tiktok_data: product.tiktok_data,
          data_source: provider,
        }, {
          onConflict: 'product_id'
        });

      if (!error) {
        savedCount++;
        
        await supabase
          .from('tiktok_collection_tasks')
          .update({
            items_collected: savedCount,
            progress: Math.floor((savedCount / mockProducts.length) * 100),
          })
          .eq('id', taskId);
      }
    }

    await supabase
      .from('tiktok_collection_tasks')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        items_collected: savedCount,
        progress: 100,
      })
      .eq('id', taskId);

    await supabase
      .from('tiktok_api_configs')
      .update({ last_used_at: new Date().toISOString() })
      .eq('provider', provider);

    return new Response(
      JSON.stringify({
        success: true,
        itemsCollected: savedCount,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in collect-tiktok-data:', error);

    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

async function collectMockData(provider: string, apiKey: string) {
  await new Promise(resolve => setTimeout(resolve, 1000));

  const countries = ['VN', 'TH', 'MY', 'SG'];
  
  // 更新的时尚配件类目（6个类目）
  const fashionAccessories = [
    { category: 'hair', names: ['发夹', '发圈', '发带', '鲨鱼夹', '头箍'], nameEn: 'Hair Accessory' },
    { category: 'jewelry', names: ['项链', '耳环', '手链', '戒指', '脚链'], nameEn: 'Jewelry' },
    { category: 'watches', names: ['电子表', '石英表', '智能手表', '运动手表', '时装表'], nameEn: 'Watch' },
    { category: 'eyewear', names: ['太阳镜', '墨镜', '偏光镜', '防UV眼镜', '装饰眼镜'], nameEn: 'Eyewear' },
    { category: 'wigs', names: ['长发假发', '短发假发', '发片', '刘海假发', '造型假发'], nameEn: 'Wig' },
    { category: 'accessories', names: ['领夹', '胸针', '围巾', '皮带', '领带', '手套', '帽子', '手帕', '口罩', '袖扣'], nameEn: 'Accessory' },
  ];
  
  const products = [];
  const productCount = 15;

  for (let i = 0; i < productCount; i++) {
    const accessory = fashionAccessories[Math.floor(Math.random() * fashionAccessories.length)];
    const itemName = accessory.names[Math.floor(Math.random() * accessory.names.length)];
    const price = Math.random() * 50 + 3;
    const sales = Math.floor(Math.random() * 15000) + 1000;
    const growthRate = Math.random() * 80 - 10;
    
    products.push({
      product_id: `${provider}_${accessory.category}_${Date.now()}_${i}`,
      name: `【${provider === 'echotik' ? 'EchoTik' : 'FastMoss'}精选】${itemName} 时尚百搭 品质优选`,
      name_en: `${accessory.nameEn} Fashion Quality ${provider}`,
      description: `来自${provider}的精选${itemName}，适合东南亚市场，品质保证`,
      images: [
        `https://via.placeholder.com/400x400/${Math.floor(Math.random() * 16777215).toString(16)}/333?text=${accessory.nameEn}`,
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
        rate: Math.round(growthRate * 10) / 10,
        trend: growthRate > 0 ? 'up' : growthRate < -5 ? 'down' : 'stable',
      },
      competition: {
        level: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
        score: Math.floor(Math.random() * 100),
        competitors: Math.floor(Math.random() * 80) + 10,
      },
      category: {
        primary: accessory.category,
        secondary: itemName,
        tags: [itemName, provider, '时尚配件'],
      },
      countries: countries.slice(0, Math.floor(Math.random() * 4) + 1),
      profit_margin: Math.floor(Math.random() * 50) + 30,
      supplier: {
        name: `${provider}推荐供应商`,
        platform: '1688',
        rating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10,
        minOrder: Math.floor(Math.random() * 100) + 20,
      },
      logistics: {
        shippingTime: '3-7天',
        warehouseLocation: ['深圳', '广州', '义乌'][Math.floor(Math.random() * 3)],
        shippingCost: Math.round((Math.random() * 8 + 2) * 10) / 10,
      },
      tiktok_data: {
        videoCount: Math.floor(Math.random() * 2000) + 100,
        totalViews: Math.floor(Math.random() * 8000000) + 500000,
        engagement: Math.round((Math.random() * 5 + 5) * 10) / 10,
        hashtags: [`#${itemName}`, `#${provider}`, '#fashion'],
      },
    });
  }

  return products;
}
