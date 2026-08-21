package com.banking360.customer.service;

import com.banking360.common.security.Authz;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.*;

/**
 * Composite dashboard aggregation for the authenticated customer.
 *
 * The dashboard is a COMPOSITE view: it fans out to the card-service,
 * transaction-service and payment-service over their public REST APIs and
 * merges the results. Each downstream service independently enforces
 * object-level authorization using the propagated principal headers.
 *
 * Degradation: if one downstream service is temporarily unavailable, the
 * dashboard still returns the data it could gather plus a list of which
 * sections failed, rather than failing the whole page.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class DashboardService {

    private final RestTemplate dashboardRestTemplate;
    private final ObjectMapper objectMapper;

    @Value("${service.card:http://localhost:8084}")
    private String cardServiceUrl;

    @Value("${service.transaction:http://localhost:8085}")
    private String transactionServiceUrl;

    @Value("${service.payment:http://localhost:8086}")
    private String paymentServiceUrl;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class CardSummary {
        private String id;
        private String maskedNumber;
        private String type;
        private String status;
        private java.math.BigDecimal availableLimit;
        private java.math.BigDecimal creditLimit;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class TransactionSummary {
        private String id;
        private String description;
        private java.math.BigDecimal amount;
        private String currency;
        private String status;
        private String date;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class PaymentSummary {
        private String id;
        private java.math.BigDecimal amount;
        private String currency;
        private String status;
        private String method;
    }

    @Data
    public static class DashboardResponse {
        private String customerId;
        private List<CardSummary> cards = new ArrayList<>();
        private List<TransactionSummary> recentTransactions = new ArrayList<>();
        private List<PaymentSummary> recentPayments = new ArrayList<>();
        private Map<String, Object> totals = new LinkedHashMap<>();
        private List<String> degradedSections = new ArrayList<>();
    }

    public DashboardResponse getDashboard() {
        String customerId = Authz.currentUserId();
        DashboardResponse response = new DashboardResponse();
        response.setCustomerId(customerId);

        fetchCards(response);
        fetchTransactions(response);
        fetchPayments(response);
        computeTotals(response);

        return response;
    }

    private HttpHeaders authHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-User-Id", Authz.currentUserId());
        headers.set("X-User-Roles", String.join(",", Authz.currentRoles()));
        return headers;
    }

    private void fetchCards(DashboardResponse response) {
        try {
            String url = cardServiceUrl + "/api/v1/cards";
            ResponseEntity<JsonNode> res = dashboardRestTemplate.exchange(
                    url, HttpMethod.GET, new HttpEntity<>(authHeaders()), JsonNode.class);
            JsonNode data = res.getBody() == null ? null : res.getBody().get("data");
            JsonNode content = data == null ? null
                    : (data.has("content") ? data.get("content") : data);
            if (content != null && content.isArray()) {
                for (JsonNode node : content) {
                    response.getCards().add(objectMapper.treeToValue(node, CardSummary.class));
                }
            }
        } catch (RestClientException | IllegalArgumentException e) {
            log.warn("Dashboard: card-service aggregation failed: {}", e.getMessage());
            response.getDegradedSections().add("cards");
        } catch (Exception e) {
            log.warn("Dashboard: unexpected error aggregating cards", e);
            response.getDegradedSections().add("cards");
        }
    }

    private void fetchTransactions(DashboardResponse response) {
        try {
            String url = transactionServiceUrl + "/api/v1/transactions?size=5";
            ResponseEntity<JsonNode> res = dashboardRestTemplate.exchange(
                    url, HttpMethod.GET, new HttpEntity<>(authHeaders()), JsonNode.class);
            JsonNode data = res.getBody() == null ? null : res.getBody().get("data");
            JsonNode content = data == null ? null
                    : (data.has("content") ? data.get("content") : data);
            if (content != null && content.isArray()) {
                for (JsonNode node : content) {
                    response.getRecentTransactions().add(objectMapper.treeToValue(node, TransactionSummary.class));
                }
            }
        } catch (RestClientException | IllegalArgumentException e) {
            log.warn("Dashboard: transaction-service aggregation failed: {}", e.getMessage());
            response.getDegradedSections().add("transactions");
        } catch (Exception e) {
            log.warn("Dashboard: unexpected error aggregating transactions", e);
            response.getDegradedSections().add("transactions");
        }
    }

    private void fetchPayments(DashboardResponse response) {
        try {
            String url = paymentServiceUrl + "/api/v1/payments?size=5";
            ResponseEntity<JsonNode> res = dashboardRestTemplate.exchange(
                    url, HttpMethod.GET, new HttpEntity<>(authHeaders()), JsonNode.class);
            JsonNode data = res.getBody() == null ? null : res.getBody().get("data");
            JsonNode content = data == null ? null
                    : (data.has("content") ? data.get("content") : data);
            if (content != null && content.isArray()) {
                for (JsonNode node : content) {
                    response.getRecentPayments().add(objectMapper.treeToValue(node, PaymentSummary.class));
                }
            }
        } catch (RestClientException | IllegalArgumentException e) {
            log.warn("Dashboard: payment-service aggregation failed: {}", e.getMessage());
            response.getDegradedSections().add("payments");
        } catch (Exception e) {
            log.warn("Dashboard: unexpected error aggregating payments", e);
            response.getDegradedSections().add("payments");
        }
    }

    private void computeTotals(DashboardResponse response) {
        BigDecimal totalAvailable = response.getCards().stream()
                .map(c -> c.getAvailableLimit() == null ? BigDecimal.ZERO : c.getAvailableLimit())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalCredit = response.getCards().stream()
                .map(c -> c.getCreditLimit() == null ? BigDecimal.ZERO : c.getCreditLimit())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        Map<String, Object> totals = response.getTotals();
        totals.put("cardCount", response.getCards().size());
        totals.put("totalAvailableLimit", totalAvailable);
        totals.put("totalCreditLimit", totalCredit);
        totals.put("recentTransactionCount", response.getRecentTransactions().size());
        totals.put("recentPaymentCount", response.getRecentPayments().size());
    }
}