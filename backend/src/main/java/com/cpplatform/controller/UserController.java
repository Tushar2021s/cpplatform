package com.cpplatform.controller;

import com.cpplatform.dto.AuthRequest;
import com.cpplatform.model.User;
import com.cpplatform.repository.UserRepository;
import com.cpplatform.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserRepository userRepository;
    private final AuthService authService;

    public UserController(UserRepository userRepository, AuthService authService) {
        this.userRepository = userRepository;
        this.authService = authService;
    }

    // GET /api/user/profile — returns the logged-in user's profile
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        Optional<User> user = userRepository.findByEmail(email);
        if (user.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(user.get());
    }

    // POST /api/user/link-codeforces   body: { "handle": "tourist" }
    // must be logged in (JWT required) — attaches a verified CF handle to your account
    @PostMapping("/link-codeforces")
    public ResponseEntity<Map<String, String>> linkCodeforces(
            @RequestBody AuthRequest request) {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
        return ResponseEntity.ok(authService.linkCodeforces(email, request.getHandle()));
    }
}