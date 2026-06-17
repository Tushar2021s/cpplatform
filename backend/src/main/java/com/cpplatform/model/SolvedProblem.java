package com.cpplatform.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "solved_problems",
        uniqueConstraints = @UniqueConstraint(
                columnNames = {"user_id", "problem_id"}
        ))
public class SolvedProblem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "problem_id", nullable = false)
    private Problem problem;

    private LocalDateTime solvedAt;

    @PrePersist
    protected void onCreate() {
        this.solvedAt = LocalDateTime.now();
    }

    // ── Getters ──────────────────────────────────────────
    public Long getId()                { return id; }
    public User getUser()              { return user; }
    public Problem getProblem()        { return problem; }
    public LocalDateTime getSolvedAt() { return solvedAt; }

    // ── Setters ──────────────────────────────────────────
    public void setId(Long id)                  { this.id = id; }
    public void setUser(User user)              { this.user = user; }
    public void setProblem(Problem problem)     { this.problem = problem; }
    public void setSolvedAt(LocalDateTime t)    { this.solvedAt = t; }
}