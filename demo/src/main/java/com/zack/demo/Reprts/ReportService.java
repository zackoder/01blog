package com.zack.demo.Reprts;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import com.zack.demo.post.Post;
import com.zack.demo.post.PostService;
import com.zack.demo.user.User;
import com.zack.demo.user.UserService;

@Service
public class ReportService {
    @Autowired
    UserService userService;

    @Autowired
    PostService postService;

    @Autowired
    ReportRepo reportRepo;

    public void saveReport(ReportDto dto, String nickname) {
        System.out.println();
        System.out.println("check reporter: " + nickname);
        User reporter = userService.checkUser(nickname);

        User reported = null;
        Post reportedPost = null;
        String type = "";

        if (dto.reported() == null || dto.reported().isEmpty()) {
            reportedPost = postService.getPost(dto.reportedPostId());
            if (reportedPost.getUser().getId().equals(reporter.getId())) {
                throw new AccessDeniedException("Forbidden");
            }
            type = "post";
        } else {
            System.out.println();
            System.out.println("check reported: " + dto.reported());
            reported = userService.checkUser(dto.reported());
            if (reported.getId().equals(reporter.getId())) {
                throw new AccessDeniedException("Forbidden");
            }
            type = "user";
        }

        Report report = new Report();
        report.setReporter(reporter);
        report.setReportedUser(reported);
        report.setContent(dto.content());
        report.setCreatedAt(new Date().getTime() / 1000);
        report.setReportedPost(reportedPost);
        report.setType(type);
        reportRepo.save(report);
    }

    public List<ReportResDtoRes> getReports(String type, long offset) {
        System.out.println();
        System.out.println("type: " + type);
        System.out.println();
        return reportRepo.getReports(type, offset);
    }
}
