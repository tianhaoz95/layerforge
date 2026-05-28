FROM node:20-slim AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ── Runtime image ──────────────────────────────────────────────
FROM python:3.12-slim

# Install Rust toolchain and Node.js
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl build-essential ca-certificates \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --no-modify-path \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

ENV PATH="/root/.cargo/bin:${PATH}"

# Python deps used by challenge test harnesses
RUN pip install --no-cache-dir numpy

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

EXPOSE 3001
CMD ["node", "dist/index.js"]
