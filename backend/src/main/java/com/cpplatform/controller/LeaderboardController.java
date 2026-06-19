package com.cpplatform.controller;

import com.cpplatform.dto.LeaderboardEntryDTO;
import com.cpplatform.model.User;
import com.cpplatform.repository.SolvedProblemRepository;
import com.cpplatform.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {

    private final UserRepository userRepository;
    private final SolvedProblemRepository solvedProblemRepository;

    public LeaderboardController(UserRepository userRepository,
                                 SolvedProblemRepository solvedProblemRepository) {
        this.userRepository = userRepository;
        this.solvedProblemRepository = solvedProblemRepository;
    }

    @GetMapping
    public ResponseEntity<List<LeaderboardEntryDTO>> getLeaderboard() {
        String currentEmail = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        List<User> allUsers = userRepository.findAll();
        List<LeaderboardEntryDTO> entries = new ArrayList<>();

        for (User user : allUsers) {
            long solvedCount = solvedProblemRepository.countByUser(user);

            // skip users who haven't solved anything — keeps the board meaningful
            if (solvedCount == 0) continue;

            entries.add(new LeaderboardEntryDTO(
                    0, // rank assigned below, after sorting
                    user.getName(),
                    user.getAvatarUrl(),
                    user.getCodeforcesHandle(),
                    solvedCount,
                    user.getCurrentStreak(),
                    user.getBestStreak(),
                    user.getEmail().equals(currentEmail)
            ));
        }

        // sort by problems solved (desc), tiebreak by best streak (desc)
        entries.sort((a, b) -> {
            int cmp = Long.compare(b.getProblemsSolved(), a.getProblemsSolved());
            if (cmp != 0) return cmp;
            return Integer.compare(b.getBestStreak(), a.getBestStreak());
        });

        for (int i = 0; i < entries.size(); i++) {
            entries.get(i).setRank(i + 1);
        }

        List<LeaderboardEntryDTO> top = entries.size() > 50
                ? entries.subList(0, 50)
                : entries;

        return ResponseEntity.ok(top);
    }
}