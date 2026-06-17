package com.cpplatform.repository;

import com.cpplatform.model.Problem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProblemRepository extends JpaRepository<Problem, Long> {

    List<Problem> findByRating(int rating);

    List<Problem> findByRatingBetween(int min, int max);

    @Query("SELECT p FROM Problem p JOIN p.tags t WHERE t = :tag")
    List<Problem> findByTag(@Param("tag") String tag);

    @Query("SELECT p FROM Problem p JOIN p.tags t " +
            "WHERE p.rating = :rating AND t = :tag")
    List<Problem> findByRatingAndTag(@Param("rating") int rating,
                                     @Param("tag") String tag);

    boolean existsByContestIdAndIndex(int contestId, String index);

    // get every unique tag across all problems
    @Query("SELECT DISTINCT t FROM Problem p JOIN p.tags t ORDER BY t")
    List<String> findAllDistinctTags();

    // get every unique rating
    @Query("SELECT DISTINCT p.rating FROM Problem p " +
            "WHERE p.rating > 0 ORDER BY p.rating")
    List<Integer> findAllDistinctRatings();
}