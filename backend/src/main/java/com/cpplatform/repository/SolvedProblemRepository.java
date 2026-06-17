package com.cpplatform.repository;

import com.cpplatform.model.SolvedProblem;
import com.cpplatform.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SolvedProblemRepository extends JpaRepository<SolvedProblem, Long> {

    // All problems a user has solved
    List<SolvedProblem> findByUser(User user);

    // Has this user solved this specific problem?
    boolean existsByUserIdAndProblemId(Long userId, Long problemId);

    // Count how many problems a user has solved
    long countByUser(User user);
}