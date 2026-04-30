package com.example.onboarding.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    // Google OAuth2 ID (for Sign in with Google)
    @Column(unique = true)
    private String googleId;

    @Enumerated(EnumType.STRING)
    private Role role;

    // New fields
    private String contactNo;

    @Column(unique = true)
    private String employeeId;

    @Enumerated(EnumType.STRING)
    private Profile profile;

    @ManyToOne
    @JoinColumn(name = "assigned_hr_id")
    @JsonIgnoreProperties({"assignedHr", "password"})
    private User assignedHr;
}
