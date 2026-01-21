package com.zack.demo.post;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import javax.ws.rs.NotFoundException;

import org.apache.tika.Tika;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zack.demo.reactions.ReactionDtoResp;
import com.zack.demo.reactions.ReactionService;
import com.zack.demo.user.User;
import com.zack.demo.user.UserService;

@Service
public class PostService {

    @Autowired
    private PostRepo postRepo;

    @Autowired
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ReactionService reactionService;

    public HashMap<String, ?> savePost(AddPostDto postDto, String userNickname, MultipartFile file) throws IOException {
        Post post = new Post();
        String filePath = "";

        HashMap<String, Object> res = new HashMap<>();

        User user = userService.checkUser(userNickname);

        if (file != null && !file.isEmpty()) {
            filePath = uploadFile(file);
            if (!filePath.startsWith("image") && !filePath.startsWith("video")) {
                res.put("error", filePath);
                return res;
            }
            String message = storeFile(filePath, file);
            if (!message.equals("successfully")) {
                res.put("error", message);
                return res;
            }
        }

        post.setId(postDto.id());
        post.setContent(postDto.content());
        post.setImagePath(filePath.isEmpty() ? "" : "/uploads/" + filePath);
        post.setUser(user);
        post.setVisibility(true);
        post.setCreated_at(new Date().getTime() / 1000);

        Post newPost = postRepo.save(post);

        res.put("message", "successfully");
        res.put("postId", newPost.getId());
        return res;
    }

    public List<GetPostDto> getPosts(long offset, String nickname) {
        User user = userService.checkUser(nickname);

        return postRepo.findPostsByOffsetAndLimit(user.getId(), 10, offset);
    }

    private String uploadFile(MultipartFile file) {
        Tika tika = new Tika();
        String fileName = "";
        try {
            byte[] bytes = file.getBytes();
            if (bytes.length > 0) {
                if (tika.detect(bytes).startsWith("image")) {
                    fileName = "images/";
                } else if (tika.detect(bytes).startsWith("video")) {
                    fileName = "videos/";
                } else {
                    System.out.println("file type " + tika.detect(bytes));
                    return "invalid file type";
                }
            }
        } catch (Exception e) {
            return "couldn't read the file";
        }

        Date currentTime = new Date();
        fileName += currentTime.getTime() + "_" + file.getOriginalFilename();
        return fileName;
    }

    public String storeFile(String fileName, MultipartFile file) throws IOException {
        Path uploadBasePath = Paths.get("uploads").toAbsolutePath().normalize();

        String[] splitted = fileName.split("/");
        Path targetDir = uploadBasePath.resolve(splitted[0]);

        Files.createDirectories(targetDir);
        Path targetPath = targetDir.resolve(splitted[1]);
        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        return "successfully";
    }

    private void removeFile(String pathStr) throws IOException {
        Path filePath = Paths.get(pathStr);
        Files.delete(filePath);
    }

    public boolean checkPost(long id) {
        return postRepo.existsById(id);
    }

    public boolean checkOwner(long id, String nickname) {
        return postRepo.existsByIdAndUserNickname(id, nickname);
    }

    public void deletePost(long id) throws IOException {
        postRepo.deleteById(id);
    }

    public List<GetPostDto> getNewPost(String nickname) {
        User user = userService.checkUser(nickname);
        return postRepo.findPostsByOffsetAndLimit(user.getId(), 1, 0);
    }

    public boolean existsByNickname(String nickname) {
        return userService.existsByNickname(nickname);
    }

    public AddPostDto converteData(String data) throws JsonMappingException, JsonProcessingException {
        AddPostDto post = objectMapper.readValue(data, AddPostDto.class);
        return post;
    }

    public GetPostDto getPostById(String role, String nickname, long id) {
        Post post = postRepo.findById(id).orElseThrow(() -> new NotFoundException("Post Not Found"));

        if (!post.getVisibility() && !role.equals("admin")) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This post has been hidden by an administrator.");
        }

        ReactionDtoResp reaction = reactionService.countReaction(nickname, post.getId());

        GetPostDto resp = new GetPostDto(post.getId(), post.getUser().getImagePath(), post.getContent(),
                post.getImagePath(), post.getUser().getId(), post.getVisibility(),
                post.getCreated_at(), post.getUser().getNickname(), reaction.getLikes(), reaction.getDislikes(),
                post.getUser().getNickname().equals(nickname), reaction.getReacted());

        return resp;
    }

    public boolean findVisibilityById(long id) {
        return postRepo.findVisibilityById(id);
    }

    public Post getPost(long id) {
        return postRepo.findById(id).orElseThrow(() -> new NotFoundException("Post Not Found"));
    }

    public String hidePost(long id) {
        Post post = getPost(id);
        post.setVisibility(!post.getVisibility());
        postRepo.save(post);
        return post.getVisibility() ? "was revealed" : "was hidden";
    }
}
