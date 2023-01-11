package ru.kata.fetchapi.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.fetchapi.exception.UserAlreadyExistsException;
import ru.kata.fetchapi.model.Role;
import ru.kata.fetchapi.model.User;
import ru.kata.fetchapi.repository.RoleRepository;
import ru.kata.fetchapi.repository.UserRepository;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService, UserDetailsService {
    private UserRepository userRepository;
    private RoleRepository roleRepository;
    private PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository,
                           RoleRepository roleRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional(readOnly = true)
    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    @Override
    @Transactional
    public void save(User user) {
        String email = user.getEmail();

        if (userRepository.existsByUsername(email)) {
            throw new UserAlreadyExistsException("User with email " + email + " already registered.");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    @Transactional
    public User updateUser(User user) {
        String oldPassword = user.getPassword();
        user.setPassword(user.getPassword().isEmpty() ?
                findById(user.getId()).get().getPassword() :
                passwordEncoder.encode(user.getPassword()));
        user = userRepository.save(user);
        return user;
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> user = userRepository.findByEmail(username);

        if (user.isEmpty()) {
            throw new UsernameNotFoundException("Invalid username or password.");
        }

        return user.get();
    }
}
