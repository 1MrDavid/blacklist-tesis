package com.demo.tesis.controller;

import com.demo.tesis.model.Whitelist;
import com.demo.tesis.service.WhitelistService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175"})
@RequiredArgsConstructor
@RequestMapping("/api/v1/whitelist")
@Slf4j
public class WhitelistController {

    private final WhitelistService whitelistService;

    @GetMapping
    public ResponseEntity<List<Whitelist>> getWhitelist() {
        log.info("Consultando registros de la Lista Blanca");
        List<Whitelist> records = whitelistService.getAllWhitelist();
        return ResponseEntity.ok(records);
    }

    @PostMapping
    public ResponseEntity<Whitelist> createWhitelist(@RequestBody Whitelist whitelist) {
        return ResponseEntity.ok(whitelistService.saveWhitelist(whitelist));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWhitelist(@PathVariable Long id) {
        whitelistService.deleteWhitelist(id);
        return ResponseEntity.noContent().build();
    }
}