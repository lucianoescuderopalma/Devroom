# ── Build del Backend con Maven ──────────────────────
FROM eclipse-temurin:21-jdk-alpine AS build

WORKDIR /app

COPY Producto/backend/.mvn/ .mvn/
COPY Producto/backend/mvnw .
COPY Producto/backend/pom.xml .
COPY Producto/backend/src ./src

RUN chmod +x mvnw && ./mvnw clean package -DskipTests

# ── Runtime ──────────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
