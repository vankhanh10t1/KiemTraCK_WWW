package com.example.__taovankhanh_22714961.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Ten san pham khong duoc rong")
    @Column(nullable = false)
    private String name;

    @NotNull(message = "Gia khong duoc rong")
    @Positive(message = "Gia phai lon hon 0")
    @Column(nullable = false)
    private Double price;

    @NotNull(message = "So luong khong duoc rong")
    @Min(value = 0, message = "So luong phai lon hon hoac bang 0")
    @Column(nullable = false)
    private Integer quantity;

    private String description;
    private String imageUrl;

    @NotNull(message = "Bat buoc chon danh muc")
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
}
