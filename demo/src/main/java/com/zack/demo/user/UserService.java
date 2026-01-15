package com.zack.demo.user;

import java.sql.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

import javax.ws.rs.NotFoundException;

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

    public boolean existsByNickname(String nickname) {
        return this.userRepository.existsByNickname(nickname);
    }

    public User saveUser(User user) {
        if (user == null) {
            return null;
        }
        return this.userRepository.save(user);
    }

    public GetCredentialsDto getCredentials(String nickname) {
        User user = checkUser(nickname);

        GetCredentialsDto userCredentials = new GetCredentialsDto(user.getId(), user.getNickname(),
                user.getImagePath(), user.getRole());
        return userCredentials;
    }

    public List<GetPostDto> getUserPosts(String nickname, String requesterNickname, long offset) {
        User requester = checkUser(requesterNickname);

        if (requesterNickname.equals(nickname)) {
            return postRepo.findUserPostsByOffsetAndLimit(requester.getId(), requester.getId(), 10, offset);
        } else {
            User owner = checkUser(nickname);
            return postRepo.findUserPostsByOffsetAndLimit(requester.getId(), owner.getId(), 10, offset);
        }
    }

    public User checkUser(String nickName) {
        return findByNickname(nickName).orElseThrow(() -> new NotFoundException("User Not Found"));
    }

    public UserProfileResponseDto getProfileData(User user, User requester) {
        boolean isOwner = user.getId().equals(requester.getId());
        boolean isFollowing = userRepository.isFollowing(requester.getId(), user.getId());

        return new UserProfileResponseDto(user.getNickname(), user.getFirstName(), user.getLastName(),
                user.getBio(),
                user.getImagePath(),
                isFollowing,
                isOwner);
    }

    public String toggleFollow(User follower, User followed) {
        if (userRepository.isFollowing(follower.getId(), followed.getId())) {
            userRepository.unfollowUser(follower.getId(), followed.getId());
            return "unfollowed";
        } else {
            userRepository.followUser(follower.getId(), followed.getId());
            return "followed";
        }
    }
}
