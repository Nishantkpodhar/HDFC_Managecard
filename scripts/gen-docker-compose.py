"""Generate docker-compose.yml for the full Banking360 stack (demo/local).

Each backend microservice is independently buildable/runnable and owns its
tables (namespaced per service) inside a single PostgreSQL instance for local
development. Production should use physically separated databases per service.
"""
import os

SERVICES = {
    "api-gateway": 8080,
    "identity-service": 8081,
    "customer-service": 8082,
    "product-service": 8083,
    "card-service": 8084,
    "transaction-service": 8085,
    "payment-service": 8086,
    "ledger-service": 8087,
    "reward-service": 8088,
    "emi-service": 8089,
    "loan-service": 8090,
    "fastag-service": 8091,
    "offer-service": 8092,
    "notification-service": 8093,
    "service-request-service": 8094,
    "configuration-service": 8095,
    "feature-flag-service": 8096,
    "audit-service": 8097,
    "cms-service": 8098,
    "admin-service": 8099,
    "reporting-service": 8100,
}

GATEWAY_INTERNAL = {
    "identity-service": 8081,
    "customer-service": 8082,
    "product-service": 8083,
    "card-service": 8084,
    "transaction-service": 8085,
    "payment-service": 8086,
    "ledger-service": 8087,
    "reward-service": 8088,
    "emi-service": 8089,
    "loan-service": 8090,
    "fastag-service": 8091,
    "offer-service": 8092,
    "notification-service": 8093,
    "service-request-service": 8094,
    "configuration-service": 8095,
    "feature-flag-service": 8096,
    "audit-service": 8097,
    "cms-service": 8098,
    "admin-service": 8099,
    "reporting-service": 8100,
}


def env_block(name, port):
    """Environment for a Spring Boot service."""
    lines = [
        f"      SPRING_PROFILES_ACTIVE: docker",
        f"      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/banking360",
        f"      SPRING_DATASOURCE_USERNAME: banking360",
        f"      SPRING_DATASOURCE_PASSWORD: banking360",
        f"      SPRING_DATA_REDIS_HOST: redis",
        f"      SPRING_DATA_REDIS_PORT: '6379'",
        f"      SPRING_KAFKA_BOOTSTRAP_SERVERS: kafka:9092",
        f"      SERVICE_PORT: '{port}'",
    ]
    for svc, p in GATEWAY_INTERNAL.items():
        env = svc.upper().replace("-", "_")
        lines.append(f"      SERVICE_{env}_URL: http://{svc}:{p}")
    return "\n".join(lines)


def service_block(name, port):
    return f"""  {name}:
    build:
      context: ./backend
      dockerfile: {name}/Dockerfile
    ports:
      - "{port}:{port}"
    environment:
{env_block(name, port)}
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started
      kafka:
        condition: service_started
    networks:
      - banking360
"""


def main():
    out = []
    out.append("""# Banking360 local development stack (DEMO ONLY — fictional data).
# Infrastructure + all microservices + both micro-frontend shells.
# Run with: docker compose up --build
version: "3.9"

services:
""")

    # Infra
    out.append("""  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: banking360
      POSTGRES_USER: banking360
      POSTGRES_PASSWORD: banking360
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U banking360"]
      interval: 5s
      timeout: 5s
      retries: 10
    networks:
      - banking360

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    networks:
      - banking360

  kafka:
    image: bitnami/kafka:3.7
    ports:
      - "9092:9092"
    environment:
      KAFKA_CFG_NODE_ID: "1"
      KAFKA_CFG_PROCESS_ROLES: "broker,controller"
      KAFKA_CFG_CONTROLLER_QUORUM_VOTERS: "1@kafka:9093"
      KAFKA_CFG_LISTENERS: "PLAINTEXT://:9092,CONTROLLER://:9093"
      KAFKA_CFG_ADVERTISED_LISTENERS: "PLAINTEXT://kafka:9092"
      KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP: "CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT"
      KAFKA_CFG_CONTROLLER_LISTENER_NAMES: "CONTROLLER"
      KAFKA_CFG_AUTO_CREATE_TOPICS_ENABLE: "true"
    networks:
      - banking360

  zookeeper:
    image: bitnami/zookeeper:3.9
    environment:
      ALLOW_ANONYMOUS_LOGIN: "yes"
    networks:
      - banking360
""")

    # Backend services
    for name, port in SERVICES.items():
        out.append(service_block(name, port))

    # Frontend shells
    out.append("""  customer-shell:
    build:
      context: ./frontend/customer/shell
      dockerfile: Dockerfile
    ports:
      - "5173:80"
    depends_on:
      - api-gateway
    networks:
      - banking360

  admin-shell:
    build:
      context: ./frontend/admin/shell
      dockerfile: Dockerfile
    ports:
      - "5174:80"
    depends_on:
      - api-gateway
    networks:
      - banking360
""")

    out.append("""volumes:
  pgdata:

networks:
  banking360:
    driver: bridge
""")

    with open("docker-compose.yml", "w") as f:
        f.write("\n".join(out))
    print("docker-compose.yml generated with", len(SERVICES), "backend services")


if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    main()