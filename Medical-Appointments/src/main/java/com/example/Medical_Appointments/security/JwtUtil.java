package com.example.Medical_Appointments.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    // 🔐 MUST stay constant (do NOT change after login)
    private static final String SECRET =
            "mysecretkeymysecretkeymysecretkey12345";

    // ✔ FIX: use UTF-8 encoding (prevents signature mismatch issues)
    private final Key key = Keys.hmacShaKeyFor(
            SECRET.getBytes(StandardCharsets.UTF_8)
    );

    // ⏳ Token validity (10 hours)
    private static final long EXPIRATION_TIME = 1000 * 60 * 60 * 10;

    // 🔐 Generate token
    public String generateToken(String email, String role) {
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // 📥 Extract email
    public String extractEmail(String token) {
        return getClaims(token).getSubject();
    }

    // 📥 Extract role
    public String extractRole(String token) {
        return getClaims(token).get("role", String.class);
    }

    // ✔ Validate token
    public boolean validateToken(String token) {
        try {
            getClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // 🔍 Parse token safely
    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}