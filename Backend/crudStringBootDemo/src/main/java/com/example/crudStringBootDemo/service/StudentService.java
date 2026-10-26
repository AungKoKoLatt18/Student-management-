package com.example.crudStringBootDemo.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.crudStringBootDemo.entity.Student;
import com.example.crudStringBootDemo.exception.DuplicateFieldException;
import com.example.crudStringBootDemo.exception.InvalidFieldException;
import com.example.crudStringBootDemo.repository.StudentRepository;
import com.example.crudStringBootDemo.util.Curriculum;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public Student createStudent(Student student) {
        checkCurriculum(student);
        checkDuplicates(student, null);
        student.setId(null);
        return studentRepository.save(student);
    }

    public Optional<Student> getStudent(Long id) {
        return studentRepository.findById(id);
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Optional<Student> updateStudent(Long id, Student req) {
        return studentRepository.findById(id).map(existing -> {
            checkCurriculum(req);
            checkDuplicates(req, id);
            existing.setName(req.getName());
            existing.setAge(req.getAge());
            existing.setEmail(req.getEmail());
            existing.setRollNo(req.getRollNo());
            existing.setYear(req.getYear());
            existing.setSemester(req.getSemester());
            existing.getSubjects().clear();
            existing.getSubjects().addAll(req.getSubjects());
            return studentRepository.save(existing);
        });
    }

    public boolean deleteStudent(Long id) {
        if (!studentRepository.existsById(id)) {
            return false;
        }
        studentRepository.deleteById(id);
        return true;
    }

    private void checkCurriculum(Student s) {
    if (!Curriculum.allValid(s.getYear(), s.getSemester(), s.getSubjects())) {
        throw new InvalidFieldException(Map.of("subjects",
                "Subjects must be unique and all from the selected year and semester"));
    }
}

    private void checkDuplicates(Student s, Long id) {
        Map<String, String> errors = new HashMap<>();

        boolean emailTaken = (id == null)
                ? studentRepository.existsByEmailIgnoreCase(s.getEmail())
                : studentRepository.existsByEmailIgnoreCaseAndIdNot(s.getEmail(), id);
        if (emailTaken) errors.put("email", "This email is already registered");

        boolean rollTaken = (id == null)
                ? studentRepository.existsByRollNo(s.getRollNo())
                : studentRepository.existsByRollNoAndIdNot(s.getRollNo(), id);
        if (rollTaken) errors.put("rollNo", "This roll number is already used");

        if (!errors.isEmpty()) throw new DuplicateFieldException(errors);
    }
}