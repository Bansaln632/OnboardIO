package com.example.onboarding.controller.admin;

import com.example.onboarding.dto.DtoMapper;
import com.example.onboarding.dto.UserDTO;
import com.example.onboarding.entity.Role;
import com.example.onboarding.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final UserRepository userRepository;

    @GetMapping
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .filter(u -> u.getRole()!= Role.ROLE_ADMIN)
                .map(DtoMapper::toUserDto)
                .collect(Collectors.toList());
    }
}
