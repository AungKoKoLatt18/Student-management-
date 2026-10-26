package com.example.crudStringBootDemo.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.crudStringBootDemo.util.Curriculum;

@RestController
@RequestMapping("/api/curriculum")
public class CurriculumController {

    @GetMapping
    public Map<Integer, Map<Integer, List<String>>> getCurriculum() {
        return Curriculum.all();
    }
}