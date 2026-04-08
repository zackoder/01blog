package com.zack.demo.user;

import java.util.ArrayList;
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

    @Autowired
    private BanedUserRepo bandUserRBanedUserRepo;

    UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<GetCredentialsDto> getAllUsers() {
        List<GetCredentialsDto> users = new ArrayList<GetCredentialsDto>();
        List<User> userEntities = userRepository.findAll();
        for (User user : userEntities) {
            users.add(new GetCredentialsDto(user.getId(), user.getNickname(), user.getImagePath(), user.getRole()));
        }
        return users;
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

    public boolean isFollowing(Long followerId, Long followedId) {
        return userRepository.isFollowing(followerId, followedId);
    }

    public UserProfileResponseDto getProfileData(User user, User requester) {
        boolean isOwner = user.getId().equals(requester.getId());
        boolean isFollowing = isFollowing(requester.getId(), user.getId());

        return new UserProfileResponseDto(user.getNickname(), user.getFirstName(), user.getLastName(),
                user.getBio(),
                user.getImagePath(),
                isFollowing,
                isOwner);
    }

    public String toggleFollow(User follower, User followed) {
        if (isFollowing(follower.getId(), followed.getId())) {
            userRepository.unfollowUser(follower.getId(), followed.getId());
            return "unfollowed";
        } else {
            userRepository.followUser(follower.getId(), followed.getId());
            return "followed";
        }
    }

    public void deleteUser(User userToDelete) {
        userRepository.delete(userToDelete);
    }

    public void saveBan(BanDto dto) {
        User user = checkUser(dto.nickname());
        int counter = 1;
        BanUserEntity banned = bandUserRBanedUserRepo.findByUserId(user.getId());

        BanUserEntity ban = new BanUserEntity();
        if (banned != null) {
            ban.setId(banned.getId());
            counter = banned.getCounter() + 1;
        }

        System.out.println(counter);
        ban.setReason(dto.reason());
        ban.setExpiresAt(new java.util.Date().getTime() + (24 * 1000 * 60 * 60 * counter));
        ban.setUserId(user.getId());
        ban.setCounter(counter);
        bandUserRBanedUserRepo.save(ban);
    }

    public List<GetCredentialsDto> getUsers(String query) {
        return userRepository.getAllUsers(query);
    }

}
