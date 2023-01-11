package ru.kata.fetchapi.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.fetchapi.model.Role;
import ru.kata.fetchapi.repository.RoleRepository;

import java.util.List;

@Service
public class RoleServiceImpl implements RoleService{
    private RoleRepository roleRepository;

    public RoleServiceImpl(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }
}
