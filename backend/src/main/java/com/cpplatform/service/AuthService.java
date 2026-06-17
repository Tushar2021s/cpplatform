package com.cpplatform.service;

import com.cpplatform.config.JwtUtil;
import com.cpplatform.dto.AuthResponse;
import com.cpplatform.model.User;
import com.cpplatform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final VerificationService verificationService;
    private final RestTemplate restTemplate;

    @Value("${google.client.id}")
    private String googleClientId;

    public AuthService(UserRepository userRepository,
                       JwtUtil jwtUtil,
                       VerificationService verificationService) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.verificationService = verificationService;
        this.restTemplate = new RestTemplate();
    }

    // ── GOOGLE LOGIN / SIGNUP ──────────────────────────────────
    // called with the ID token React gets from Google's Sign-In button
    public AuthResponse loginWithGoogle(String idToken) {
        // ask Google directly: "is this token real, and who is it for?"
        String url = "https://oauth2.googleapis.com/tokeninfo?id_token=" + idToken;

        Map tokenInfo;
        try {
            tokenInfo = restTemplate.getForObject(url, Map.class);
        } catch (Exception e) {
            throw new RuntimeException("Invalid Google token");
        }

        if (tokenInfo == null) {
            throw new RuntimeException("Invalid Google token");
        }

        // critical check — make sure this token was issued for OUR app,
        // not some other website using Google login
        String audience = (String) tokenInfo.get("aud");
        if (!googleClientId.equals(audience)) {
            throw new RuntimeException("Token was not issued for this application");
        }

        String email    = (String) tokenInfo.get("email");
        String name     = (String) tokenInfo.get("name");
        String picture  = (String) tokenInfo.get("picture");
        String googleId = (String) tokenInfo.get("sub"); // Google's permanent user ID

        Optional<User> existing = userRepository.findByGoogleId(googleId);

        User user;
        if (existing.isPresent()) {
            user = existing.get();
        } else {
            // first time we've seen this Google account — auto-register
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setName(name);
            newUser.setAvatarUrl(picture);
            newUser.setGoogleId(googleId);
            newUser.setAuthProvider(User.AuthProvider.GOOGLE);
            user = userRepository.save(newUser);
        }

        String jwt = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(jwt, user.getEmail(), user.getName(), user.getAvatarUrl());
    }

    // ── CODEFORCES CHALLENGE (shared by both linking and CF-login) ──
    public Map<String, Object> startCodeforcesVerification(String handle) {
        String checkUrl = "https://codeforces.com/api/user.info?handles=" + handle;
        Map response = restTemplate.getForObject(checkUrl, Map.class);

        if (response == null || !"OK".equals(response.get("status"))) {
            throw new RuntimeException("Codeforces handle not found: " + handle);
        }

        verificationService.startChallenge(handle);

        int contestId = VerificationService.CHALLENGE_CONTEST_ID;
        String index  = VerificationService.CHALLENGE_INDEX;

        return Map.of(
                "problemUrl", "https://codeforces.com/problemset/problem/"
                        + contestId + "/" + index,
                "instructions", "Submit ANY code to this problem that fails to compile. " +
                        "Then click Verify within 10 minutes."
        );
    }

    // shared verification check — does the proof actually exist on Codeforces?
    private boolean challengeWasCompleted(String handle) {
        Long startTime = verificationService.getChallengeStartTime(handle);
        if (startTime == null) return false;

        if (verificationService.isExpired(startTime)) {
            verificationService.clearChallenge(handle);
            return false;
        }

        String url = "https://codeforces.com/api/user.status?handle="
                + handle + "&from=1&count=10";
        Map response = restTemplate.getForObject(url, Map.class);

        if (response == null || !"OK".equals(response.get("status"))) return false;

        List submissions = (List) response.get("result");

        for (Object obj : submissions) {
            Map submission = (Map) obj;
            Map problem = (Map) submission.get("problem");

            int contestId = (Integer) problem.get("contestId");
            String idx     = (String) problem.get("index");
            String verdict = (String) submission.get("verdict");
            long submittedAt = ((Number) submission.get("creationTimeSeconds")).longValue();

            boolean isChallengeProblem =
                    contestId == VerificationService.CHALLENGE_CONTEST_ID
                            && idx.equals(VerificationService.CHALLENGE_INDEX);
            boolean isCompileError = "COMPILATION_ERROR".equals(verdict);
            boolean isAfterStart   = submittedAt >= startTime;

            if (isChallengeProblem && isCompileError && isAfterStart) {
                return true;
            }
        }
        return false;
    }

    // ── LINK a Codeforces handle to an EXISTING logged-in account ──
    public Map<String, String> linkCodeforces(String userEmail, String handle) {
        if (!challengeWasCompleted(handle)) {
            throw new RuntimeException(
                    "Verification not found yet. Submit the compile error first, then try again.");
        }

        // make sure nobody else already claimed this handle
        Optional<User> handleOwner = userRepository.findByCodeforcesHandle(handle);
        if (handleOwner.isPresent() && !handleOwner.get().getEmail().equals(userEmail)) {
            throw new RuntimeException("This Codeforces handle is already linked to another account");
        }

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setCodeforcesHandle(handle);
        userRepository.save(user);
        verificationService.clearChallenge(handle);

        return Map.of("status", "success", "message", "Codeforces handle linked!");
    }

    // ── LOGIN using an ALREADY-LINKED Codeforces handle ──
    public AuthResponse loginWithCodeforces(String handle) {
        if (!challengeWasCompleted(handle)) {
            throw new RuntimeException(
                    "Verification not found yet. Submit the compile error first, then try again.");
        }

        // critical — only allow login if this handle is linked to a REAL registered account
        User user = userRepository.findByCodeforcesHandle(handle)
                .orElseThrow(() -> new RuntimeException(
                        "No account is linked to this handle. Please sign up with Google first."));

        verificationService.clearChallenge(handle);

        String jwt = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(jwt, user.getEmail(), user.getName(), user.getAvatarUrl());
    }
}