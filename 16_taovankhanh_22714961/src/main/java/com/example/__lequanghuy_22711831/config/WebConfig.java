package com.example.__taovankhanh_22714961.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        var uploadDir = Path.of("uploads").toAbsolutePath().toUri().toString();
        registry.addResourceHandler("/uploads/**").addResourceLocations(uploadDir);
    }
}
