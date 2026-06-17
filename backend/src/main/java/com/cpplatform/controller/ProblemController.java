package com.cpplatform.controller;

import com.cpplatform.model.Problem;
import com.cpplatform.model.SolvedProblem;
import com.cpplatform.model.User;
import com.cpplatform.repository.ProblemRepository;
import com.cpplatform.repository.SolvedProblemRepository;
import com.cpplatform.repository.UserRepository;
import com.cpplatform.service.ProblemService;
import com.cpplatform.service.StreakService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/problems")
public class ProblemController {

    private final ProblemService problemService;
    private final ProblemRepository problemRepository;
    private final SolvedProblemRepository solvedProblemRepository;
    private final UserRepository userRepository;
    private final StreakService streakService;

    public ProblemController(ProblemService problemService,
                             ProblemRepository problemRepository,
                             SolvedProblemRepository solvedProblemRepository,
                             UserRepository userRepository,
                             StreakService streakService) {
        this.problemService = problemService;
        this.problemRepository = problemRepository;
        this.solvedProblemRepository = solvedProblemRepository;
        this.userRepository = userRepository;
        this.streakService = streakService;
    }

    @GetMapping
    public ResponseEntity<List<Problem>> getAllProblems() {
        return ResponseEntity.ok(problemService.getAllProblems());
    }

    @GetMapping("/filter")
    public ResponseEntity<List<Problem>> filterProblems(
            @RequestParam(required = false) Integer rating,
            @RequestParam(required = false) String tag) {
        return ResponseEntity.ok(problemService.filterProblems(rating, tag));
    }

    @PostMapping("/sync")
    public ResponseEntity<Map<String, String>> syncProblems() {
        problemService.syncProblemsFromCodeforces();
        return ResponseEntity.ok(Map.of("status", "success",
                "message", "Sync started"));
    }

    @GetMapping("/tags")
    public ResponseEntity<List<String>> getAllTags() {
        return ResponseEntity.ok(problemService.getAllTags());
    }

    @GetMapping("/ratings")
    public ResponseEntity<List<Integer>> getAllRatings() {
        return ResponseEntity.ok(problemService.getAllRatings());
    }

    // POST /api/problems/{id}/solve
    // marks a problem as solved for the logged-in user
    @PostMapping("/{id}/solve")
    public ResponseEntity<?> markSolved(@PathVariable Long id) {
        // get logged-in user's email from JWT
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        Optional<User> userOpt = userRepository.findByEmail(email);
        Optional<Problem> problemOpt = problemRepository.findById(id);

        if (userOpt.isEmpty() || problemOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOpt.get();
        Problem problem = problemOpt.get();

        // check if already solved
        if (solvedProblemRepository.existsByUserIdAndProblemId(
                user.getId(), problem.getId())) {
            return ResponseEntity.ok(Map.of(
                    "status", "already_solved",
                    "message", "You already solved this problem"
            ));
        }

        // save the solved record
        SolvedProblem solved = new SolvedProblem();
        solved.setUser(user);
        solved.setProblem(problem);
        solvedProblemRepository.save(solved);

        // update the user's streak
        streakService.updateStreak(user);

        return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Problem marked as solved!",
                "currentStreak", user.getCurrentStreak()
        ));
    }

    // GET /api/problems/solved — all problems solved by logged-in user
    @GetMapping("/solved")
    public ResponseEntity<?> getSolvedProblems() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) return ResponseEntity.notFound().build();

        List<SolvedProblem> solved =
                solvedProblemRepository.findByUser(userOpt.get());

        return ResponseEntity.ok(solved);
    }
}