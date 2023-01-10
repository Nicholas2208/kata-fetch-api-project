package ru.kata.fetchapi.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.kata.fetchapi.exception.UserNotFoundException;
import ru.kata.fetchapi.model.Role;
import ru.kata.fetchapi.model.User;
import ru.kata.fetchapi.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ApplicationRestController {
    private UserService userService;

    public ApplicationRestController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users")
    public List<User> findAllUsers() {
        return userService.findAllUsers();
    }

    @GetMapping("/roles")
    public List<Role> findRoles() {
        return userService.findRoles();
    }

    @PostMapping("/users")
    public ResponseEntity<User> create(@Valid @RequestBody User user) {
        userService.save(user);

        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping("/users/{id}")
    public User findById(@PathVariable Long id) throws UserNotFoundException {
        return userService.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
    }

    @PutMapping("/users")
    public ResponseEntity<User> update(@Valid @RequestBody User user) {

        return ResponseEntity.ok(userService.updateUser(user));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.deleteUser(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
