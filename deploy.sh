#!/bin/bash

# FacDoc 도커 배포 스크립트
# 사용법: ./deploy.sh [start|stop|restart|build|logs|status]

set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 로그 함수
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 로그 디렉토리 생성
create_logs_dir() {
    if [ ! -d "logs" ]; then
        log_info "로그 디렉토리를 생성합니다..."
        mkdir -p logs
    fi
}

# 도커 설치 확인
check_docker() {
    if ! command -v docker &> /dev/null; then
        log_error "Docker가 설치되어 있지 않습니다."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose가 설치되어 있지 않습니다."
        exit 1
    fi
    
    log_success "Docker 환경이 확인되었습니다."
}

# 기존 컨테이너 정리
cleanup() {
    log_info "기존 컨테이너를 정리합니다..."
    docker-compose down --remove-orphans 2>/dev/null || true
}

# 이미지 빌드
build_image() {
    log_info "도커 이미지를 빌드합니다..."
    docker-compose build --no-cache
    log_success "이미지 빌드가 완료되었습니다."
}

# 애플리케이션 시작
start_app() {
    log_info "애플리케이션을 시작합니다..."
    create_logs_dir
    docker-compose up -d
    log_success "애플리케이션이 시작되었습니다."
    
    # 헬스체크 대기
    log_info "애플리케이션 상태를 확인합니다..."
    sleep 10
    
    if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
        log_success "애플리케이션이 정상적으로 실행되고 있습니다."
        log_info "접속 URL: http://localhost:5000"
    else
        log_warning "애플리케이션 시작 중입니다. 잠시 후 다시 확인해주세요."
    fi
}

# 애플리케이션 중지
stop_app() {
    log_info "애플리케이션을 중지합니다..."
    docker-compose down
    log_success "애플리케이션이 중지되었습니다."
}

# 애플리케이션 재시작
restart_app() {
    log_info "애플리케이션을 재시작합니다..."
    stop_app
    start_app
}

# 로그 확인
show_logs() {
    log_info "애플리케이션 로그를 확인합니다..."
    docker-compose logs -f
}

# 상태 확인
show_status() {
    log_info "애플리케이션 상태를 확인합니다..."
    docker-compose ps
    
    echo ""
    log_info "컨테이너 리소스 사용량:"
    docker stats --no-stream facdoc-app 2>/dev/null || log_warning "컨테이너가 실행 중이 아닙니다."
}

# 백업 생성
backup_database() {
    log_info "데이터베이스를 백업합니다..."
    if [ -f "backend/database.sqlite" ]; then
        cp backend/database.sqlite "backend/database.sqlite.backup.$(date +%Y%m%d_%H%M%S)"
        log_success "데이터베이스 백업이 완료되었습니다."
    else
        log_warning "백업할 데이터베이스 파일이 없습니다."
    fi
}

# 메인 함수
main() {
    case "${1:-start}" in
        "start")
            check_docker
            cleanup
            build_image
            start_app
            ;;
        "stop")
            check_docker
            stop_app
            ;;
        "restart")
            check_docker
            restart_app
            ;;
        "build")
            check_docker
            cleanup
            build_image
            ;;
        "logs")
            check_docker
            show_logs
            ;;
        "status")
            check_docker
            show_status
            ;;
        "backup")
            backup_database
            ;;
        "help"|"-h"|"--help")
            echo "FacDoc 도커 배포 스크립트"
            echo ""
            echo "사용법: $0 [명령어]"
            echo ""
            echo "명령어:"
            echo "  start     - 애플리케이션 시작 (기본값)"
            echo "  stop      - 애플리케이션 중지"
            echo "  restart   - 애플리케이션 재시작"
            echo "  build     - 도커 이미지 빌드"
            echo "  logs      - 로그 확인"
            echo "  status    - 상태 확인"
            echo "  backup    - 데이터베이스 백업"
            echo "  help      - 도움말 표시"
            ;;
        *)
            log_error "알 수 없는 명령어: $1"
            echo "사용법: $0 [start|stop|restart|build|logs|status|backup|help]"
            exit 1
            ;;
    esac
}

# 스크립트 실행
main "$@" 