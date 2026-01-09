package com.zack.demo.Reprts;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.zack.demo.config.JwtService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class ReportsController {
    @Autowired
    private JwtService jwtService;
    @Autowired
    private ReportService reportService;

    @PostMapping("/report")
    public ResponseEntity<?> reportsController(@Valid @RequestBody ReportDto dto,
            @RequestHeader("authorization") String auth) {

        String nickname = jwtService.extractUsername(auth.substring(7));
        System.out.println();
        System.out.println();
        System.out.println(dto.toString());
        System.out.println();
        System.out.println();

        if ((dto.reported() == null || dto.reported().isEmpty()) && dto.reportedPostId() <= 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "Bad Request"));
        }

        reportService.saveReport(dto, nickname);
        return ResponseEntity.ok(null);
    }

    @GetMapping("/reports")
    public ResponseEntity<?> getReports(@RequestHeader("authorization") String jwt) {
        String role = jwtService.extractClaim(jwt.substring(7), claims -> claims.get("role", String.class));
        if (!role.equals("admin")) {
            return ResponseEntity.status(403).body(Map.of("error", "Access Denied"));
        }
        List<Report> reports = reportService.getReports(0);
        System.out.println(reports);
        return ResponseEntity.ok().body(reports);
    }
}
