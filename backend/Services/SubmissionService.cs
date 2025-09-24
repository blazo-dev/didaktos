using didaktos.backend.Interfaces;
using didaktos.backend.Models;
using didaktos.backend.Models.DTOs;

namespace didaktos.backend.Services
{
    public class SubmissionService : ISubmissionService
    {
        private readonly ISubmissionRepository _submissionRepository;
        private readonly ICourseRepository _courseRepository;

        public SubmissionService(
            ISubmissionRepository submissionRepository,
            ICourseRepository courseRepository
        )
        {
            _submissionRepository = submissionRepository;
            _courseRepository = courseRepository;
        }

        public async Task<HttpResponseDto<object>> CreateSubmissionAsync(
            SubmissionAddRequestDto request,
            Guid studentId
        )
        {
            try
            {
                if (
                    !await _courseRepository.IsUserEnrolledInCourseAsync(
                        studentId,
                        request.CourseId
                    )
                )
                {
                    return new HttpResponseDto<object>
                    {
                        Success = false,
                        Message = "You are not enrolled in this course",
                    };
                }

                var submission = new Submission
                {
                    Id = Guid.NewGuid(),
                    Content = request.Content,
                    StudentId = studentId,
                    Grade = null,
                };

                var createdSubmission = await _submissionRepository.InsertSubmissionAsync(
                    submission
                );

                return createdSubmission;
            }
            catch (Exception ex)
            {
                return new HttpResponseDto<object>
                {
                    Success = false,
                    Message = "Submission failed",
                    Errors = new { exception = ex.Message },
                };
            }
        }

        public async Task<HttpResponseDto<object>> GetAllCourseSubmissionsAsync(
            Guid userId,
            Guid courseId
        )
        {
            try
            {
                if (!await _courseRepository.IsUserInstructorOfCourseAsync(userId, courseId))
                {
                    return new HttpResponseDto<object>
                    {
                        Success = false,
                        Message = "Access denied. Only course instructors can see submissions",
                    };
                }

                var enrollments = await _submissionRepository.SelectAllCourseSubmissionsAsync(
                    courseId
                );

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

        public async Task<HttpResponseDto<object>> SetSubmissionGradeAsync(
            Guid userId,
            SubmissionGradeRequestDto request
        )
        {
            try
            {
                if (
                    !await _courseRepository.IsUserInstructorOfCourseAsync(userId, request.CourseId)
                )
                {
                    return new HttpResponseDto<object>
                    {
                        Success = false,
                        Message = "Access denied. Only course instructors can close the course",
                    };
                }

                var updatedEnrollmentInfo = await _submissionRepository.UpdateSubmissionGradeAsync(
                    request.Grade,
                    request.Id
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
