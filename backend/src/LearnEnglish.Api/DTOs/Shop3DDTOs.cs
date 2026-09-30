namespace LearnEnglish.Api.DTOs;

public class Shop3DListResponse
{
    public List<AvatarItem3DDto> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public int UserTokenBalance { get; set; }
}

public class Purchase3DItemResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public int NewBalance { get; set; }
    public AvatarItem3DDto Item { get; set; } = null!;
    public UserAvatar3DConfigDto EquippedConfig { get; set; } = null!;
}
