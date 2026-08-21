#!/usr/bin/env python3
"""Generate Banking360 backend microservices (Spring Boot + Maven).
Uniform scaffold: real JPA entities, REST controllers, DTOs, security,
OpenAPI, Flyway migration, actuator health. Enhanced services are
overwritten separately after generation.
"""
import os

ROOT = "/Users/nishantkumar/Project/HDFC_Managecard/backend"

# (artifact, ClassName, port, dbName, entityName, fields[(java, name)], basePath)
SERVICES = [
    ("customer-service", "Customer", 8082, "customer_db", "CustomerProfile",
     [("String", "fullName"), ("String", "mobile"), ("String", "email"),
      ("String", "segment"), ("String", "status")], "customers"),
    ("product-service", "Product", 8083, "product_db", "Product",
     [("String", "name"), ("String", "category"), ("String", "eligibility"),
      ("Boolean", "active")], "products"),
    ("card-service", "Card", 8084, "card_db", "Card",
     [("String", "customerId"), ("String", "maskedNumber"), ("String", "lastFour"),
      ("String", "type"), ("String", "status"), ("java.math.BigDecimal", "creditLimit")], "cards"),
    ("transaction-service", "Transaction", 8085, "transaction_db", "Transaction",
     [("String", "customerId"), ("String", "cardId"), ("String", "description"),
      ("java.math.BigDecimal", "amount"), ("String", "currency"), ("String", "state")], "transactions"),
    ("payment-service", "Payment", 8086, "payment_db", "Payment",
     [("String", "customerId"), ("String", "fromCardId"), ("String", "toAccount"),
      ("java.math.BigDecimal", "amount"), ("String", "currency"), ("String", "status"),
      ("String", "idempotencyKey")], "payments"),
    ("ledger-service", "Ledger", 8087, "ledger_db", "LedgerEntry",
     [("String", "accountId"), ("String", "type"), ("java.math.BigDecimal", "amount"),
      ("String", "currency"), ("String", "referenceId"), ("String", "status")], "ledger"),
    ("reward-service", "Reward", 8088, "reward_db", "RewardAccount",
     [("String", "customerId"), ("java.math.BigDecimal", "balance"),
      ("String", "currency")], "rewards"),
    ("emi-service", "Emi", 8089, "emi_db", "EmiPlan",
     [("String", "customerId"), ("String", "cardId"), ("Integer", "tenure"),
      ("java.math.BigDecimal", "principal"), ("java.math.BigDecimal", "interestRate"),
      ("String", "status")], "emi"),
    ("loan-service", "Loan", 8090, "loan_db", "LoanApplication",
     [("String", "customerId"), ("String", "product"), ("java.math.BigDecimal", "amount"),
      ("String", "status")], "loans"),
    ("fastag-service", "Fastag", 8091, "fastag_db", "Fastag",
     [("String", "customerId"), ("String", "vehicleNumber"), ("String", "status"),
      ("java.math.BigDecimal", "balance"), ("String", "currency")], "fastag"),
    ("offer-service", "Offer", 8092, "offer_db", "Offer",
     [("String", "title"), ("String", "category"), ("String", "segment"),
      ("String", "status"), ("java.math.BigDecimal", "minSpend")], "offers"),
    ("notification-service", "Notification", 8093, "notification_db", "Notification",
     [("String", "customerId"), ("String", "channel"), ("String", "template"),
      ("String", "status")], "notifications"),
    ("service-request-service", "ServiceRequest", 8094, "servicerequest_db", "ServiceRequest",
     [("String", "customerId"), ("String", "type"), ("String", "status"),
      ("String", "description")], "service-requests"),
    ("configuration-service", "Configuration", 8095, "configuration_db", "ConfigEntry",
     [("String", "key"), ("String", "value"), ("String", "category")], "configurations"),
    ("feature-flag-service", "FeatureFlag", 8096, "featureflag_db", "FeatureFlag",
     [("String", "name"), ("Boolean", "enabled"), ("String", "segment")], "flags"),
    ("audit-service", "Audit", 8097, "audit_db", "AuditLog",
     [("String", "actor"), ("String", "action"), ("String", "entity"),
      ("String", "entityId"), ("String", "result")], "audit"),
    ("cms-service", "Cms", 8098, "cms_db", "CmsContent",
     [("String", "type"), ("String", "title"), ("String", "body"),
      ("String", "status")], "cms"),
    ("admin-service", "Admin", 8099, "admin_db", "AdminUser",
     [("String", "username"), ("String", "role"), ("String", "email"),
      ("String", "status")], "admins"),
    ("reporting-service", "Reporting", 8100, "reporting_db", "Report",
     [("String", "name"), ("String", "type"), ("String", "status")], "reports"),
]

