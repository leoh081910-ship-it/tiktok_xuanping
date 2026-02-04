# 📡 商品信息采集API资源

## 🎯 TikTok相关API

### 1. TikTok Shop官方API（推荐）
**官网**: https://seller.tiktok.com/

**优点**:
- ✅ 官方数据，最准确
- ✅ 实时更新
- ✅ 合法合规

**缺点**:
- ❌ 需要TikTok Shop卖家账号
- ❌ 需要申请开发者权限
- ❌ 有调用限制

**申请流程**:
```
1. 注册TikTok Shop卖家账号
2. 访问开发者中心: https://partner.tiktokshop.com/
3. 创建应用获取API密钥
4. 配置回调URL
5. 获得App Key和App Secret
```

**主要接口**:
```javascript
// 商品搜索
GET /api/products/search

// 类目获取
GET /api/products/categories

// 商品详情
GET /api/products/details

// 销售数据
GET /api/products/sales
```

---

### 2. RapidAPI - TikTok数据API
**平台**: https://rapidapi.com/

#### A. TikTok Product API
**地址**: https://rapidapi.com/mrrobot2110/api/tiktok-product-api/

**价格**: 
- 免费: 500请求/月
- Basic: $9.99/月, 10,000请求
- Pro: $49.99/月, 100,000请求

**功能**:
```javascript
// 商品搜索
GET /product/search?keyword=jewelry&region=VN

// 热门商品
GET /product/trending?category=fashion&country=VN

// 商品详情
GET /product/details?id=12345
```

**示例代码**:
```javascript
const options = {
  method: 'GET',
  url: 'https://tiktok-product-api.p.rapidapi.com/product/search',
  params: {
    keyword: 'jewelry',
    region: 'VN'
  },
  headers: {
    'X-RapidAPI-Key': 'YOUR_API_KEY',
    'X-RapidAPI-Host': 'tiktok-product-api.p.rapidapi.com'
  }
};
```

#### B. TikTok Shop Data API
**地址**: https://rapidapi.com/datalab6/api/tiktok-shop-data/

**价格**:
- 免费: 100请求/月
- Basic: $19.99/月, 5,000请求

**功能**:
- 商品搜索和排名
- 卖家数据
- 评论分析
- 销售趋势

---

### 3. Apify - TikTok爬虫
**官网**: https://apify.com/

**TikTok Scraper**:
```
https://apify.com/clockworks/tiktok-scraper
```

**价格**:
- 免费: $5额度/月
- Personal: $49/月
- Team: $499/月

**功能**:
- 商品数据爬取
- 视频数据分析
- 评论采集
- 用户信息

**使用方式**:
```javascript
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({
    token: 'YOUR_TOKEN',
});

const run = await client.actor("clockworks/tiktok-scraper").call({
    searchQueries: ['fashion jewelry Vietnam'],
    maxResults: 100
});
```

---

## 🛒 电商数据API

### 4. 1688/Taobao数据API

#### A. 1688 Open Platform（官方）
**官网**: https://open.1688.com/

**优点**:
- ✅ 官方供应商数据
- ✅ 价格实时更新
- ✅ 库存信息准确

**申请**:
```
1. 注册1688企业账号
2. 申请开发者账号
3. 创建应用获取AppKey
```

#### B. 第三方1688数据API
**推荐平台**:
- 聚合数据: https://www.juhe.cn/
- 极速数据: https://www.jisuapi.com/

**价格**: ¥100-500/月

---

### 5. Shopee API
**官网**: https://open.shopee.com/

**覆盖国家**: 
- 🇻🇳 越南
- 🇹🇭 泰国
- 🇲🇾 马来西亚
- 🇸🇬 新加坡

**优点**:
- ✅ 东南亚最大电商平台
- ✅ 官方API完善
- ✅ 数据准确

**主要接口**:
```javascript
// 商品搜索
POST /api/v2/product/search_item

// 类目列表
GET /api/v2/product/get_category

// 商品详情
GET /api/v2/product/get_item_base_info
```

---

### 6. Lazada API
**官网**: https://open.lazada.com/

**覆盖国家**: 东南亚6国

**功能**:
- 商品搜索和管理
- 订单处理
- 物流追踪
- 营销工具

---

## 🔍 综合数据平台

### 7. EchoTik（专业TikTok数据）
**官网**: https://www.echotik.com/

**功能**:
- 🎯 TikTok商品分析
- 📊 销售数据追踪
- 🔥 热门商品发现
- 💡 市场洞察

**价格**:
- 免费版: 基础功能
- 专业版: $99/月
- 企业版: 定制

**API文档**: 需联系客服获取

---

### 8. FastMoss
**官网**: https://www.fastmoss.com/

**功能**:
- TikTok商品数据
- 竞品分析
- 趋势预测
- 供应链对接

**价格**:
- 标准版: ¥299/月
- 专业版: ¥999/月

---

### 9. DataCrow（数据鸦）
**官网**: https://www.datacrow.cn/

**功能**:
- 跨境电商数据
- TikTok/Shopee/Lazada
- 数据API接口

**价格**: ¥500-2000/月

---

## 🆓 免费/开源方案

### 10. Google Trends API
**地址**: https://trends.google.com/

**优点**:
- ✅ 完全免费
- ✅ 全球数据
- ✅ 趋势分析

**非官方库**:
```bash
npm install google-trends-api
```

