using didaktos.backend.Interfaces;
using didaktos.backend.Models;
using didaktos.backend.Models.DTOs;

namespace didaktos.backend.Services
{
    public class AssignmentService : IAssignmentService
    {
        private readonly IAssignmentRepository _assignmentRepository;
        private readonly IModuleRepository _moduleRepository;
        private readonly ICourseRepository _courseRepository;

        public AssignmentService(
            IAssignmentRepository assignmentRepository,
            IModuleRepository moduleRepository,
            ICourseRepository courseRepository
        )
        {
            _assignmentRepository = assignmentRepository;
            _moduleRepository = moduleRepository;
            _courseRepository = courseRepository;
        }

        public async Task<HttpResponseDto<object>> GetModuleAssignmentsAsync(
            Guid moduleId,
            Guid userId
        )
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

                // Pass the userId and isInstructor parameters
                var assignments =
                    await _assignmentRepository.GetModuleAssignmentsWithSubmissionsAsync(
                        moduleId,
                        userId,
                        isInstructor
                    );

                // Since the repository now returns AssignmentDto directly, you don't need to map again
                // Just return the assignments directly
                return new HttpResponseDto<object>
                {
                    Success = true,
                    Message = $"Retrieved {assignments.Count} assignments for module",
                    Data = assignments, // assignments is already List<AssignmentDto>
                    Errors = null,
                };
            }
            catch (Exception ex)
            {
                return new HttpResponseDto<object>
                {
                    Success = false,
                    Message = "Failed to retrieve module assignments",
                    Errors = new { exception = ex.Message },
                };
            }
        }

        public async Task<HttpResponseDto<AssignmentDto>> CreateAssignmentAsync(
            Guid moduleId,
            CreateAssignmentRequestDto request,
            Guid userId
        )
        {
            try
            {
                // Check if module exists
                if (!await _moduleRepository.ModuleExistsAsync(moduleId))
                {
                    return new HttpResponseDto<AssignmentDto>
                    {
                        Success = false,
                        Message = "Module not found",
                    };
                }

                // Get course ID and check if user is instructor
                var courseId = await _moduleRepository.GetModuleCourseIdAsync(moduleId);
                if (!await _courseRepository.IsUserInstructorOfCourseAsync(userId, courseId))
                {
                    return new HttpResponseDto<AssignmentDto>
                    {
                        Success = false,
                        Message = "Access denied. Only course instructors can create assignments",
                    };
                }

                var assignment = new Assignment
                {
                    Id = Guid.NewGuid(),
                    Title = request.Title,
                    Description = request.Description,
                    ModuleId = moduleId,
                    DueDate = request.DueDate,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                };

                var createdAssignment = await _assignmentRepository.CreateAssignmentAsync(
                    assignment
                );

                var assignmentDto = new AssignmentDto
                {
                    Id = createdAssignment.Id,
                    Title = createdAssignment.Title,
                    Description = createdAssignment.Description,
                    ModuleId = createdAssignment.ModuleId,
                    DueDate = createdAssignment.DueDate,
                };

                return new HttpResponseDto<AssignmentDto>
                {
                    Success = true,
                    Message = "Assignment created successfully",
                    Data = assignmentDto,
                };
            }
            catch (Exception ex)
            {
                return new HttpResponseDto<AssignmentDto>
                {
                    Success = false,
                    Message = "Failed to create assignment",
                    Errors = new { exception = ex.Message },
                };
            }
        }

        public async Task<HttpResponseDto<AssignmentResponseDto>> UpdateAssignmentAsync(
            Guid assignmentId,
            UpdateAssignmentRequestDto request,
            Guid userId
        )
        {
            try
            {
                // Check if assignment exists
                var existingAssignment = await _assignmentRepository.GetAssignmentByIdAsync(
                    assignmentId
                );
                if (existingAssignment == null)
                {
                    return new HttpResponseDto<AssignmentResponseDto>
                    {
                        Success = false,
                        Message = "Assignment not found",
                    };
                }

                // Get course ID and check permissions
                var moduleId = existingAssignment.ModuleId;
                var courseId = await _moduleRepository.GetModuleCourseIdAsync(moduleId);

                if (!await _courseRepository.IsUserInstructorOfCourseAsync(userId, courseId))
                {
                    return new HttpResponseDto<AssignmentResponseDto>
                    {
                        Success = false,
                        Message = "Access denied. Only course instructors can update assignments",
                    };
                }

                // Update assignment
                existingAssignment.Title = request.Title;
                existingAssignment.Description = request.Description;
                existingAssignment.DueDate = request.DueDate;
                existingAssignment.UpdatedAt = DateTime.UtcNow;

                var updatedAssignment = await _assignmentRepository.UpdateAssignmentAsync(
                    existingAssignment
                );

                var assignmentResponseDto = new AssignmentResponseDto
                {
                    Id = updatedAssignment.Id,
                    Title = updatedAssignment.Title,
                    Description = updatedAssignment.Description,
                    ModuleId = updatedAssignment.ModuleId,
                    UpdatedAt = updatedAssignment.UpdatedAt,
                    DueDate = updatedAssignment.DueDate,
                };

                return new HttpResponseDto<AssignmentResponseDto>
                {
                    Success = true,
                    Message = "Assignment updated successfully",
                    Data = assignmentResponseDto,
                };
            }
            catch (Exception ex)
            {
                return new HttpResponseDto<AssignmentResponseDto>
                {
                    Success = false,
                    Message = "Failed to update assignment",
                    Errors = new { exception = ex.Message },
                };
            }
        }

        public async Task<HttpResponseDto<object>> DeleteAssignmentAsync(
            Guid assignmentId,
            Guid userId
        )
        {
            try
            {
                // Check if assignment exists
                var existingAssignment = await _assignmentRepository.GetAssignmentByIdAsync(
                    assignmentId
                );
                if (existingAssignment == null)
                {
                    return new HttpResponseDto<object>
                    {
                        Success = false,
                        Message = "Assignment not found",
                    };
                }

                // Get course ID and check permissions
                var moduleId = existingAssignment.ModuleId;
                var courseId = await _moduleRepository.GetModuleCourseIdAsync(moduleId);

                if (!await _courseRepository.IsUserInstructorOfCourseAsync(userId, courseId))
                {
                    return new HttpResponseDto<object>
                    {
                        Success = false,
                        Message = "Access denied. Only course instructors can delete assignments",
                    };
                }

                var deleted = await _assignmentRepository.DeleteAssignmentAsync(assignmentId);

                if (!deleted)
                {
                    return new HttpResponseDto<object>
                    {
                        Success = false,
                        Message = "Failed to delete assignment",
                    };
                }

                return new HttpResponseDto<object>
                {
                    Success = true,
                    Message = "Assignment deleted successfully",
                };
            }
            catch (Exception ex)
            {
                return new HttpResponseDto<object>
                {
                    Success = false,
                    Message = "Failed to delete assignment",
                    Errors = new { exception = ex.Message },
                };
            }
        }
    }
}
