package com.zack.demo.user;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.zack.demo.post.GetPostDto;
import com.zack.demo.post.PostRepo;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepo postRepo;

    UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Optional<User> findByEmail(String email) {
        return this.userRepository.findByEmail(email);
    }

    public Optional<User> findByNickname(String nickname) {
        return this.userRepository.findByNickname(nickname);
    }

    public User saveUser(User user) {
        if (user == null) {
            return null;
        }
        return this.userRepository.save(user);
    }

    public GetCredentialsDto getCredentials(String nickname) {
        User user = userRepository.findByNickname(nickname).get();
        if (user == null) {
            return null;
        }
        GetCredentialsDto userCredentials = new GetCredentialsDto(user.getNickname(), user.getId(),
                "/uploads/default-avatar.jpg");
        return userCredentials;
    }

    public List<GetPostDto> getUserPosts(String nickname, String requesterNickname, long offset) {
        long requesterId = userRepository.findByNickname(requesterNickname).get().getId();
        if (requesterNickname.equals(nickname)) {
            return postRepo.findUserPostsByOffsetAndLimit(requesterId, requesterId, requesterId, 10, offset);
        } else {
            long ownerId = userRepository.findByNickname(nickname).get().getId();
            return postRepo.findUserPostsByOffsetAndLimit(requesterId, requesterId, ownerId, 10, offset);
        }
    }

    public UserProfileResponseDto getProfileData(User user, long id) {
        return new UserProfileResponseDto(user.getNickname(), user.getFirstName(), user.getLastName(), user.getBio(),
                userRepository.isFollowing(id, user.getId()),
                user.getId() == id);
    }
}
