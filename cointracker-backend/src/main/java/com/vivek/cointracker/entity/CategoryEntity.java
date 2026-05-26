package com.vivek.cointracker.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tbl_categories", uniqueConstraints = {
        @UniqueConstraint(name = "uk_user_category", columnNames = { "name", "profile_id" })
})
@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
public class CategoryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "category_seq_gen")
    @SequenceGenerator(name = "category_seq_gen", sequenceName = "category_seq", allocationSize = 50)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING) // Without this JPA will save it as ordinal, tells JPA how to store enum in DB
    @Column(nullable = false)
    private CategoryType type;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    private String icon;

    @ManyToOne(fetch = FetchType.LAZY, optional = false) //Multiple categories can exist for a user
    @JoinColumn(name = "profile_id", nullable = false)
    private ProfileEntity profile;

    public void setName(String name) {
        this.name = name;
    }

    public void setType(CategoryType type) {
        this.type = type;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }
}