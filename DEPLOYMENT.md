# FacDoc 도커 배포 가이드

이 문서는 FacDoc 애플리케이션을 도커를 사용하여 다른 컴퓨터에 배포하는 방법을 설명합니다.

## 📋 사전 요구사항

### 대상 서버에 필요한 소프트웨어
- **Docker Desktop** (Windows/Mac) 또는 **Docker Engine** (Linux)
- **Docker Compose** (Docker Desktop에 포함됨)

### 설치 방법

#### Windows
1. [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/) 다운로드 및 설치
2. 설치 후 Docker Desktop 실행

#### macOS
1. [Docker Desktop for Mac](https://docs.docker.com/desktop/install/mac-install/) 다운로드 및 설치
2. 설치 후 Docker Desktop 실행

#### Linux (Ubuntu/Debian)
```bash
# Docker Engine 설치
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 현재 사용자를 docker 그룹에 추가
sudo usermod -aG docker $USER

# Docker Compose 설치
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 시스템 재시작 또는 로그아웃/로그인
```

## 🚀 배포 방법

### 1. 프로젝트 파일 전송

배포할 서버에 다음 파일들을 전송합니다:

```
facdoc/
├── backend/
│   ├── package.json
│   ├── server.js
│   └── database.sqlite (기존 데이터가 있는 경우)
├── frontend/
│   ├── package.json
│   ├── public/
│   └── src/
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── deploy.sh (Linux/Mac용)
├── deploy.ps1 (Windows용)
└── DEPLOYMENT.md
```

### 2. 자동 배포 (권장)

#### Windows에서 배포
```powershell
# PowerShell을 관리자 권한으로 실행
.\deploy.ps1 start
```

#### Linux/Mac에서 배포
```bash
# 실행 권한 부여
chmod +x deploy.sh

# 배포 시작
./deploy.sh start
```

### 3. 수동 배포

#### 이미지 빌드
```bash
docker-compose build --no-cache
```

#### 애플리케이션 시작
```bash
docker-compose up -d
```

#### 상태 확인
```bash
docker-compose ps
```

## 📊 배포 스크립트 명령어

### Windows (PowerShell)
```powershell
.\deploy.ps1 start      # 애플리케이션 시작
.\deploy.ps1 stop       # 애플리케이션 중지
.\deploy.ps1 restart    # 애플리케이션 재시작
.\deploy.ps1 build      # 이미지 빌드
.\deploy.ps1 logs       # 로그 확인
.\deploy.ps1 status     # 상태 확인
.\deploy.ps1 backup     # 데이터베이스 백업
.\deploy.ps1 help       # 도움말
```

### Linux/Mac (Bash)
```bash
./deploy.sh start       # 애플리케이션 시작
./deploy.sh stop        # 애플리케이션 중지
./deploy.sh restart     # 애플리케이션 재시작
./deploy.sh build       # 이미지 빌드
./deploy.sh logs        # 로그 확인
./deploy.sh status      # 상태 확인
./deploy.sh backup      # 데이터베이스 백업
./deploy.sh help        # 도움말
```

## 🔧 설정 및 환경 변수

### 포트 변경
`docker-compose.yml` 파일에서 포트를 변경할 수 있습니다:

```yaml
ports:
  - "8080:5000"  # 호스트 포트 8080으로 변경
```

### 환경 변수
```yaml
environment:
  - NODE_ENV=production
  - PORT=5000
  - TZ=Asia/Seoul
```

## 📁 데이터 관리

### 데이터베이스 백업
```bash
# 자동 백업
./deploy.sh backup

# 수동 백업
cp backend/database.sqlite backend/database.sqlite.backup.$(date +%Y%m%d_%H%M%S)
```

### 데이터베이스 복원
```bash
# 백업 파일을 원본으로 복사
cp backend/database.sqlite.backup.YYYYMMDD_HHMMSS backend/database.sqlite

# 애플리케이션 재시작
./deploy.sh restart
```

## 🔍 모니터링 및 로그

### 로그 확인
```bash
# 실시간 로그
./deploy.sh logs

# 수동 로그 확인
docker-compose logs -f
```

### 상태 확인
```bash
# 컨테이너 상태
./deploy.sh status

# 수동 상태 확인
docker-compose ps
docker stats facdoc-app
```

### 헬스체크
애플리케이션은 `/api/health` 엔드포인트를 통해 헬스체크를 제공합니다:

```bash
curl http://localhost:5000/api/health
```

## 🛠️ 문제 해결

### 일반적인 문제들

#### 1. 포트 충돌
```
Error: Port 5000 is already in use
```
**해결방법:**
- `docker-compose.yml`에서 포트 변경
- 기존 프로세스 확인: `netstat -tulpn | grep 5000`

#### 2. 권한 문제
```
Error: Permission denied
```
**해결방법:**
- Windows: PowerShell을 관리자 권한으로 실행
- Linux: `sudo` 사용 또는 사용자를 docker 그룹에 추가

#### 3. 이미지 빌드 실패
```
Error: Build failed
```
**해결방법:**
- Docker Desktop이 실행 중인지 확인
- 인터넷 연결 확인
- `docker-compose build --no-cache` 재시도

#### 4. 데이터베이스 연결 오류
```
Error: Database connection failed
```
**해결방법:**
- 데이터베이스 파일 권한 확인
- 볼륨 마운트 경로 확인
- 애플리케이션 재시작

### 로그 분석
```bash
# 애플리케이션 로그
docker-compose logs facdoc-app

# 빌드 로그
docker-compose build --no-cache

# 시스템 로그 (Linux)
journalctl -u docker
```

## 🔒 보안 고려사항

### 프로덕션 환경 설정
1. **방화벽 설정**: 필요한 포트만 열기
2. **HTTPS 설정**: 리버스 프록시 사용 (Nginx, Apache)
3. **정기 백업**: 자동 백업 스크립트 설정
4. **모니터링**: 로그 모니터링 및 알림 설정

### 예시: Nginx 리버스 프록시 설정
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 📞 지원

문제가 발생하면 다음을 확인해주세요:

1. **로그 확인**: `./deploy.sh logs`
2. **상태 확인**: `./deploy.sh status`
3. **Docker 버전**: `docker --version`
4. **시스템 리소스**: CPU, 메모리, 디스크 공간

## 🔄 업데이트 방법

### 애플리케이션 업데이트
```bash
# 1. 새 코드 배포
git pull origin main

# 2. 애플리케이션 재시작
./deploy.sh restart
```

### 도커 이미지 업데이트
```bash
# 1. 새 이미지 빌드
./deploy.sh build

# 2. 애플리케이션 재시작
./deploy.sh restart
```

---

**참고**: 이 가이드는 단일 서버 배포를 위한 것입니다. 고가용성이나 로드 밸런싱이 필요한 경우 추가적인 설정이 필요합니다. 