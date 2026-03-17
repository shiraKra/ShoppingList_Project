namespace ShoppingList.API.Models
{
    public class ExecRequest
    {
        public string SpName { get; set; } 
        public Dictionary<string, object>? Params { get; set; }
    }
}
