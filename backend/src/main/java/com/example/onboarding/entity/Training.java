package com.example.onboarding.entity;

import com.example.onboarding.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Training {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private boolean completed;
    private boolean started;
    private String content;

    @ManyToOne(optional = false)
    private User employee;

    // explicit getter for content (some static tools don't pick up Lombok)
    public String getContent() {
        return this.content;
    }
}
