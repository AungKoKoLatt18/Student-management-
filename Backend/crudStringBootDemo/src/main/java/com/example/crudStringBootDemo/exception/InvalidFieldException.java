package com.example.crudStringBootDemo.exception;

import java.util.Map;

public class InvalidFieldException extends RuntimeException {
    private final Map<String, String> errors;

    public InvalidFieldException(Map<String, String> errors) {
        super("Invalid value");
        this.errors = errors;
    }

    public Map<String, String> getErrors() {
        return errors;
    }
}