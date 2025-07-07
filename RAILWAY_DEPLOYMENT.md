# Railway를 사용한 FacDoc 온라인 배포 가이드

## 📋 사전 준비

### 1. Railway 계정 생성
- [Railway.app](https://railway.app)에 접속
- GitHub 계정으로 로그인

### 2. 프로젝트 준비
- GitHub에 프로젝트 업로드
- 다음 파일들이 포함되어야 함:
  - `Dockerfile`
  - `docker-compose.yml`
  - `backend/`
  - `frontend/`

## 🚀 배포 단계

### 1. Railway 프로젝트 생성
1. Railway 대시보드에서 "New Project" 클릭
2. "Deploy from GitHub repo" 선택
3. GitHub 저장소 선택

### 2. 환경 설정
Railway는 자동으로 Dockerfile을 인식하지만, 다음 환경 변수를 설정해야 합니다:

```bash
NODE_ENV=production
PORT=5000
TZ=Asia/Seoul
```

### 3. 도메인 설정
1. 프로젝트 설정에서 "Domains" 탭 클릭
2. "Generate Domain" 클릭
3. 제공된 URL로 접속 가능

## 🔧 고급 설정

### 커스텀 도메인 연결
1. 도메인 구매 (예: GoDaddy, Namecheap)
2. DNS 설정에서 CNAME 레코드 추가
3. Railway에서 커스텀 도메인 추가

### SSL 인증서
- Railway는 자동으로 SSL 인증서 제공
- 커스텀 도메인에도 자동 적용

## 📊 모니터링

### 로그 확인
- Railway 대시보드에서 실시간 로그 확인
- 배포 상태 모니터링

### 성능 모니터링
- CPU, 메모리 사용량 확인
- 트래픽 분석

## 💰 비용

### 무료 티어
- 월 $5 크레딧 제공
- 소규모 프로젝트에 적합

### 유료 플랜
- 월 $20부터 시작
- 더 많은 리소스와 기능

## 🛠️ 문제 해결

### 일반적인 문제들

#### 1. 빌드 실패
- Dockerfile 문법 확인
- 의존성 설치 문제 확인

#### 2. 포트 문제
- 환경 변수 PORT 설정 확인
- Railway가 자동으로 포트 할당

#### 3. 데이터베이스 문제
- SQLite 파일이 볼륨에 저장되는지 확인
- 백업 정책 수립

## 🔄 자동 배포

### GitHub 연동
1. GitHub 저장소에 코드 푸시
2. Railway가 자동으로 새 버전 배포
3. 무중단 배포 지원

### 환경별 배포
- Development 브랜치 → 개발 환경
- Main 브랜치 → 프로덕션 환경

## 📈 확장성

### 트래픽 증가 시
- Railway가 자동으로 스케일링
- 필요시 더 많은 리소스 할당

### 백업 전략
- 정기적인 데이터베이스 백업
- 코드 버전 관리
- 환경 설정 백업 