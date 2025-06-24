# Stage 1: Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Accept build arguments from GitHub Actions
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_GOOGLE_ANALYTICS

# Make them available as environment variables
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_GOOGLE_ANALYTICS=$NEXT_PUBLIC_GOOGLE_ANALYTICS

# Check if correctly copied ENV
RUN echo "Correctly Copied: NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL"
RUN echo "Correctly Copied: NEXT_PUBLIC_GOOGLE_ANALYTICS=$NEXT_PUBLIC_GOOGLE_ANALYTICS"

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
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts

USER nodejs

EXPOSE 3000

CMD ["pnpm", "run", "start"]

