# 🔌 API集成示例代码

## 快速开始指南

### 1. RapidAPI TikTok API 集成

#### 步骤1: 注册获取API Key

1. 访问 https://rapidapi.com/
2. 注册账号
3. 搜索 "TikTok Product API"
4. 订阅免费或付费计划
5. 获取 `X-RapidAPI-Key`

#### 步骤2: 添加密钥到Supabase

```bash
# 使用项目提供的工具添加密钥
# 在Supabase Dashboard添加secrets
```

在代码中：
```typescript
const RAPIDAPI_KEY = Deno.env.get('RAPIDAPI_KEY');
```

#### 步骤3: 创建Edge Function

```typescript
// supabase/functions/rapidapi-products/index.ts
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
    const { keyword, country = 'VN' } = await req.json();
    
    const RAPIDAPI_KEY = Deno.env.get('RAPIDAPI_KEY');
    if (!RAPIDAPI_KEY) {
      throw new Error('RAPIDAPI_KEY未配置');
    }

    // 调用RapidAPI
    const response = await fetch(
      `https://tiktok-product-api.p.rapidapi.com/product/search?keyword=${encodeURIComponent(keyword)}&region=${country}`,
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'tiktok-product-api.p.rapidapi.com'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`API调用失败: ${response.statusText}`);
    }

    const data = await response.json();

    // 转换数据格式
    const products = data.items?.map((item: any) => ({
      product_id: `rapid_${item.id}`,
      name: item.title,
      name_en: item.title_en || item.title,
      description: item.description || '',
      images: item.images || [],
      price: {
        value: item.price?.current || 0,
        currency: 'USD',
        originalPrice: item.price?.original || 0,
        discount: item.discount || 0
      },
      sales: {
        total: item.sales?.total || 0,
        daily: item.sales?.daily || 0,
        weekly: item.sales?.weekly || 0,
        monthly: item.sales?.monthly || 0
      },
      growth: {
        rate: item.growth_rate || 0,
        trend: item.trend || 'stable'
      },
      competition: {
        level: item.competition?.level || 'medium',
        score: item.competition?.score || 50,
        competitors: item.competitors || 0
      },
      category: {
        primary: item.category || 'accessories',
        secondary: item.subcategory || '',
        tags: item.tags || []
      },
      countries: [country],
      profit_margin: item.profit_margin || 50,
      data_source: 'rapidapi'
    })) || [];

    // 保存到数据库
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    for (const product of products) {
      await supabase.from('tiktok_products').upsert(product, {
        onConflict: 'product_id'
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        count: products.length,
        products
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: (error as Error).message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
```

#### 步骤4: 前端调用

```typescript
// src/lib/api/rapidapi.ts
import { supabase } from '@/integrations/supabase/client';

export async function fetchRealProducts(keyword: string, country: string) {
  const { data, error } = await supabase.functions.invoke('rapidapi-products', {
    body: { keyword, country }
  });

  if (error) {
    throw error;
  }

  return data;
}
```

在页面中使用：
```typescript
// src/pages/DataCollection.tsx
import { fetchRealProducts } from '@/lib/api/rapidapi';

const handleRapidAPIFetch = async () => {
  setLoading(true);
  try {
    const result = await fetchRealProducts('jewelry', 'VN');
    toast.success(`成功采集${result.count}个商品`);
  } catch (error) {
    toast.error('采集失败: ' + error.message);
  } finally {
    setLoading(false);
  }
};
```

---

### 2. Google Trends API 集成（免费）

#### 安装依赖

```bash
npm install google-trends-api
```

#### Edge Function实现

```typescript
// supabase/functions/google-trends-enhanced/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  const { keywords, country } = await req.json();

  // 使用fetch调用非官方Trends API
  const trends = await Promise.all(
    keywords.map(async (keyword: string) => {
      const response = await fetch(
        `https://trends.google.com/trends/api/explore?hl=en-US&tz=-480&req={"comparisonItem":[{"keyword":"${keyword}","geo":"${country}","time":"today 3-m"}],"category":0,"property":""}`
      );
      
      const text = await response.text();
      // 解析Google Trends返回的数据
      const data = JSON.parse(text.slice(5)); // 移除 )]}',
      
      return {
        keyword,
        data: data.default.timelineData
      };
    })
  );

  return new Response(JSON.stringify(trends), {
    headers: { 'Content-Type': 'application/json' }
  });
});
```

---

### 3. Shopee API 集成

```typescript
// supabase/functions/shopee-products/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createHmac } from 'https://deno.land/std@0.170.0/node/crypto.ts';

serve(async (req) => {
  const { keyword, country } = await req.json();
  
  const partnerId = Deno.env.get('SHOPEE_PARTNER_ID');
  const partnerKey = Deno.env.get('SHOPEE_PARTNER_KEY');
  const shopId = Deno.env.get('SHOPEE_SHOP_ID');
  
  const timestamp = Math.floor(Date.now() / 1000);
  const path = '/api/v2/product/search_item';
  const baseString = `${partnerId}${path}${timestamp}`;
  
  // 生成签名
  const sign = createHmac('sha256', partnerKey)
    .update(baseString)
    .digest('hex');

  const response = await fetch(
    `https://partner.shopeemobile.com${path}?partner_id=${partnerId}&timestamp=${timestamp}&sign=${sign}&shop_id=${shopId}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        keyword,
        page_size: 50
      })
    }
  );

  const data = await response.json();
  
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  });
});
```

---

### 4. 1688 API 集成

```typescript
// supabase/functions/alibaba-1688/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  const { keyword } = await req.json();
  
  const appKey = Deno.env.get('ALIBABA_APP_KEY');
  const appSecret = Deno.env.get('ALIBABA_APP_SECRET');
  
  // 1688 API调用逻辑
  const timestamp = Date.now();
  
  // 生成签名（简化版）
  const sign = generateSign(appKey, appSecret, timestamp);
  
  const response = await fetch(
    `https://gw.open.1688.com/openapi/param2/1/com.alibaba.product/alibaba.product.search/${appKey}?keyword=${keyword}&sign=${sign}&timestamp=${timestamp}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }
  );

  const data = await response.json();
  
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  });
});

