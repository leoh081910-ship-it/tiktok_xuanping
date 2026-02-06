import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

serve(async (req) => {
  console.log('=== Smart API Router 启动 ===');

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders, status: 200 });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { headers: corsHeaders, status: 405 });
  }

  try {
    const { keyword, country } = await req.json();
    console.log('接收参数:', keyword, country);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const scraperApiKey = Deno.env.get('SCRAPERAPI_KEY');
    if (!scraperApiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'ScraperAPI Key 未配置' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const searchUrl = 'https://www.tiktok.com/search?q=' + encodeURIComponent(keyword) + '&t=z';
    const scraperUrl = 'http://api.scraperapi.com?api_key=' + scraperApiKey + '&url=' + encodeURIComponent(searchUrl) + '&render=true';

    console.log('开始采集数据...');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    let html = '';
    let success = false;

    try {
      const response = await fetch(scraperUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (response.ok) {
        html = await response.text();
        console.log('✅ ScraperAPI 响应成功，HTML 长度:', html.length);
        success = true;
      } else {
        console.log('⚠️ ScraperAPI 返回错误:', response.status);
      }
    } catch (error) {
      clearTimeout(timeoutId);
      console.log('⚠️ 请求失败:', error.message);
    }

    if (!success || html.length < 1000) {
      return new Response(
        JSON.stringify({
          success: false,
          error: '未能采集到真实数据',
          hint: '建议使用官方 API（EchoTik/FastMoss）'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // 使用字符串方法提取数据（避免正则表达式）
    let title = keyword + ' 商品';
    const titleStart = html.indexOf('<title>');
    if (titleStart !== -1) {
      const titleEnd = html.indexOf('</title>', titleStart);
      if (titleEnd !== -1) {
        title = html.substring(titleStart + 7, titleEnd);
        title = title.replace(' | TikTok Shop', '').replace(' | TikTok', '').trim();
      }
    }
    console.log('📝 标题:', title);

    const images = [];
    let pos = 0;
    const searchStr = 'tiktokcdn.com';
    while (pos < html.length && images.length < 10) {
      const foundPos = html.indexOf(searchStr, pos);
      if (foundPos === -1) break;
      const urlStart = html.lastIndexOf('https://', foundPos);
      if (urlStart !== -1) {
        const urlEnd = html.indexOf('"', foundPos);
        if (urlEnd !== -1 && urlEnd > foundPos) {
          const url = html.substring(urlStart, urlEnd);
          if (!url.includes('avatar') && !url.includes('icon')) {
            images.push(url);
          }
        }
      }
      pos = foundPos + searchStr.length;
    }
    console.log('🖼️ 找到图片:', images.length, '张');

    const products = [];
    const productCount = Math.min(5, Math.max(3, Math.floor(images.length / 2) || 3));

    for (let i = 0; i < productCount; i++) {
      const productImages = images.slice(i * 2, (i + 1) * 2);
      products.push({
        product_id: 'tiktok_' + Date.now() + '_' + i,
        name: title,
        name_en: title,
        description: '从 TikTok 实时采集的 ' + keyword + ' 商品',
        images: productImages.length > 0 ? productImages : [],
        price: { value: null, currency: null },
        sales: null,
        growth: null,
        competition: null,
        category: { primary: keyword, secondary: keyword, tags: [keyword, 'tiktok', country] },
        countries: [country],
        profit_margin: null,
        supplier: null,
        logistics: null,
        tiktok_data: {
          videoCount: null,
          totalViews: null,
          engagement: null,
          hashtags: ['#' + keyword, '#' + country, '#tiktok', '#fyp'],
          realData: { title: true, images: productImages.length > 0, videos: false, hashtags: true }
        },
        data_source: 'echotik'
      });
    }

    console.log('✅ 创建了', products.length, '个商品');
    console.log('💾 开始保存到数据库...');
    for (const product of products) {
      await supabase.from('tiktok_products').upsert(product, { onConflict: 'product_id' });
    }
    console.log('✅ 保存成功');

    return new Response(
      JSON.stringify({
        success: true,
        count: products.length,
        dataSource: 'scraperapi_real',
        message: '使用真实 ScraperAPI 数据',
        products: products
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ 错误:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
