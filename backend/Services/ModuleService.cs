using didaktos.backend.Interfaces;
using didaktos.backend.Models;
using didaktos.backend.Models.DTOs;

namespace didaktos.backend.Services
{
    public class ModuleService : IModuleService
    {
        private readonly IModuleRepository _moduleRepository;
        private readonly ICourseRepository _courseRepository;

        public ModuleService(IModuleRepository moduleRepository, ICourseRepository courseRepository)
        {
            _moduleRepository = moduleRepository;
            _courseRepository = courseRepository;
        }

        public async Task<HttpResponseDto<List<ModuleDto>>> GetCourseModulesAsync(
            Guid courseId,
            Guid userId
        )
        {
            try
            {
                // Check if course exists
                if (!await _courseRepository.CourseExistsAsync(courseId))
                {
                    return new HttpResponseDto<List<ModuleDto>>
                    {
                        Success = false,
                        Message = "Course not found",
                    };
                }

                // Check if user has access to this course (either instructor or enrolled student)
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
                    return new HttpResponseDto<List<ModuleDto>>
                    {
                        Success = false,
                        Message = "Access denied to this course",
                    };
                }

                // Get modules for the course
                var modules = await _moduleRepository.GetCourseModulesAsync(courseId);

                var moduleDtos = modules
                    .Select(m => new ModuleDto
                    {
                        Id = m.Id,
                        Title = m.Title,
                        CourseId = m.CourseId,
                    })
                    .ToList();

                return new HttpResponseDto<List<ModuleDto>>
                {
                    Success = true,
                    Message = $"Retrieved {moduleDtos.Count} modules for course",
                    Data = moduleDtos,
                };
            }
            catch (Exception ex)
            {
                return new HttpResponseDto<List<ModuleDto>>
                {
                    Success = false,
                    Message = "Failed to retrieve course modules",
                    Errors = new { exception = ex.Message },
                };
            }
        }

        public async Task<HttpResponseDto<ModuleDto>> CreateModuleAsync(
            Guid courseId,
            CreateModuleRequestDto request,
            Guid userId
        )
        {
            try
            {
                // Check if course exists
                if (!await _courseRepository.CourseExistsAsync(courseId))
                {
                    return new HttpResponseDto<ModuleDto>
                    {
                        Success = false,
                        Message = "Course not found",
                    };
                }

                // Only instructors can create modules
                if (!await _courseRepository.IsUserInstructorOfCourseAsync(userId, courseId))
                {
                    return new HttpResponseDto<ModuleDto>
                    {
                        Success = false,
                        Message = "Access denied. Only course instructors can create modules",
                    };
                }

                // Create the module
                var module = new Module
                {
                    Id = Guid.NewGuid(),
                    Title = request.Title,
                    CourseId = courseId,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                };

                var createdModule = await _moduleRepository.CreateModuleAsync(module);

                var moduleDto = new ModuleDto
                {
                    Id = createdModule.Id,
                    Title = createdModule.Title,
                    CourseId = createdModule.CourseId,
                };

                return new HttpResponseDto<ModuleDto>
                {
                    Success = true,
                    Message = "Module created successfully",
                    Data = moduleDto,
                };
            }
            catch (Exception ex)
            {
                return new HttpResponseDto<ModuleDto>
                {
                    Success = false,
                    Message = "Failed to create module",
                    Errors = new { exception = ex.Message },
                };
            }
        }
    }
}
