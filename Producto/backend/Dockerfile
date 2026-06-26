# ── Etapa 1: Build del Frontend con Vite ──────────────────────────────────────
FROM node:20-alpine AS frontend-build

WORKDIR /frontend

COPY Producto/frontend/package*.json ./
RUN npm install

COPY Producto/frontend/ .

ARG VITE_API_URL=http://localhost:8080
ARG VITE_GITHUB_CLIENT_ID=Ov23liOZ8Db9SFAgin3l
ARG VITE_GITHUB_REDIRECT_URI=http://localhost:3000/auth/callback

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_GITHUB_CLIENT_ID=$VITE_GITHUB_CLIENT_ID
ENV VITE_GITHUB_REDIRECT_URI=$VITE_GITHUB_REDIRECT_URI

RUN npm run build

# ── Etapa 2: Build del Backend con Maven ───────────────────────────────────────
FROM eclipse-temurin:21-jdk-alpine AS backend-build

WORKDIR /app

COPY Producto/backend/.mvn/ .mvn/
COPY Producto/backend/mvnw .
COPY Producto/backend/pom.xml .
COPY Producto/backend/src ./src

RUN chmod +x mvnw && ./mvnw clean package -DskipTests

# ── Etapa 3: Runtime - Servir Frontend + Backend ────────────────────────────────
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copiar JAR del backend
COPY --from=backend-build /app/target/*.jar app.jar

# Copiar archivos estáticos del frontend
COPY --from=frontend-build /frontend/dist /app/static

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]

