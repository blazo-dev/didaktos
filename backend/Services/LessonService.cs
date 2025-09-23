using didaktos.backend.Interfaces;
using didaktos.backend.Models.DTOs;

namespace didaktos.backend.Services
{
    public class LessonService : ILessonService
    {
        public Task<HttpResponseDto<List<LessonDto>>> GetModuleLessonsAsync(
            Guid moduleId,
            Guid userId
        )
        {
            // TODO: Implement when ready
            return Task.FromResult(
                new HttpResponseDto<List<LessonDto>>
                {
                    Success = false,
                    Message = "Lesson functionality not yet implemented",
                }
            );
        }

        public Task<HttpResponseDto<LessonDto>> CreateLessonAsync(
            Guid moduleId,
            CreateLessonRequestDto request,
            Guid userId
        )
        {
            // TODO: Implement when ready
            return Task.FromResult(
                new HttpResponseDto<LessonDto>
                {
                    Success = false,
                    Message = "Lesson functionality not yet implemented",
                }
            );
        }
    }
}
