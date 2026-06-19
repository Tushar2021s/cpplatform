package com.cpplatform.dto;

public class LeaderboardEntryDTO {
    private int rank;
    private String name;
    private String avatarUrl;
    private String codeforcesHandle;
    private long problemsSolved;
    private int currentStreak;
    private int bestStreak;
    private boolean isCurrentUser;

    public LeaderboardEntryDTO(int rank, String name, String avatarUrl,
                               String codeforcesHandle, long problemsSolved,
                               int currentStreak, int bestStreak, boolean isCurrentUser) {
        this.rank = rank;
        this.name = name;
        this.avatarUrl = avatarUrl;
        this.codeforcesHandle = codeforcesHandle;
        this.problemsSolved = problemsSolved;
        this.currentStreak = currentStreak;
        this.bestStreak = bestStreak;
        this.isCurrentUser = isCurrentUser;
    }

    public int getRank()                    { return rank; }
    public void setRank(int rank)            { this.rank = rank; }

    public String getName()                 { return name; }
    public void setName(String name)        { this.name = name; }

    public String getAvatarUrl()                { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl)  { this.avatarUrl = avatarUrl; }

    public String getCodeforcesHandle()             { return codeforcesHandle; }
    public void setCodeforcesHandle(String handle)  { this.codeforcesHandle = handle; }

    public long getProblemsSolved()              { return problemsSolved; }
    public void setProblemsSolved(long solved)   { this.problemsSolved = solved; }

    public int getCurrentStreak()               { return currentStreak; }
    public void setCurrentStreak(int streak)    { this.currentStreak = streak; }

    public int getBestStreak()                  { return bestStreak; }
    public void setBestStreak(int streak)       { this.bestStreak = streak; }

    public boolean isCurrentUser()                  { return isCurrentUser; }
    public void setCurrentUser(boolean current)     { this.isCurrentUser = current; }
}