**示例**:
```javascript
const googleTrends = require('google-trends-api');

googleTrends.interestByRegion({
  keyword: 'fashion jewelry',
  startTime: new Date('2024-01-01'),
  geo: 'VN'
})
.then((results) => {
  console.log(results);
});
```

---

### 11. 网页爬虫方案

#### A. Puppeteer（免费）
```bash
npm install puppeteer
```

```javascript
const puppeteer = require('puppeteer');

async function scrapeTikTok() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto('https://www.tiktok.com/search?q=jewelry');
  
  const products = await page.evaluate(() => {
    // 提取商品信息
  });
  
  await browser.close();
}
```

#### B. Cheerio + Axios（免费）
```bash
npm install axios cheerio
```

```javascript
const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeProducts(url) {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  
  const products = [];
  $('.product-item').each((i, el) => {
    products.push({
      name: $(el).find('.name').text(),
      price: $(el).find('.price').text()
    });
  });
  
  return products;
}
```

---

## 📊 推荐方案对比

| API/工具 | 价格 | 数据质量 | 难度 | 推荐度 |
|---------|------|---------|------|--------|
| TikTok Shop官方API | 免费* | ⭐⭐⭐⭐⭐ | 难 | ⭐⭐⭐⭐⭐ |
| RapidAPI TikTok API | $10-50/月 | ⭐⭐⭐⭐ | 易 | ⭐⭐⭐⭐ |
| EchoTik | $99/月 | ⭐⭐⭐⭐ | 易 | ⭐⭐⭐⭐ |
| FastMoss | ¥299/月 | ⭐⭐⭐⭐ | 易 | ⭐⭐⭐⭐ |
| Apify | $49/月 | ⭐⭐⭐ | 中 | ⭐⭐⭐ |
| Shopee API | 免费* | ⭐⭐⭐⭐⭐ | 中 | ⭐⭐⭐⭐ |
| Google Trends | 免费 | ⭐⭐⭐ | 易 | ⭐⭐⭐⭐ |
| Puppeteer爬虫 | 免费 | ⭐⭐ | 难 | ⭐⭐⭐ |

*需要商家/开发者账号

---

## 🎯 针对本项目的建议

### 短期方案（0-30元/月预算）
```javascript
1. Google Trends API（免费）
   - 用于市场趋势分析
   - 关键词热度追踪

2. RapidAPI基础套餐（$9.99/月）
   - 基础商品数据采集
   - 每月10,000次请求够用

3. 自建简单爬虫
   - Puppeteer爬取公开数据
   - 配合代理池避免封禁
```

### 中期方案（¥300-500/月）
```javascript
1. FastMoss标准版（¥299/月）
   - 完整TikTok数据
   - 直接集成API

2. 1688数据API（¥200/月）
   - 供应商信息
   - 价格数据

3. Google Trends（免费）
   - 趋势分析补充
```

### 长期方案（¥1000+/月）
```javascript
1. TikTok Shop官方API
   - 申请官方授权
   - 最准确的数据

2. EchoTik专业版（$99/月）
   - 深度数据分析
   - 竞品追踪

3. Shopee/Lazada API
   - 多平台对比
   - 完整生态数据

4. 自建数据库
   - 历史数据积累
   - 趋势分析模型
```

---

## 🔧 快速集成示例

### 使用RapidAPI TikTok API

```typescript
// src/lib/api/rapidapi-tiktok.ts
import axios from 'axios';

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const API_HOST = 'tiktok-product-api.p.rapidapi.com';

export async function searchProducts(keyword: string, country: string) {
  try {
    const response = await axios.get(
      `https://${API_HOST}/product/search`,
      {
        params: { keyword, region: country },
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': API_HOST
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('API调用失败:', error);
    throw error;
  }
}

export async function getTrendingProducts(category: string, country: string) {
  const response = await axios.get(
    `https://${API_HOST}/product/trending`,
    {
      params: { category, country },
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': API_HOST
      }
    }
  );
  
  return response.data;
}
```

### 创建Edge Function调用API

```typescript
// supabase/functions/fetch-real-data/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  const { keyword, country } = await req.json();
  
  const response = await fetch(
    `https://tiktok-product-api.p.rapidapi.com/product/search?keyword=${keyword}&region=${country}`,
    {
      headers: {
        'X-RapidAPI-Key': Deno.env.get('RAPIDAPI_KEY')!,
        'X-RapidAPI-Host': 'tiktok-product-api.p.rapidapi.com'
      }
    }
  );
  
  const data = await response.json();
  
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  });
});
```

---

## 📞 获取帮助

- RapidAPI市场: https://rapidapi.com/
- Apify演员市场: https://apify.com/store
- TikTok开发者论坛: https://developers.tiktok.com/
- EchoTik客服: service@echotik.com
- FastMoss客服: 微信公众号搜索"FastMoss"

---

## ⚠️ 注意事项

1. **合规性**: 确保使用官方API或授权第三方服务
2. **频率限制**: 注意API调用次数限制
3. **数据隐私**: 遵守GDPR和当地数据保护法规
4. **成本控制**: 监控API调用量避免超额费用
5. **备用方案**: 准备多个数据源防止单点故障

---

## 🎉 结论

**针对0-30元/月预算的最佳组合**:
```
✅ Google Trends API（免费） - 趋势分析
✅ RapidAPI基础版（$9.99/月） - 商品数据
✅ 自建简单爬虫（免费） - 补充数据
```

**总成本**: 约¥70/月，完全在预算内！

需要我帮您集成具体的API吗？
