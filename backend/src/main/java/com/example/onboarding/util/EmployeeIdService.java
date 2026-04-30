package com.example.onboarding.util;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;

@Service
public class EmployeeIdService {

    private final JdbcTemplate jdbc;

    public EmployeeIdService(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @PostConstruct
    public void ensureSequence() {
        try {
            // Try standard H2/Postgres compatible sequence creation (IF NOT EXISTS supported by H2 and Postgres >=9.6)
            jdbc.execute("CREATE SEQUENCE IF NOT EXISTS employee_seq START WITH 1 INCREMENT BY 1");
        } catch (Exception ignored) {
            // If it fails, ignore; sequence might exist or DB doesn't support IF NOT EXISTS
            try {
                jdbc.execute("CREATE SEQUENCE employee_seq START WITH 1 INCREMENT BY 1");
            } catch (Exception e) {
                // last resort: ignore; nextVal queries will fail if sequence missing
            }
        }
    }

    public long nextSequence() {
        // Try Postgres style
        try {
            Long val = jdbc.queryForObject("SELECT nextval('employee_seq')", Long.class);
            if (val != null) return val;
        } catch (Exception ignored) {}

        // Try H2 style
        try {
            Long val = jdbc.queryForObject("SELECT NEXT VALUE FOR employee_seq", Long.class);
            if (val != null) return val;
        } catch (Exception ignored) {}

        // As fallback, try to insert into a helper table (not implemented) -> throw
        throw new RuntimeException("Could not obtain next employee sequence value from DB");
    }

    public String nextEmployeeId() {
        long seq = nextSequence();
        return String.format("EMP%03d", seq);
    }
}

