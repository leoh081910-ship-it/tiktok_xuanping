# 贡献指南

感谢您考虑为东南亚TikTok选品工具做贡献！

## 🚀 快速开始

### 开发环境要求

- Node.js 18+
- pnpm 8+
- Git

### 本地开发

```bash
# 1. Fork并克隆仓库
git clone https://github.com/YOUR_USERNAME/tiktok-product-selector.git
cd tiktok-product-selector

# 2. 安装依赖
pnpm install

# 3. 启动开发服务器
pnpm dev

# 4. 在浏览器访问
# http://localhost:5173
```

## 📋 贡献流程

### 1. 创建分支

```bash
# 从main分支创建功能分支
git checkout -b feature/your-feature-name

# 或创建bug修复分支
git checkout -b fix/bug-description
```

### 2. 开发和提交

```bash
# 开发完成后，添加更改
git add .

# 使用规范的提交信息
git commit -m "feat: add new feature"
```

### 3. 推送和创建PR

```bash
# 推送到您的fork
git push origin feature/your-feature-name

# 在GitHub上创建Pull Request
```

## 📝 提交信息规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 格式：

- `feat:` 新功能
- `fix:` Bug修复
- `docs:` 文档更新
- `style:` 代码格式调整（不影响功能）
- `refactor:` 代码重构
- `perf:` 性能优化
- `test:` 测试相关
- `chore:` 构建/工具/依赖更新

**示例**：
```
feat: add market insights page
fix: resolve image loading error
docs: update deployment guide
```

## 🔍 代码规范

### JavaScript/TypeScript

- 使用TypeScript编写所有代码
- 遵循ESLint配置
- 使用函数式组件和Hooks
- 避免使用any类型

### 代码检查

```bash
# 运行lint
pnpm lint

# 类型检查
pnpm type-check

# 自动修复
pnpm lint --fix
```

### 组件规范

```typescript
// ✅ 好的实践
export function ProductCard({ product }: { product: Product }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
      </CardHeader>
    </Card>
  );
}

// ❌ 避免
export function ProductCard(props: any) {
  return <div>{props.product.name}</div>;
}
```

## 📁 项目结构

```
src/
├── components/     # UI组件
│   ├── layout/    # 布局组件
│   └── ui/        # shadcn/ui组件
├── pages/         # 页面组件
├── lib/           # 工具库
│   ├── constants.ts
│   ├── types.ts
│   └── utils.ts
└── integrations/  # 第三方集成
    └── supabase/
```

## 🧪 测试

目前项目暂未配置自动化测试，但请确保：

- 手动测试所有更改
- 检查不同浏览器兼容性
- 验证响应式设计
- 测试错误处理

## 📖 文档

更新代码时，请同步更新相关文档：

- `README.md` - 项目说明
- `DEPLOYMENT.md` - 部署指南
- 代码注释 - 复杂逻辑说明

## 🐛 报告Bug

使用GitHub Issues报告Bug：
1. 使用Bug模板
2. 提供详细的复现步骤
3. 包含截图或错误信息
4. 说明环境信息

## ✨ 功能建议

欢迎提出新功能建议：
1. 使用功能请求模板
2. 清晰描述使用场景
3. 说明预期收益
4. 考虑实现方案

## 📋 Pull Request检查清单

提交PR前请确认：

- [ ] 代码通过lint检查
- [ ] 没有TypeScript错误
- [ ] 功能已充分测试
- [ ] 提交信息符合规范
- [ ] 已更新相关文档
- [ ] PR描述清晰完整

## 💬 交流讨论

如有疑问或需要讨论：
- 创建GitHub Issue
- 在PR中评论
- 查看现有Issue和PR

## 📜 许可证

贡献的代码将遵循项目许可证。

## 🙏 感谢

感谢所有贡献者！您的帮助让这个项目变得更好。

---

再次感谢您的贡献！🎉
