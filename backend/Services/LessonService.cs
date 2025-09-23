using didaktos.backend.Interfaces;
using didaktos.backend.Models;
using didaktos.backend.Models.DTOs;

namespace didaktos.backend.Services
{
    public class LessonService : ILessonService
    {
        private readonly ILessonRepository _lessonRepository;
        private readonly IModuleRepository _moduleRepository;
        private readonly ICourseRepository _courseRepository;

        public LessonService(
            ILessonRepository lessonRepository,
            IModuleRepository moduleRepository,
            ICourseRepository courseRepository
        )
        {
            _lessonRepository = lessonRepository;
            _moduleRepository = moduleRepository;
            _courseRepository = courseRepository;
        }

        public async Task<HttpResponseDto<object>> GetModuleLessonsAsync(Guid moduleId, Guid userId)
        {
            try
            {
                // Check if module exists
                if (!await _moduleRepository.ModuleExistsAsync(moduleId))
                {
                    return new HttpResponseDto<object>
                    {
                        Success = false,
                        Message = "Module not found",
                    };
                }

                // Get course ID and check permissions
                var courseId = await _moduleRepository.GetModuleCourseIdAsync(moduleId);
                var isInstructor = await _courseRepository.IsUserInstructorOfCourseAsync(
                    userId,
                    courseId
                );
                var isEnrolled = await _courseRepository.IsUserEnrolledInCourseAsync(
                    userId,
                    courseId
                );

                if (!isInstructor && !isEnrolled)
                {
                    return new HttpResponseDto<object>
                    {
                        Success = false,
                        Message = "Access denied to this module",
                    };
                }

                var lessons = await _lessonRepository.GetModuleLessonsAsync(moduleId);

                var lessonDtos = lessons
                    .Select(l => new LessonDto
                    {
                        Id = l.Id,
                        Title = l.Title,
                        Content = l.Content,
                        ModuleId = l.ModuleId,
                    })
                    .ToList();

                return new HttpResponseDto<object>
                {
                    Success = true,
                    Message = $"Retrieved {lessonDtos.Count} lessons for module",
                    Data = lessonDtos,
                    Errors = null,
                };
            }
            catch (Exception ex)
            {
                return new HttpResponseDto<object>
                {
                    Success = false,
                    Message = "Failed to retrieve module lessons",
                    Errors = new { exception = ex.Message },
                };
            }
        }

        public async Task<HttpResponseDto<LessonDto>> CreateLessonAsync(
            Guid moduleId,
            CreateLessonRequestDto request,
            Guid userId
        )
        {
            try
            {
                // Check if module exists
                if (!await _moduleRepository.ModuleExistsAsync(moduleId))
                {
                    return new HttpResponseDto<LessonDto>
                    {
                        Success = false,
                        Message = "Module not found",
                    };
                }

                // Get course ID and check if user is instructor
                var courseId = await _moduleRepository.GetModuleCourseIdAsync(moduleId);
                if (!await _courseRepository.IsUserInstructorOfCourseAsync(userId, courseId))
                {
                    return new HttpResponseDto<LessonDto>
                    {
                        Success = false,
                        Message = "Access denied. Only course instructors can create lessons",
                    };
                }

                var lesson = new Lesson
                {
                    Id = Guid.NewGuid(),
                    Title = request.Title,
                    Content = request.Content,
                    ModuleId = moduleId,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                };

                var createdLesson = await _lessonRepository.CreateLessonAsync(lesson);

                var lessonDto = new LessonDto
                {
                    Id = createdLesson.Id,
                    Title = createdLesson.Title,
                    Content = createdLesson.Content,
                    ModuleId = createdLesson.ModuleId,
                };

                return new HttpResponseDto<LessonDto>
                {
                    Success = true,
                    Message = "Lesson created successfully",
                    Data = lessonDto,
                };
            }
            catch (Exception ex)
            {
                return new HttpResponseDto<LessonDto>
                {
                    Success = false,
                    Message = "Failed to create lesson",
                    Errors = new { exception = ex.Message },
                };
            }
        }

        public async Task<HttpResponseDto<LessonResponseDto>> UpdateLessonAsync(
            Guid lessonId,
            UpdateLessonRequestDto request,
            Guid userId
        )
        {
            try
            {
                // Check if lesson exists
                var existingLesson = await _lessonRepository.GetLessonByIdAsync(lessonId);
                if (existingLesson == null)
                {
                    return new HttpResponseDto<LessonResponseDto>
                    {
                        Success = false,
                        Message = "Lesson not found",
                    };
                }

                // Get course ID and check permissions
                var moduleId = existingLesson.ModuleId;
                var courseId = await _moduleRepository.GetModuleCourseIdAsync(moduleId);

                if (!await _courseRepository.IsUserInstructorOfCourseAsync(userId, courseId))
                {
                    return new HttpResponseDto<LessonResponseDto>
                    {
                        Success = false,
                        Message = "Access denied. Only course instructors can update lessons",
                    };
                }

                // Update lesson
                existingLesson.Title = request.Title;
                existingLesson.Content = request.Content;
                existingLesson.UpdatedAt = DateTime.UtcNow;

                var updatedLesson = await _lessonRepository.UpdateLessonAsync(existingLesson);

                var lessonResponseDto = new LessonResponseDto
                {
                    Id = updatedLesson.Id,
                    Title = updatedLesson.Title,
                    Content = updatedLesson.Content,
                    ModuleId = updatedLesson.ModuleId,
                    UpdatedAt = updatedLesson.UpdatedAt,
                };

                return new HttpResponseDto<LessonResponseDto>
                {
                    Success = true,
                    Message = "Lesson updated successfully",
                    Data = lessonResponseDto,
                };
            }
            catch (Exception ex)
            {
                return new HttpResponseDto<LessonResponseDto>
                {
                    Success = false,
                    Message = "Failed to update lesson",
                    Errors = new { exception = ex.Message },
                };
            }
        }

        public async Task<HttpResponseDto<object>> DeleteLessonAsync(Guid lessonId, Guid userId)
        {
            try
            {
                // Check if lesson exists
                var existingLesson = await _lessonRepository.GetLessonByIdAsync(lessonId);
                if (existingLesson == null)
                {
                    return new HttpResponseDto<object>
                    {
                        Success = false,
                        Message = "Lesson not found",
                    };
                }

                // Get course ID and check permissions
                var moduleId = existingLesson.ModuleId;
                var courseId = await _moduleRepository.GetModuleCourseIdAsync(moduleId);

                if (!await _courseRepository.IsUserInstructorOfCourseAsync(userId, courseId))
                {
                    return new HttpResponseDto<object>
                    {
                        Success = false,
                        Message = "Access denied. Only course instructors can delete lessons",
                    };
                }

                var deleted = await _lessonRepository.DeleteLessonAsync(lessonId);

                if (!deleted)
                {
                    return new HttpResponseDto<object>
                    {
                        Success = false,
                        Message = "Failed to delete lesson",
                    };
                }

                return new HttpResponseDto<object>
                {
                    Success = true,
                    Message = "Lesson deleted successfully",
                };
            }
            catch (Exception ex)
            {
                return new HttpResponseDto<object>
                {
                    Success = false,
                    Message = "Failed to delete lesson",
                    Errors = new { exception = ex.Message },
                };
            }
        }
    }
}
