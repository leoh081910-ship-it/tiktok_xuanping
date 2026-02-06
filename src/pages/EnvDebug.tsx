/**
 * 环境变量调试页面
 * 用于检查 Vercel 部署后的环境变量是否正确注入
 */

export default function EnvDebug() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>🔍 环境变量调试页面</h1>

      <div style={{ marginTop: '20px' }}>
        <h2>环境变量状态</h2>
        <table style={{ border: '1px solid #ccc', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f0f0f0' }}>
              <th style={{ border: '1px solid #ccc', padding: '10px' }}>变量名</th>
              <th style={{ border: '1px solid #ccc', padding: '10px' }}>状态</th>
              <th style={{ border: '1px solid #ccc', padding: '10px' }}>值</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #ccc', padding: '10px' }}>VITE_SUPABASE_URL</td>
              <td style={{ border: '1px solid #ccc', padding: '10px', color: supabaseUrl ? 'green' : 'red' }}>
                {supabaseUrl ? '✅ 已定义' : '❌ 未定义'}
              </td>
              <td style={{ border: '1px solid #ccc', padding: '10px', fontSize: '12px' }}>
                {supabaseUrl || 'undefined'}
              </td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #ccc', padding: '10px' }}>VITE_SUPABASE_ANON_KEY</td>
              <td style={{ border: '1px solid #ccc', padding: '10px', color: supabaseAnonKey ? 'green' : 'red' }}>
                {supabaseAnonKey ? '✅ 已定义' : '❌ 未定义'}
              </td>
              <td style={{ border: '1px solid #ccc', padding: '10px', fontSize: '12px', maxWidth: '400px', wordBreak: 'break-all' }}>
                {supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'undefined'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h2>所有环境变量</h2>
        <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
          {JSON.stringify(import.meta.env, null, 2)}
        </pre>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h2>诊断建议</h2>
        {!supabaseUrl || !supabaseAnonKey ? (
          <div style={{ color: 'red' }}>
            <p>❌ 环境变量未正确配置！</p>
            <p>请检查：</p>
            <ol>
              <li>Vercel Settings → Environment Variables 是否已添加变量</li>
              <li>变量名是否以 <code>VITE_</code> 开头</li>
              <li>是否已重新部署</li>
              <li>是否勾选了 Production 环境</li>
            </ol>
          </div>
        ) : (
          <div style={{ color: 'green' }}>
            <p>✅ 环境变量配置正确！</p>
            <p>如果页面仍有问题，请检查浏览器控制台的其他错误。</p>
          </div>
        )}
      </div>
    </div>
  );
}
