package com.zack.demo.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BanedUserRepo extends JpaRepository<BanUserEntity, Long> {
    BanUserEntity findByUserId(long id);
}
