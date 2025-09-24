using didaktos.backend.Models.DTOs;

namespace didaktos.backend.Interfaces
{
    public interface IModuleService
    {
        Task<HttpResponseDto<object>> GetCourseModulesAsync(Guid courseId, Guid userId);
        Task<HttpResponseDto<ModuleDto>> CreateModuleAsync(
            Guid courseId,
            CreateModuleRequestDto request,
            Guid userId
        );
        Task<HttpResponseDto<ModuleResponseDto>> UpdateModuleAsync(
            Guid moduleId,
            UpdateModuleRequestDto request,
            Guid userId
        );
        Task<HttpResponseDto<object>> DeleteModuleAsync(Guid moduleId, Guid userId);
    }
}
