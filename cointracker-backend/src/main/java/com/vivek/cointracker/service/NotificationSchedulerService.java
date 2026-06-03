package com.vivek.cointracker.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.function.Consumer;
import java.util.function.Function;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.vivek.cointracker.entity.CategoryType;
import com.vivek.cointracker.entity.ProfileEntity;
import com.vivek.cointracker.repository.ProfileRepository;
import com.vivek.cointracker.repository.TransactionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationSchedulerService {

    private static final Logger log = LoggerFactory.getLogger(NotificationSchedulerService.class);

    private final ProfileRepository profileRepository;
    private final TransactionRepository transactionRepository;
    private final NotificationService notificationService;

    // @Scheduled(cron = "0 * * * * *", zone = "Asia/Kolkata")
    @Scheduled(cron = "0 0 22 * * *", zone = "Asia/Kolkata")
    public void dispatchDailyExpenseReminders() {

        log.info("Started daily expense reminder job");

        processUsers(
                pageable -> profileRepository.findByActiveTrueAndDigestEnabledTrueAndDigestFrequency("daily", pageable),
                user -> notificationService.sendDailyExpenseReminder(user));

        log.info("Completed daily expense reminder job");
    }

    // @Scheduled(cron = "0 * * * * *", zone = "Asia/Kolkata")
    @Scheduled(cron = "0 30 21 * * *", zone = "Asia/Kolkata")
    public void dispatchDailyExpenseSummaries() {

        log.info("Started daily expense summary job");

        processUsers(
                pageable -> profileRepository.findByActiveTrueAndNewsletterSubscribedTrueAndDigestFrequency("daily",
                        pageable),
                user -> {

            LocalDate today = LocalDate.now();

            BigDecimal totalIncome = transactionRepository.sumAmountByTypeAndDate(
                    user.getId(),
                    CategoryType.INCOME,
                    today)
                    .orElse(BigDecimal.ZERO);

            BigDecimal totalExpense = transactionRepository.sumAmountByTypeAndDate(
                    user.getId(),
                    CategoryType.EXPENSE,
                    today)
                    .orElse(BigDecimal.ZERO);

            long transactionCount = transactionRepository.countByProfileIdAndDate(
                    user.getId(),
                    today);

            notificationService.sendDailyExpenseSummary(
                    user,
                    totalExpense,
                    totalIncome,
                    transactionCount);
                });

        log.info("Completed daily expense summary job");
    }

    private void processUsers(
            Function<Pageable, Page<ProfileEntity>> pageLoader,
            Consumer<ProfileEntity> consumer) {

        Pageable pageable = PageRequest.of(0, 100);

        Page<ProfileEntity> page;

        do {

            page = pageLoader.apply(pageable);

            page.getContent().forEach(consumer);

            pageable = pageable.next();

        } while (page.hasNext());
    }
}
