package com.cpplatform.dto;

public class AuthRequest {
    private String token;
    private String handle;
    private String type;

    public String getToken()        { return token; }
    public void setToken(String t)  { this.token = t; }

    public String getHandle()         { return handle; }
    public void setHandle(String h)   { this.handle = h; }

    public String getType()           { return type; }
    public void setType(String t)     { this.type = t; }
}