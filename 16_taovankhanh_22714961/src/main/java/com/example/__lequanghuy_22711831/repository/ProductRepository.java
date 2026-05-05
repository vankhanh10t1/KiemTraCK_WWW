package com.example.__taovankhanh_22714961.repository;

import com.example.__taovankhanh_22714961.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByNameContainingIgnoreCase(String keyword);
}
