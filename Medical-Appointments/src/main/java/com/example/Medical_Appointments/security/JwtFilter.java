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
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        // ✅ ALLOW PRE-FLIGHT REQUESTS
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        String path = request.getServletPath();

        // 🔓 Public endpoints skip JWT
        if (path.startsWith("/api/auth")
                || path.startsWith("/h2-console")
                || path.startsWith("/v3/api-docs")
                || path.startsWith("/swagger-ui")) {

            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        try {

            if (!jwtUtil.validateToken(token)) {
                filterChain.doFilter(request, response);
                return;
            }

            String email = jwtUtil.extractEmail(token);
            String role = jwtUtil.extractRole(token);

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
            filterChain.doFilter(request, response);
            return;
        }

        filterChain.doFilter(request, response);
    }
}