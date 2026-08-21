package com.banking360.gateway.filter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

/**
 * Centralized gateway authentication filter.
 *
 * Validates the bearer JWT issued by the Identity Service, then propagates a
 * verified principal to downstream microservices via trusted headers
 * (X-User-Id, X-User-Roles). Downstream services trust these headers ONLY
 * because they are injected by the gateway; the browser can never set them
 * (CORS on the gateway plus the AuthFilter ignoring client-supplied values).
 *
 * DEVELOPMENT-ONLY: token signing uses the same shared HMAC secret as the
 * Identity Service. In production this is replaced by OIDC/JWT verification
 * against a trusted authorization server with rotated signing keys.
 */
@Component
public class JwtAuthGatewayFilter implements GlobalFilter, Ordered {

    private static final List<String> PUBLIC_PATHS = List.of("/api/v1/auth/");

    private final SecretKey key;

    public JwtAuthGatewayFilter(@Value("${app.jwt.secret}") String jwtSecret) {
        this.key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    @Override
    public int getOrder() {
        return -1; // run early, before routing
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path = exchange.getRequest().getURI().getPath();
        if (isPublic(path)) {
            return chain.filter(exchange);
        }

        String auth = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (auth == null || !auth.startsWith("Bearer ")) {
            return unauthorized(exchange);
        }

        String token = auth.substring(7);
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            String userId = claims.getSubject();
            List<String> roles = new ArrayList<>();
            Object roleClaim = claims.get("role");
            if (roleClaim instanceof String s && !s.isBlank()) {
                roles.add(s);
            }
            Object rolesClaim = claims.get("roles");
            if (rolesClaim instanceof Iterable<?> iterable) {
                for (Object r : iterable) {
                    if (r != null) roles.add(r.toString());
                }
            }

            ServerWebExchange mutated = exchange.mutate()
                    .request(r -> r.header("X-User-Id", userId)
                            .header("X-User-Roles", String.join(",", roles))
                            .header("X-Request-Id", exchange.getRequest().getId()))
                    .build();
            return chain.filter(mutated);
        } catch (Exception e) {
            return unauthorized(exchange);
        }
    }

    private boolean isPublic(String path) {
        return PUBLIC_PATHS.stream().anyMatch(path::startsWith);
    }

    private Mono<Void> unauthorized(ServerWebExchange exchange) {
        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
        exchange.getResponse().getHeaders().add("Content-Type", "application/json");
        byte[] body = "{\"success\":false,\"error\":{\"code\":\"UNAUTHENTICATED\",\"message\":\"Missing or invalid token\"}}"
                .getBytes(StandardCharsets.UTF_8);
        return exchange.getResponse().writeWith(
                Mono.just(exchange.getResponse().bufferFactory().wrap(body)));
    }
}