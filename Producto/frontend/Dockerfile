# ── Etapa 1: Build de React con Vite ─────────────────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG VITE_GITHUB_REDIRECT_URI=http://localhost:3000/auth/callback
ARG VITE_API_URL=http://localhost:8080
ARG VITE_GITHUB_CLIENT_ID=Ov23liOZ8Db9SFAgin3l

ENV VITE_GITHUB_REDIRECT_URI=$VITE_GITHUB_REDIRECT_URI
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_GITHUB_CLIENT_ID=$VITE_GITHUB_CLIENT_ID

RUN npm run build

# ── Etapa 2: Servir con Nginx ─────────────────────────────────────────────────
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]