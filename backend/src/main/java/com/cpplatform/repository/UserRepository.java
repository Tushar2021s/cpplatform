package com.cpplatform.repository;

import com.cpplatform.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

// JpaRepository<User, Long> means:
// - this repo works with the User entity
// - the primary key type is Long
public interface UserRepository extends JpaRepository<User, Long> {

    // Spring generates: SELECT * FROM users WHERE email = ?
    Optional<User> findByEmail(String email);

    // Spring generates: SELECT * FROM users WHERE google_id = ?
    Optional<User> findByGoogleId(String googleId);

    // Spring generates: SELECT * FROM users WHERE codeforces_handle = ?
    Optional<User> findByCodeforcesHandle(String handle);
}