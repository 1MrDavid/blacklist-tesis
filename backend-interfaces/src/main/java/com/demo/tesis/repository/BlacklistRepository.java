package com.demo.tesis.repository;

import com.demo.tesis.model.Blacklist;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BlacklistRepository extends JpaRepository<Blacklist, Long> {
    boolean existsByDocumento(String documento);
    // boolean existsByIp(String ip); // Descomenta si pasas la IP desde el FrontEnd
}