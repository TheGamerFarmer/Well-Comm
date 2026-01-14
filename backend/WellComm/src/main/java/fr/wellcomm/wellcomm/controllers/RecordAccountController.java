package fr.wellcomm.wellcomm.controllers;

import fr.wellcomm.wellcomm.services.RecordAccountService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/{userName}/recordsaccount")
@AllArgsConstructor
public class RecordAccountController {
    private final RecordAccountService recordAccountService;

}