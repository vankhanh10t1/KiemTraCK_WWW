package com.example.__taovankhanh_22714961.service;

import com.example.__taovankhanh_22714961.controller.ProductRequest;
import com.example.__taovankhanh_22714961.entity.Product;
import com.example.__taovankhanh_22714961.repository.CategoryRepository;
import com.example.__taovankhanh_22714961.repository.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public List<Product> findAll(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return productRepository.findAll();
        }
        return productRepository.findByNameContainingIgnoreCase(keyword.trim());
    }

    public Product findById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Khong tim thay san pham"));
    }

    public Product create(ProductRequest request) {
        return productRepository.save(fill(new Product(), request));
    }

    public Product update(Long id, ProductRequest request) {
        return productRepository.save(fill(findById(id), request));
    }

    public void delete(Long id) {
        productRepository.delete(findById(id));
    }

    private Product fill(Product product, ProductRequest request) {
        var category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new EntityNotFoundException("Khong tim thay danh muc"));

        product.setName(request.name());
        product.setPrice(request.price());
        product.setQuantity(request.quantity());
        product.setDescription(request.description());
        product.setImageUrl(request.imageUrl());
        product.setCategory(category);
        return product;
    }
}
