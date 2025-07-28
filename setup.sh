#!/bin/bash
echo "🚀 React + TypeScript + Tailwind + Vite 환경 설정 시작..."

# 환경 체크
echo "📋 환경 체크 중..."
node --version || { echo "❌ Node.js 설치 필요 (https://nodejs.org/)"; exit 1; }
npm --version || { echo "❌ npm 설치 필요"; exit 1; }
git --version || { echo "❌ Git 설치 필요"; exit 1; }

# 패키지 설치
echo "📦 패키지 설치 중..."
npm install

# Tailwind CSS가 제대로 설치되었는지 확인
echo "🎨 Tailwind CSS 설정 확인 중..."
if [ ! -f "tailwind.config.js" ]; then
    echo "⚠️ tailwind.config.js가 없습니다. 생성 중..."
    npx tailwindcss init -p
fi

echo "✅ 설정 완료!"
echo ""
echo "🎯 사용 가능한 명령어:"
echo "  npm run dev     - 개발 서버 시작 (http://localhost:5173)"
echo "  npm run build   - 프로덕션 빌드"
echo "  npm run preview - 빌드 미리보기"
echo ""
echo "🚀 개발을 시작하려면: npm run dev"