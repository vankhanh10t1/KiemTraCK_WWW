package com.example.__taovankhanh_22714961.controller;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record ProductRequest(
        @NotBlank(message = "Ten san pham khong duoc rong")
        String name,

        @NotNull(message = "Gia khong duoc rong")
        @Positive(message = "Gia phai lon hon 0")
        Double price,

        @NotNull(message = "So luong khong duoc rong")
        @Min(value = 0, message = "So luong phai lon hon hoac bang 0")
        Integer quantity,

        String description,
        String imageUrl,

        @NotNull(message = "Bat buoc chon danh muc")
        Long categoryId
) {
}