function generateSign(appKey: string, appSecret: string, timestamp: number) {
  // 实现1688签名算法
  // 具体算法见1688官方文档
  return 'signature_here';
}
```

---

### 5. 组合使用多个API

```typescript
// supabase/functions/aggregate-data/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  const { keyword, country } = await req.json();
  
  // 并发调用多个API
  const [rapidApiData, googleTrends, shopeeData] = await Promise.allSettled([
    fetchRapidAPI(keyword, country),
    fetchGoogleTrends(keyword, country),
    fetchShopee(keyword, country)
  ]);

  // 聚合数据
  const aggregatedData = {
    products: rapidApiData.status === 'fulfilled' ? rapidApiData.value : [],
    trends: googleTrends.status === 'fulfilled' ? googleTrends.value : [],
    shopee: shopeeData.status === 'fulfilled' ? shopeeData.value : [],
    timestamp: new Date().toISOString()
  };

  return new Response(JSON.stringify(aggregatedData), {
    headers: { 'Content-Type': 'application/json' }
  });
});
```

---

## 🔐 密钥管理

### 添加API密钥到Supabase

```bash
# 方式1: 使用Supabase CLI
supabase secrets set RAPIDAPI_KEY=your_key_here
supabase secrets set SHOPEE_PARTNER_ID=your_id_here
supabase secrets set ALIBABA_APP_KEY=your_key_here

# 方式2: 使用Supabase Dashboard
# Settings → Edge Functions → Secrets
# 添加环境变量
```

### 在代码中使用

```typescript
const apiKey = Deno.env.get('RAPIDAPI_KEY');
if (!apiKey) {
  throw new Error('API密钥未配置');
}
```

---

## 📊 数据格式转换

### 统一数据格式

```typescript
interface UnifiedProduct {
  product_id: string;
  name: string;
  name_en: string;
  description: string;
  images: string[];
  price: {
    value: number;
    currency: string;
    originalPrice: number;
    discount: number;
  };
  sales: {
    total: number;
    daily: number;
    weekly: number;
    monthly: number;
  };
  growth: {
    rate: number;
    trend: 'up' | 'down' | 'stable';
  };
  data_source: string;
}

function convertRapidAPIData(rawData: any): UnifiedProduct {
  return {
    product_id: `rapid_${rawData.id}`,
    name: rawData.title,
    // ... 其他字段转换
    data_source: 'rapidapi'
  };
}

function convertShopeeData(rawData: any): UnifiedProduct {
  return {
    product_id: `shopee_${rawData.itemid}`,
    name: rawData.name,
    // ... 其他字段转换
    data_source: 'shopee'
  };
}
```

---

## 🚀 部署和测试

### 部署Edge Function

```bash
# 部署单个函数
supabase functions deploy rapidapi-products

# 部署所有函数
supabase functions deploy
```

### 测试API

```bash
# 测试RapidAPI集成
curl -X POST https://your-project.supabase.co/functions/v1/rapidapi-products \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"keyword":"jewelry","country":"VN"}'
```

---

## 💰 成本估算

### RapidAPI方案（推荐）

```
免费套餐: 500次/月 = $0
Basic套餐: 10,000次/月 = $9.99
Pro套餐: 100,000次/月 = $49.99

预计使用:
- 每天采集4国 x 6类目 = 24次
- 每月 24 x 30 = 720次
- 建议: Basic套餐（$9.99/月）
```

### 混合方案（性价比最高）

```
Google Trends: 免费
RapidAPI Basic: $9.99/月
自建爬虫: 免费（服务器成本已含）

总成本: 约¥70/月
```

---

## ⚠️ 注意事项

1. **API限流**: 实现请求队列避免超限
2. **错误处理**: 添加重试机制
3. **数据缓存**: 避免重复请求
4. **成本监控**: 定期检查API调用量
5. **合规使用**: 遵守各平台服务条款

---

需要我帮您实现具体的API集成吗？
