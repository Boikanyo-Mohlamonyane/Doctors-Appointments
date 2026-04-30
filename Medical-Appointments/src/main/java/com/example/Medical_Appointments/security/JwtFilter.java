package com.example.Medical_Appointments.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        // =========================================
        // 1. ALLOW PRE-FLIGHT (CORS FIX)
        // =========================================
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
            filterChain.doFilter(request, response);
            return;
        }

        String path = request.getServletPath();

        // =========================================
        // 2. SKIP PUBLIC ENDPOINTS
        // =========================================
        if (isPublicPath(path)) {
            filterChain.doFilter(request, response);
            return;
        }

        // =========================================
        // 3. GET AUTH HEADER
        // =========================================
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        try {

            // =========================================
            // 4. VALIDATE TOKEN
            // =========================================
            if (!jwtUtil.validateToken(token)) {
                filterChain.doFilter(request, response);
                return;
            }

            // =========================================
            // 5. EXTRACT USER INFO
            // =========================================
            String email = jwtUtil.extractEmail(token);
            String role = jwtUtil.extractRole(token);

            // =========================================
            // 6. SET SECURITY CONTEXT
            // =========================================
            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(
                                email,
                                null,
                                List.of(new SimpleGrantedAuthority(role))
                        );

                auth.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );

                SecurityContextHolder.getContext().setAuthentication(auth);
            }

        } catch (Exception e) {
            // If anything fails → continue request safely
            filterChain.doFilter(request, response);
            return;
        }

        // =========================================
        // 7. CONTINUE CHAIN (ONLY ONCE)
        // =========================================
        filterChain.doFilter(request, response);
    }

    // =========================================
    // CLEAN PUBLIC PATH HANDLER
    // =========================================
    private boolean isPublicPath(String path) {
        return path.startsWith("/api/auth")
                || path.startsWith("/h2-console")
                || path.startsWith("/v3/api-docs")
                || path.startsWith("/swagger-ui");
    }
}