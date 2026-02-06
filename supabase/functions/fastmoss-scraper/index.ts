import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ScraperConfig {
  username: string;
  password: string;
}

interface Product {
  product_id: string;
  name: string;
  price: any;
  sales: any;
  growth: any;
  competition: any;
  category: any;
  countries: string[];
  profit_margin: number;
  images: string[];
}

// 真实的 FastMoss 爬虫实现
class FastMossScraper {
  private config: ScraperConfig;
  private cookies: Map<string, string> = new Map();
  private csrfToken: string = '';

  constructor(config: ScraperConfig) {
    this.config = config;
  }

  // 登录 FastMoss
  async login(): Promise<boolean> {
    console.log('🔐 开始登录 FastMoss...');

    try {
      // 步骤 1: 获取登录页面和 CSRF token
      const loginPageResponse = await fetch('https://www.fastmoss.com/login', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        },
      });

      if (!loginPageResponse.ok) {
        throw new Error('无法访问登录页面');
      }

      const loginPageHtml = await loginPageResponse.text();

      // 提取 CSRF token
      const csrfMatch = loginPageHtml.match(/<input[^>]*name=["\']csrf["\'][^>]*value=["']([^"']+)["']/);
      if (csrfMatch) {
        this.csrfToken = csrfMatch[1];
        console.log('✅ 找到 CSRF token');
      }

      // 提取 session cookie
      const setCookieHeader = loginPageResponse.headers.get('set-cookie');
      if (setCookieHeader) {
        this.parseCookies(setCookieHeader);
      }

      // 步骤 2: 提交登录表单
      const formData = new FormData();
      formData.append('username', this.config.username);
      formData.append('password', this.config.password);
      formData.append('csrf_token', this.csrfToken);
      formData.append('remember', '1');

      const loginResponse = await fetch('https://www.fastmoss.com/login', {
        method: 'POST',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': 'https://www.fastmoss.com/login',
          'Cookie': this.getCookieString(),
        },
        body: formData,
      });

      // 步骤 3: 检查登录是否成功
      if (loginResponse.url && !loginResponse.url.includes('/login')) {
        console.log('✅ 登录成功！');
        return true;
      }

      const loginHtml = await loginResponse.text();
      if (loginHtml.includes('Dashboard') || loginHtml.includes('用户中心')) {
        console.log('✅ 登录成功！');
        return true;
      }

      console.log('❌ 登录失败');
      return false;

    } catch (error) {
      console.error('登录错误:', error);
      return false;
    }
  }

  // 爬取商品数据
  async scrapeProducts(keyword: string, country: string): Promise<Product[]> {
    console.log(`🕷️ 开始爬取商品数据 - 关键词: ${keyword}, 国家: ${country}`);

    const products: Product[] = [];

    try {
      // 方案 1: 尝试访问 FastMoss 的数据接口
      const apiUrl = `https://www.fastmoss.com/api/products?keyword=${encodeURIComponent(keyword)}&country=${country}&limit=20`;

      const response = await fetch(apiUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': 'https://www.fastmoss.com/',
          'Cookie': this.getCookieString(),
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ API 接口调用成功，返回 ${data.length || 0} 个商品`);
        return this.parseProductsFromAPI(data);
      }

      // 方案 2: 如果 API 不可用，尝试爬取网页
      console.log('⚠️ API 不可用，尝试爬取网页...');
      return await this.scrapeFromWebpage(keyword, country);

    } catch (error) {
      console.error('爬取错误:', error);
      throw error;
    }
  }

  // 从网页爬取数据
  private async scrapeFromWebpage(keyword: string, country: string): Promise<Product[]> {
    const products: Product[] = [];

    // FastMoss 商品搜索页面 URL
    const searchUrl = `https://www.fastmoss.com/search?q=${encodeURIComponent(keyword)}&category=all&country=${country}`;

    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://www.fastmoss.com/',
        'Cookie': this.getCookieString(),
      },
    });

    if (!response.ok) {
      throw new Error(`无法访问搜索页面: ${response.status}`);
    }

    const html = await response.text();

    // 解析 HTML，提取商品信息
    // 这里需要根据 FastMoss 实际的 HTML 结构来解析
    const productMatches = html.match(/class="product-item"[^>]*>(.*?)<\/div>/gs);

    if (productMatches) {
      console.log(`找到 ${productMatches.length} 个商品元素`);
      // 解析每个商品的详细信息
      // ...
    }

