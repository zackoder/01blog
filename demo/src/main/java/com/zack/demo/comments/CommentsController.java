package com.zack.demo.comments;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.zack.demo.config.JwtService;

import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api")
public class CommentsController {

    @Autowired
    private CommentsService commentsService;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/addComment")
    public ResponseEntity<?> addComment(@RequestBody CommentsReqDto dto, @RequestHeader("authorization") String jwt) {
        HashMap<String, String> resp = new HashMap<>();

        String nickname = jwtService.extractUsername(jwt.substring(7));
        System.out.println(nickname);
        System.out.println(dto.toString());

        if (!commentsService.checkUser(nickname)) {
            resp.put("error", "user not found");
            return ResponseEntity.badRequest().body(resp);
        }

        if (!commentsService.checkPost(dto.getPostId())) {
            resp.put("error", "post not found");
            return ResponseEntity.badRequest().body(resp);
        }
        CommentsResDto newComment = commentsService.saveComment(dto, nickname);
        return ResponseEntity.ok().body(newComment);
    }

    @GetMapping("/getComments")
    public ResponseEntity<?> getComments(@RequestParam("id") long id, @RequestHeader("authorization") String jwt) {

        String nickname = jwtService.extractUsername(jwt.substring(7));

        List<CommentsResDto> comments = commentsService.getAllComments(id, nickname);
        return ResponseEntity.ok().body(comments);
    }

    @DeleteMapping("/deleteComment")
    public ResponseEntity<?> deleteComment(@RequestParam("id") long id, @RequestHeader("authorization") String jwt) {

        String nickname = jwtService.extractUsername(jwt.substring(7));
        String res = commentsService.deleteComment(id, nickname);
        if (res.equals("deleted")) {
            return ResponseEntity.ok().body(Map.of("message", "deleted"));
        }
        return ResponseEntity.badRequest().body(Map.of("error", res));
    }
}
