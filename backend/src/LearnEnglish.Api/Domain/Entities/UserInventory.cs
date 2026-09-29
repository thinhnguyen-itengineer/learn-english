namespace LearnEnglish.Api.Domain.Entities;

public class UserInventory
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public Guid ItemId { get; set; }

    public int TokenSpent { get; set; }
    public bool IsEquipped { get; set; } = false;
    public string AcquiredFrom { get; set; } = "shop_purchase";
    public DateTime AcquiredAt { get; set; } = DateTime.UtcNow;

    public UserProfile Profile { get; set; } = null!;
    public ShopItem Item { get; set; } = null!;
}
