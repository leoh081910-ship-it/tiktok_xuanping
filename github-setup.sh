#!/bin/bash

# GitHub自动设置和上传脚本
# 使用方法: ./github-setup.sh

echo "🚀 GitHub自动设置和上传脚本"
echo "================================"
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查Git是否安装
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git未安装，请先安装Git${NC}"
    echo "访问: https://git-scm.com/downloads"
    exit 1
fi

echo -e "${GREEN}✅ Git已安装: $(git --version)${NC}"
echo ""

# 检查是否已经是Git仓库
if [ -d .git ]; then
    echo -e "${YELLOW}⚠️  检测到现有Git仓库${NC}"
    read -p "是否继续？这将保留现有的Git历史 (y/n): " continue_with_existing
    if [ "$continue_with_existing" != "y" ]; then
        echo "操作已取消"
        exit 0
    fi
else
    echo "📁 初始化Git仓库..."
    git init
    echo -e "${GREEN}✅ Git仓库初始化完成${NC}"
    echo ""
fi

# 配置Git用户信息（如果未配置）
if [ -z "$(git config user.name)" ]; then
    echo "📝 配置Git用户信息"
    read -p "请输入您的名字: " git_name
    git config user.name "$git_name"
fi

if [ -z "$(git config user.email)" ]; then
    read -p "请输入您的邮箱: " git_email
    git config user.email "$git_email"
fi

echo -e "${GREEN}✅ Git用户: $(git config user.name) <$(git config user.email)>${NC}"
echo ""

# 检查远程仓库
if git remote | grep -q "origin"; then
    echo -e "${YELLOW}⚠️  远程仓库'origin'已存在${NC}"
    echo "当前远程仓库:"
    git remote -v
    echo ""
    read -p "是否要更新远程仓库URL? (y/n): " update_remote
    if [ "$update_remote" = "y" ]; then
        read -p "请输入新的GitHub仓库URL: " repo_url
        git remote set-url origin "$repo_url"
        echo -e "${GREEN}✅ 远程仓库已更新${NC}"
    fi
else
    echo "🔗 设置GitHub远程仓库"
    echo ""
    echo "请先在GitHub上创建仓库："
    echo "1. 访问 https://github.com/new"
    echo "2. 填写仓库名称（建议: tiktok-product-selector）"
    echo "3. 选择私有或公开"
    echo "4. 不要添加README或.gitignore（我们已经有了）"
    echo "5. 创建仓库后，复制仓库URL"
    echo ""
    echo "示例URL格式："
    echo "  HTTPS: https://github.com/username/repo-name.git"
    echo "  SSH:   git@github.com:username/repo-name.git"
    echo ""
    read -p "请输入GitHub仓库URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo -e "${RED}❌ 仓库URL不能为空${NC}"
        exit 1
    fi
    
    git remote add origin "$repo_url"
    echo -e "${GREEN}✅ 远程仓库已设置${NC}"
fi

echo ""
echo "📦 准备提交代码..."

# 检查是否有文件需要提交
if git diff-index --quiet HEAD -- 2>/dev/null; then
    echo -e "${YELLOW}⚠️  没有检测到新的更改${NC}"
else
    # 显示将要提交的文件
    echo "将要添加的文件:"
    git status --short
    echo ""
    
    read -p "是否添加所有文件? (y/n): " add_files
    if [ "$add_files" = "y" ]; then
        git add .
        echo -e "${GREEN}✅ 文件已添加${NC}"
        
        # 创建提交
        echo ""
        echo "📝 创建提交"
        read -p "请输入提交信息 (直接回车使用默认信息): " commit_msg
        
        if [ -z "$commit_msg" ]; then
            commit_msg="feat: initial commit - Southeast Asia TikTok product selector tool

- Complete frontend with React 19 + Vite + TypeScript
- 6 fashion accessory categories
- 4 Southeast Asian countries support
- Supabase integration with Edge Functions
- EchoTik API + FastMoss scraper integration
- Google Trends integration
- TikTok Shop official data support
- Multi-country account management"
        fi
        
        git commit -m "$commit_msg"
        echo -e "${GREEN}✅ 提交已创建${NC}"
    else
        echo "操作已取消"
        exit 0
    fi
fi

echo ""
echo "🚀 准备推送到GitHub..."
echo ""

# 检查当前分支
current_branch=$(git branch --show-current)
if [ -z "$current_branch" ]; then
    current_branch="main"
    git branch -M main
fi

echo "当前分支: $current_branch"
echo ""

# 推送代码
echo "正在推送代码到GitHub..."
if git push -u origin $current_branch; then
    echo ""
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}✨ 成功！代码已推送到GitHub ✨${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "📍 您的仓库地址:"
    git remote get-url origin
    echo ""
    echo "🎉 下一步:"
    echo "1. 访问GitHub查看您的代码"
    echo "2. 设置仓库描述和标签"
    echo "3. 邀请团队成员"
    echo "4. 配置GitHub Pages（如需要）"
    echo ""
else
    echo ""
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${RED}❌ 推送失败${NC}"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "可能的原因："
    echo "1. 认证失败 - 需要配置Personal Access Token或SSH密钥"
    echo "2. 远程仓库不存在"
    echo "3. 没有推送权限"
    echo ""
    echo "解决方案："
    echo "1. 检查认证配置（详见 GITHUB_SETUP.md）"
    echo "2. 确认仓库URL正确: git remote -v"
    echo "3. 尝试手动推送: git push -u origin $current_branch"
    echo ""
    exit 1
fi

# 显示推送后的信息
echo "📊 提交历史:"
git log --oneline -5
echo ""

echo "✅ 完成！"
