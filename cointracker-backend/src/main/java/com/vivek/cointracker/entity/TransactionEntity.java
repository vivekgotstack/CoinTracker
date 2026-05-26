package com.vivek.cointracker.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tbl_transactions", indexes = {
        @Index(name = "idx_tx_profile", columnList = "profile_id"),
        @Index(name = "idx_tx_category", columnList = "category_id"),
        @Index(name = "idx_tx_date", columnList = "date"),
        @Index(name = "idx_tx_type", columnList = "type")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class TransactionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "tx_seq_gen")
    @SequenceGenerator(name = "tx_seq_gen", sequenceName = "tx_seq", allocationSize = 50)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String icon;

    @Column(nullable = false)
    @Builder.Default
    private LocalDate date = LocalDate.now();

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CategoryType type;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private CategoryEntity category;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "profile_id", nullable = false)
    private ProfileEntity profile;
}
