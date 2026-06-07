FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
ARG BUILD_TARGET=prod
RUN if [ "$BUILD_TARGET" = "dev" ] || [ "$BUILD_TARGET" = "development" ]; then npm run build:dev; else npm run build:prod; fi

FROM nginx:1.27-alpine
WORKDIR /usr/share/nginx/html

COPY --from=build /app/dist/kata-customers-frontend/browser .
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
