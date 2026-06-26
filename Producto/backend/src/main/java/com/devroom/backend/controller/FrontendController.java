package com.devroom.backend.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class FrontendController {

    /**
     * Sirve el index.html para todas las rutas que no sean API
     * Esto permite que React Router maneje el routing del lado del cliente
     */
    @GetMapping(value = {"/", "/{x:[\\w\\-]+}", "/{x:^(?!api).*$}/**"})
    public String index() {
        return "forward:/index.html";
    }
}

