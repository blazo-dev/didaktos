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

        [HttpPut]
        public async Task<IActionResult> EditCourse([FromBody] CourseEditDto request)
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

            return result.Success switch
            {
                true => Ok(result),
                false when result.Message == "You are already enrolled in this course" => NotFound(
                    result
                ),
                false when result.Message.Contains("Access denied") => Forbid(),
                _ => BadRequest(result),
            };
        }

        [HttpPost]
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

            var result = await _enrollmentService.CreateEnrollmentAsync(request);

            if (result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetEnrollments()
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

            var result = await _enrollmentService.GetEnrollmentsAsync(userId);

            if (result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        [HttpPut]
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

            return result.Success switch
            {
                true => Ok(result),
                false when result.Message == "You are already enrolled in this course" => NotFound(
                    result
                ),
                false when result.Message.Contains("Access denied") => Forbid(),
                _ => BadRequest(result),
            };
        }
    }
}
