package com.cpplatform.service;

import com.cpplatform.config.JwtUtil;
import com.cpplatform.dto.AuthResponse;
import com.cpplatform.model.User;
import com.cpplatform.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final RestTemplate restTemplate;

    public AuthService(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.restTemplate = new RestTemplate();
    }

    public AuthResponse loginWithCodeforces(String handle) {
        String url = "https://codeforces.com/api/user.info?handles=" + handle;

        try {
            Map response = restTemplate.getForObject(url, Map.class);

            if (response == null || !"OK".equals(response.get("status"))) {
                throw new RuntimeException("Codeforces handle not found: " + handle);
            }

            List resultList = (List) response.get("result");
            Map cfUser = (Map) resultList.get(0);

            String firstName = (String) cfUser.getOrDefault("firstName", "");
            String lastName  = (String) cfUser.getOrDefault("lastName", "");
            String fullName  = (firstName + " " + lastName).trim();

            // these are final — safe to use inside lambda below
            final String name   = fullName.isEmpty() ? handle : fullName;
            final String avatar = (String) cfUser.getOrDefault("avatar", "");
            final String email  = handle + "@codeforces.local";

            Optional<User> existingUser = userRepository.findByCodeforcesHandle(handle);

            User user;
            if (existingUser.isPresent()) {
                // user already exists — just return them
                user = existingUser.get();
            } else {
                // new user — create and save
                User newUser = new User();
                newUser.setEmail(email);
                newUser.setName(name);
                newUser.setAvatarUrl(avatar);
                newUser.setCodeforcesHandle(handle);
                newUser.setAuthProvider(User.AuthProvider.CODEFORCES);
                user = userRepository.save(newUser);
            }

            String jwt = jwtUtil.generateToken(user.getEmail());

            return new AuthResponse(
                    jwt,
                    user.getEmail(),
                    user.getName(),
                    user.getAvatarUrl()
            );

        } catch (Exception e) {
            throw new RuntimeException("Failed to verify Codeforces handle: " + e.getMessage());
        }
    }
}