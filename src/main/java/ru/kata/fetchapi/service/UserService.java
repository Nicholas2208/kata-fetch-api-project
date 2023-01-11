package ru.kata.fetchapi.service;

import ru.kata.fetchapi.model.Role;
import ru.kata.fetchapi.model.User;

import java.util.List;
import java.util.Optional;

public interface UserService {
    List<User> findAllUsers();
    void save(User user);

    Optional<User> findById(Long id);

    User updateUser(User user);

    void deleteUser(Long id);

}
