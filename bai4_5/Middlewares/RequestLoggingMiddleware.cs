using Microsoft.AspNetCore.Http;
using System;
using System.Threading.Tasks;

namespace bai4_5.Middlewares
{
    public class RequestLoggingMiddleware
    {
        private readonly RequestDelegate _next;

        public RequestLoggingMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var time = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
            var method = context.Request.Method;
            var path = context.Request.Path.ToString();

            Console.WriteLine($"[{time}] Method: {method} - Path: {path}");

            if (path == "/Book/Detail/0" || path == "/Book/Detail/-1")
            {
                context.Response.StatusCode = 400;
                context.Response.ContentType = "text/plain; charset=utf-8";
                await context.Response.WriteAsync("Book id không hợp lệ");
                return;
            }

            await _next(context);

            Console.WriteLine($"Status Code: {context.Response.StatusCode}");
            Console.WriteLine(new string('-', 30));
        }
    }
}