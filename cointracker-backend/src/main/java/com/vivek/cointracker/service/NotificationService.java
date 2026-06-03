package com.vivek.cointracker.service;

import java.math.BigDecimal;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.vivek.cointracker.entity.ProfileEntity;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private final EmailService emailService;

    @Value("${app.base-url}")
    private String backendUrl;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Async
    public void sendAccountActivationEmail(
            ProfileEntity user,
            String activationToken) {

        try {

            String activationLink = backendUrl + "/activate?token=" + activationToken;

            String body = authEmail(
                    "Activate your account",
                    "Welcome to CoinTracker, " + user.getFullName() + ".",
                    "Confirm your email so your account is ready for secure money tracking.",
                    "Activate account",
                    activationLink,
                    "This activation link expires in 15 minutes.");

            emailService.sendEmail(
                    user.getEmail(),
                    "Activate your CoinTracker account",
                    body);

        } catch (Exception e) {

            log.error(
                    "Failed to send activation email to {}",
                    user.getEmail(),
                    e);
        }
    }

    @Async
    public void sendPasswordResetEmail(
            ProfileEntity user,
            String resetToken) {

        try {

            String resetLink = frontendUrl + "/reset-password?token=" + resetToken;

            String body = authEmail(
                    "Reset your password",
                    "Hi " + user.getFullName() + ",",
                    "Use the secure link below to choose a fresh password for your CoinTracker account.",
                    "Reset password",
                    resetLink,
                    "This reset link expires in 10 minutes. Ignore this email if you did not request it.");

            emailService.sendEmail(
                    user.getEmail(),
                    "Reset your CoinTracker password",
                    body);

        } catch (Exception e) {

            log.error(
                    "Failed to send reset password email to {}",
                    user.getEmail(),
                    e);
        }
    }

    @Async
    public void sendDailyExpenseReminder(ProfileEntity user) {

        try {
            String body = """
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="UTF-8">
                    </head>

                    <body style="
                            margin:0;
                            padding:0;
                            background-color:#f4f7fb;
                            font-family:Arial,sans-serif;
                            color:#1f2937;
                    ">

                        <table width="100%%" cellpadding="0" cellspacing="0">
                            <tr>
                                <td align="center" style="padding:40px 16px;">

                                    <table width="600" cellpadding="0" cellspacing="0"
                                        style="
                                            background:#ffffff;
                                            border-radius:12px;
                                            overflow:hidden;
                                            box-shadow:0 4px 20px rgba(0,0,0,0.08);
                                        ">

                                        <tr>
                                            <td style="
                                                    background:#1BA61B;
                                                    padding:24px;
                                                    text-align:center;
                                            ">
                                                <h1 style="
                                                        margin:0;
                                                        color:#ffffff;
                                                        font-size:28px;
                                                ">
                                                    CoinTracker
                                                </h1>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td style="padding:40px 32px;">

                                                <h2 style="
                                                        margin-top:0;
                                                        color:#111827;
                                                        font-size:24px;
                                                ">
                                                    Daily Expense Reminder
                                                </h2>

                                                <p style="
                                                        font-size:16px;
                                                        line-height:1.7;
                                                        color:#4b5563;
                                                ">
                                                    Hi %s,
                                                </p>

                                                <p style="
                                                        font-size:16px;
                                                        line-height:1.7;
                                                        color:#4b5563;
                                                ">
                                                    This is a quick reminder to record today’s
                                                    expenses and income entries in your
                                                    CoinTracker account.
                                                </p>

                                                <p style="
                                                        font-size:16px;
                                                        line-height:1.7;
                                                        color:#4b5563;
                                                ">
                                                    Consistent daily tracking helps you:
                                                </p>

                                                <ul style="
                                                        color:#4b5563;
                                                        line-height:1.8;
                                                        padding-left:20px;
                                                ">
                                                    <li>Understand spending habits</li>
                                                    <li>Track savings progress</li>
                                                    <li>Maintain accurate financial reports</li>
                                                    <li>Stay in control of your budget</li>
                                                </ul>

                                                <div style="margin:32px 0; text-align:center;">
                                                    <a href="%s"
                                                        style="
                                                            background:#1BA61B;
                                                            color:#ffffff;
                                                            text-decoration:none;
                                                            padding:14px 24px;
                                                            border-radius:8px;
                                                            display:inline-block;
                                                            font-weight:bold;
                                                            font-size:15px;
                                                    ">
                                                        Open Dashboard
                                                    </a>
                                                </div>

                                                <p style="
                                                        font-size:14px;
                                                        line-height:1.7;
                                                        color:#6b7280;
                                                        text-align:center;
                                                ">
                                                    Thank you for using CoinTracker.
                                                </p>

                                            </td>
                                        </tr>

                                        <tr>
                                            <td style="
                                                    background:#f9fafb;
                                                    padding:20px;
                                                    text-align:center;
                                                    font-size:12px;
                                                    color:#9ca3af;
                                            ">
                                                © 2026 CoinTracker. All rights reserved.
                                            </td>
                                        </tr>

                                    </table>

                                </td>
                            </tr>
                        </table>

                    </body>
                    </html>
                    """.formatted(
                    user.getFullName(),
                    frontendUrl);

            emailService.sendEmail(
                    user.getEmail(),
                    "Track today's finances with CoinTracker",
                    body);

            log.info(
                    "Daily reminder email sent to {}",
                    user.getEmail());

        } catch (Exception e) {

            log.error(
                    "Failed to send reminder email to {}",
                    user.getEmail(),
                    e);
        }
    }

    @Async
    public void sendDailyExpenseSummary(
            ProfileEntity user,
            BigDecimal totalExpense,
            BigDecimal totalIncome,
            long transactionCount) {

        try {
            BigDecimal balance = totalIncome.subtract(totalExpense);

            String body = """
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="UTF-8">
                    </head>

                    <body style="
                            margin:0;
                            padding:0;
                            background-color:#f4f7fb;
                            font-family:Arial,sans-serif;
                            color:#1f2937;
                    ">

                        <table width="100%%" cellpadding="0" cellspacing="0">
                            <tr>
                                <td align="center" style="padding:40px 16px;">

                                    <table width="600" cellpadding="0" cellspacing="0"
                                        style="
                                            background:#ffffff;
                                            border-radius:12px;
                                            overflow:hidden;
                                            box-shadow:0 4px 20px rgba(0,0,0,0.08);
                                        ">

                                        <tr>
                                            <td style="
                                                    background:#1BA61B;
                                                    padding:24px;
                                                    text-align:center;
                                            ">
                                                <h1 style="
                                                        margin:0;
                                                        color:#ffffff;
                                                        font-size:28px;
                                                ">
                                                    CoinTracker
                                                </h1>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td style="padding:40px 32px;">

                                                <h2 style="
                                                        margin-top:0;
                                                        color:#111827;
                                                        font-size:24px;
                                                ">
                                                    Daily Financial Summary
                                                </h2>

                                                <p style="
                                                        font-size:16px;
                                                        line-height:1.7;
                                                        color:#4b5563;
                                                ">
                                                    Hi %s,
                                                </p>

                                                <p style="
                                                        font-size:16px;
                                                        line-height:1.7;
                                                        color:#4b5563;
                                                ">
                                                    Here’s your financial activity summary for today:
                                                </p>

                                                <table width="100%%"
                                                    cellpadding="16"
                                                    cellspacing="0"
                                                    style="
                                                        margin:24px auto;
                                                        border-collapse:collapse;
                                                    ">

                                                    <tr>
                                                        <td style="
                                                                background:#8AC28A;
                                                                border:1px solid #e5e7eb;
                                                                font-weight:bold;
                                                        ">
                                                            Total Income
                                                        </td>

                                                        <td style="
                                                                background:#ecfdf5;
                                                                border:1px solid #e5e7eb;
                                                                color:#065f46;
                                                                font-weight:bold;
                                                        ">
                                                            ₹%s
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td style="
                                                                background:#D9736C;
                                                                border:1px solid #e5e7eb;
                                                                font-weight:bold;
                                                        ">
                                                            Total Expense
                                                        </td>

                                                        <td style="
                                                                background:#fef2f2;
                                                                border:1px solid #e5e7eb;
                                                                color:#991b1b;
                                                                font-weight:bold;
                                                        ">
                                                            ₹%s
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td style="
                                                                background:#A16BC7;
                                                                border:1px solid #e5e7eb;
                                                                font-weight:bold;
                                                        ">
                                                            Net Balance
                                                        </td>

                                                        <td style="
                                                                background:#eff6ff;
                                                                border:1px solid #e5e7eb;
                                                                color:#1e3a8a;
                                                                font-weight:bold;
                                                        ">
                                                            ₹%s
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td style="
                                                                background:#f9fafb;
                                                                border:1px solid #e5e7eb;
                                                                font-weight:bold;
                                                        ">
                                                            Transactions Logged
                                                        </td>

                                                        <td style="
                                                                background:#ffffff;
                                                                border:1px solid #e5e7eb;
                                                                font-weight:bold;
                                                        ">
                                                            %s
                                                        </td>
                                                    </tr>

                                                </table>

                                                <p style="
                                                        font-size:15px;
                                                        line-height:1.7;
                                                        color:#4b5563;
                                                ">
                                                    Maintaining consistent financial records helps you
                                                    build better budgeting habits and long-term financial awareness.
                                                </p>

                                                <div style="margin:32px 0; text-align:center;">
                                                    <a href="%s"
                                                        style="
                                                            background:#1BA61B;
                                                            color:#ffffff;
                                                            text-decoration:none;
                                                            padding:14px 24px;
                                                            border-radius:8px;
                                                            display:inline-block;
                                                            font-weight:bold;
                                                            font-size:15px;
                                                    ">
                                                        View Dashboard
                                                    </a>
                                                </div>

                                                <p style="
                                                        font-size:14px;
                                                        line-height:1.7;
                                                        color:#6b7280;
                                                        text-align:center;
                                                ">
                                                    Thank you for using CoinTracker.
                                                </p>

                                            </td>
                                        </tr>

                                        <tr>
                                            <td style="
                                                    background:#f9fafb;
                                                    padding:20px;
                                                    text-align:center;
                                                    font-size:12px;
                                                    color:#9ca3af;
                                            ">
                                                © 2026 CoinTracker. All rights reserved.
                                            </td>
                                        </tr>

                                    </table>

                                </td>
                            </tr>
                        </table>

                    </body>
                    </html>
                    """.formatted(
                    user.getFullName(),
                    totalIncome,
                    totalExpense,
                    balance,
                    transactionCount,
                    frontendUrl);

            emailService.sendEmail(
                    user.getEmail(),
                    "Your Daily Financial Summary",
                    body);

            log.info(
                    "Daily summary email sent to {}",
                    user.getEmail());

        } catch (Exception e) {

            log.error(
                    "Failed to send daily summary email to {}",
                    user.getEmail(),
                    e);
        }
    }

    private String authEmail(
            String title,
            String greeting,
            String message,
            String buttonText,
            String link,
            String note) {

        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                </head>

                <body style="
                        margin:0;
                        padding:0;
                        background-color:#f4f7fb;
                        font-family:Arial,sans-serif;
                        color:#1f2937;
                ">
                    <table width="100%%" cellpadding="0" cellspacing="0">
                        <tr>
                            <td align="center" style="padding:40px 16px;">
                                <table width="600" cellpadding="0" cellspacing="0"
                                    style="
                                        background:#ffffff;
                                        border-radius:12px;
                                        overflow:hidden;
                                        box-shadow:0 4px 20px rgba(0,0,0,0.08);
                                    ">
                                    <tr>
                                        <td style="
                                                background:#1BA61B;
                                                padding:24px;
                                                text-align:center;
                                        ">
                                            <img src="%s" alt="CoinTracker" style="
                                                    display:block;
                                                    width:54px;
                                                    height:54px;
                                                    border-radius:14px;
                                                    margin:0 auto 12px;
                                                    background:#ffffff;
                                                    padding:4px;
                                                    box-sizing:border-box;
                                            " />
                                            <div style="
                                                    display:none;
                                                    width:54px;
                                                    height:54px;
                                                    line-height:54px;
                                                    border-radius:14px;
                                                    background:#ffffff;
                                                    color:#1BA61B;
                                                    font-size:22px;
                                                    font-weight:bold;
                                                    margin-bottom:12px;
                                            ">
                                                Rs
                                            </div>
                                            <h1 style="
                                                    margin:0;
                                                    color:#ffffff;
                                                    font-size:28px;
                                            ">
                                                CoinTracker
                                            </h1>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td style="padding:40px 32px;">
                                            <h2 style="
                                                    margin-top:0;
                                                    color:#111827;
                                                    font-size:24px;
                                            ">
                                                %s
                                            </h2>

                                            <p style="
                                                    font-size:16px;
                                                    line-height:1.7;
                                                    color:#4b5563;
                                            ">
                                                %s
                                            </p>

                                            <p style="
                                                    font-size:16px;
                                                    line-height:1.7;
                                                    color:#4b5563;
                                            ">
                                                %s
                                            </p>

                                            <div style="margin:32px 0; text-align:center;">
                                                <a href="%s"
                                                    style="
                                                        background:#1BA61B;
                                                        color:#ffffff;
                                                        text-decoration:none;
                                                        padding:14px 24px;
                                                        border-radius:8px;
                                                        display:inline-block;
                                                        font-weight:bold;
                                                        font-size:15px;
                                                ">
                                                    %s
                                                </a>
                                            </div>

                                            <p style="
                                                    font-size:14px;
                                                    line-height:1.7;
                                                    color:#6b7280;
                                                    text-align:center;
                                            ">
                                                %s
                                            </p>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td style="
                                                background:#f9fafb;
                                                padding:20px;
                                                text-align:center;
                                                font-size:12px;
                                                color:#9ca3af;
                                        ">
                                            CoinTracker keeps your finances organized.
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
                """.formatted(frontendUrl + "/pwa-icon.svg", title, greeting, message, link, buttonText, note);
    }
}
