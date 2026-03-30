package com.demo.tesis.dto;

import jakarta.persistence.Column;

public record NotificacionDTO(
    String codigo,

    String fecha,

    String hora,

    String codigoMoneda,

    String monto,

    String tipo,

    String referenciaBancoOrigen,

    String bancoOrigen,

    String bancoDestino,

    String numCliente,

    String cuentaOrigen,

    String cuentaDestino,

    String idComercio,

    String concepto,

    String cedulaOrigen,

    String cedulaDestino
) {
}
