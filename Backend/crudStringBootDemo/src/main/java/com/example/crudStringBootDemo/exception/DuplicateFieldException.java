package com.example.crudStringBootDemo.exception;

import java.util.Map;

public class DuplicateFieldException extends RuntimeException {
    private final Map<String, String> errors;

    public DuplicateFieldException(Map<String, String> errors) {
        super("Duplicate value");
        this.errors = errors;
    }

    public Map<String, String> getErrors() {
        return errors;
    }
}