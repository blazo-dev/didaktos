using didaktos.backend.Interfaces;
using didaktos.backend.Models;
using didaktos.backend.Models.DTOs;

namespace didaktos.backend.Services
{
    public class EnrollmentService : IEnrollmentService
    {
        private readonly IEnrollmentRepository _enrollmentRepository;

        public EnrollmentService(IEnrollmentRepository enrollmentRepository)
        {
            _enrollmentRepository = enrollmentRepository;
        }

        public async Task<HttpResponseDto<object>> CreateEnrollmentAsync(
            EnrollmentAddRequestDto request
        )
        {
            try
            {
                var enrollment = new Enrollment
                {
                    Id = Guid.NewGuid(),
                    Status = "enrolled",
                    StudentId = request.StudentId,
                    CourseId = request.CourseId,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                };

                var createdEnrollment = await _enrollmentRepository.InsertEnrollmentAsync(
                    enrollment
                );

                return new HttpResponseDto<object>
                {
                    Success = true,
                    Message = "Enrollment successfull",
                    Data = new EnrollmentAddResponseDto
                    {
                        Id = createdEnrollment.Id,
                        StudentId = createdEnrollment.StudentId,
                        CourseId = createdEnrollment.CourseId,
                        Status = createdEnrollment.Status,
                    },
                };
            }
            catch (Exception ex)
            {
                return new HttpResponseDto<object>
                {
                    Success = false,
                    Message = "Enrollment failed",
                    Errors = new { exception = ex.Message },
                };
            }
        }

        public async Task<HttpResponseDto<object>> GetEnrollmentsAsync(Guid userId)
        {
            try
            {
                var enrollments = await _enrollmentRepository.SelectEnrollmentByIdAsync(userId);

                return new HttpResponseDto<object>
                {
                    Success = true,
                    Message = "Enrollments retrieved successfully",
                    Data = enrollments,
                };
            }
            catch (Exception ex)
            {
                return new HttpResponseDto<object>
                {
                    Success = false,
                    Message = "Retrieval of enrollments failed",
                    Errors = new { exception = ex.Message },
                };
            }
        }

        public async Task<HttpResponseDto<object>> CloseEnrollmentsAsync(Guid CourseId, Guid UserId)
        {
            try
            {
                var existingModule = await _enrollmentRepository.IsUserEnrolledInCourseAsync(
                    UserId,
                    CourseId
                );
                if (!(existingModule == false))
                {
                    return new HttpResponseDto<object>
                    {
                        Success = false,
                        Message = "You are already enrolled in this course",
                    };
                }

                if (!await _courseRepository.IsUserInstructorOfCourseAsync(UserId, CourseId))
                {
                    return new HttpResponseDto<object>
                    {
                        Success = false,
                        Message = "Access denied. Only course instructors can close the course",
                    };
                }

                var updatedEnrollmentInfo = await _enrollmentRepository.UpdateEnrollmentsAsync(
                    CourseId
                );

                var moduleDto = new EnrollmentCloseResponseDto
                {
                    CourseId = updatedEnrollmentInfo.CourseId,
                    Status = updatedEnrollmentInfo.Status,
                };

                return new HttpResponseDto<object>
                {
                    Success = true,
                    Message = "Enrollments closed Successfully",
                    Data = moduleDto,
                };
            }
            catch (Exception ex)
            {
                return new HttpResponseDto<object>
                {
                    Success = false,
                    Message = "Failed to close enrollments",
                    Errors = new { exception = ex.Message },
                };
            }
        }
    }
}
