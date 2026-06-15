package com.devroom.backend.dto;

import lombok.Data;

@Data
public class UpdateUserDTO {
    private String name;
    private String bio;
    private String location;
    private String role;
}
