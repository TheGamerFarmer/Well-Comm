package fr.wellcomm.wellcomm.controllers;

import fr.wellcomm.wellcomm.entities.Record;
import fr.wellcomm.wellcomm.repositories.RecordAccountRepository;
import fr.wellcomm.wellcomm.services.RecordAccountService;
import fr.wellcomm.wellcomm.services.RecordService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/{userName}/recordsaccount")
@AllArgsConstructor
public class RecordAccountController {
    private final RecordAccountService recordAccountService;

}