#!/bin/bash

# OS 감지 함수
detect_os() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo "Linux"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        echo "macOS"
    elif [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
        echo "Windows"
    else
        echo "Unknown"
    fi
}

echo "🔧 Redux Toolkit 설정을 시작합니다..."

# OS 감지
OS=$(detect_os)
echo "🖥️  운영체제: $OS"

# 환경 체크
if ! command -v npm &> /dev/null; then
    echo "❌ npm이 설치되지 않았습니다."
    exit 1
fi

if [ ! -f "package.json" ]; then
    echo "❌ package.json 파일이 없습니다."
    echo "React 프로젝트 루트에서 실행해주세요."
    exit 1
fi

# OS별 설치 메시지
case $OS in
    "Windows")
        echo "📦 Windows에서 Redux Toolkit 설치 중..."
        ;;
    "macOS")
        echo "📦 macOS에서 Redux Toolkit 설치 중..."
        ;;
    "Linux")
        echo "📦 Linux에서 Redux Toolkit 설치 중..."
        ;;
    *)
        echo "📦 Redux Toolkit 설치 중..."
        ;;
esac

# Redux Toolkit 설치
npm install @reduxjs/toolkit react-redux

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Redux Toolkit 설치 완료!"
    echo "🔗 RTK Query도 함께 설치되었습니다."
    
    # OS별 간단한 추가 정보
    case $OS in
        "Windows")
            echo "💡 VSCode 터미널 사용을 권장합니다."
            ;;
        "macOS")
            echo "💡 터미널 또는 iTerm2에서 사용하세요."
            ;;
        "Linux")
            echo "💡 대부분의 Linux 배포판에서 잘 작동합니다."
            ;;
    esac
    
    echo ""
    echo "📝 다음 단계:"
    echo "  1. src/store/ 폴더에 Redux 설정"
    echo "  2. src/hooks/ 폴더에 타입 안전한 훅들"
    echo "  3. src/types/ 폴더에 타입 정의"
else
    echo "❌ 설치 실패"
    exit 1
fi