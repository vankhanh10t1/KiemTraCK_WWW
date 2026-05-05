package com.example.__lequanghuy_22711831.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/uploads")
@RequiredArgsConstructor
public class UploadController {
    @PostMapping
    public Map<String, String> upload(@RequestParam MultipartFile file) throws IOException {
        var folder = Path.of("uploads");
        Files.createDirectories(folder);

        var originalName = file.getOriginalFilename() == null ? "image.jpg" : file.getOriginalFilename();
        var extension = originalName.contains(".") ? originalName.substring(originalName.lastIndexOf(".")) : ".jpg";
        var fileName = UUID.randomUUID() + extension;

        file.transferTo(folder.resolve(fileName));
        return Map.of("url", "http://localhost:8080/uploads/" + fileName);
    }
}
