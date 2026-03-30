package com.demo.tesis.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "notification")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(nullable = false)
    private String codigo;

    @Column(nullable = false)
    private String fecha;

    @Column(nullable = false)
    private String hora;

    @Column(name = "codigo-moneda", nullable = false)
    private String codigoMoneda;

    @Column(nullable = false)
    private String monto;

    @Column(nullable = false)
    private String tipo;

    @Column(name = "referencia-banco-origen", nullable = false)
    private String referenciaBancoOrigen;

    @Column(name = "banco-origen", nullable = false)
    private String bancoOrigen;

    @Column(name = "banco-destino", nullable = false)
    private String bancoDestino;

    @Column(name = "num-cliente", nullable = false)
    private String numCliente;

    @Column(name = "cuenta-origen", nullable = false)
    private String cuentaOrigen;

    @Column(name = "cuenta-destino", nullable = false)
    private String cuentaDestino;

    @Column(name = "id-comercio", nullable = false)
    private String idComercio;

    @Column(nullable = false)
    private String concepto;
}
