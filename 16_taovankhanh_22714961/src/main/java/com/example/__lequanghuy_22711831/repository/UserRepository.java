package com.example.__taovankhanh_22714961.repository;

import com.example.__taovankhanh_22714961.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}
