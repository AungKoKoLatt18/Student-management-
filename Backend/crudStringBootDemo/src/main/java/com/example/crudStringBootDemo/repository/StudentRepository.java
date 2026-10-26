package com.example.crudStringBootDemo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.crudStringBootDemo.entity.Student;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    boolean existsByEmailIgnoreCase(String email);
    boolean existsByRollNo(int rollNo);
    boolean existsByEmailIgnoreCaseAndIdNot(String email, Long id);
    boolean existsByRollNoAndIdNot(int rollNo, Long id);
}