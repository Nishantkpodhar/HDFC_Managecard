# Banking360 cms-service — independently deployable microservice (DEMO ONLY).
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY common-lib/pom.xml common-lib/pom.xml
COPY cms-service/pom.xml cms-service/pom.xml
RUN mvn -q -pl cms-service -am dependency:go-offline -B || true
COPY . .
RUN mvn -q -pl cms-service -am package -DskipTests -B

FROM eclipse-temurin:21-jre
WORKDIR /app
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75"
EXPOSE 8098
COPY --from=build /app/cms-service/target/*.jar app.jar
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
