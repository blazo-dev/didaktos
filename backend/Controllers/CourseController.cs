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
        public async Task<IActionResult> GetCourses()
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
        public async Task<IActionResult> CreateCourses([FromBody] CourseRequestDto request)
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

        [HttpPut("{courseId}")]
        [Authorize]
        public async Task<IActionResult> EditCourse(Guid courseId, [FromBody] CourseEditDto request)
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

            var result = await _courseService.EditCourseAsync(courseId, request, userId);

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
        public async Task<IActionResult> GetEnrollments()
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
        public async Task<IActionResult> CreateEnrollment(
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

        [HttpPut("enrollments")]
        [Authorize]
        public async Task<IActionResult> CloseEnrollments([FromBody] Guid CourseId)
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

            var result = await _enrollmentService.CloseEnrollmentsAsync(CourseId, userId);

            if (result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }
    }
}
