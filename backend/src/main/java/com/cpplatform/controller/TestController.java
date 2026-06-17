package com.cpplatform.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController                    // marks this as a REST API controller
@RequestMapping("/api")            // all endpoints in this class start with /api
public class TestController {

    @GetMapping("/health")         // GET /api/health
    public Map<String, String> health() {
        return Map.of(
                "status", "running",
                "message", "CP Platform backend is live!"
        );
    }
}