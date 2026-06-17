package com.cpplatform.controller;

import com.cpplatform.model.User;
import com.cpplatform.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // GET /api/user/profile — returns the logged-in user's profile
    // requires JWT token in Authorization header
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        // SecurityContextHolder holds the logged-in user's email
        // set by JwtAuthFilter on every request
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        Optional<User> user = userRepository.findByEmail(email);
        if (user.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(user.get());
    }
}