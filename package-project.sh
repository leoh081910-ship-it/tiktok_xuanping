#!/bin/bash

# 东南亚TikTok选品工具 - 项目打包脚本
# 使用方法: ./package-project.sh

echo "🚀 开始打包项目..."
echo ""

# 项目名称和版本
PROJECT_NAME="tiktok-product-selector"
VERSION=$(date +%Y%m%d_%H%M%S)
OUTPUT_DIR="releases"
PACKAGE_NAME="${PROJECT_NAME}_${VERSION}"

# 创建输出目录
mkdir -p $OUTPUT_DIR

echo "📦 正在创建项目包..."
echo "版本: ${VERSION}"
echo ""

# 方案1: 创建源码包（不含node_modules和构建产物）
echo "1️⃣ 创建源码包..."
zip -r "${OUTPUT_DIR}/${PACKAGE_NAME}_source.zip" . \
  -x "node_modules/*" \
  -x "dist/*" \
  -x ".next/*" \
  -x ".turbo/*" \
  -x "*.log" \
  -x ".DS_Store" \
  -x ".git/*" \
  -x "${OUTPUT_DIR}/*"

echo "✅ 源码包创建完成: ${OUTPUT_DIR}/${PACKAGE_NAME}_source.zip"
echo ""

# 方案2: 构建生产版本
echo "2️⃣ 构建生产版本..."
pnpm install --frozen-lockfile
pnpm build

if [ -d "dist" ]; then
  echo "✅ 构建成功"
  
  # 创建构建产物包
  cd dist
  zip -r "../${OUTPUT_DIR}/${PACKAGE_NAME}_dist.zip" .
  cd ..
  
  echo "✅ 构建产物包创建完成: ${OUTPUT_DIR}/${PACKAGE_NAME}_dist.zip"
else
  echo "❌ 构建失败，未找到dist目录"
fi

echo ""
echo "3️⃣ 创建完整部署包（源码+文档）..."

# 创建临时目录
TEMP_DIR="${OUTPUT_DIR}/temp_${VERSION}"
mkdir -p $TEMP_DIR

# 复制必要文件
cp -r src $TEMP_DIR/
cp -r supabase $TEMP_DIR/
cp -r public $TEMP_DIR/
cp package.json $TEMP_DIR/
cp pnpm-lock.yaml $TEMP_DIR/
cp vite.config.ts $TEMP_DIR/
cp tsconfig.json $TEMP_DIR/
cp tsconfig.app.json $TEMP_DIR/
cp tsconfig.node.json $TEMP_DIR/
cp tailwind.config.ts $TEMP_DIR/
cp postcss.config.js $TEMP_DIR/
cp index.html $TEMP_DIR/
cp components.json $TEMP_DIR/
cp DEPLOYMENT.md $TEMP_DIR/
cp README.md $TEMP_DIR/ 2>/dev/null || echo "README.md不存在，跳过"

# 打包
cd $OUTPUT_DIR
zip -r "${PACKAGE_NAME}_complete.zip" "temp_${VERSION}"
rm -rf "temp_${VERSION}"
cd ..

echo "✅ 完整部署包创建完成: ${OUTPUT_DIR}/${PACKAGE_NAME}_complete.zip"
echo ""

# 显示包信息
echo "📊 打包完成统计:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
ls -lh ${OUTPUT_DIR}/${PACKAGE_NAME}*.zip
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "✨ 所有打包完成！"
echo ""
echo "📦 包说明："
echo "  • ${PACKAGE_NAME}_source.zip      - 源码包（用于开发）"
echo "  • ${PACKAGE_NAME}_dist.zip        - 构建产物包（用于部署）"
echo "  • ${PACKAGE_NAME}_complete.zip    - 完整包（源码+文档）"
echo ""
echo "🚀 部署说明请查看 DEPLOYMENT.md"
