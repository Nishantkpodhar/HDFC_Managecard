package com.banking360.gateway;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Deterministic gateway routing. Each business domain maps to one
 * independently deployable microservice behind the API Gateway. The browser
 * only ever talks to the gateway (port 8080); the gateway fans out to the
 * correct service by API path prefix.
 *
 * Service base URLs are externalised so local/dev/docker/k8s can point at
 * different hosts without changing code.
 */
@Configuration
public class RouteConfig {

    @Bean
    public RouteLocator routeLocator(RouteLocatorBuilder builder,
                                     @Value("${service.identity:http://localhost:8081}") String identity,
                                     @Value("${service.customer:http://localhost:8082}") String customer,
                                     @Value("${service.product:http://localhost:8083}") String product,
                                     @Value("${service.card:http://localhost:8084}") String card,
                                     @Value("${service.transaction:http://localhost:8085}") String transaction,
                                     @Value("${service.payment:http://localhost:8086}") String payment,
                                     @Value("${service.ledger:http://localhost:8087}") String ledger,
                                     @Value("${service.reward:http://localhost:8088}") String reward,
                                     @Value("${service.emi:http://localhost:8089}") String emi,
                                     @Value("${service.loan:http://localhost:8090}") String loan,
                                     @Value("${service.fastag:http://localhost:8091}") String fastag,
                                     @Value("${service.offer:http://localhost:8092}") String offer,
                                     @Value("${service.notification:http://localhost:8093}") String notification,
                                     @Value("${service.service-request:http://localhost:8094}") String serviceRequest,
                                     @Value("${service.configuration:http://localhost:8095}") String configuration,
                                     @Value("${service.feature-flag:http://localhost:8096}") String featureFlag,
                                     @Value("${service.audit:http://localhost:8097}") String audit,
                                     @Value("${service.cms:http://localhost:8098}") String cms,
                                     @Value("${service.admin:http://localhost:8099}") String admin,
                                     @Value("${service.reporting:http://localhost:8100}") String reporting) {
        RouteLocatorBuilder.Builder routes = builder.routes();
        routes.route("identity-service", r -> r.path("/api/v1/auth/**").uri(identity));
        routes.route("customer-service", r -> r.path("/api/v1/customers/**", "/api/v1/profile/**", "/api/v1/customer/**").uri(customer));
        routes.route("product-service", r -> r.path("/api/v1/products/**").uri(product));
        routes.route("card-service", r -> r.path("/api/v1/cards/**").uri(card));
        routes.route("transaction-service", r -> r.path("/api/v1/transactions/**").uri(transaction));
        routes.route("payment-service", r -> r.path("/api/v1/payments/**").uri(payment));
        routes.route("ledger-service", r -> r.path("/api/v1/ledger/**").uri(ledger));
        routes.route("reward-service", r -> r.path("/api/v1/rewards/**").uri(reward));
        routes.route("emi-service", r -> r.path("/api/v1/emi/**").uri(emi));
        routes.route("loan-service", r -> r.path("/api/v1/loans/**").uri(loan));
        routes.route("fastag-service", r -> r.path("/api/v1/fastag/**").uri(fastag));
        routes.route("offer-service", r -> r.path("/api/v1/offers/**").uri(offer));
        routes.route("notification-service", r -> r.path("/api/v1/notifications/**").uri(notification));
        routes.route("service-request-service", r -> r.path("/api/v1/service-requests/**").uri(serviceRequest));
        routes.route("configuration-service", r -> r.path("/api/v1/config/**").uri(configuration));
        routes.route("feature-flag-service", r -> r.path("/api/v1/feature-flags/**").uri(featureFlag));
        routes.route("audit-service", r -> r.path("/api/v1/audit/**").uri(audit));
        routes.route("cms-service", r -> r.path("/api/v1/cms/**").uri(cms));
        routes.route("admin-service", r -> r.path("/api/v1/admin/**").uri(admin));
        routes.route("reporting-service", r -> r.path("/api/v1/reporting/**").uri(reporting));
        return routes.build();
    }
}