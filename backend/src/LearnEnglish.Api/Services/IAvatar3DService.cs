using LearnEnglish.Api.DTOs;

namespace LearnEnglish.Api.Services;

public interface IAvatar3DService
{
    Task<Manifest3DDto> GetManifestAsync();
    Task<UserAvatar3DConfigDto> GetEquippedAsync(Guid userId);
    Task<UserAvatar3DConfigDto> EquipAsync(Guid userId, string slot, string itemId);
    Task<List<AvatarPreset3DDto>> GetPresetsAsync(Guid userId);
    Task<AvatarPreset3DDto> SavePresetAsync(Guid userId, SavePreset3DRequest request);
    Task<UserAvatar3DConfigDto> ApplyPresetAsync(Guid userId, Guid presetId);
    Task<ActiveCharacterDto> GetActiveCharacterAsync(Guid userId);
    Task<ActiveCharacterDto> SwitchActiveCharacterAsync(Guid userId, string gender);
}
