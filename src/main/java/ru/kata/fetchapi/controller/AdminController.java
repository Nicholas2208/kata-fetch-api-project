package ru.kata.fetchapi.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;
import ru.kata.fetchapi.service.RoleService;

@Controller
@RequestMapping("/admin")
public class AdminController {
    private RoleService roleService;

    public AdminController(RoleService roleService) {
        this.roleService = roleService;
    }

    @GetMapping("/")
    public ModelAndView getAllUsers() {
        var mav = new ModelAndView();
        mav.setViewName("admin");
        mav.addObject("allRoles", roleService.getAllRoles());

        return mav;
    }
}
