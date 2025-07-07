# FacDoc - 부동산 문서 관리 시스템

부동산 관련 문서들을 효율적으로 관리할 수 있는 웹 애플리케이션입니다.

## 🚀 온라인 배포

### Railway를 통한 배포 (추천)

1. **GitHub 저장소 생성**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/facdoc.git
   git push -u origin main
   ```

2. **Railway 배포**
   - [Railway.app](https://railway.app)에 접속
   - GitHub 계정으로 로그인
   - "New Project" → "Deploy from GitHub repo" 선택
   - 저장소 선택 후 자동 배포

3. **환경 변수 설정**
   ```
   NODE_ENV=production
   PORT=5000
   TZ=Asia/Seoul
   ```

4. **도메인 확인**
   - Railway 대시보드에서 제공된 URL로 접속
   - 예: `https://facdoc-production.up.railway.app`

## 🏃‍♂️ 로컬 개발

### 사전 요구사항
- Node.js 18+
- npm 또는 yarn

### 설치 및 실행

1. **의존성 설치**
   ```bash
   # 백엔드
   cd backend
   npm install
   
   # 프론트엔드
   cd frontend
   npm install
   ```

2. **개발 서버 실행**
   ```bash
   # 백엔드 (터미널 1)
   cd backend
   npm start
   
   # 프론트엔드 (터미널 2)
   cd frontend
   npm start
   ```

3. **브라우저에서 접속**
   - 프론트엔드: http://localhost:3000
   - 백엔드 API: http://localhost:5000

## 🐳 Docker 배포

### 로컬 Docker 실행
```bash
# Windows
.\deploy.ps1 start

# Linux/Mac
./deploy.sh start
```

### 다른 서버에 배포
1. 프로젝트 파일들을 서버에 복사
2. Docker 설치
3. 배포 스크립트 실행

## 📁 프로젝트 구조

```
facdoc/
├── backend/           # Node.js 백엔드
│   ├── server.js     # Express 서버
│   ├── package.json  # 백엔드 의존성
│   └── database.sqlite # SQLite 데이터베이스
├── frontend/         # React 프론트엔드
│   ├── src/         # 소스 코드
│   ├── public/      # 정적 파일
│   └── package.json # 프론트엔드 의존성
├── Dockerfile       # 도커 이미지 설정
├── docker-compose.yml # 도커 컴포즈 설정
├── deploy.sh        # Linux/Mac 배포 스크립트
├── deploy.ps1       # Windows 배포 스크립트
└── README.md        # 프로젝트 문서
```

## 🔧 주요 기능

- 📄 부동산 문서 업로드 및 관리
- 🔍 문서 검색 및 필터링
- 📱 반응형 웹 디자인
- 🔐 비밀번호 보호 기능
- 📊 문서 통계 및 분석

## 🛠️ 기술 스택

### 백엔드
- Node.js
- Express.js
- SQLite
- Multer (파일 업로드)

### 프론트엔드
- React.js
- CSS3
- HTML5

### 배포
- Docker
- Railway (온라인 호스팅)

## 📞 지원

문제가 발생하거나 질문이 있으시면 GitHub Issues를 통해 문의해주세요.

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 