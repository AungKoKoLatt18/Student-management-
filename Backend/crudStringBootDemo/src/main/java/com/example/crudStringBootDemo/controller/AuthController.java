package com.example.crudStringBootDemo.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.crudStringBootDemo.dto.LoginRequest;
import com.example.crudStringBootDemo.security.JwtService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final JwtService jwtService;
    private final String adminUsername;
    private final String adminPassword;

    public AuthController(JwtService jwtService,
                          @Value("${app.admin.username}") String adminUsername,
                          @Value("${app.admin.password}") String adminPassword) {
        this.jwtService = jwtService;
        this.adminUsername = adminUsername;
        this.adminPassword = adminPassword;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@Valid @RequestBody LoginRequest req) {
        if (adminUsername.equals(req.username()) && adminPassword.equals(req.password())) {
            return ResponseEntity.ok(Map.of(
                    "token", jwtService.generateToken(req.username()),
                    "username", req.username()));
        }
        return ResponseEntity.status(401).body(Map.of("message", "Invalid username or password"));
    }
}