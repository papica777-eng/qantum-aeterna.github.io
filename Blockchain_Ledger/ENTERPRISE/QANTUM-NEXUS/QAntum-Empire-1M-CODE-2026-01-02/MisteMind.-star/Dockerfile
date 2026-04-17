# ╔═══════════════════════════════════════════════════════════════════════════╗
# ║           QANTUM v9.0 - Docker Configuration                         ║
# ║           AI-Powered QA Automation Framework                              ║
# ╚═══════════════════════════════════════════════════════════════════════════╝

FROM node:18-slim

# Install Chrome dependencies
RUN apt-get update && apt-get install -y \
    chromium \
    chromium-driver \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libatspi2.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxkbcommon0 \
    libxrandr2 \
    xdg-utils \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Set Chrome path
ENV CHROME_BIN=/usr/bin/chromium
ENV CHROMEDRIVER_PATH=/usr/bin/chromedriver

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY qantum-v8.js ./
COPY shadow-visual-engines.js ./
COPY test-scenarios.js ./

# Create directories
RUN mkdir -p knowledge output baselines visual_diffs bug_reports

# Copy knowledge base if exists (using shell to handle missing dir)
RUN if [ -d "knowledge" ]; then cp -r knowledge/ ./knowledge/; fi

# Set environment
ENV NODE_ENV=production
ENV HEADLESS=true

# Expose port for potential web interface
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "console.log('OK')" || exit 1

# Default command
CMD ["node", "qantum-v8.js"]
