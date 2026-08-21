package com.banking360.reward.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI api() {
        return new OpenAPI().info(new Info()
            .title("Reward Service API")
            .description("Banking360 Reward microservice (development/demo, fictional data)")
            .version("v1"));
    }
}
