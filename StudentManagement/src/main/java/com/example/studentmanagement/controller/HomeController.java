package com.example.studentmanagement.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/home") // Cấu hình đường dẫn gốc cho toàn bộ Controller này
public class HomeController {

    @GetMapping("/index")
    @ResponseBody
    public String index() {
        return "Welcome to Spring Boot";
    }

    @GetMapping("/about")
    @ResponseBody
    public String about() {
        return "Họ tên sinh viên: Trần Viết Thụ"; 
    }

    @GetMapping("/contact")
    @ResponseBody
    public String contact() {
        return "Email sinh viên: bcs240041@st.cmcu.edu.vn"; 
    }
}