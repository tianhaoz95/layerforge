FROM node:20-slim AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build && npm prune --omit=dev

# ── Runtime image ──────────────────────────────────────────────
FROM python:3.12-slim

# Install Node.js
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl ca-certificates \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Create a non-privileged sandbox user
RUN useradd -m -s /bin/bash sandbox

# Python deps used by challenge test harnesses
RUN pip install --no-cache-dir numpy torch --index-url https://download.pytorch.org/whl/cpu && \
    pip install --no-cache-dir triton

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

# Grant ownership of /app to the sandbox user
RUN chown -R sandbox:sandbox /app

# Switch to the non-privileged user
USER sandbox

EXPOSE 3001
CMD ["node", "dist/index.js"]
