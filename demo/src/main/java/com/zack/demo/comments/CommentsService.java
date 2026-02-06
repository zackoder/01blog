package com.zack.demo.comments;

import java.util.Date;
import java.util.List;

import javax.ws.rs.NotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.zack.demo.notifications.Notifications;
import com.zack.demo.notifications.NotificationsRepo;
import com.zack.demo.post.Post;
import com.zack.demo.post.PostRepo;
import com.zack.demo.user.User;
import com.zack.demo.user.UserRepository;
import com.zack.demo.user.UserService;

@Service
public class CommentsService {
    @Autowired
    private UserService userService;
    @Autowired
    private PostRepo postRepo;
    @Autowired
    private CommentsRepo commentsRepo;
    @Autowired
    private NotificationsRepo notificationsRepo;

    public boolean checkUser(String nickname) {
        return userService.existsByNickname(nickname);
    }

    public boolean checkPost(long postId) {
        return postRepo.existsById(postId);
    }

    public CommentsResDto saveComment(CommentsReqDto dto, String nickname) {
        Comments comment = convertToComments(dto, nickname);
        if (comment == null) {
            return null;
        }
        comment = commentsRepo.save(comment);
        CommentsResDto res = commentsResDto(comment);
        return res;
    }

    private Comments convertToComments(CommentsReqDto dto, String nickname) {
        User user = userService.checkUser(nickname);
        Post post = postRepo.findById(dto.getPostId()).get();

        Comments comment = new Comments();
        comment.setContent(dto.getComment());
        comment.setCreatedAt(new Date().getTime() / 1000);
        comment.setPost(post);
        comment.setUser(user);
        return comment;
    }

    private CommentsResDto commentsResDto(Comments comment) {
        CommentsResDto resDto = new CommentsResDto(comment.getId(), comment.getUser().getId(),
                comment.getPost().getId(), comment.getContent(), comment.getUser().getNickname(),
                comment.getCreatedAt(), true);
        return resDto;
    }

    public List<CommentsResDto> getAllComments(long id, String nickname) {
        List<Comments> comments = commentsRepo.findAllByPostIdOrderByCreatedAtDesc(id);
        return convetToResDto(comments, nickname);
    }

    public List<CommentsResDto> convetToResDto(List<Comments> comments, String nickname) {
        List<CommentsResDto> resDto = comments.stream().map(comment -> new CommentsResDto(
                comment.getId(),
                comment.getUser().getId(),
                comment.getPost().getId(),
                comment.getContent(),
                comment.getUser().getNickname(),
                comment.getCreatedAt(),
                comment.getUser().getNickname().equals(nickname))).toList();

        return resDto;
    }

    public String deleteComment(long id, String nickname) {
        Comments comment = commentsRepo.findById(id).orElseThrow(() -> new NotFoundException("comment not found"));

        if (!comment.getUser().getNickname().equals(nickname)) {
            return "you are not the owner";
        }

        commentsRepo.delete(comment);
        return "deleted";
    }


}
