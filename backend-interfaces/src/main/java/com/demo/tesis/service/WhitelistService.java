package com.demo.tesis.service;

import com.demo.tesis.model.Whitelist;
import com.demo.tesis.repository.BlacklistRepository;
import com.demo.tesis.repository.WhitelistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WhitelistService {

    private final WhitelistRepository whitelistRepository;
    private final BlacklistRepository blacklistRepository;

    public List<Whitelist> getAllWhitelist() {
        return whitelistRepository.findAll();
    }

    @Transactional
    public Whitelist saveWhitelist(Whitelist whitelist) {

        if (blacklistRepository.existsByDocumento(whitelist.getDocumento())) {
            blacklistRepository.deleteByDocumento(whitelist.getDocumento());
        }

        return whitelistRepository.save(whitelist);
    }

    public void deleteWhitelist(Long id) {
        whitelistRepository.deleteById(id);
    }
}