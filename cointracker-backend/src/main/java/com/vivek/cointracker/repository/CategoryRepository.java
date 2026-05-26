package com.vivek.cointracker.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vivek.cointracker.entity.CategoryEntity;
import com.vivek.cointracker.entity.CategoryType;

public interface CategoryRepository extends JpaRepository<CategoryEntity, Long> {

    List<CategoryEntity> findByProfileId(Long profileId); // JPA internally maps: profile.id → profileId coz of @ManyToOne

    Optional<CategoryEntity> findByIdAndProfileId(Long id, Long profileId);

    List<CategoryEntity> findByProfileIdAndType(Long profileId, CategoryType type);
}