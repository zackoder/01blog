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

    @GetMapping("/userData/{nickname}")
    public ResponseEntity<?> getUserData(@RequestParam("offset") long offset, @PathVariable String nickname,
            @RequestHeader("authorization") String jwt) {
        HashMap<String, Object> res = new HashMap<>();
        if (jwt == null || !jwt.startsWith("Bearer ")) {
            res.put("error", "Unauthorized");
            return ResponseEntity.status(401).body(res);
        }

        String requesterNickname = jwtService.extractUsername(jwt.substring(7));
        List<GetPostDto> posts = userService.getUserPosts(nickname, requesterNickname, offset);

        return ResponseEntity.ok().body(posts);
    }

    @GetMapping("/profileData")
    public ResponseEntity<?> profileData(@RequestParam("id") Long id, @RequestHeader("authorization") String jwt) {
        String nickname = jwtService.extractUsername(jwt.substring(7));
        User user = userService.findByNickname(nickname).get();
        if (user == null) {
            return ResponseEntity.badRequest().body("{\"error\":\"user not found\"}");
        }
        UserProfileResponseDto resp = userService.getProfileData(user, id);
        return ResponseEntity.ok().body(resp);
    }
}
