package com.zack.demo.post;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zack.demo.config.JwtService;

@RestController
@RequestMapping("/api")
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private JwtService jwtService;

    @GetMapping("/getPosts")
    public ResponseEntity<?> getPosts(@RequestParam long offset, @RequestHeader("authorization") String authHeader) {

        String nickname = jwtService.extractUsername(authHeader.substring(7));
        List<GetPostDto> posts = postService.getPosts(offset, nickname);
        return ResponseEntity.ok(posts);
    }

    @PostMapping("/addPost")
    public ResponseEntity<?> addPost(
            @RequestPart("content") String content,
            @RequestPart(value = "file", required = false) MultipartFile file,
            @RequestHeader("authorization") String authHeader) {

        String jwt = authHeader.substring(7);
        String nickname = jwtService.extractUsername(jwt);
        System.out.println("Extracted nickname: " + nickname);

        HashMap<String, ?> savingPost = postService.savePost(content, nickname, file);

        if (savingPost.get("error") != null) {
            // return ResponseEntity.
        }
        System.out.println(savingPost.get("postId"));
        List<GetPostDto> newPost = postService.getNewPost(nickname);
        return ResponseEntity.ok(newPost);
    }

    @PutMapping("/updatePost")
    public ResponseEntity<?> updatePost(
            @RequestPart("content") String content,
            @RequestPart(value = "file", required = false) MultipartFile file,
            @RequestHeader("authorization") String jwt) throws JsonProcessingException {

        AddPostDto post = postService.converteData(content);

        System.out.println(post);

        if (post.id() == null) {
            return ResponseEntity.badRequest().body("{\"error\":\"Bad Request\"}");
        }
        String nickname = jwtService.extractUsername(jwt.substring(7));
        if (!postService.checkOwner(post.id(), nickname)) {
            return ResponseEntity.status(401).body(null);
        }
        postService.savePost(content, nickname, file);
        return ResponseEntity.ok().body("ok");
    }

    @DeleteMapping("/deletePost/{id}")
    public ResponseEntity<?> deletePost(@PathVariable long id, @RequestHeader("authorization") String jwt) {
        HashMap<String, String> resp = new HashMap<>();

        String UserNickname = jwtService.extractUsername(jwt.substring(7));
        if (!postService.checkUser(UserNickname)) {
            resp.put("error", "user not found");
            return ResponseEntity.status(403).body(resp);
        }

        if (!postService.checkPost(id)) {
            resp.put("error", "post not found");
            return ResponseEntity.status(403).body(resp);
        }

        String role = jwtService.extractClaim(jwt.substring(7), claims -> claims.get("role", String.class));
        System.out.println("role: " + role);
        if (!postService.checkOwner(id, UserNickname)) {

        }

        postService.deletePost(id);
        resp.put("message", "post deleted");
        return ResponseEntity.ok().body(resp);
    }

}
