package com.demo.tesis.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "whitelist")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Whitelist {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(name = "fecha_registro", nullable = false)
    private String fechaRegistro;

    private String documento;
    private String nombre;
    private String ip;

    @Column(name = "usuario_registro", nullable = false)
    private String usuarioRegistro;
}