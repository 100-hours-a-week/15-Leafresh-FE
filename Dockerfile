# # Stage 1: Build the Next.js application using a lightweight builder
# FROM node:22-alpine AS builder

# WORKDIR /app

# # Install pnpm first (전역)
# RUN npm install -g pnpm

# # 복사 및 의존성 설치
# COPY package.json pnpm-lock.yaml ./
# RUN pnpm install --frozen-lockfile

# # 나머지 코드 복사 및 빌드
# COPY . .
# RUN pnpm run build

# # Stage 2: Use a minimal production image (only what's needed to serve)
# FROM node:22-alpine AS runner

# WORKDIR /app

# ENV NODE_ENV=production

# # Non-root user for security
# RUN addgroup --system --gid 1001 nodejs && \
#     adduser --system --uid 1001 nodejs

# # Install only production dependencies
# COPY package.json pnpm-lock.yaml ./
# RUN npm install -g pnpm && pnpm install --prod --frozen-lockfile

# # 빌드된 정적 파일만 복사
# COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/public ./public
# COPY --from=builder /app/next.config.ts ./

# USER nodejs

# EXPOSE 3000

# CMD ["pnpm", "run", "start"]


# Stage 1: Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source and build
COPY . .
RUN pnpm run build

# Stage 2: Runtime stage (minimal)
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup -g 1001 nodejs && adduser -u 1001 -G nodejs -s /bin/sh -D nodejs && \
    npm install -g pnpm

# Copy only what is needed to run
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts

USER nodejs

EXPOSE 3000

CMD ["pnpm", "run", "start"]

