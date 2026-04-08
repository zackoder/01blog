package com.zack.demo.config;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
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

    @Autowired
    private StringRedisTemplate redisTemplate;

    private final int MAX_REQUESTS = 100;
    private final long BAN_TIME_MINUTES = 1;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        String userIdentifier = getIdentifier(request);
        String rateKey = "rate:" + userIdentifier;
        String banKey = "ban:" + userIdentifier;

        if (Boolean.TRUE.equals(redisTemplate.hasKey(banKey))) {
            sendError(response, "You are banned for " + BAN_TIME_MINUTES + " minute(s) due to excessive requests.");
            return;
        }

        Long count = redisTemplate.opsForValue().increment(rateKey);

        if (count != null && count == 1) {
            redisTemplate.expire(rateKey, 1, TimeUnit.MINUTES);
        }

        if (count != null && count > MAX_REQUESTS) {
            redisTemplate.opsForValue().set(banKey, "true", BAN_TIME_MINUTES, TimeUnit.MINUTES);
            sendError(response, "Too many requests. You have been banned for " + BAN_TIME_MINUTES + " minute(s).");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private String getIdentifier(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return "user:" + authHeader.substring(7).hashCode();
        }
        return "ip:" + request.getRemoteAddr();
    }

    private void sendError(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.setContentType("application/json");
        response.getWriter().write("{\"error\": \"" + message + "\"}");
    }
}