package com.example.onboarding.repository;

import com.example.onboarding.entity.Profile;
import com.example.onboarding.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    List<User> findByProfile(Profile profile);

    Optional<User> findByUsername(String name);
}