def jpkg(art):
    return "com.banking360." + art.replace("-service", "").replace("-", "")

PARENT_POM = """<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.banking360</groupId>
    <artifactId>banking360-backend</artifactId>
    <version>1.0.0</version>
    <packaging>pom</packaging>
    <name>Banking360 Backend</name>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.5.0</version>
        <relativePath/>
    </parent>
    <modules>
        <module>common-lib</module>
__MODULES__
    </modules>
    <properties>
        <java.version>21</java.version>
        <maven.compiler.release>21</maven.compiler.release>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <lombok.version>1.18.42</lombok.version>
    </properties>
    <build>
        <pluginManagement>
            <plugins>
                <plugin>
                    <groupId>org.apache.maven.plugins</groupId>
                    <artifactId>maven-compiler-plugin</artifactId>
                    <configuration>
                        <parameters>true</parameters>
                        <annotationProcessorPaths>
                            <path>
                                <groupId>org.projectlombok</groupId>
                                <artifactId>lombok</artifactId>
                                <version>${lombok.version}</version>
                            </path>
                        </annotationProcessorPaths>
                    </configuration>
                </plugin>
            </plugins>
        </pluginManagement>
    </build>
</project>
"""

COMMON_POM = """<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>com.banking360</groupId>
        <artifactId>banking360-backend</artifactId>
        <version>1.0.0</version>
    </parent>
    <artifactId>common-lib</artifactId>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>io.swagger.core.v3</groupId>
            <artifactId>swagger-annotations-jakarta</artifactId>
            <version>2.2.22</version>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
    </dependencies>
</project>
"""

SERVICE_POM = """<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>com.banking360</groupId>
        <artifactId>banking360-backend</artifactId>
        <version>1.0.0</version>
    </parent>
    <artifactId>__ART__</artifactId>
    <dependencies>
        <dependency>
            <groupId>com.banking360</groupId>
            <artifactId>common-lib</artifactId>
            <version>1.0.0</version>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.flywaydb</groupId>
            <artifactId>flyway-core</artifactId>
        </dependency>
        <dependency>
            <groupId>org.flywaydb</groupId>
            <artifactId>flyway-database-postgresql</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springdoc</groupId>
            <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
            <version>2.7.0</version>
        </dependency>
        <dependency>
            <groupId>io.github.resilience4j</groupId>
            <artifactId>resilience4j-spring-boot3</artifactId>
            <version>2.2.0</version>
        </dependency>
        <dependency>
            <groupId>org.springframework.kafka</groupId>
            <artifactId>spring-kafka</artifactId>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    <build>
        <finalName>__ART__</finalName>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <mainClass>__PKG__.Application</mainClass>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
"""

APP = """package __PKG__;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = {"__PKG__", "com.banking360.common"})
@EntityScan("__PKG__.domain")
@EnableJpaRepositories("__PKG__.repository")
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
"""

SECURITY = """package __PKG__.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import com.banking360.common.security.AuthFilter;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/actuator/health", "/actuator/info", "/swagger-ui/**",
                    "/v3/api-docs/**", "/swagger-resources/**", "/webjars/**").permitAll()
                .anyRequest().authenticated())
            .addFilterBefore(new AuthFilter(), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public AuthFilter authFilter() {
        return new AuthFilter();
    }
}
"""

OPENAPI = """package __PKG__.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI api() {
        return new OpenAPI().info(new Info()
            .title("__CLASS__ Service API")
            .description("Banking360 __CLASS__ microservice (development/demo, fictional data)")
            .version("v1"));
    }
}
"""

ENTITY = """package __PKG__.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "__TABLE__")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class __ENTITY__ {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

__FIELDS__

    @Column(updatable = false)
    private Instant createdAt = Instant.now();
    private Instant updatedAt = Instant.now();

    @PreUpdate
    void preUpdate() { this.updatedAt = Instant.now(); }
}
"""

REPO = """package __PKG__.repository;

import __PKG__.domain.__ENTITY__;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface __ENTITY__Repository extends JpaRepository<__ENTITY__, String> {
}
"""

DTO_REQ = """package __PKG__.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class __ENTITY__Request {
__REQFIELDS__
}
"""

