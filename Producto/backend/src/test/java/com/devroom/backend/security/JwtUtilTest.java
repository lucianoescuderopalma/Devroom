package com.devroom.backend.security;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

class JwtUtilTest {

    private JwtUtil jwtUtil;

    private static final String TEST_SECRET =
            "devroom-super-secret-key-must-be-at-least-64-characters-long-ok!!";
    private static final Long TEST_EXPIRATION = 3600000L;

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
        ReflectionTestUtils.setField(jwtUtil, "secret", TEST_SECRET);
        ReflectionTestUtils.setField(jwtUtil, "expiration", TEST_EXPIRATION);
    }

    // TC-JWT01: generar token y extraer userId
    @Test
    void generateToken_ThenExtractUserId_ReturnsCorrectId() {
        String token = jwtUtil.generateToken(42L, "lescudero");
        Long userId = jwtUtil.extractUserId(token);
        assertThat(userId).isEqualTo(42L);
    }

    // TC-JWT02: token recién generado es válido
    @Test
    void isTokenValid_FreshToken_ReturnsTrue() {
        String token = jwtUtil.generateToken(1L, "lescudero");
        assertThat(jwtUtil.isTokenValid(token)).isTrue();
    }

    // TC-JWT03: token manipulado falla la validación
    @Test
    void isTokenValid_WithTamperedToken_ReturnsFalse() {
        String bad = "eyJhbGciOiJIUzI1NiJ9.fakePayload.fakeSignature";
        assertThat(jwtUtil.isTokenValid(bad)).isFalse();
    }

    // TC-JWT04: string vacío — espera IllegalArgumentException de jjwt
    @Test
    void isTokenValid_WithEmptyString_ThrowsOrReturnsFalse() {
        // jjwt lanza IllegalArgumentException antes del try/catch interno
        // si JwtUtil no tiene guardia null/blank, este comportamiento es esperado
        try {
            boolean result = jwtUtil.isTokenValid("");
            assertThat(result).isFalse();
        } catch (IllegalArgumentException e) {
            // también es válido — jjwt rechaza string vacío
            assertThat(e.getMessage()).containsIgnoringCase("null or empty");
        }
    }
}