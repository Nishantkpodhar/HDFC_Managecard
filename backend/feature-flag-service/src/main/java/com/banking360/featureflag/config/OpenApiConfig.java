package com.banking360.featureflag.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI api() {
        return new OpenAPI().info(new Info()
            .title("FeatureFlag Service API")
            .description("Banking360 FeatureFlag microservice (development/demo, fictional data)")
            .version("v1"));
    }
}
