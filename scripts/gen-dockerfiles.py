"""Generate per-service backend Dockerfiles for Banking360 microservices.

Each microservice is independently buildable/runnable. The build stage compiles
the Maven reactor module (-pl <service> -am) so the service artifact is produced
along with its required common-lib dependency, then a slim JRE image runs it.
"""
import os

SERVICES = [
    "api-gateway", "identity-service", "customer-service", "product-service",
    "card-service", "transaction-service", "payment-service", "ledger-service",
    "reward-service", "emi-service", "loan-service", "fastag-service",
    "offer-service", "notification-service", "service-request-service",
    "configuration-service", "feature-flag-service", "audit-service",
    "cms-service", "admin-service", "reporting-service",
]

PORTS = {
    "api-gateway": 8080, "identity-service": 8081, "customer-service": 8082,
    "product-service": 8083, "card-service": 8084, "transaction-service": 8085,
    "payment-service": 8086, "ledger-service": 8087, "reward-service": 8088,
    "emi-service": 8089, "loan-service": 8090, "fastag-service": 8091,
    "offer-service": 8092, "notification-service": 8093,
    "service-request-service": 8094, "configuration-service": 8095,
    "feature-flag-service": 8096, "audit-service": 8097, "cms-service": 8098,
    "admin-service": 8099, "reporting-service": 8100,
}

DOCKERFILE = """# Banking360 {service} — independently deployable microservice (DEMO ONLY).
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY common-lib/pom.xml common-lib/pom.xml
COPY {service}/pom.xml {service}/pom.xml
RUN mvn -q -pl {service} -am dependency:go-offline -B || true
COPY . .
RUN mvn -q -pl {service} -am package -DskipTests -B

FROM eclipse-temurin:21-jre
WORKDIR /app
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75"
EXPOSE {port}
COPY --from=build /app/{service}/target/*.jar app.jar
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
"""


def main():
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    backend = os.path.join(root, "backend")
    for svc in SERVICES:
        path = os.path.join(backend, svc, "Dockerfile")
        with open(path, "w") as f:
            f.write(DOCKERFILE.format(service=svc, port=PORTS[svc]))
    print("Generated", len(SERVICES), "backend Dockerfiles")


if __name__ == "__main__":
    main()