using didaktos.backend.Models.DTOs;

namespace didaktos.backend.Interfaces
{
    public interface ILessonService
    {
        Task<HttpResponseDto<List<LessonDto>>> GetModuleLessonsAsync(Guid moduleId, Guid userId);
        Task<HttpResponseDto<LessonDto>> CreateLessonAsync(
            Guid moduleId,
            CreateLessonRequestDto request,
            Guid userId
        );
    }
}
