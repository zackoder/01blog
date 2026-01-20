package com.zack.demo.config;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class ManualRateLimitFilter extends OncePerRequestFilter {

    private final Map<String, UserBucket> buckets = new ConcurrentHashMap<>();
    private final int MAX_REQUESTS = 10;
    private final long TIME_WINDOW = 60000;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        String key = request.getRemoteAddr();
        long now = System.currentTimeMillis();

        UserBucket bucket = buckets.compute(key, (k, v) -> {
            if (v == null || now > v.expiration) {
                return new UserBucket(1, now + TIME_WINDOW);
            }
            v.count++;
            return v;
        });

        if (bucket.count > MAX_REQUESTS) {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Too many requests. Try again in a minute.\"}");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private static class UserBucket {
        int count;
        long expiration;

        UserBucket(int count, long expiration) {
            this.count = count;
            this.expiration = expiration;
        }
    }
}