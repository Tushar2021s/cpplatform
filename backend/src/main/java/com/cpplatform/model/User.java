package com.cpplatform.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    private String name;
    private String avatarUrl;
    private String googleId;
    private String codeforcesHandle;

    @Enumerated(EnumType.STRING)
    private AuthProvider authProvider;

    private int currentStreak = 0;
    private int bestStreak = 0;
    private LocalDate lastSolvedDate;
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // ── Getters ──────────────────────────────────────────
    public Long getId()                    { return id; }
    public String getEmail()               { return email; }
    public String getName()                { return name; }
    public String getAvatarUrl()           { return avatarUrl; }
    public String getGoogleId()            { return googleId; }
    public String getCodeforcesHandle()    { return codeforcesHandle; }
    public AuthProvider getAuthProvider()  { return authProvider; }
    public int getCurrentStreak()          { return currentStreak; }
    public int getBestStreak()             { return bestStreak; }
    public LocalDate getLastSolvedDate()   { return lastSolvedDate; }
    public LocalDateTime getCreatedAt()    { return createdAt; }

    // ── Setters ──────────────────────────────────────────
    public void setId(Long id)                         { this.id = id; }
    public void setEmail(String email)                 { this.email = email; }
    public void setName(String name)                   { this.name = name; }
    public void setAvatarUrl(String avatarUrl)         { this.avatarUrl = avatarUrl; }
    public void setGoogleId(String googleId)           { this.googleId = googleId; }
    public void setCodeforcesHandle(String handle)     { this.codeforcesHandle = handle; }
    public void setAuthProvider(AuthProvider provider) { this.authProvider = provider; }
    public void setCurrentStreak(int s)                { this.currentStreak = s; }
    public void setBestStreak(int s)                   { this.bestStreak = s; }
    public void setLastSolvedDate(LocalDate d)         { this.lastSolvedDate = d; }
    public void setCreatedAt(LocalDateTime d)          { this.createdAt = d; }

    public enum AuthProvider {
        GOOGLE, CODEFORCES
    }
}