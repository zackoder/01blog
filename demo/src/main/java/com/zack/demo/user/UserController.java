package com.zack.demo.user;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.zack.demo.config.JwtService;
import com.zack.demo.post.GetPostDto;

@RestController
@RequestMapping("/api")
public class UserController {
    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserService userService;

    @GetMapping("/userCredentials")
    public ResponseEntity<?> userCredentials(@RequestHeader("authorization") String jwt) {
        String nickname = jwtService.extractUsername(jwt.substring(7));
        GetCredentialsDto CredentialsDto = userService.getCredentials(nickname);
        return ResponseEntity.ok().body(CredentialsDto);
    }

    @GetMapping("/userData/{nicknameAndId}")
    public ResponseEntity<?> getUserData(@RequestParam("offset") long offset, @PathVariable String nicknameAndId,
            @RequestHeader("authorization") String jwt) {
        HashMap<String, String> res = new HashMap<>();
        if (jwt == null || !jwt.startsWith("Bearer ")) {
            res.put("error", "Unauthorized");
            return ResponseEntity.status(401).body(res);
        }

        String nickname = jwtService.extractUsername(jwt.substring(7));
        String[] data = nicknameAndId.split("\\.");
        res = userService.checkData(nickname, data);
        if (res != null) {
            return ResponseEntity.status(403).body(res);
        }
        long id = Long.parseLong(data[1]);
        List<GetPostDto> posts = userService.getUserPosts(nickname, id, offset);
        return ResponseEntity.ok().body(posts);
    }
}
