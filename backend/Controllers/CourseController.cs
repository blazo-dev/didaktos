using System.Security.Claims;
using didaktos.backend.Interfaces;
using didaktos.backend.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace didaktos.backend.Controllers
{
    [ApiController]
    [Route("api/courses")]
    public class CourseController : ControllerBase
    {
        private readonly ICourseService _courseService;
        private readonly IEnrollmentService _enrollmentService;

        public CourseController(ICourseService courseService, IEnrollmentService enrollmentService)
        {
            _courseService = courseService;
            _enrollmentService = enrollmentService;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<HttpResponseDto<CourseReadResponseDto>>> GetCourses()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(
                    new HttpResponseDto<object>
                    {
                        Success = false,
                        Message = "Invalid request data",
                        Errors = ModelState,
                    }
                );
            }

            var result = await _courseService.GetCoursesAsync();

            if (result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<HttpResponseDto<CourseResponseDto>>> CreateCourses(
            [FromBody] CourseRequestDto request
        )
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(
                    new HttpResponseDto<object>
                    {
                        Success = false,
                        Message = "Invalid request data",
                        Errors = ModelState,
                    }
                );
            }

            var result = await _courseService.CreateCourseAsync(request, userId);

            if (result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        [HttpPut]
        [Authorize]
        public async Task<ActionResult<HttpResponseDto<CourseEditDto>>> EditCourse(
            [FromBody] CourseEditDto request
        )
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(
                    new HttpResponseDto<object>
                    {
                        Success = false,
                        Message = "Invalid request data",
                        Errors = ModelState,
                    }
                );
            }

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(
                    new HttpResponseDto<object>
                    {
                        Success = false,
                        Message = "Invalid or missing authentication token",
                    }
                );
            }

            var result = await _courseService.EditCourseAsync(request, userId);

            if (result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        [HttpDelete("{courseId}")]
        [Authorize]
        public async Task<ActionResult<HttpResponseDto<object>>> DeleteCourse(Guid courseId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(
                    new HttpResponseDto<object>
                    {
                        Success = false,
                        Message = "Invalid or missing authentication token",
                    }
                );
            }

            var result = await _courseService.DeleteCourseAsync(courseId, userId);

            if (result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        [HttpGet("enrollments")]
        [Authorize]
        public async Task<ActionResult<HttpResponseDto<EnrollmentAddResponseDto>>> GetEnrollments()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized();
            }

            var result = await _enrollmentService.GetEnrollmentsAsync(userId);

            if (result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        [HttpPost("enrollments")]
        [Authorize]
        public async Task<ActionResult<HttpResponseDto<EnrollmentAddResponseDto>>> CreateEnrollment(
            [FromBody] EnrollmentAddRequestDto request
        )
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(
                    new HttpResponseDto<object>
                    {
                        Success = false,
                        Message = "Invalid request data",
                        Errors = ModelState,
                    }
                );
            }

            var result = await _enrollmentService.CreateEnrollmentAsync(request, userId);

            if (result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        [HttpPut("{courseId}/enrollments")]
        [Authorize]
        public async Task<
            ActionResult<HttpResponseDto<EnrollmentCloseResponseDto>>
        > CloseEnrollments(Guid courseId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(
                    new HttpResponseDto<object>
                    {
                        Success = false,
                        Message = "Invalid request data",
                        Errors = ModelState,
                    }
                );
            }

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(
                    new HttpResponseDto<object>
                    {
                        Success = false,
                        Message = "Invalid or missing authentication token",
                    }
                );
            }

            var result = await _enrollmentService.CloseEnrollmentsAsync(courseId, userId);

            if (result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }
    }
}
