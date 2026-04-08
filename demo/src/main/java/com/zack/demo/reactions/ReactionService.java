package com.zack.demo.reactions;

import java.util.HashMap;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.zack.demo.post.Post;
import com.zack.demo.post.PostRepo;
import com.zack.demo.user.User;
import com.zack.demo.user.UserRepository;

@Service
public class ReactionService {
    @Autowired
    private PostRepo post;

    @Autowired
    private UserRepository user;

    @Autowired
    private ReactionRepo reactionRepo;

    private ReactionDto dto;

    public HashMap<String, String> validateDto(ReactionDto dto) {
        HashMap<String, String> res = new HashMap<>();
        if (dto.reactionType().isEmpty()
                || (!dto.reactionType().equals("like") && !dto.reactionType().equals("dislike"))) {
            res.put("error", "bad request");
            return res;
        }

        Optional<Post> postOption = post.findById(dto.targetId());
        if (postOption.isEmpty()) {
            res.put("error", "bad request");
            return res;
        }
        this.dto = dto;
        return res;
    }

    public boolean checkUser(String nickname) {
        return user.existsByNickname(nickname);
    }

    public void seveReaction(String nickname) {
        Optional<User> userOptional = user.findByNickname(nickname);
        User reacter = userOptional.get();
        Optional<Reactions> reactionOptional = reactionRepo.findByPostIdAndUserId(this.dto.targetId(),
                reacter.getId());
        Reactions reaction = new Reactions();
        if (reactionOptional.isEmpty()) {
            reaction.setPostId(this.dto.targetId());
            reaction.setUserId(reacter.getId());
            reaction.setReaction_type(dto.reactionType());
            reactionRepo.save(reaction);
        } else {
            reaction = reactionOptional.get();
            if (reaction.getReaction_type().equals(dto.reactionType())) {
                reactionRepo.delete(reaction);
            } else {
                reaction.setReaction_type(dto.reactionType());
                reactionRepo.save(reaction);
            }
        }
    }

    public ReactionDtoResp countReaction(String nickname, long post_id) {
        User user = this.user.findByNickname(nickname).get();
        return reactionRepo.countReaction(user.getId(), post_id);
    }
}
