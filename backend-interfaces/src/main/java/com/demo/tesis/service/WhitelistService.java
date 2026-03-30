package com.demo.tesis.service;

import com.demo.tesis.model.Whitelist;
import com.demo.tesis.repository.WhitelistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WhitelistService {

    private final WhitelistRepository whitelistRepository;

    public List<Whitelist> getAllWhitelist() {
        return whitelistRepository.findAll();
    }

    public Whitelist saveWhitelist(Whitelist whitelist) {
        return whitelistRepository.save(whitelist);
    }

    public void deleteWhitelist(Long id) {
        whitelistRepository.deleteById(id);
    }
}