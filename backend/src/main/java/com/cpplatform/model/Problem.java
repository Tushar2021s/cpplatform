package com.cpplatform.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "problems")
public class Problem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int contestId;
    private String index;
    private String name;
    private int rating;

    @ElementCollection
    @CollectionTable(name = "problem_tags",
            joinColumns = @JoinColumn(name = "problem_id"))
    @Column(name = "tag")
    private List<String> tags;

    private String url;
    private int solvedCount;

    // ── Getters ──────────────────────────────────────────
    public Long getId()             { return id; }
    public int getContestId()       { return contestId; }
    public String getIndex()        { return index; }
    public String getName()         { return name; }
    public int getRating()          { return rating; }
    public List<String> getTags()   { return tags; }
    public String getUrl()          { return url; }
    public int getSolvedCount()     { return solvedCount; }

    // ── Setters ──────────────────────────────────────────
    public void setId(Long id)               { this.id = id; }
    public void setContestId(int contestId)  { this.contestId = contestId; }
    public void setIndex(String index)       { this.index = index; }
    public void setName(String name)         { this.name = name; }
    public void setRating(int rating)        { this.rating = rating; }
    public void setTags(List<String> tags)   { this.tags = tags; }
    public void setUrl(String url)           { this.url = url; }
    public void setSolvedCount(int count)    { this.solvedCount = count; }
}