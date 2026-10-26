package com.example.crudStringBootDemo.util;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public final class Curriculum {

    private static final Map<Integer, Map<Integer, List<String>>> DATA = new LinkedHashMap<>();

    static {
        add(1, 1, "Engineering Mathematics I", "Engineering Physics", "Programming in C",
                "Basic Electrical Engineering", "Engineering Graphics", "Communication Skills",
                "Environmental Studies", "Workshop Practice");
        add(1, 2, "Engineering Mathematics II", "Engineering Chemistry", "Data Structures",
                "Digital Logic Design", "Object Oriented Programming", "Basic Electronics",
                "Professional Ethics", "Programming Lab");

        add(2, 1, "Discrete Mathematics", "Computer Organization", "Database Management Systems",
                "Design and Analysis of Algorithms", "Operating Systems", "Probability and Statistics",
                "Java Programming", "DBMS Lab");
        add(2, 2, "Computer Networks", "Software Engineering", "Theory of Computation",
                "Microprocessors", "Web Technologies", "Linux Administration",
                "Python Programming", "Networks Lab");

        add(3, 1, "Compiler Design", "Artificial Intelligence", "Machine Learning",
                "Cryptography", "Cloud Computing", "Data Mining",
                "Mobile App Development", "ML Lab");
        add(3, 2, "Big Data Analytics", "Information Security", "Computer Graphics",
                "Internet of Things", "DevOps", "Deep Learning",
                "Human Computer Interaction", "Mini Project");

        add(4, 1, "Distributed Systems", "Natural Language Processing", "Blockchain Technology",
                "Cyber Security", "Computer Vision", "Parallel Computing",
                "Quantum Computing Basics", "Project Phase I");
        add(4, 2, "Industrial Management", "Engineering Economics", "Robotics",
                "Data Visualization", "Software Testing", "Technical Seminar",
                "Internship", "Project Phase II");
    }

    private Curriculum() {}

    private static void add(int year, int sem, String... subjects) {
        DATA.computeIfAbsent(year, y -> new LinkedHashMap<>()).put(sem, List.of(subjects));
    }

    public static Map<Integer, Map<Integer, List<String>>> all() {
        return DATA;
    }

    public static boolean isValid(int year, int semester, String subject) {
        return DATA.getOrDefault(year, Map.of()).getOrDefault(semester, List.of()).contains(subject);
    }
    public static boolean allValid(int year, int semester, java.util.List<String> subjects) {
    if (subjects == null || subjects.isEmpty()) return false;
    List<String> offered = DATA.getOrDefault(year, Map.of()).getOrDefault(semester, List.of());
    return subjects.stream().distinct().count() == subjects.size()   // no duplicates
            && offered.containsAll(subjects);                        // all from this semester
}
}