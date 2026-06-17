package com.cpplatform.controller;

import com.cpplatform.model.User;
import com.cpplatform.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/streak")
public class StreakController {

    private final UserRepository userRepository;

    public StreakController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // GET /api/streak — returns current user's streak info
    @GetMapping
    public ResponseEntity<?> getStreak() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOpt.get();

        return ResponseEntity.ok(Map.of(
                "currentStreak", user.getCurrentStreak(),
                "bestStreak",    user.getBestStreak(),
                "lastSolvedDate", user.getLastSolvedDate() != null
                        ? user.getLastSolvedDate().toString()
                        : "never"
        ));
    }
}