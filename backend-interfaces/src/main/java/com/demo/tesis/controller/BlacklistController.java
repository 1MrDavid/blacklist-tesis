package com.demo.tesis.controller;

import com.demo.tesis.model.Blacklist;
import com.demo.tesis.service.BlacklistService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175"})
@RequiredArgsConstructor
@RequestMapping("/api/v1/blacklist")
@Slf4j
public class BlacklistController {

    private final BlacklistService blacklistService;

    @GetMapping
    public ResponseEntity<List<Blacklist>> getBlacklist() {
        log.info("Consultando registros de la Lista Negra");
        List<Blacklist> records = blacklistService.getAllBlacklist();
        return ResponseEntity.ok(records);
    }

    @PostMapping
    public ResponseEntity<Blacklist> createBlacklist(@RequestBody Blacklist blacklist) {
        return ResponseEntity.ok(blacklistService.saveBlacklist(blacklist));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBlacklist(@PathVariable Long id) {
        blacklistService.deleteBlacklist(id);
        return ResponseEntity.noContent().build();
    }
}