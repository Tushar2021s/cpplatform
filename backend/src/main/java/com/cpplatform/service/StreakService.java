package com.cpplatform.service;

import com.cpplatform.model.User;
import com.cpplatform.repository.UserRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class StreakService {

    private final UserRepository userRepository;

    public StreakService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // call this when a user solves a problem
    public void updateStreak(User user) {
        LocalDate today = LocalDate.now();
        LocalDate lastSolved = user.getLastSolvedDate();

        if (lastSolved == null) {
            // first time solving — start streak at 1
            user.setCurrentStreak(1);
            user.setBestStreak(1);

        } else if (lastSolved.equals(today)) {
            // already solved today — streak unchanged
            return;

        } else if (lastSolved.equals(today.minusDays(1))) {
            // solved yesterday — streak continues
            int newStreak = user.getCurrentStreak() + 1;
            user.setCurrentStreak(newStreak);

            // update best streak if current is higher
            if (newStreak > user.getBestStreak()) {
                user.setBestStreak(newStreak);
            }

        } else {
            // gap of more than 1 day — streak resets
            user.setCurrentStreak(1);
        }

        user.setLastSolvedDate(today);
        userRepository.save(user);
    }

    // runs every day at midnight to reset streaks
    // cron = "second minute hour day month weekday"
    @Scheduled(cron = "0 0 0 * * *")
    public void resetExpiredStreaks() {
        System.out.println("Checking for expired streaks...");

        LocalDate yesterday = LocalDate.now().minusDays(1);
        List<User> allUsers = userRepository.findAll();

        for (User user : allUsers) {
            LocalDate lastSolved = user.getLastSolvedDate();

            // if user didn't solve anything yesterday or today — reset
            if (lastSolved != null && lastSolved.isBefore(yesterday)) {
                user.setCurrentStreak(0);
                userRepository.save(user);
            }
        }

        System.out.println("Streak check complete.");
    }
}