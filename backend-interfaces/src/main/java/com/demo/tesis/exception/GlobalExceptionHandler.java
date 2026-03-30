package com.demo.tesis.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BlockedTransactionException.class)
    public ResponseEntity<Map<String, String>> handleBlockedTransaction(BlockedTransactionException ex) {
        Map<String, String> response = new HashMap<>();
        response.put("error", "Transacción Denegada");
        response.put("message", ex.getMessage());
        response.put("status", "403");

        return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
    }
}