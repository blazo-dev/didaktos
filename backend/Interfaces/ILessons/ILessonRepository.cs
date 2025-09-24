using didaktos.backend.Models;

namespace didaktos.backend.Interfaces
{
    public interface ILessonRepository
    {
        Task<List<Lesson>> GetModuleLessonsAsync(Guid moduleId);
        Task<Lesson> CreateLessonAsync(Lesson lesson);
        Task<Lesson?> GetLessonByIdAsync(Guid lessonId);
        Task<bool> LessonExistsAsync(Guid lessonId);
        Task<Guid> GetLessonModuleIdAsync(Guid lessonId);
        Task<Lesson> UpdateLessonAsync(Lesson lesson);
        Task<bool> DeleteLessonAsync(Guid lessonId);
    }
}
