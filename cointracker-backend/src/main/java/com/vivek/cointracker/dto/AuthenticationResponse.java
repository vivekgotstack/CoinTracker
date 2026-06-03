package com.vivek.cointracker.dto;
import com.vivek.cointracker.entity.Role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuthenticationResponse {
    private String accessToken;
    private String refreshToken;
    private String tokenType;
    private Long expiresIn;
    private UserInfo user;
    private String message;

    @Data
    @Builder
    public static class UserInfo{
        private Long id;
        private String email;
        private String fullName;
        private Role role;
        private String profileImageUrl;
    }
}
