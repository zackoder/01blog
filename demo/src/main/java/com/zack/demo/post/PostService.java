package com.zack.demo.post;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.apache.tika.Tika;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.zack.demo.user.User;
import com.zack.demo.user.UserRepository;

@Service
public class PostService {

    @Autowired
    private PostRepo postRepo;

    @Autowired
    private UserRepository userRepository;

    public HashMap<String, ?> savePost(String content, String userNickname, MultipartFile file) {
        Post post = new Post();
        String filePath = "";

        HashMap<String, Object> res = new HashMap<>();

        User user = userRepository.findByNickname(userNickname).get();
        if (user == null) {
            removeFile(filePath);
            res.put("error", "user not found");
            return res;
        }

        if (file != null) {
            filePath = uploadFile(file);

            String message = storeFile(filePath, file);

            if (!message.equals("successfully")) {
                res.put("error", "couldn't store the file please try again");
                return res;
            }
        }

        post.setContent(content);
        post.setImagePath(filePath);
        post.setUser(user);
        post.setVisibility(true);
        post.setCreated_at(new Date().getTime() / 1000);
        System.out.println(post.toString());
        Post newPost = postRepo.save(post);
        System.out.println(newPost);
        res.put("message", "successfully");
        res.put("postId", newPost.getId());
        return res;
    }

    public List<GetPostDto> getPosts(long offset, String nickname) {
        User user = userRepository.findByNickname(nickname).get();
        if (user == null) {
            return null;
        }
        return postRepo.findPostsByOffsetAndLimit(user.getId(), user.getId(), 10, offset);
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
                    return "invalid type of file\n";
                }
            }
        } catch (Exception e) {
            return "couldn't read the file\n";
        }

        Date currentTime = new Date();
        fileName += currentTime.getTime() + "_" + file.getOriginalFilename();
        return fileName;
    }

    public String storeFile(String fileName, MultipartFile file) {
        Path uploadBasePath = Paths.get("uploads").toAbsolutePath().normalize();

        String[] splited = fileName.split("/");
        Path targetDir = uploadBasePath.resolve(splited[0]);
        try {
            Files.createDirectories(targetDir);
            Path targetPath = targetDir.resolve(splited[1]);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
        } catch (Exception e) {
            System.out.println("creating parent folder for an uploaded file:\n" + e);
            return "couldn't create the parent folder";
        }

        return "successfully";
    }

    private void removeFile(String path) {

    }

    public boolean checkUser(String nickname) {
        return userRepository.existsByNickname(nickname);
    }

    public boolean checkPost(long id) {
        return postRepo.existsById(id);
    }

    public boolean checkOwner(long id, String nickname) {
        return postRepo.existsByIdAndUserNickname(id, nickname);
    }

    public void deletePost(long id) {
        postRepo.deleteById(id);
    }

    public List<GetPostDto> getNewPost(String nickname) {
        User user = userRepository.findByNickname(nickname).get();
        return postRepo.findPostsByOffsetAndLimit(user.getId(), user.getId(), 1, 0);
    }
}
