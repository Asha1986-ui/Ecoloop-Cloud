# Multi-stage Dockerfile for EcoLoop Spring Boot Backend
# Stage 1: Build & Package
FROM maven:3.9.8-eclipse-temurin-21 AS builder
WORKDIR /app

# Cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Build application artifact
COPY src ./src
RUN mvn clean package -DskipTests -B

# Stage 2: Minimal Production JRE Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Create a non-root service user for container security
RUN addgroup -S ecoloop && adduser -S ecoloop -G ecoloop
USER ecoloop

# Copy compiled jar from build stage
COPY --from=builder /app/target/ecoloop-backend-1.0.0.jar app.jar
# Configuration defaults
ENV SPRING_PROFILES_ACTIVE=prod \
    SERVER_PORT=8080 \
    JAVA_OPTS="-Xms256m -Xmx512m -XX:+UseG1GC"

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=45s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/api/health || exit 1

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
