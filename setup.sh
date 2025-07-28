# #!/bin/bash
# echo "🚀 React + TypeScript + Tailwind + Vite 환경 설정 시작..."

# # 환경 체크
# echo "📋 환경 체크 중..."
# node --version || { echo "❌ Node.js 설치 필요 (https://nodejs.org/)"; exit 1; }
# npm --version || { echo "❌ npm 설치 필요"; exit 1; }
# git --version || { echo "❌ Git 설치 필요"; exit 1; }

# # 패키지 설치
# echo "📦 패키지 설치 중..."
# npm install

# # Tailwind CSS가 제대로 설치되었는지 확인
# echo "🎨 Tailwind CSS 설정 확인 중..."
# if [ ! -f "tailwind.config.js" ]; then
#     echo "⚠️ tailwind.config.js가 없습니다. 생성 중..."
#     npx tailwindcss init -p
# fi

# echo "✅ 설정 완료!"
# echo ""
# echo "🎯 사용 가능한 명령어:"
# echo "  npm run dev     - 개발 서버 시작 (http://localhost:5173)"
# echo "  npm run build   - 프로덕션 빌드"
# echo "  npm run preview - 빌드 미리보기"
# echo ""
# echo "🚀 개발을 시작하려면: npm run dev"

#!/bin/bash

# 색상 정의 (Windows Git Bash에서도 작동)
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# OS별 패키지 매니저 확인
check_package_manager() {
    local OS=$1
    
    case $OS in
        "macOS")
            if command -v brew &> /dev/null; then
                echo -e "${GREEN}✅ Homebrew 설치됨${NC}"
                return 0
            else
                echo -e "${YELLOW}⚠️  Homebrew 미설치. 설치 방법:${NC}"
                echo "/bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
                return 1
            fi
            ;;
        "Linux")
            if command -v apt &> /dev/null; then
                echo -e "${GREEN}✅ APT 패키지 매니저 사용 가능${NC}"
                return 0
            elif command -v yum &> /dev/null; then
                echo -e "${GREEN}✅ YUM 패키지 매니저 사용 가능${NC}"
                return 0
            else
                echo -e "${YELLOW}⚠️  패키지 매니저를 확인하세요${NC}"
                return 1
            fi
            ;;
        "Windows")
            echo -e "${GREEN}✅ Windows 환경 (Git Bash 또는 WSL)${NC}"
            return 0
            ;;
    esac
}

# Node.js 설치 안내 (OS별)
install_nodejs_guide() {
    local OS=$1
    
    echo -e "${RED}❌ Node.js가 설치되지 않았습니다.${NC}"
    echo -e "${BLUE}📥 설치 방법:${NC}"
    
    case $OS in
        "macOS")
            echo "  brew install node"
            echo "  또는 https://nodejs.org에서 다운로드"
            ;;
        "Linux")
            echo "  # Ubuntu/Debian:"
            echo "  curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -"
            echo "  sudo apt-get install -y nodejs"
            echo ""
            echo "  # CentOS/RHEL:"
            echo "  curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -"
            echo "  sudo yum install -y nodejs"
            ;;
        "Windows")
            echo "  1. https://nodejs.org에서 Windows Installer 다운로드"
            echo "  2. 또는 chocolatey: choco install nodejs"
            echo "  3. 또는 winget: winget install OpenJS.NodeJS"
            ;;
    esac
}

# Git 설치 안내 (OS별)
install_git_guide() {
    local OS=$1
    
    echo -e "${RED}❌ Git이 설치되지 않았습니다.${NC}"
    echo -e "${BLUE}📥 설치 방법:${NC}"
    
    case $OS in
        "macOS")
            echo "  brew install git"
            echo "  또는 Xcode Command Line Tools: xcode-select --install"
            ;;
        "Linux")
            echo "  # Ubuntu/Debian: sudo apt-get install git"
            echo "  # CentOS/RHEL: sudo yum install git"
            ;;
        "Windows")
            echo "  https://git-scm.com/download/win에서 다운로드"
            echo "  또는 chocolatey: choco install git"
            ;;
    esac
}

# 메인 스크립트 시작
echo -e "${GREEN}🚀 React + TypeScript + Tailwind + Vite 환경 설정 시작...${NC}"
echo ""

# OS 감지
OS=$(detect_os)
echo -e "${BLUE}🖥️  감지된 운영체제: $OS${NC}"
echo ""

