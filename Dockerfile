# 빌드 스테이지: 프론트엔드 빌드
FROM node:18-alpine AS builder

WORKDIR /app

# 프론트엔드 의존성 설치
COPY frontend/package*.json ./frontend/
WORKDIR /app/frontend
RUN npm ci --only=production

# 프론트엔드 소스 전체 복사 및 빌드
COPY frontend/ ./
RUN npm run build


# 프로덕션 스테이지: 백엔드 및 실행 환경
FROM node:18-alpine AS production

# non-root 사용자 생성 (Alpine 환경)
RUN addgroup -g 1001 nodejs && \
    adduser -D -u 1001 -G nodejs nodejs

# 작업 디렉토리 설정 (백엔드 루트)
WORKDIR /app/backend

# 백엔드 전체 소스 복사 (package.json 포함)
COPY backend/ ./

# SQLite3 빌드 위해 필요한 툴 설치 후, 프로덕션 의존성 설치 및 툴 제거
RUN apk add --no-cache python3 make g++ \
    && npm install --omit=dev \
    && apk del python3 make g++

# 빌드된 프론트엔드 결과물 복사 (builder 스테이지에서)
COPY --from=builder /app/frontend/build ../frontend/build

# 작업 디렉토리를 상위 폴더로 변경 (필요 시)
WORKDIR /app

# 소유권 변경 (nodejs 사용자 권한 부여)
RUN chown -R nodejs:nodejs /app

# non-root 사용자로 전환
USER nodejs

# 포트 노출
EXPOSE 5000

# 헬스체크 설정
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

# 백엔드 워킹 디렉토리에서 실행
WORKDIR /app/backend

CMD ["node", "server.js"]