DTO_RES = """package __PKG__.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class __ENTITY__Response {
    private String id;
__RESFIELDS__
    private Instant createdAt;
    private Instant updatedAt;
}
"""

SERVICE = """package __PKG__.service;

import __PKG__.domain.__ENTITY__;
import __PKG__.dto.__ENTITY__Request;
import __PKG__.dto.__ENTITY__Response;
import __PKG__.repository.__ENTITY__Repository;
import com.banking360.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class __ENTITY__Service {

    private final __ENTITY__Repository repository;

    public ApiResponse<Page<__ENTITY__Response>> list(Pageable pageable) {
        return ApiResponse.success(repository.findAll(pageable).map(this::toResponse));
    }

    public ApiResponse<__ENTITY__Response> get(String id) {
        return ApiResponse.success(toResponse(repository.findById(id)
            .orElseThrow(() -> com.banking360.common.exception.ApiException.notFound("__ENTITY__", id))));
    }

    public ApiResponse<__ENTITY__Response> create(__ENTITY__Request req) {
        __ENTITY__ e = toEntity(req);
        e.setId(UUID.randomUUID().toString());
        return ApiResponse.success(toResponse(repository.save(e)));
    }

    public ApiResponse<__ENTITY__Response> update(String id, __ENTITY__Request req) {
        __ENTITY__ e = repository.findById(id)
            .orElseThrow(() -> com.banking360.common.exception.ApiException.notFound("__ENTITY__", id));
        apply(e, req);
        return ApiResponse.success(toResponse(repository.save(e)));
    }

    public ApiResponse<Void> delete(String id) {
        repository.deleteById(id);
        return ApiResponse.success(null);
    }

    private __ENTITY__Response toResponse(__ENTITY__ e) {
        __ENTITY__Response r = __ENTITY__Response.builder()
            .id(e.getId())
__MAPRES__
            .createdAt(e.getCreatedAt())
            .updatedAt(e.getUpdatedAt())
            .build();
        return r;
    }

    private __ENTITY__ toEntity(__ENTITY__Request req) {
        __ENTITY__ e = new __ENTITY__();
        apply(e, req);
        return e;
    }

    private void apply(__ENTITY__ e, __ENTITY__Request req) {
__MAPREQ__
    }
}
"""

CONTROLLER = """package __PKG__.controller;

import __PKG__.dto.__ENTITY__Request;
import __PKG__.dto.__ENTITY__Response;
import __PKG__.service.__ENTITY__Service;
import com.banking360.common.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/__BASE__")
@RequiredArgsConstructor
public class __ENTITY__Controller {

    private final __ENTITY__Service service;

    @GetMapping
    public ResponseEntity<ApiResponse<?>> list(Pageable pageable) {
        return ResponseEntity.ok(service.list(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> get(@PathVariable String id) {
        return ResponseEntity.ok(service.get(id));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<?>> create(@Valid @RequestBody __ENTITY__Request req) {
        return ResponseEntity.ok(service.create(req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> update(@PathVariable String id,
                                                 @Valid @RequestBody __ENTITY__Request req) {
        return ResponseEntity.ok(service.update(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> delete(@PathVariable String id) {
        return ResponseEntity.ok(service.delete(id));
    }
}
"""

APP_YML = """server:
  port: __PORT__
spring:
  application:
    name: __ART__
  datasource:
    url: ${DB_URL:jdbc:postgresql://localhost:5432/__DB__}
    username: ${DB_USERNAME:banking360}
    password: ${DB_PASSWORD:banking360}
    driver-class-name: org.postgresql.Driver
  jpa:
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
    open-in-view: false
  flyway:
    enabled: true
    locations: classpath:db/migration
    baseline-on-migrate: true
  kafka:
    bootstrap-servers: ${KAFKA_SERVERS:localhost:9092}
    enabled: false
  security:
    user:
      name: actuator
      password: ${ACTUATOR_PASSWORD:act}
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  endpoint:
    health:
      show-details: always
  tracing:
    sampling:
      probability: 1.0
"""

TEST_YML = """spring:
  datasource:
    url: jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;MODE=PostgreSQL
    username: sa
    password: ""
    driver-class-name: org.h2.Driver
  jpa:
    hibernate:
      ddl-auto: create-drop
    properties:
      hibernate:
        dialect: org.hibernate.dialect.H2Dialect
  flyway:
    enabled: false
"""

TEST = """package __PKG__;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class ApplicationTests {
    @Test
    void contextLoads() {
    }
}
"""

def toCamel(name):
    return name[0].lower() + name[1:]

