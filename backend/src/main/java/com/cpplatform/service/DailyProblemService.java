package com.cpplatform.service;

import com.cpplatform.model.Problem;
import com.cpplatform.model.SolvedProblem;
import com.cpplatform.model.User;
import com.cpplatform.repository.ProblemRepository;
import com.cpplatform.repository.SolvedProblemRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class DailyProblemService {

    private final ProblemRepository problemRepository;
    private final SolvedProblemRepository solvedProblemRepository;

    public DailyProblemService(ProblemRepository problemRepository,
                               SolvedProblemRepository solvedProblemRepository) {
        this.problemRepository = problemRepository;
        this.solvedProblemRepository = solvedProblemRepository;
    }

    public Problem getDailyProblem(User user) {
        List<SolvedProblem> solved = solvedProblemRepository.findByUser(user);

        Set<Long> solvedIds = solved.stream()
                .map(sp -> sp.getProblem().getId())
                .collect(Collectors.toSet());

        // average rating of everything they've solved — brand new users default to 1000
        double avgRating = solved.isEmpty()
                ? 1000
                : solved.stream()
                .mapToInt(sp -> sp.getProblem().getRating())
                .average()
                .orElse(1000);

        // aim slightly above their average to encourage growth
        int target = (int) (Math.round(avgRating / 100.0) * 100) + 100;
        target = Math.max(800, Math.min(3500, target));

        // widen the search window until we find candidates
        List<Problem> candidates = List.of();
        int windowSize = 100;
        while (candidates.isEmpty() && windowSize <= 1600) {
            List<Problem> inRange = problemRepository.findByRatingBetween(
                    Math.max(800, target - windowSize),
                    Math.min(3500, target + windowSize)
            );
            candidates = inRange.stream()
                    .filter(p -> !solvedIds.contains(p.getId()))
                    .collect(Collectors.toList());
            windowSize += 200;
        }

        if (candidates.isEmpty()) return null; // solved literally everything

        // deterministic pick — same all day for this user, changes tomorrow
        String seed = LocalDate.now() + "-" + user.getId();
        int index = Math.abs(seed.hashCode()) % candidates.size();

        return candidates.get(index);
    }
}