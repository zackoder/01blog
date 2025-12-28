package com.zack.demo.reactions;

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
public class ReactionController {

    @Autowired
    private ReactionService reactionService;

    @Autowired
    private JwtService jwt;

    @PostMapping("/reaction")
    public ResponseEntity<?> handleReaction(@RequestBody ReactionDto dtoReq,
            @RequestHeader(value = "authorization", required = false) String auth) {

        HashMap<String, String> resp = new HashMap<>();

        String nickname = jwt.extractUsername(auth.substring(7));
        resp = reactionService.validateDto(dtoReq);
        if (resp.get("error") != null) {
            return ResponseEntity.badRequest().body(resp);
        }

        if (!reactionService.checkUser(nickname)) {
            resp.put("error", "user not found");
            return ResponseEntity.badRequest().body(resp);
        }

        reactionService.seveReaction(nickname);
        ReactionDtoResp res = reactionService.countReaction(nickname);
        System.out.println(res);
        return ResponseEntity.ok().body(res);
    }
}
