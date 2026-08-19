package com.saferoute;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordTest {
    @Test
    public void generateHashes() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        System.out.println("HASH_MODERATOR: " + encoder.encode("Moderator123!"));
        System.out.println("HASH_AUTHORITY: " + encoder.encode("Authority123!"));
    }
}