def main():
    modules = "\n".join(f"        <module>{a}</module>" for a, *_ in SERVICES)
    parent = PARENT_POM.replace("__MODULES__", "        <module>identity-service</module>\n" + modules)
    with open(os.path.join(ROOT, "pom.xml"), "w") as f:
        f.write(parent)
    with open(os.path.join(ROOT, "common-lib", "pom.xml"), "w") as f:
        f.write(COMMON_POM)
    os.makedirs(os.path.join(ROOT, "common-lib", "src", "main", "java", "com", "banking360", "common"), exist_ok=True)
    write_common_lib(ROOT)

    for (art, cls, port, db, ent, fields, base) in SERVICES:
        pkg = jpkg(art)
        path = os.path.join(ROOT, art)
        base_java = os.path.join(path, "src", "main", "java", *pkg.split("."))
        test_java = os.path.join(path, "src", "test", "java", *pkg.split("."))
        res = os.path.join(path, "src", "main", "resources")
        tres = os.path.join(path, "src", "test", "resources")
        os.makedirs(base_java, exist_ok=True)
        os.makedirs(test_java, exist_ok=True)
        os.makedirs(os.path.join(res, "db", "migration"), exist_ok=True)
        os.makedirs(tres, exist_ok=True)

        table = toCamel(ent) + "s"
        field_defs = "\n".join(f"    private {t} {n};" for t, n in fields)
        req_fields = "\n".join(f"    private {t} {n};" for t, n in fields)
        res_fields = "\n".join(f"    private {t} {n};" for t, n in fields)
        map_res = "\n".join(f"            .{n}(e.get{n[0].upper()+n[1:]}())" for _, n in fields)
        map_req = "\n".join(f"        e.set{n[0].upper()+n[1:]}(req.get{n[0].upper()+n[1:]}());" for _, n in fields)

        repl = {"__PKG__": pkg, "__CLASS__": cls, "__ART__": art, "__PORT__": str(port),
                "__DB__": db, "__ENTITY__": ent, "__BASE__": base, "__TABLE__": table}

        def fill(t):
            s = t
            for k, v in repl.items():
                s = s.replace(k, v)
            return s

        writes = {
            os.path.join(path, "pom.xml"): SERVICE_POM,
            os.path.join(base_java, "Application.java"): APP,
            os.path.join(base_java, "config", "SecurityConfig.java"): SECURITY,
            os.path.join(base_java, "config", "OpenApiConfig.java"): OPENAPI,
            os.path.join(base_java, "domain", ent + ".java"): ENTITY,
            os.path.join(base_java, "repository", ent + "Repository.java"): REPO,
            os.path.join(base_java, "dto", ent + "Request.java"): DTO_REQ,
            os.path.join(base_java, "dto", ent + "Response.java"): DTO_RES,
            os.path.join(base_java, "service", ent + "Service.java"): SERVICE,
            os.path.join(base_java, "controller", ent + "Controller.java"): CONTROLLER,
            os.path.join(res, "application.yml"): APP_YML,
            os.path.join(tres, "application-test.yml"): TEST_YML,
            os.path.join(test_java, "ApplicationTests.java"): TEST,
        }
        # entity/dto/service need field substitution beyond repl
        writes[os.path.join(base_java, "domain", ent + ".java")] = fill(ENTITY).replace("__FIELDS__", field_defs)
        writes[os.path.join(base_java, "dto", ent + "Request.java")] = fill(DTO_REQ).replace("__REQFIELDS__", req_fields)
        writes[os.path.join(base_java, "dto", ent + "Response.java")] = fill(DTO_RES).replace("__RESFIELDS__", res_fields)
        writes[os.path.join(base_java, "service", ent + "Service.java")] = fill(SERVICE).replace("__MAPRES__", map_res).replace("__MAPREQ__", map_req)

        # migration SQL
        cols = ",\n".join(f"    {n} {sqltype(t)}" for t, n in fields)
        migration = f"""-- __ART__ initial schema
CREATE TABLE IF NOT EXISTS {table} (
    id VARCHAR(36) PRIMARY KEY,
{cols},
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_{table}_created ON {table}(created_at);
"""
        writes[os.path.join(res, "db", "migration", "V1__init.sql")] = migration

        for fp, content in writes.items():
            d = os.path.dirname(fp)
            if d:
                os.makedirs(d, exist_ok=True)
            # re-fill for non-field templates
            if fp.endswith(".java") or fp.endswith("application.yml") or fp.endswith("ApplicationTests.java") or fp.endswith("pom.xml"):
                content = fill(content)
            with open(fp, "w") as f:
                f.write(content)
        print("generated", art)

