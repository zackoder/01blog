package com.zack.demo.post;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;

import com.zack.demo.config.JwtService;

import jakarta.validation.Valid;

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

    @GetMapping("/getPost/{id}")
    public ResponseEntity<?> getPost(@PathVariable long id, @RequestParam("edit") boolean edit,
            @RequestHeader("authorization") String authHeader) {

        String nickname = jwtService.extractUsername(authHeader.substring(7));
        if (edit) {
            if (!postService.checkOwner(id, nickname)) {
                return ResponseEntity.badRequest().body("{\"error\":\"Bad Request\"}");
            }
        }
        GetPostDto post = postService.getPostById(nickname, id);
        return ResponseEntity.ok(post);
    }

    @PostMapping(value = "/addPost", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<?> addPost(
            @Valid @RequestPart("content") AddPostDto post,
            @RequestPart(value = "file", required = false) MultipartFile file,
            @RequestHeader("authorization") String authHeader) throws IOException {
        String jwt = authHeader.substring(7);
        String nickname = jwtService.extractUsername(jwt);
        System.out.println("Extracted nickname: " + nickname);

        HashMap<String, ?> savingPost = postService.savePost(post, nickname, file);

        if (savingPost.get("error") != null) {
            return ResponseEntity.badRequest().body(savingPost);
        }

        System.out.println(savingPost.get("postId"));
        return ResponseEntity.ok(Map.of("message", "success"));
    }

    @PutMapping(value = "/updatePost", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<?> updatePost(
            @Valid @RequestPart("content") AddPostDto post,
            @RequestPart(value = "file", required = false) MultipartFile file,
            @RequestHeader("authorization") String jwt) throws IOException {

        if (post.id() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Bad Request"));
        }

        if (!postService.findVisibilityById(post.id())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Bad Request"));
        }

        String nickname = jwtService.extractUsername(jwt.substring(7));
        if (!postService.checkOwner(post.id(), nickname)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Bad Request"));
        }
        HashMap<String, ?> res = postService.savePost(post, nickname, file);
        if (res.get("error") != null) {
            return ResponseEntity.badRequest().body(res);
        }
        return ResponseEntity.ok().body(Map.of("message", "success"));
    }

    @DeleteMapping("/deletePost/{id}")
    public ResponseEntity<?> deletePost(@PathVariable long id, @RequestHeader("authorization") String jwt)
            throws IOException {
        HashMap<String, String> resp = new HashMap<>();

        String UserNickname = jwtService.extractUsername(jwt.substring(7));
        String role = jwtService.extractClaim(jwt.substring(7), claims -> claims.get("role", String.class));
        System.out.println("role: " + role);

        if (!postService.existsByNickname(UserNickname)) {
            resp.put("error", "user not found");
            return ResponseEntity.status(403).body(resp);
        }

        if (!postService.checkPost(id)) {
            resp.put("error", "post not found");
            return ResponseEntity.status(403).body(resp);
        }

        if (!role.equals("admin") && !postService.checkOwner(id, UserNickname)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Bad Request"));
        }

        postService.deletePost(id);
        resp.put("message", "post deleted");
        return ResponseEntity.ok().body(resp);
    }

}
