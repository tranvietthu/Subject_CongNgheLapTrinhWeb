package com.example.studentmanagement.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/product")
public class ProductController {

    // 1. Sử dụng @PathVariable cho /product/detail/{id}
    @GetMapping("/detail/{id}")
    @ResponseBody
    public String productDetail(@PathVariable("id") String id) {
        // Kiểm tra xem id có phải là số hợp lệ không
        try {
            int intId = Integer.parseInt(id);
            if (intId <= 0) {
                return "Lỗi: ID sản phẩm phải lớn hơn 0!"; // 
            }
            return "Product ID = " + intId; // 
        } catch (NumberFormatException e) {
            return "Lỗi: ID sản phẩm không hợp lệ (Phải là một số nguyên)!"; // 
        }
    }

    // 2. Sử dụng @RequestParam cho /product/category?name=...
    @GetMapping("/category")
    @ResponseBody
    public String productCategory(@RequestParam(value = "name", required = false) String name) {
        // Kiểm tra nếu thiếu dữ liệu tham số 'name'
        if (name == null || name.trim().isEmpty()) {
            return "Lỗi: Vui lòng cung cấp tên danh mục (?name=...)!"; // 
        }
        return "Category = " + name; // 
    }
}