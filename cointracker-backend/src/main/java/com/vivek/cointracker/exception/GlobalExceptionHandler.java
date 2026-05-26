package com.vivek.cointracker.exception;

import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import lombok.Builder;
import lombok.Data;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 🔴 409 - Duplicate
    @ExceptionHandler(CustomExceptions.DuplicateResourceException.class)
    public ResponseEntity<ErrorResponse> handleDuplicate(CustomExceptions.DuplicateResourceException ex) {
        return buildResponse(ex.getMessage(), HttpStatus.CONFLICT);
    }

    // 🔴 404 - Not Found
    @ExceptionHandler(CustomExceptions.ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(CustomExceptions.ResourceNotFoundException ex) {
        return buildResponse(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    // 🔴 400 - Bad Request
    @ExceptionHandler(CustomExceptions.BadRequestException.class)
    public ResponseEntity<ErrorResponse> handleBadRequest(CustomExceptions.BadRequestException ex) {
        return buildResponse(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    // 🔴 401 - Unauthorized
    @ExceptionHandler(CustomExceptions.UnauthorizedException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorized(CustomExceptions.UnauthorizedException ex) {
        return buildResponse(ex.getMessage(), HttpStatus.UNAUTHORIZED);
    }

    // 🔴 403 - Forbidden
    @ExceptionHandler(CustomExceptions.ForbiddenException.class)
    public ResponseEntity<ErrorResponse> handleForbidden(CustomExceptions.ForbiddenException ex) {
        return buildResponse(ex.getMessage(), HttpStatus.FORBIDDEN);
    }

    // 🔴 503 - Unavailable Service
    @ExceptionHandler(CustomExceptions.EmailSendException.class)
    public ResponseEntity<ErrorResponse> handleEmailError(CustomExceptions.EmailSendException ex) {
        return buildResponse(
                ex.getMessage(),
                HttpStatus.SERVICE_UNAVAILABLE // 🔥 correct status
        );
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrity(DataIntegrityViolationException ex) {

        String message = "Database constraint violation";

        Throwable root = ex.getRootCause();

        if (root != null && root.getMessage() != null) {
            String error = root.getMessage();

            if (error.contains("uk_user_category")) {
                message = "Category with this name already exists";
            }
        }

        return buildResponse(message, HttpStatus.CONFLICT);
    }

    // 🔴 Validation errors
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {

        Map<String, String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .collect(java.util.stream.Collectors.toMap(
                        e -> e.getField(),
                        e -> e.getDefaultMessage()));

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                ErrorResponse.builder()
                        .timestamp(LocalDateTime.now())
                        .status(HttpStatus.BAD_REQUEST.value())
                        .message("Validation failed")
                        .errors(errors)
                        .build());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(Exception ex) {
        return buildResponse("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private ResponseEntity<ErrorResponse> buildResponse(String message, HttpStatus status) {
        return ResponseEntity.status(status).body(
                ErrorResponse.builder()
                        .timestamp(LocalDateTime.now())
                        .status(status.value())
                        .message(message)
                        .build());
    }

    @Data
    @Builder
    static class ErrorResponse {
        private LocalDateTime timestamp;
        private int status;
        private String message;
        private Object errors;
    }
}