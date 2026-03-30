package com.demo.tesis.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "blacklist")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Blacklist {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(name = "fecha-registro", nullable = false)
    private String fechaRegistro;

    private String documento;

    private String nombre;

    private String ip;

    @Column(nullable = false)
    private String referencia;

    @Column(name = "hora-bloqueo", nullable = false)
    private String horaBloqueo;

    @Column(name = "motivo-bloqueo", nullable = false)
    private String motivoBloqueo;
}
