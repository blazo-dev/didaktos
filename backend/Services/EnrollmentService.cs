using didaktos.backend.Interfaces;
using didaktos.backend.Models;
using didaktos.backend.Models.DTOs;

namespace didaktos.backend.Services
{
    public class EnrollmentService : IEnrollmentService
    {
        private readonly IEnrollmentRepository _enrollmentRepository;
        private readonly ICourseRepository _courseRepository;

        public EnrollmentService(
            IEnrollmentRepository enrollmentRepository,
            ICourseRepository courseRepository
        )
        {
            _enrollmentRepository = enrollmentRepository;
            _courseRepository = courseRepository;
        }

        public async Task<HttpResponseDto<EnrollmentAddResponseDto>> CreateEnrollmentAsync(
            EnrollmentAddRequestDto request,
            Guid studentId
        )
        {
            try
            {
                var enrollment = new Enrollment
                {
                    Id = Guid.NewGuid(),
                    Status = "active",
                    StudentId = studentId,
                    CourseId = request.CourseId,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                };

                if (
                    await _courseRepository.IsUserInstructorOfCourseAsync(
                        studentId,
                        request.CourseId
                    )
                )
                {
                    return new HttpResponseDto<EnrollmentAddResponseDto>
                    {
                        Success = false,
                        Message = "User cannot be enrolled in their own course",
                    };
                }

                var existingModule = await _courseRepository.IsUserEnrolledInCourseAsync(
                    studentId,
                    request.CourseId
                );
                if (existingModule)
                {
                    return new HttpResponseDto<EnrollmentAddResponseDto>
                    {
                        Success = false,
                        Message = "You are already enrolled in this course",
                    };
                }

                var createdEnrollment = await _enrollmentRepository.InsertEnrollmentAsync(
                    enrollment
                );

                return new HttpResponseDto<EnrollmentAddResponseDto>
                {
                    Success = true,
                    Message = "Enrollment successful",
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
                return new HttpResponseDto<EnrollmentAddResponseDto>
                {
                    Success = false,
                    Message = "Enrollment failed",
                    Errors = new { exception = ex.Message },
                };
            }
        }

        public async Task<HttpResponseDto<List<EnrollmentReadResponseDto>>> GetEnrollmentsAsync(
            Guid userId
        )
        {
            try
            {
                var enrollments = await _enrollmentRepository.SelectEnrollmentByIdAsync(userId);

                return new HttpResponseDto<List<EnrollmentReadResponseDto>>
                {
                    Success = true,
                    Message = "Enrollments retrieved successfully",
                    Data = enrollments,
                };
            }
            catch (Exception ex)
            {
                return new HttpResponseDto<List<EnrollmentReadResponseDto>>
                {
                    Success = false,
                    Message = "Retrieval of enrollments failed",
                    Errors = new { exception = ex.Message },
                };
            }
        }

        public async Task<HttpResponseDto<EnrollmentCloseResponseDto>> CloseEnrollmentsAsync(
            Guid courseId,
            Guid userId
        )
        {
            try
            {
                if (!await _courseRepository.IsUserInstructorOfCourseAsync(userId, courseId))
                {
                    return new HttpResponseDto<EnrollmentCloseResponseDto>
                    {
                        Success = false,
                        Message = "Access denied. Only course instructors can close the course",
                    };
                }

                var updatedEnrollmentInfo = await _enrollmentRepository.UpdateEnrollmentsAsync(
                    courseId
                );

                var moduleDto = new EnrollmentCloseResponseDto
                {
                    CourseId = updatedEnrollmentInfo.CourseId,
                    Status = updatedEnrollmentInfo.Status,
                };

                return new HttpResponseDto<EnrollmentCloseResponseDto>
                {
                    Success = true,
                    Message = "Enrollments closed Successfully",
                    Data = moduleDto,
                };
            }
            catch (Exception ex)
            {
                return new HttpResponseDto<EnrollmentCloseResponseDto>
                {
                    Success = false,
                    Message = "Failed to close enrollments",
                    Errors = new { exception = ex.Message },
                };
            }
        }
    }
}
