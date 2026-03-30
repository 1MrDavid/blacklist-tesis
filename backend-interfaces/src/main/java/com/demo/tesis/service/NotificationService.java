package com.demo.tesis.service;

import com.demo.tesis.dto.NotificacionDTO;
import com.demo.tesis.exception.BlockedTransactionException;
import com.demo.tesis.model.Blacklist;
import com.demo.tesis.model.Notification;
import com.demo.tesis.repository.BlacklistRepository;
import com.demo.tesis.repository.NotificationRepository;
import com.demo.tesis.repository.WhitelistRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@AllArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final BlacklistRepository blacklistRepository;
    private final WhitelistRepository whitelistRepository;

    // Límite quemado para la simulación (ej. 10,000 Bs)
    private static final BigDecimal LIMITE_TRANSACCION = new BigDecimal("10000.00");

    public NotificacionDTO createNotification(NotificacionDTO request) {
        log.info("Iniciando validación antifraude para transacción");

        String cedulaOrigen = request.cedulaOrigen();

        log.info("Cedula origen: {}", request.cedulaOrigen());

        // 1. Si está en Lista Blanca, omitimos las reglas estrictas
        boolean isWhitelisted = whitelistRepository.existsByDocumento(cedulaOrigen);

        if (!isWhitelisted) {
            // 2. Validar Lista Negra el usuario origen
            if (blacklistRepository.existsByDocumento(cedulaOrigen)) {
                log.warn("Transacción bloqueada: Usuario {} en lista negra", cedulaOrigen);
                throw new BlockedTransactionException("El usuario se encuentra en la Lista Negra.");
            }

            // Valida Lista Negra el usuario destino
            if (blacklistRepository.existsByDocumento(request.cedulaDestino())) {
                log.warn("Transacción bloqueada: Usuario {} en lista negra", request.cedulaDestino());
                // Propaga lista negra al usuario origen
                agregarListaNegra(request);
                throw new BlockedTransactionException("El usuario se encuentra en la Lista Negra.");
            }

            // 3. Validar Monto (Simulación de regla de fraude)
            BigDecimal montoTransaccion = new BigDecimal(request.monto().replace(",", ".")); // Asegurar formato

            if (montoTransaccion.compareTo(LIMITE_TRANSACCION) > 0) {
                log.warn("Alerta de fraude: Monto excede el límite. Agregando a lista negra.");

                // Agregar a Lista Negra automáticamente
                agregarListaNegra(request);

                throw new BlockedTransactionException("Transacción declinada por seguridad. Monto excede el límite permitido. Usuario bloqueado.");
            }
        } else {
            log.info("Usuario en Lista Blanca. Omitiendo validaciones de límite.");
        }

        // 4. Si pasa todas las validaciones, procedemos a guardar (Procesar Pago)
        log.info("Validaciones superadas. Procesando pago...");

        Notification notification = new Notification();
        notification.setCodigo(request.codigo());
        notification.setFecha(request.fecha());
        notification.setHora(request.hora());
        notification.setCodigoMoneda(request.codigoMoneda());
        notification.setMonto(request.monto());
        notification.setTipo(request.tipo());
        notification.setReferenciaBancoOrigen(request.referenciaBancoOrigen());
        notification.setBancoOrigen(request.bancoOrigen());
        notification.setBancoDestino(request.bancoDestino());
        notification.setNumCliente(request.numCliente());
        notification.setCuentaOrigen(request.cuentaOrigen());
        notification.setCuentaDestino(request.cuentaDestino());
        notification.setIdComercio(request.idComercio());
        notification.setConcepto(request.concepto());

        notificationRepository.save(notification);

        return request;
    }

    private void agregarListaNegra(NotificacionDTO request) {
        Blacklist newBlacklistEntry = new Blacklist();
        newBlacklistEntry.setFechaRegistro(request.fecha());
        newBlacklistEntry.setHoraBloqueo(request.hora());
        newBlacklistEntry.setDocumento(request.cedulaOrigen());
        newBlacklistEntry.setNombre("USUARIO SIMULADO"); // En un caso real lo buscarías en BD
        newBlacklistEntry.setIp("127.0.0.1"); // Simulamos IP local
        newBlacklistEntry.setReferencia(request.referenciaBancoOrigen());
        newBlacklistEntry.setMotivoBloqueo("Exceso de límite permitido (" + LIMITE_TRANSACCION + ")");

        blacklistRepository.save(newBlacklistEntry);
    }
}

