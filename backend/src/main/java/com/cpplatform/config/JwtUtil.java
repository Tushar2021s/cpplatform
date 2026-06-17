package com.cpplatform.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component  // Spring manages this as a bean — can be injected anywhere
public class JwtUtil {

    // reads jwt.secret from application.properties
    @Value("${jwt.secret}")
    private String secret;

    // reads jwt.expiration from application.properties
    @Value("${jwt.expiration}")
    private Long expiration;

    // converts the secret string into a cryptographic key
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    // generates a JWT token for a given email
    public String generateToken(String email) {
        return Jwts.builder()
                .subject(email)           // who this token is for
                .issuedAt(new Date())     // when it was created
                .expiration(new Date(System.currentTimeMillis() + expiration)) // when it expires
                .signWith(getSigningKey()) // sign it so nobody can fake it
                .compact();               // build the final string
    }

    // extracts the email from a JWT token
    public String getEmailFromToken(String token) {
        return getClaims(token).getSubject();
    }

    // checks if a token is still valid (not expired, not tampered)
    public boolean validateToken(String token) {
        try {
            Claims claims = getClaims(token);
            return !claims.getExpiration().before(new Date());
        } catch (Exception e) {
            return false;  // any error means invalid token
        }
    }

    // parses the token and extracts all the data inside it
    private Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}