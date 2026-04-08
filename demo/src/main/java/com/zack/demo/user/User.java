package com.zack.demo.user;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.Data;

@Entity
@Table(name = "users")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String nickname;

    @Email
    @Column(unique = true, nullable = false)
    private String email;

    private String firstName;
    private String lastName;
    private String password;
    private String bio;
    private String role = "user";
    private String imagePath;

}