    return products;
  }

  // 解析 API 返回的商品数据
  private parseProductsFromAPI(data: any[]): Product[] {
    const products: Product[] = [];

    for (const item of data) {
      products.push({
        product_id: `fastmoss_${item.id}_${Date.now()}`,
        name: item.title || item.name || 'Unknown',
        price: {
          value: item.price || 0,
          currency: 'USD',
          originalPrice: item.original_price || item.price || 0,
          discount: item.discount || 0,
        },
        sales: {
          total: item.total_sales || 0,
          monthly: item.monthly_sales || 0,
          daily: item.daily_sales || 0,
        },
        growth: {
          rate: item.growth_rate || 0,
          trend: item.trend || 'stable',
        },
        competition: {
          level: item.competition_level || 'medium',
          score: item.competition_score || 50,
        },
        category: {
          primary: item.category || 'other',
          secondary: item.sub_category || '',
        },
        countries: [item.country || 'VN'],
        profit_margin: item.profit_margin || 30,
        images: item.images || [],
      });
    }

    return products;
  }

  // Cookie 管理
  private parseCookies(setCookieHeader: string | null): void {
    if (!setCookieHeader) return;

    const cookies = setCookieHeader.split(', ');
    for (const cookie of cookies) {
      const [nameValue] = cookie.split(';')[0].split('=');
      if (nameValue.length === 2) {
        this.cookies.set(nameValue[0], nameValue[1]);
      }
    }
  }

  private getCookieString(): string {
    return Array.from(this.cookies.entries())
      .map(([name, value]) => `${name}=${value}`)
      .join('; ');
  }
}

// Edge Function 入口
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { taskId } = await req.json();

    if (!taskId) {
      throw new Error('Missing taskId');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // 获取配置
    const { data: config, error: configError } = await supabase
      .from('tiktok_api_configs')
      .select('*')
      .eq('provider', 'fastmoss')
      .eq('is_active', true)
      .single();

    if (configError || !config) {
      throw new Error('FastMoss账号配置未找到');
    }

    console.log('🚀 FastMoss 爬虫启动');
    console.log('配置:', config.username);

    // 更新任务状态
    await supabase
      .from('tiktok_collection_tasks')
      .update({ status: 'running', started_at: new Date().toISOString() })
      .eq('id', taskId);

    // 创建爬虫实例
    const scraper = new FastMossScraper({
      username: config.username,
      password: config.password_encrypted,
    });

    // 登录
    const loginSuccess = await scraper.login();
    if (!loginSuccess) {
      throw new Error('FastMoss 登录失败');
    }

    // 爬取数据（这里使用示例关键词）
    const keywords = ['handbag', 'jewelry', 'watch'];
    const countries = ['VN', 'TH', 'MY', 'SG'];
    const allProducts: Product[] = [];

    let savedCount = 0;
    const totalToScrape = keywords.length * countries.length;

    for (const keyword of keywords) {
      for (const country of countries) {
        try {
          console.log(`爬取: ${keyword} - ${country}`);

          const products = await scraper.scrapeProducts(keyword, country);

          for (const product of products) {
            // 保存到数据库
            const { error } = await supabase
              .from('tiktok_products')
              .upsert({
                product_id: product.product_id,
                name: product.name,
                price: product.price,
                sales: product.sales,
                growth: product.growth,
                competition: product.competition,
                category: product.category,
                countries: product.countries,
                profit_margin: product.profit_margin,
                images: product.images,
                data_source: 'fastmoss',
              }, {
                onConflict: 'product_id'
              });

            if (!error) {
              savedCount++;
              allProducts.push(product);

              // 更新进度
              await supabase
                .from('tiktok_collection_tasks')
                .update({
                  items_collected: savedCount,
                  progress: Math.floor((savedCount / totalToScrape) * 100),
                })
                .eq('id', taskId);
            }
          }

          // 避免请求过快
          await new Promise(resolve => setTimeout(resolve, 1000));

        } catch (error) {
          console.error(`爬取失败 ${keyword} - ${country}:`, error);
          // 继续爬取其他商品
        }
      }
    }

    // 标记任务完成
    await supabase
      .from('tiktok_collection_tasks')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        items_collected: savedCount,
        items_total: totalToScrape,
        progress: 100,
      })
      .eq('id', taskId);

    console.log(`✅ 爬虫完成! 成功采集 ${savedCount} 个商品`);

    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type');
    headers.set('Content-Type', 'application/json');

    return new Response(
      JSON.stringify({
        success: true,
        message: `成功采集 ${savedCount} 个商品`,
        itemsCollected: savedCount,
        productsCount: allProducts.length,
      }),
      { headers, status: 200 }
    );

  } catch (error) {
    console.error('FastMoss爬虫错误:', error);

    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type');
    headers.set('Content-Type', 'application/json');

    return new Response(
      JSON.stringify({
        success: false,
        error: (error as Error).message,
        hint: '请检查 FastMoss 账号密码是否正确，或者网站结构是否发生变化'
      }),
      { headers, status: 500 }
    );
  }
});
