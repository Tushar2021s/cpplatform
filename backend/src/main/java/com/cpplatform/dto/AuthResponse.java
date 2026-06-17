package com.cpplatform.dto;

public class AuthResponse {
    private String jwt;
    private String email;
    private String name;
    private String avatarUrl;

    public AuthResponse(String jwt, String email, String name, String avatarUrl) {
        this.jwt = jwt;
        this.email = email;
        this.name = name;
        this.avatarUrl = avatarUrl;
    }

    public String getJwt()               { return jwt; }
    public void setJwt(String jwt)       { this.jwt = jwt; }

    public String getEmail()             { return email; }
    public void setEmail(String email)   { this.email = email; }

    public String getName()              { return name; }
    public void setName(String name)     { this.name = name; }

    public String getAvatarUrl()             { return avatarUrl; }
    public void setAvatarUrl(String url)     { this.avatarUrl = url; }
}