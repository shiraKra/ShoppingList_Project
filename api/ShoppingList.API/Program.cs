using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Text.Json;

namespace ShoppingList.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // 1. הגדרת CORS - מאפשר לאנגולר לגשת לשרת ללא חסימות דפדפן
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAngular", policy =>
                {
                    policy.AllowAnyOrigin()
                          .AllowAnyMethod()
                          .AllowAnyHeader();
                });
            });

            // 2. הגדרת בקרים עם שמירה על שמות השדות בדיוק כמו ב-SQL (PascalCase)
            builder.Services.AddControllers()
                .AddJsonOptions(options =>
                {
                    // מונע מהשרת להפוך ItemName ל-itemName
                    options.JsonSerializerOptions.PropertyNamingPolicy = null;
                    // מבטיח שה-JSON יהיה קריא ותקין
                    options.JsonSerializerOptions.DictionaryKeyPolicy = null;
                });

            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            // --- סדר ה-Middleware קריטי לפתרון שגיאות Preflight ---

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Shopping List API V1");
                    c.RoutePrefix = "swagger";
                });
            }

            // הפעלת ה-CORS חייבת להיות כאן, לפני הניתוב והבקרים
            app.UseCors("AllowAngular");

            // הערה: UseRouting נקרא אוטומטית אם לא מציינים אותו, 
            // אבל app.UseCors חייב לבוא לפני app.MapControllers

            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}