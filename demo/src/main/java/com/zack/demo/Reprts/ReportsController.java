package com.zack.demo.Reprts;

import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.zack.demo.config.JwtService;

@RestController
@RequestMapping("/api")
public class ReportsController {
    @Autowired
    private JwtService jwt;
    @Autowired
    private ReportService reportService;

    @PostMapping("/report")
    public ResponseEntity<?> reportsController(@RequestBody ReportDto dto,
            @RequestHeader("authorization") String auth) {

        HashMap<String, Object> resp = new HashMap<>();

        String nickname = jwt.extractUsername(auth.substring(7));
        HashMap<String, Object> reportStat = reportService.checkReportData(nickname, dto);

        if (reportStat.get("error") != null) {
            return ResponseEntity.status(404).body(reportStat);
        }

        reportService.saveReport(dto, (long) reportStat.get("userId"));
        resp.put("message", "success");
        return ResponseEntity.ok(resp);
    }
}
