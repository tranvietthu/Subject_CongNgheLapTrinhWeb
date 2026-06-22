package com.example.studentmanagement.controller;

import com.example.studentmanagement.model.Student;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class StudentController {

    @GetMapping("/student/info") // 
    public String studentInfo(Model model) {
        // Tạo đối tượng sinh viên với thông tin đề bài yêu cầu
        Student student = new Student("Trần Viết Thụ", 20, "Công nghệ thông tin"); 
        
        // Truyền đối tượng này sang bên View với cái tên đại diện là "studentData"
        model.addAttribute("studentData", student);
        
        // Trỏ tới file HTML nằm tại: templates/student/info.html
        return "student/info"; 
    }
}