def sqltype(t):
    if t == "String": return "VARCHAR(255)"
    if t == "Boolean": return "BOOLEAN"
    if t == "Integer": return "INTEGER"
    if t.startswith("java.math"): return "NUMERIC(19,4)"
    return "VARCHAR(255)"

def write_common_lib(root):
    base = os.path.join(root, "common-lib", "src", "main", "java", "com", "banking360", "common")
    dtod = os.path.join(base, "dto"); exd = os.path.join(base, "exception"); secd = os.path.join(base, "security")
    os.makedirs(dtod, exist_ok=True); os.makedirs(exd, exist_ok=True); os.makedirs(secd, exist_ok=True)
    with open(os.path.join(dtod, "ApiResponse.java"), "w") as f:
        f.write('''package com.banking360.common.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import java.util.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    private boolean success;
    private T data;
    private String message;
    private ErrorBody error;
    private Meta meta;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ErrorBody {
        private String code;
        private String message;
        private List<String> details;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Meta {
        private String requestId;
        private String correlationId;
    }

    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder().success(true).data(data).message("Success")
            .meta(Meta.builder().requestId(UUID.randomUUID().toString()).build()).build();
    }

    public static <T> ApiResponse<T> success(T data, String msg) {
        return ApiResponse.<T>builder().success(true).data(data).message(msg)
            .meta(Meta.builder().requestId(UUID.randomUUID().toString()).build()).build();
    }

    public static <T> ApiResponse<T> error(String code, String message) {
        return ApiResponse.<T>builder().success(false)
            .error(ErrorBody.builder().code(code).message(message).details(new ArrayList<>()).build())
            .meta(Meta.builder().requestId(UUID.randomUUID().toString()).build()).build();
    }
}
''')
    with open(os.path.join(exd, "ApiException.java"), "w") as f:
        f.write('''package com.banking360.common.exception;

import lombok.*;

@Getter
public class ApiException extends RuntimeException {
    private final String code;
    private final int httpStatus;

    public ApiException(String code, String message, int httpStatus) {
        super(message);
        this.code = code;
        this.httpStatus = httpStatus;
    }

    public static ApiException notFound(String entity, String id) {
        return new ApiException(entity.toUpperCase() + "_NOT_FOUND",
            "The requested " + entity.toLowerCase() + " was not found: " + id, 404);
    }

    public static ApiException badRequest(String code, String message) {
        return new ApiException(code, message, 400);
    }

    public static ApiException forbidden(String message) {
        return new ApiException("FORBIDDEN", message, 403);
    }
}
''')
    with open(os.path.join(exd, "GlobalExceptionHandler.java"), "w") as f:
        f.write('''package com.banking360.common.exception;

import com.banking360.common.dto.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ApiResponse<?>> handleApi(ApiException ex, HttpServletRequest req) {
        return ResponseEntity.status(ex.getHttpStatus())
            .body(ApiResponse.error(ex.getCode(), ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<?>> handleValidation(MethodArgumentNotValidException ex) {
        String msg = ex.getBindingResult().getFieldErrors().stream()
            .map(e -> e.getField() + ": " + e.getDefaultMessage()).collect(Collectors.joining("; "));
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.error("VALIDATION_ERROR", msg));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<?>> handleGeneric(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ApiResponse.error("INTERNAL_ERROR", "An unexpected error occurred"));
    }
}
''')
    with open(os.path.join(secd, "AuthFilter.java"), "w") as f:
        f.write('''package com.banking360.common.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * Development AuthFilter: reads identity from gateway-propagated headers.
 * In production this is replaced by OIDC/JWT validation at the API gateway.
 * NEVER trust these headers directly from the browser in production.
 */
public class AuthFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String userId = request.getHeader("X-User-Id");
        String roles = request.getHeader("X-User-Roles");
        if (userId != null && !userId.isBlank()) {
            List<SimpleGrantedAuthority> authorities = List.of();
            if (roles != null && !roles.isBlank()) {
                authorities = java.util.Arrays.stream(roles.split(","))
                    .map(r -> new SimpleGrantedAuthority("ROLE_" + r.trim())).toList();
            }
            var auth = new UsernamePasswordAuthenticationToken(userId, null, authorities);
            SecurityContextHolder.getContext().setAuthentication(auth);
        }
        chain.doFilter(request, response);
    }
}
''')

if __name__ == "__main__":
    main()