FROM node:20-slim AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build && npm prune --omit=dev

# ── Runtime image ──────────────────────────────────────────────
FROM python:3.12-slim

# Configure Rust to install globally so non-root users can access it
ENV RUSTUP_HOME=/usr/local/rustup \
    CARGO_HOME=/usr/local/cargo \
    PATH=/usr/local/cargo/bin:${PATH}

# Install Rust toolchain and Node.js
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl build-essential ca-certificates \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --no-modify-path \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Create a non-privileged sandbox user
RUN useradd -m -s /bin/bash sandbox

# Ensure global Cargo and Rustup directories are readable and executable by everyone
RUN chmod -R a+rx /usr/local/cargo /usr/local/rustup

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
