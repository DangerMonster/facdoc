# 멀티스테이지 빌드: 빌드 스테이지
FROM node:18-alpine AS builder

# 작업 디렉토리 설정
WORKDIR /app

# 프론트엔드 의존성 설치
COPY frontend/package*.json ./frontend/
WORKDIR /app/frontend
RUN npm ci --only=production

# 프론트엔드 소스 코드 복사 및 빌드
COPY frontend/ ./
RUN npm run build

# 프로덕션 스테이지
FROM node:18-alpine AS production

# 보안을 위한 non-root 사용자 생성
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# 작업 디렉토리 설정
WORKDIR /app

# 백엔드 의존성 설치
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm ci --only=production

# 백엔드 소스 코드 복사
COPY backend/ ./

# 빌드된 프론트엔드 파일 복사
COPY --from=builder /app/frontend/build ./frontend/build

# 소유권 변경
RUN chown -R nodejs:nodejs /app

# non-root 사용자로 전환
USER nodejs

# 포트 노출
EXPOSE 5000

# 헬스체크 추가
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

# 애플리케이션 실행
CMD ["node", "server.js"] 