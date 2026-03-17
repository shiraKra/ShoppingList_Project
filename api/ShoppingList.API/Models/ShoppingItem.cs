namespace ShoppingList.API.Models
{
    public class ShoppingItem
    {
        public int Id { get; set; }
        public string ItemName { get; set; } = string.Empty;
        public string? ItemDescription { get; set; }
        public string? CategoryName { get; set; }
        public string? StatusName { get; set; }
        public int CategoryId { get; set; }
        public int StatusId { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
