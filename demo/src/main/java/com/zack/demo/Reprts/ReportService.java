package com.zack.demo.Reprts;

import java.util.Date;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.zack.demo.post.PostRepo;
import com.zack.demo.user.User;
import com.zack.demo.user.UserRepository;

@Service
public class ReportService {
    @Autowired
    UserRepository userRepo;

    @Autowired
    PostRepo postRepo;

    @Autowired
    ReportRepo reportRepo;

    public HashMap<String, Object> checkReportData(String nickname, ReportDto dto) {

        HashMap<String, Object> resp = new HashMap<>();

        User reporter = userRepo.findByNickname(nickname).get();

        if (reporter == null) {
            resp.put("error", "User Not found");
            return resp;
        }

        boolean postExists = postRepo.existsById(dto.targetId());

        if (!postExists) {
            resp.put("error", "Post Does not exists");
            return resp;
        }
        resp.put("userId", reporter.getId());
        return resp;
    }

    public void saveReport(ReportDto dto, long reporterId) {
        Reports newReport = new Reports();
        newReport.setPostId(dto.targetId());
        newReport.setContent(dto.content());
        newReport.setCreated_at(new Date().getTime() / 1000);
        newReport.setUserId(reporterId);
        reportRepo.save(newReport);
    }
}

