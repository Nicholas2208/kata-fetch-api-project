package ru.kata.fetchapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ru.kata.fetchapi.model.User;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    @Query("select u from User u join fetch u.roles where u.email = :email")
    Optional<User> findByEmail(String email);
    @Query("select case when count(c)> 0 then true else false end from User c where lower(c.email) like lower(:username)")
    boolean existsByUsername(String username);
}
