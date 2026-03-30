package com.demo.tesis.exception;

public class BlockedTransactionException extends RuntimeException {
    public BlockedTransactionException(String message) {
        super(message);
    }
}
