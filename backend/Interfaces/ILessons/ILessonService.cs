using didaktos.backend.Models.DTOs;

namespace didaktos.backend.Interfaces
{
    public interface ILessonService
    {
        Task<HttpResponseDto<object>> GetModuleLessonsAsync(Guid moduleId, Guid userId);
        Task<HttpResponseDto<LessonDto>> CreateLessonAsync(
            Guid moduleId,
            CreateLessonRequestDto request,
            Guid userId
        );

        Task<HttpResponseDto<LessonResponseDto>> UpdateLessonAsync(
            Guid lessonId,
            UpdateLessonRequestDto request,
            Guid userId
        );
        Task<HttpResponseDto<object>> DeleteLessonAsync(Guid lessonId, Guid userId);
    }
}
