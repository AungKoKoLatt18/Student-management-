package com.example.crudStringBootDemo.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be 2 to 100 characters")
    @Pattern(regexp = "^[\\p{L} .'-]+$", message = "Name contains invalid characters")
    private String name;

    @Min(value = 5, message = "Age must be at least 5")
    @Max(value = 100, message = "Age must be at most 100")
    private int age;

    @NotBlank(message = "Email is required")
    @Email(message = "Enter a valid email")
    private String email;

    @Min(value = 1, message = "Roll number must be at least 1")
    private int rollNo;

    @Min(value = 1, message = "Select a year")
    @Max(value = 4, message = "Year must be 1 to 4")
    @Column(name = "academic_year")
    private int year;

    @Min(value = 1, message = "Select a semester")
    @Max(value = 2, message = "Semester must be 1 or 2")
    private int semester;

    @NotEmpty(message = "Select at least one subject")
    @Size(max = 8, message = "A semester has only 8 subjects")
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "student_subjects", joinColumns = @JoinColumn(name = "student_id"))
    @Column(name = "subject", length = 100)
    private List<String> subjects = new ArrayList<>();
}