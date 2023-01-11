package ru.kata.fetchapi.init;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import ru.kata.fetchapi.model.Role;
import ru.kata.fetchapi.model.User;
import ru.kata.fetchapi.repository.RoleRepository;
import ru.kata.fetchapi.repository.UserRepository;

import java.util.HashSet;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner loadData(RoleRepository roleRepository,
                               UserRepository userRepository,
                               PasswordEncoder passwordEncoder) {
        return args -> {
            Role roleAdmin = new Role("ROLE_ADMIN");
            Role roleUser = new Role("ROLE_USER");

            roleRepository.save(roleAdmin);
            roleRepository.save(roleUser);

            userRepository.save(new User("Nicholas", "White", (byte) 48, "nwhite@mail.ru",
                    passwordEncoder.encode("admin"),
                    new HashSet<>() {{
                        add(roleAdmin);
                        add(roleUser);
                    }}));

            userRepository.save(new User("Helen", "Petrovsky", (byte) 25, "helen@mail.com",
                    passwordEncoder.encode("helen"),
                    new HashSet<>() {{
                        add(roleUser);
                    }}));

            userRepository.save(new User("Arthur", "Peck", (byte) 35, "arthur@mail.com",
                    passwordEncoder.encode("arthur"),
                    new HashSet<>() {{
                        add(roleUser);
                    }}));
        };
    }
}
