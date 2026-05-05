package com.example.__lequanghuy_22711831.repository;

import com.example.__lequanghuy_22711831.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}
