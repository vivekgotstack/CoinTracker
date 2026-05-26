package com.vivek.cointracker.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.vivek.cointracker.entity.CategoryType;
import com.vivek.cointracker.entity.TransactionEntity;

public interface TransactionRepository extends
                JpaRepository<TransactionEntity, Long>,
                JpaSpecificationExecutor<TransactionEntity> {

        Page<TransactionEntity> findByProfileId(Long profileId, Pageable pageable);

        @Query("""
                            SELECT COALESCE(SUM(t.amount), 0)
                            FROM TransactionEntity t
                            WHERE t.profile.id = :profileId AND t.type = :type
                        """)
        Optional<BigDecimal> sumAmountByType(@Param("profileId") Long profileId, @Param("type") CategoryType type);

        List<TransactionEntity> findTop5ByProfileIdOrderByDateDesc(Long profileId);

        List<TransactionEntity> findTop5ByProfileIdAndTypeOrderByDateDesc(
                        Long profileId,
                        CategoryType type);

        @Query("""
                SELECT COALESCE(SUM(t.amount), 0)
                FROM TransactionEntity t
                WHERE t.profile.id = :profileId
                AND t.type = :type
                AND t.date = :date
                """)
        Optional<BigDecimal> sumAmountByTypeAndDate(
                        @Param("profileId") Long profileId,
                        @Param("type") CategoryType type,
                        @Param("date") LocalDate date);

        long countByProfileIdAndDate(
                        Long profileId,
                        LocalDate date);
}