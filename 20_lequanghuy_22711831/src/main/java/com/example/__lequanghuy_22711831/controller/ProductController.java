package com.example.__lequanghuy_22711831.controller;

import com.example.__lequanghuy_22711831.entity.Product;
import com.example.__lequanghuy_22711831.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @GetMapping
    public List<Product> list(@RequestParam(required = false) String keyword) {
        return productService.findAll(keyword);
    }

    @GetMapping("/{id}")
    public Product detail(@PathVariable Long id) {
        return productService.findById(id);
    }
}
