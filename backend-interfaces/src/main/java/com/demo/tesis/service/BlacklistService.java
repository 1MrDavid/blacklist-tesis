package com.demo.tesis.service;

import com.demo.tesis.model.Blacklist;
import com.demo.tesis.repository.BlacklistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BlacklistService {

    private final BlacklistRepository blacklistRepository;

    public List<Blacklist> getAllBlacklist() {
        return blacklistRepository.findAll();
    }

    public Blacklist saveBlacklist(Blacklist blacklist) {
        return blacklistRepository.save(blacklist);
    }

    public void deleteBlacklist(Long id) {
        blacklistRepository.deleteById(id);
    }
}