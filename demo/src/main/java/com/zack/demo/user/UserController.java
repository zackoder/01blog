package com.zack.demo.user;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.ws.rs.NotFoundException;

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

        String requesterNickname = jwtService.extractUsername(jwt.substring(7));
        List<GetPostDto> posts = userService.getUserPosts(nickname, requesterNickname, offset);

        return ResponseEntity.ok().body(posts);
    }

    @GetMapping("/profileData")
    public ResponseEntity<?> profileData(@RequestParam("nickname") String nickname,
            @RequestHeader("authorization") String jwt) {

        String requesterNickname = jwtService.extractUsername(jwt.substring(7));

        User user = userService.checkUser(nickname);

        User requester = userService.checkUser(requesterNickname);

        UserProfileResponseDto resp = userService.getProfileData(user, requester);
        return ResponseEntity.ok().body(resp);
    }

    @GetMapping("/follow")
    public ResponseEntity<?> follow(@RequestParam("followedNickname") String followedNickname,
            @RequestHeader("authorization") String jwt) {

        String nickname = jwtService.extractUsername(jwt.substring(7));
        User follower = userService.checkUser(nickname);
        User followed = userService.checkUser(followedNickname);

        if (followed.getId().equals(follower.getId())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Bad Request"));
        }

        String message = userService.toggleFollow(follower, followed);

        return ResponseEntity.ok().body(Map.of("message", message));
    }

}
