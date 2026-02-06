/**
 * AI 助手故障诊断工具 (Node.js 版本)
 *
 * 用途：检查 DeepSeek Chatbot Edge Function 的部署状态和配置
 *
 * 使用方法：
 * node scripts/diagnose-ai.js
 */

const SUPABASE_URL = "https://cqsqedvhhnyhwxakujyf.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxc3FlZHZoaG55aHd4YWt1anlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMjM5NjEsImV4cCI6MjA4NTY5OTk2MX0.4xJbf6fTBqsd4xagMcUuibW7XAeT-vf5UZWXAXvyhds";

console.log('='.repeat(60));
console.log('🔍 AI 助手故障诊断工具');
console.log('='.repeat(60));

async function diagnose() {
  const results = {
    step1: { name: '检查 Supabase 连接', status: 'pending', details: '' },
    step2: { name: '检查 Edge Function 部署状态', status: 'pending', details: '' },
    step3: { name: '测试 Edge Function 调用', status: 'pending', details: '' },
    step4: { name: '检查 DeepSeek API 配置', status: 'pending', details: '' },
  };

  // 步骤 1: 检查 Supabase 连接
  console.log('\n📌 步骤 1: 检查 Supabase 连接...');
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });

    if (response.ok) {
      results.step1.status = '✅ 成功';
      results.step1.details = 'Supabase API 连接正常';
      console.log('   ✅ Supabase API 连接正常');
    } else {
      results.step1.status = '❌ 失败';
      results.step1.details = `HTTP ${response.status}`;
      console.error(`   ❌ 连接失败: HTTP ${response.status}`);
    }
  } catch (error) {
    results.step1.status = '❌ 错误';
    results.step1.details = error.message;
    console.error(`   ❌ 连接错误: ${error.message}`);
  }

  // 步骤 2: 检查 Edge Function 部署状态
  console.log('\n📌 步骤 2: 检查 Edge Function 部署状态...');
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/deepseek-chatbot`, {
      method: 'OPTIONS',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok || response.status === 405) {
      results.step2.status = '✅ 已部署';
      results.step2.details = 'Edge Function 已部署';
      console.log('   ✅ Edge Function 已部署');
    } else if (response.status === 404) {
      results.step2.status = '❌ 未部署';
      results.step2.details = 'Edge Function 不存在，需要部署';
      console.error('   ❌ Edge Function 未部署 (404)');
      console.error('   💡 解决方案：运行 npx supabase functions deploy deepseek-chatbot');
    } else {
      results.step2.status = '⚠️ 异常';
      results.step2.details = `HTTP ${response.status}`;
      console.log(`   ⚠️ 状态码: HTTP ${response.status}`);
    }
  } catch (error) {
    results.step2.status = '❌ 错误';
    results.step2.details = error.message;
    console.error(`   ❌ 请求错误: ${error.message}`);
  }

  // 步骤 3: 测试 Edge Function 调用
  console.log('\n📌 步骤 3: 测试 Edge Function 调用...');
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/deepseek-chatbot`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: '你好',
        conversationHistory: [],
      }),
    });

    const data = await response.json();

    if (response.ok) {
      results.step3.status = '✅ 正常';
      results.step3.details = 'Edge Function 调用成功';
      console.log('   ✅ Edge Function 调用成功');
      console.log('   📝 响应:', JSON.stringify(data, null, 2));
    } else {
      results.step3.status = '⚠️ 部分异常';
      results.step3.details = data.error || `HTTP ${response.status}`;
      console.log(`   ⚠️ 调用异常: HTTP ${response.status}`);
      console.log('   📝 错误详情:', JSON.stringify(data, null, 2));

      // 分析具体错误
      if (data.error && data.error.includes('DeepSeek API 未配置')) {
        console.error('\n   🔴 关键问题: DEEPSEEK_API_KEY 环境变量未配置');
        console.error('   💡 解决方案：');
        console.error('      1. 访问 Supabase Dashboard: https://supabase.com/dashboard/project/cqsqedvhhnyhwxakujyf/edge-functions');
        console.error('      2. 选择 deepseek-chatbot 函数');
        console.error('      3. 点击 "Settings" → "Environment Variables"');
        console.error('      4. 添加环境变量: DEEPSEEK_API_KEY = <your_api_key>');
        console.error('      5. 保存并重新部署函数');
      } else if (data.error && data.error.includes('DeepSeek API error')) {
        console.error('\n   🔴 关键问题: DeepSeek API 调用失败');
        console.error('   💡 可能原因：');
        console.error('      - API Key 无效或过期');
        console.error('      - DeepSeek API 服务不可用');
        console.error('      - 网络连接问题');
      }
    }
  } catch (error) {
    results.step3.status = '❌ 错误';
    results.step3.details = error.message;
    console.error(`   ❌ 调用错误: ${error.message}`);
  }

  // 步骤 4: 检查 DeepSeek API 配置（通过查看错误消息）
  console.log('\n📌 步骤 4: 检查 DeepSeek API 配置...');
  if (results.step3.details.includes('DEEPSEEK_API_KEY')) {
    results.step4.status = '❌ 未配置';
    results.step4.details = 'DEEPSEEK_API_KEY 环境变量未设置';
    console.error('   ❌ DEEPSEEK_API_KEY 未配置');
  } else if (results.step3.details.includes('DeepSeek API error')) {
    results.step4.status = '⚠️ 异常';
    results.step4.details = 'DeepSeek API 调用失败';
    console.warn('   ⚠️ DeepSeek API 调用失败');
  } else if (results.step3.status === '✅ 正常') {
    results.step4.status = '✅ 正常';
    results.step4.details = 'DeepSeek API 配置正确';
    console.log('   ✅ DeepSeek API 配置正确');
  } else {
    results.step4.status = '⏭️ 跳过';
    results.step4.details = '无法确定（需要先通过步骤 3）';
    console.log('   ⏭️ 跳过（需要先通过步骤 3）');
  }

  // 总结
  console.log('\n' + '='.repeat(60));
  console.log('📊 诊断总结');
  console.log('='.repeat(60));
  console.log(`步骤 1: ${results.step1.status} - ${results.step1.details}`);
  console.log(`步骤 2: ${results.step2.status} - ${results.step2.details}`);
  console.log(`步骤 3: ${results.step3.status} - ${results.step3.details}`);
  console.log(`步骤 4: ${results.step4.status} - ${results.step4.details}`);
  console.log('='.repeat(60));

  // 提供解决建议
  console.log('\n💡 解决建议：\n');

  if (results.step2.status === '❌ 未部署') {
    console.log('1️⃣ 部署 Edge Function:');
    console.log('   npx supabase functions deploy deepseek-chatbot');
    console.log('');
  }

  if (results.step4.status === '❌ 未配置') {
    console.log('2️⃣ 配置 DEEPSEEK_API_KEY:');
    console.log('   a. 获取 DeepSeek API Key: https://platform.deepseek.com/api_keys');
    console.log('   b. 在 Supabase Dashboard 配置环境变量');
    console.log('   c. 重新部署函数');
    console.log('');
  }

  if (results.step3.status === '⚠️ 部分异常' && results.step4.status === '⚠️ 异常') {
    console.log('3️⃣ 检查 DeepSeek API 状态:');
    console.log('   - 验证 API Key 是否有效');
    console.log('   - 检查 DeepSeek 服务状态');
    console.log('   - 查看账户余额');
    console.log('');
  }

  if (results.step3.status === '✅ 正常') {
    console.log('✨ 恭喜！AI 助手运行正常！');
    console.log('   可以正常使用 AI 助手功能了。');
    console.log('');
  }

  return results;
}

// 运行诊断
diagnose()
  .then(results => {
    console.log('✨ 诊断完成！');

    // 设置退出码
    const allPassed = results.step3.status === '✅ 正常';
    process.exit(allPassed ? 0 : 1);
  })
  .catch(error => {
    console.error('\n❌ 诊断失败:', error);
    process.exit(1);
  });
