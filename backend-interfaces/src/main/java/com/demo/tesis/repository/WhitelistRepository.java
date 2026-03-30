package com.demo.tesis.repository;

import com.demo.tesis.model.Whitelist;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WhitelistRepository extends JpaRepository<Whitelist, Long> {
    boolean existsByDocumento(String documento);
}