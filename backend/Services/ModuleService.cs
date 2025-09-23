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

        public async Task<HttpResponseDto<object>> GetCourseModulesAsync(Guid courseId, Guid userId)
        {
            try
            {
                // Check if course exists
                if (!await _courseRepository.CourseExistsAsync(courseId))
                {
                    return new HttpResponseDto<object>
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
                    return new HttpResponseDto<object>
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

                return new HttpResponseDto<object>
                {
                    Success = true,
                    Message = $"Retrieved {moduleDtos.Count} modules for course",
                    Data = new { modules = moduleDtos },
                    Errors = null,
                };
            }
            catch (Exception ex)
            {
                return new HttpResponseDto<object>
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

        public async Task<HttpResponseDto<ModuleResponseDto>> UpdateModuleAsync(
            Guid moduleId,
            UpdateModuleRequestDto request,
            Guid userId
        )
        {
            try
            {
                var existingModule = await _moduleRepository.GetModuleByIdAsync(moduleId);
                if (existingModule == null)
                {
                    return new HttpResponseDto<ModuleResponseDto>
                    {
                        Success = false,
                        Message = "Module not found",
                    };
                }

                var courseId = await _moduleRepository.GetModuleCourseIdAsync(moduleId);

                if (!await _courseRepository.IsUserInstructorOfCourseAsync(userId, courseId))
                {
                    return new HttpResponseDto<ModuleResponseDto>
                    {
                        Success = false,
                        Message = "Access denied. Only course instructors can update modules",
                    };
                }

                existingModule.Title = request.Title;
                existingModule.UpdatedAt = DateTime.UtcNow;

                var updatedModule = await _moduleRepository.UpdateModuleAsync(existingModule);

                var moduleDto = new ModuleResponseDto
                {
                    Id = updatedModule.Id,
                    Title = updatedModule.Title,
                    CourseId = updatedModule.CourseId,
                    UpdatedAt = updatedModule.UpdatedAt,
                };

                return new HttpResponseDto<ModuleResponseDto>
                {
                    Success = true,
                    Message = "Module updated successfully",
                    Data = moduleDto,
                };
            }
            catch (Exception ex)
            {
                return new HttpResponseDto<ModuleResponseDto>
                {
                    Success = false,
                    Message = "Failed to update module",
                    Errors = new { exception = ex.Message },
                };
            }
        }

        public async Task<HttpResponseDto<object>> DeleteModuleAsync(Guid moduleId, Guid userId)
        {
            try
            {
                var existingModule = await _moduleRepository.GetModuleByIdAsync(moduleId);
                if (existingModule == null)
                {
                    return new HttpResponseDto<object>
                    {
                        Success = false,
                        Message = "Module not found",
                    };
                }

                var courseId = await _moduleRepository.GetModuleCourseIdAsync(moduleId);

                if (!await _courseRepository.IsUserInstructorOfCourseAsync(userId, courseId))
                {
                    return new HttpResponseDto<object>
                    {
                        Success = false,
                        Message = "Access denied. Only course owners can delete modules",
                    };
                }

                var deleted = await _moduleRepository.DeleteModuleAsync(moduleId);

                if (!deleted)
                {
                    return new HttpResponseDto<object>
                    {
                        Success = false,
                        Message = "Failed to delete module",
                    };
                }

                return new HttpResponseDto<object>
                {
                    Success = true,
                    Message = "Module deleted successfully",
                };
            }
            catch (Exception ex)
            {
                return new HttpResponseDto<object>
                {
                    Success = false,
                    Message = "Failed to delete module",
                    Errors = new { exception = ex.Message },
                };
            }
        }
    }
}
