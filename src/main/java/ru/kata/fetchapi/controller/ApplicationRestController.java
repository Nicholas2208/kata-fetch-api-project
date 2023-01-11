package ru.kata.fetchapi.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.kata.fetchapi.exception.UserNotFoundException;
import ru.kata.fetchapi.model.Role;
import ru.kata.fetchapi.model.User;
import ru.kata.fetchapi.service.RoleService;
import ru.kata.fetchapi.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ApplicationRestController {
    private UserService userService;
    private RoleService roleService;

    public ApplicationRestController(UserService userService,
                                     RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> findAllUsers() {
        return ResponseEntity.ok(userService.findAllUsers());
    }

    @GetMapping("/roles")
    public ResponseEntity<Iterable<Role>> findRoles() {
        return ResponseEntity.ok(roleService.getAllRoles());
    }

    @PostMapping("/users")
    public ResponseEntity<User> create(@Valid @RequestBody User user) {
        userService.save(user);

        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> findById(@PathVariable Long id) throws UserNotFoundException {
        return ResponseEntity.ok(userService.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id)));
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
