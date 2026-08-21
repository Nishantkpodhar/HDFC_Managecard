package com.banking360.common.security;

import com.banking360.common.exception.ApiException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.Set;

/**
 * Centralized authorization helper shared by all microservices.
 *
 * In development, the {@link AuthFilter} populates the Spring Security context from
 * gateway-propagated headers (X-User-Id, X-User-Roles). In production the gateway
 * would perform OIDC/JWT validation and propagate a verified principal.
 *
 * Every service independently enforces object-level authorization using this helper.
 * The frontend is untrusted: never rely on client-sent identifiers for ownership.
 */
public final class Authz {

    private static final Set<String> ADMIN_ROLES = Set.of(
            "SUPER_ADMIN", "ADMIN", "OPERATIONS", "FINANCE",
            "CUSTOMER_SUPPORT", "CONTENT_MANAGER", "AUDITOR");

    private Authz() {
    }

    /** Returns the authenticated principal id (customer id or admin user id). */
    public static String currentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null || auth.getName().isBlank()) {
            throw ApiException.forbidden("Authentication required");
        }
        return auth.getName();
    }

    /** True when the current principal holds any administrative role. */
    public static boolean isAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) {
            return false;
        }
        return auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .map(a -> a.startsWith("ROLE_") ? a.substring(5) : a)
                .anyMatch(ADMIN_ROLES::contains);
    }

    /**
     * Enforces object-level authorization for a resource owned by a customer.
     * Administrative principals may access any resource; customers may only
     * access resources owned by their own customer id.
     */
    public static void assertCustomerAccess(String ownerCustomerId) {
        if (isAdmin()) {
            return;
        }
        String principal = currentUserId();
        if (ownerCustomerId == null || !principal.equals(ownerCustomerId)) {
            throw ApiException.forbidden("You are not authorized to access this resource");
        }
    }

    /** Requires an administrative principal. */
    public static void requireAdmin() {
        if (!isAdmin()) {
            throw ApiException.forbidden("Administrative privileges required");
        }
    }

    /** Returns the current principal's roles. */
    public static List<String> currentRoles() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) {
            return List.of();
        }
        return auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .map(a -> a.startsWith("ROLE_") ? a.substring(5) : a)
                .toList();
    }
}