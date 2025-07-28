# Stage 1: Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Accept build arguments from GitHub Actions
ARG NEXT_PUBLIC_RUNTIME
ARG NEXT_PUBLIC_GOOGLE_ANALYTICS

# Make them available as environment variables
ENV NEXT_PUBLIC_RUNTIME=$NEXT_PUBLIC_RUNTIME
ENV NEXT_PUBLIC_GOOGLE_ANALYTICS=$NEXT_PUBLIC_GOOGLE_ANALYTICS

# Check if correctly copied ENV
RUN echo "Correctly Copied: NEXT_PUBLIC_RUNTIME=$NEXT_PUBLIC_RUNTIME"
RUN echo "Correctly Copied: NEXT_PUBLIC_GOOGLE_ANALYTICS=$NEXT_PUBLIC_GOOGLE_ANALYTICS"

# Install pnpm globally
RUN npm install -g pnpm

# Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source and build
COPY . .
COPY next.config.ts next.config.ts
RUN echo "Correctly Copied: NEXT_PUBLIC_RUNTIME=$NEXT_PUBLIC_RUNTIME"
RUN echo "Correctly Copied: NEXT_PUBLIC_GOOGLE_ANALYTICS=$NEXT_PUBLIC_GOOGLE_ANALYTICS"
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
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/next.config.ts ./next.config.ts

USER nodejs

EXPOSE 3000
EXPOSE 9103

#CMD ["pnpm", "run", "start"]
CMD sh -c "node scripts/metrics-server.js & pnpm run start"