# 패키지 매니저 확인
check_package_manager $OS
echo ""

# 환경 체크
echo -e "${YELLOW}📋 환경 체크 중...${NC}"

# Node.js 체크
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js 버전: $NODE_VERSION${NC}"
else
    install_nodejs_guide $OS
    exit 1
fi

# npm 체크
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✅ npm 버전: $NPM_VERSION${NC}"
else
    echo -e "${RED}❌ npm이 설치되지 않았습니다.${NC}"
    echo "Node.js와 함께 설치됩니다. Node.js를 다시 설치해주세요."
    exit 1
fi

# Git 체크
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version)
    echo -e "${GREEN}✅ $GIT_VERSION${NC}"
else
    install_git_guide $OS
    exit 1
fi

echo ""

# package.json 존재 확인
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ package.json 파일이 없습니다.${NC}"
    echo "React 프로젝트 루트 디렉토리에서 실행해주세요."
    exit 1
fi

# 패키지 설치
echo -e "${YELLOW}📦 패키지 설치 중...${NC}"

# OS별 설치 명령어 (실제로는 npm install로 동일하지만, 메시지만 다르게)
case $OS in
    "Windows")
        echo "Windows 환경에서 npm 패키지를 설치합니다..."
        ;;
    "macOS")
        echo "macOS 환경에서 npm 패키지를 설치합니다..."
        ;;
    "Linux")
        echo "Linux 환경에서 npm 패키지를 설치합니다..."
        ;;
esac

npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ 패키지 설치 완료${NC}"
else
    echo -e "${RED}❌ 패키지 설치 실패${NC}"
    exit 1
fi

echo ""

# Tailwind CSS 설정 확인
echo -e "${YELLOW}🎨 Tailwind CSS 설정 확인 중...${NC}"
if [ ! -f "tailwind.config.js" ]; then
    echo -e "${YELLOW}⚠️  tailwind.config.js가 없습니다. 생성 중...${NC}"
    npx tailwindcss init -p
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Tailwind CSS 설정 파일 생성 완료${NC}"
    else
        echo -e "${RED}❌ Tailwind CSS 설정 실패${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Tailwind CSS 설정 파일이 이미 존재합니다${NC}"
fi

echo ""

# OS별 추가 안내
echo -e "${BLUE}🔧 $OS 환경 추가 정보:${NC}"
case $OS in
    "Windows")
        echo "  • Git Bash 또는 WSL에서 실행하는 것을 권장합니다"
        echo "  • PowerShell에서도 npm 명령어는 동일하게 작동합니다"
        echo "  • 방화벽에서 Node.js 허용이 필요할 수 있습니다"
        ;;
    "macOS")
        echo "  • 터미널 또는 iTerm2에서 실행하세요"
        echo "  • Homebrew로 추가 도구들을 쉽게 설치할 수 있습니다"
        echo "  • Xcode Command Line Tools가 있으면 더 좋습니다"
        ;;
    "Linux")
        echo "  • 대부분의 배포판에서 잘 작동합니다"
        echo "  • 필요한 경우 build-essential 패키지를 설치하세요"
        echo "  • 권한 문제가 있다면 sudo 없이 npm을 사용할 수 있도록 설정하세요"
        ;;
esac

echo ""
echo -e "${GREEN}✅ 설정 완료!${NC}"
echo ""
echo -e "${BLUE}🎯 사용 가능한 명령어:${NC}"
echo -e "  ${YELLOW}npm run dev${NC}     - 개발 서버 시작 (http://localhost:5173)"
echo -e "  ${YELLOW}npm run build${NC}   - 프로덕션 빌드"
echo -e "  ${YELLOW}npm run preview${NC} - 빌드 미리보기"
echo ""
echo -e "${GREEN}🚀 개발을 시작하려면: ${YELLOW}npm run dev${NC}"

# OS별 브라우저 자동 열기 안내
echo ""
echo -e "${BLUE}💡 팁:${NC}"
case $OS in
    "Windows")
        echo "  개발 서버 시작 후 자동으로 브라우저가 열리지 않으면"
        echo "  http://localhost:5173 을 직접 열어주세요"
        ;;
    "macOS")
        echo "  개발 서버 시작 후 ⌘+클릭으로 링크를 열 수 있습니다"
        ;;
    "Linux")
        echo "  개발 서버 시작 후 Ctrl+클릭으로 링크를 열 수 있습니다"
        ;;
esac