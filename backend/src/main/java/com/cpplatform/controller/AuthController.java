package com.cpplatform.controller;

import com.cpplatform.dto.AuthRequest;
import com.cpplatform.dto.AuthResponse;
import com.cpplatform.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // POST /api/auth/codeforces
    // body: { "handle": "tourist" }
    @PostMapping("/codeforces")
    public ResponseEntity<AuthResponse> loginWithCodeforces(
            @RequestBody AuthRequest request) {
        AuthResponse response = authService.loginWithCodeforces(request.getHandle());
        return ResponseEntity.ok(response);
    }

    // GET /api/auth/test-cf?handle=tourist
    // quick test endpoint
    @GetMapping("/test-cf")
    public ResponseEntity<AuthResponse> testCf(
            @RequestParam String handle) {
        AuthResponse response = authService.loginWithCodeforces(handle);
        return ResponseEntity.ok(response);
    }
}