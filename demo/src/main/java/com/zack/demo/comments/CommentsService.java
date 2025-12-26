package com.zack.demo.comments;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.zack.demo.post.Post;
import com.zack.demo.post.PostRepo;
import com.zack.demo.user.User;
import com.zack.demo.user.UserRepository;

@Service
public class CommentsService {
    @Autowired
    private UserRepository userRepo;
    @Autowired
    private PostRepo postRepo;
    @Autowired
    private CommentsRepo commentsRepo;

    public boolean checkUser(String nickname) {
        return userRepo.existsByNickname(nickname);
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
        User user = userRepo.findByNickname(nickname).get();
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
                comment.getCreatedAt());
        return resDto;
    }

    public List<CommentsResDto> getAllComments(long id) {
        List<Comments> comments = commentsRepo.findAllByPostIdOrderByCreatedAtDesc(id);
        return convetToResDto(comments);
    }

    public List<CommentsResDto> convetToResDto(List<Comments> comments) {
        List<CommentsResDto> resDto = comments.stream().map(comment -> new CommentsResDto(
                comment.getId(),
                comment.getUser().getId(),
                comment.getPost().getId(),
                comment.getContent(),
                comment.getUser().getNickname(),
                comment.getCreatedAt())).toList();
        return resDto;
    }
}
