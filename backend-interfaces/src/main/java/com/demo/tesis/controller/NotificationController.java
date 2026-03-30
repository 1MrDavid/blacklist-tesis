package com.demo.tesis.controller;

import com.demo.tesis.dto.NotificacionDTO;
import com.demo.tesis.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
@RequiredArgsConstructor
@RequestMapping("/api/v1/not")
@Slf4j
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping
    public ResponseEntity<NotificacionDTO> crearPago(@RequestBody NotificacionDTO pago) {

        log.info("Pago móvil recibido: {}", pago);

        // Guardar en BD
        NotificacionDTO createdNotification = notificationService.createNotification(pago);

        return ResponseEntity.status(201).body(createdNotification);
    }
}
