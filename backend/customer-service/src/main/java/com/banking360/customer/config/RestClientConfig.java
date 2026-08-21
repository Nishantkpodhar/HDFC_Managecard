package com.banking360.customer.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

/**
 * Shared outbound REST client used by the customer-service to aggregate data from
 * other independently deployable microservices (card-service, transaction-service)
 * for composite views such as the dashboard. This is real inter-service
 * communication through HTTP APIs, never direct database access.
 */
@Configuration
public class RestClientConfig {

    @Bean
    public RestTemplate dashboardRestTemplate() {
        return new RestTemplate();
    }
}