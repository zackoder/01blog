package com.zack.demo.GlobalExceptionHandler;

import java.util.Map;

import javax.ws.rs.NotFoundException;

import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

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
        }

        else {
            return ResponseEntity.internalServerError().body(Map.of("error", "Internal Server Error"));
        }
    }
}
