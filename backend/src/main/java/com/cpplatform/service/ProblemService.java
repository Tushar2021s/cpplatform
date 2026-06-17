package com.cpplatform.service;

import com.cpplatform.model.Problem;
import com.cpplatform.repository.ProblemRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class ProblemService {

    private final ProblemRepository problemRepository;
    private final RestTemplate restTemplate;

    public ProblemService(ProblemRepository problemRepository) {
        this.problemRepository = problemRepository;
        this.restTemplate = new RestTemplate();
    }

    // runs automatically every 24 hours (86400000 ms)
    // also runs once when the app starts (initialDelay = 5 seconds)
    @Scheduled(fixedDelay = 86400000, initialDelay = 5000)
    public void syncProblemsFromCodeforces() {
        System.out.println("Starting Codeforces problem sync...");

        try {
            String url = "https://codeforces.com/api/problemset.problems";
            Map response = restTemplate.getForObject(url, Map.class);

            if (response == null || !"OK".equals(response.get("status"))) {
                System.out.println("Failed to fetch from Codeforces API");
                return;
            }

            Map result = (Map) response.get("result");
            List problems = (List) result.get("problems");

            int newCount = 0;

            for (Object obj : problems) {
                Map p = (Map) obj;

                // skip problems with no rating
                if (p.get("rating") == null) continue;

                int contestId = (Integer) p.get("contestId");
                String index  = (String) p.get("index");

                // skip if already in our database
                if (problemRepository.existsByContestIdAndIndex(contestId, index)) {
                    continue;
                }

                Problem problem = new Problem();
                problem.setContestId(contestId);
                problem.setIndex(index);
                problem.setName((String) p.get("name"));
                problem.setRating((Integer) p.get("rating"));
                problem.setUrl("https://codeforces.com/problemset/problem/"
                        + contestId + "/" + index);

                // extract tags
                List tagList = (List) p.get("tags");
                List<String> tags = new ArrayList<>();
                for (Object tag : tagList) {
                    tags.add((String) tag);
                }
                problem.setTags(tags);

                problemRepository.save(problem);
                newCount++;
            }

            System.out.println("Sync complete. Added " + newCount + " new problems.");

        } catch (Exception e) {
            System.out.println("Sync failed: " + e.getMessage());
        }
    }

    public List<Problem> getAllProblems() {
        return problemRepository.findAll();
    }

    public List<Problem> filterProblems(Integer rating, String tag) {
        if (rating != null && tag != null) {
            return problemRepository.findByRatingAndTag(rating, tag);
        } else if (rating != null) {
            return problemRepository.findByRating(rating);
        } else if (tag != null) {
            return problemRepository.findByTag(tag);
        } else {
            return problemRepository.findAll();
        }
    }

    public List<String> getAllTags() {
        return problemRepository.findAllDistinctTags();
    }

    public List<Integer> getAllRatings() {
        return problemRepository.findAllDistinctRatings();
    }
}