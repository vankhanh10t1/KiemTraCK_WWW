package com.example.__taovankhanh_22714961.controller;

import com.example.__taovankhanh_22714961.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserRepository userRepository;

    @GetMapping("/me")
    public Map<String, Object> me(Authentication authentication) {
        var user = userRepository.findByUsername(authentication.getName()).orElseThrow();
        var roles = user.getRoles().stream().map(role -> role.getName()).toList();
        return Map.of(
                "username", user.getUsername(),
                "fullName", user.getFullName(),
                "roles", roles
        );
    }

    @PostMapping("/login")
    public void loginHandledBySpringSecurity() {
    }
}
