package com.devroom.backend.controller;

import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.devroom.backend.dto.CvDTO;
import com.devroom.backend.security.JwtUtil;
import com.devroom.backend.service.CvService;

@RestController
@RequestMapping("/api/cv")
public class CvController {

    private final CvService cvService;
    private final JwtUtil jwtUtil;

    public CvController(CvService cvService, JwtUtil jwtUtil) {
        this.cvService = cvService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/me")
    public ResponseEntity<CvDTO> getMyCv(
            @RequestHeader("Authorization") String authHeader) {
        Long userId = jwtUtil.extractUserId(authHeader.replace("Bearer ", ""));
        return ResponseEntity.ok(cvService.getCurrentCvForUser(userId));
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportMyCv(
            @RequestHeader("Authorization") String authHeader) {

        Long userId = jwtUtil.extractUserId(authHeader.replace("Bearer ", ""));
        byte[] pdf = cvService.exportCvAsPdf(userId);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(
                ContentDisposition.attachment().filename("cv-devroom.pdf").build()
        );

        return new ResponseEntity<>(pdf, headers, HttpStatus.OK);
    }
}