package com.zack.demo.GlobalExceptionHandler;

import java.util.HashMap;
import java.util.Map;

import javax.ws.rs.NotFoundException;

import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.transaction.TransactionSystemException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import com.fasterxml.jackson.core.JsonProcessingException;

import io.swagger.v3.oas.annotations.Hidden;

@Hidden
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleAllExceptions(Exception e) {
        if (e instanceof JsonProcessingException) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid JSON format"));
        } else if (e instanceof MissingServletRequestParameterException) {
            return ResponseEntity.badRequest().body(Map.of("error", "missing Data"));
        } else if (e instanceof MethodArgumentTypeMismatchException) {
            return ResponseEntity.badRequest().body(Map.of("error", "missing Data"));
        } else if (e instanceof HttpMessageNotReadableException) {
            return ResponseEntity.badRequest().body(Map.of("error", "missing Data"));
        } else if (e instanceof NotFoundException) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } else if (e instanceof TransactionSystemException) {
            System.out.println(e.getCause());
            return ResponseEntity.internalServerError().body(Map.of("error", "try again soon"));
        } else if (e instanceof MethodArgumentNotValidException ex) {
            Map<String, String> errors = new HashMap<>();

            ex.getBindingResult().getAllErrors().forEach((error) -> {
                String fieldName = ((FieldError) error).getField();
                String errorMessage = error.getDefaultMessage();
                errors.put(fieldName, errorMessage);
            });

            return ResponseEntity.badRequest().body(errors);
        } else if (e instanceof ResponseStatusException ex) {
            return ResponseEntity.status(ex.getStatusCode()).body(Map.of("error", ex.getReason()));
        } else if (e instanceof NoResourceFoundException) {
            return ResponseEntity.status(404).body(Map.of("error", "Resource not found"));
        } else if (e instanceof AccessDeniedException) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }

        else {
            return ResponseEntity.internalServerError().body(Map.of("error", "Internal Server Error"));
        }
    }
}
