package fr.wellcomm.wellcomm.controllers;

import fr.wellcomm.wellcomm.repositories.RecordAccountRepository;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
public class RecordAccountController {
    private final RecordAccountRepository repository;
}