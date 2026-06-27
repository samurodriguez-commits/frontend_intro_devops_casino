FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./

RUN if [ -f package-lock.json ]; then \
      npm ci; \
    else \
      npm install; \
    fi

COPY . .
RUN npm run build && \
    mkdir -p /app/build-output && \
    ( cp -r /app/dist/*/browser/* /app/build-output/ 2>/dev/null || \
      cp -r /app/dist/*/* /app/build-output/ )

FROM nginxinc/nginx-unprivileged:1.27-alpine AS runtime
COPY --from=builder --chown=nginx:nginx /app/build-output/ /usr/share/nginx/html/

COPY --chown=nginx:nginx nginx.conf /etc/nginx/templates/default.conf.template

USER nginx
EXPOSE 8080