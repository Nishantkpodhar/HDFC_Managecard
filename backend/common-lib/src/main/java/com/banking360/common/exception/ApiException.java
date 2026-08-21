package com.banking360.common.exception;

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
