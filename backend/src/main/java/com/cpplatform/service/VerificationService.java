package com.cpplatform.service;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class VerificationService {

    private final Map<String, Long> pendingChallenges = new ConcurrentHashMap<>();

    public static final int CHALLENGE_CONTEST_ID = 4;
    public static final String CHALLENGE_INDEX = "A";
    public static final long CHALLENGE_EXPIRY_SECONDS = 600;

    public void startChallenge(String handle) {
        pendingChallenges.put(handle, System.currentTimeMillis() / 1000);
    }

    public Long getChallengeStartTime(String handle) {
        return pendingChallenges.get(handle);
    }

    public boolean isExpired(long startTime) {
        long now = System.currentTimeMillis() / 1000;
        return (now - startTime) > CHALLENGE_EXPIRY_SECONDS;
    }

    public void clearChallenge(String handle) {
        pendingChallenges.remove(handle);
    }
}
