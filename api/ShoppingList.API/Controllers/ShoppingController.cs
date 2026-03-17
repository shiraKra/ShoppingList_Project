using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Dapper;
using System.Data;
using System.Text.Json;
using ShoppingList.API.Models;

namespace ShoppingList.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShoppingController : ControllerBase
    {
        private readonly IConfiguration _config;

        public ShoppingController(IConfiguration config)
        {
            _config = config;
        }

        [HttpPost("exec")]
        public async Task<ActionResult> ExecuteProcedure([FromBody] ExecRequest request)
        {
            try
            {
                using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));

                // ניקוי שם הפרוצדורה מסימני שאלה מיותרים
                string actualSpName = request.SpName.Split('?')[0];

                var dynamicParameters = new DynamicParameters();

                if (request.Params != null)
                {
                    foreach (var param in request.Params)
                    {
                        object value = param.Value;

                        if (param.Value is JsonElement element)
                        {
                            value = element.ValueKind switch
                            {
                                JsonValueKind.String => element.GetString(),
                                JsonValueKind.Number => element.TryGetInt32(out int intVal) ? intVal : element.GetDecimal(),
                                JsonValueKind.True => true,
                                JsonValueKind.False => false,
                                JsonValueKind.Null => null,
                                _ => element.ToString()
                            };
                        }

                        // הוספת @ לשם הפרמטר עבור SQL
                        dynamicParameters.Add("@" + param.Key, value);
                    }
                }

                // הרצה
                var result = await connection.QueryAsync(
                    actualSpName,
                    dynamicParameters,
                    commandType: CommandType.StoredProcedure);

                // מניעת Cache
                Response.Headers.Append("Cache-Control", "no-cache, no-store, must-revalidate");

                return Ok(result);
            }
            catch (Exception ex)
            {
                // כאן תראי ב-Visual Studio ב-Output Window את השגיאה המדויקת מה-SQL
                Console.WriteLine($"SQL Error in {request.SpName}: {ex.Message}");
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}