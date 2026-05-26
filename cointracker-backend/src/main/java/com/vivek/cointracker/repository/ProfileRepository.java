package com.vivek.cointracker.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vivek.cointracker.entity.ProfileEntity;

@Repository
public interface ProfileRepository extends JpaRepository<ProfileEntity,Long>{
    public Optional<ProfileEntity> findByEmail(String email);
    public Optional<ProfileEntity> findByActivationToken(String activationToken);
    public Optional<ProfileEntity> findByResetToken(String resetToken);
}
