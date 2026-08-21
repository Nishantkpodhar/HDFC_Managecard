package com.banking360.gateway.filter;

import org.slf4j.MDC;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Component
public class CorrelationIdFilter implements GlobalFilter, Ordered {

    public static final String CORRELATION_ID_HEADER = "X-Correlation-Id";
    public static final String REQUEST_ID_HEADER = "X-Request-Id";

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String correlationId = exchange.getRequest().getHeaders().getFirst(CORRELATION_ID_HEADER);
        if (correlationId == null || correlationId.isBlank()) {
            correlationId = UUID.randomUUID().toString();
        }
        String requestId = UUID.randomUUID().toString();

        MDC.put(CORRELATION_ID_HEADER, correlationId);
        MDC.put(REQUEST_ID_HEADER, requestId);

        ServerHttpRequest mutated = exchange.getRequest().mutate()
                .header(CORRELATION_ID_HEADER, correlationId)
                .header(REQUEST_ID_HEADER, requestId)
                .build();
        ServerWebExchange mutatedExchange = exchange.mutate().request(mutated).build();

        mutatedExchange.getResponse().getHeaders().add(CORRELATION_ID_HEADER, correlationId);
        mutatedExchange.getResponse().getHeaders().add(REQUEST_ID_HEADER, requestId);

        return chain.filter(mutatedExchange)
                .then(Mono.fromRunnable(() -> {
                    MDC.remove(CORRELATION_ID_HEADER);
                    MDC.remove(REQUEST_ID_HEADER);
                }));
    }

    @Override
    public int getOrder() {
        return -100;
    }
}