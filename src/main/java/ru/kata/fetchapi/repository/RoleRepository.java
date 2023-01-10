package ru.kata.fetchapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.kata.fetchapi.model.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {
}
