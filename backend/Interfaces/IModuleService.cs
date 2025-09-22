using didaktos.backend.Models.DTOs;

namespace didaktos.backend.Interfaces
{
    public interface IModuleService
    {
        Task<HttpResponseDto<List<ModuleDto>>> GetCourseModulesAsync(Guid courseId, Guid userId);
        Task<HttpResponseDto<ModuleDto>> CreateModuleAsync(
            Guid courseId,
            CreateModuleRequestDto request,
            Guid userId
        );
    }
}
