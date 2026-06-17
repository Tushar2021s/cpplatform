package com.cpplatform.controller;

import com.cpplatform.dto.AuthRequest;
import com.cpplatform.dto.AuthResponse;
import com.cpplatform.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // POST /api/auth/google   body: { "token": "<google id token>" }
    @PostMapping("/google")
    public ResponseEntity<AuthResponse> loginWithGoogle(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.loginWithGoogle(request.getToken()));
    }

    // GET /api/auth/codeforces/challenge?handle=tourist
    @GetMapping("/codeforces/challenge")
    public ResponseEntity<Map<String, Object>> getChallenge(@RequestParam String handle) {
        return ResponseEntity.ok(authService.startCodeforcesVerification(handle));
    }

    // POST /api/auth/codeforces/login   body: { "handle": "tourist" }
    // only works if this handle is already linked to a registered account
    @PostMapping("/codeforces/login")
    public ResponseEntity<AuthResponse> loginWithCodeforces(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.loginWithCodeforces(request.getHandle()));
    }
}