# Node 이미지
FROM node:22-slim

# 작업 디렉토리 설정
WORKDIR /usr/src/app

# 패키지 파일 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 모든 소스 파일 복사
COPY . .

RUN npm run build

# 포트
EXPOSE 28080

# 앱 실행 명령
CMD ["sh", "-c", "PORT=28080 npm start"]