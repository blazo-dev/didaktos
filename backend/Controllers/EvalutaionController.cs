using System.Security.Claims;
using didaktos.backend.Interfaces;
using didaktos.backend.Models;
using didaktos.backend.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace didaktos.backend.Controllers
{
    [ApiController]
    [Route("api/evaluation")]
    public class EvaluationController : ControllerBase
    {
        private readonly ISubmissionService _submissionService;

        public EvaluationController(ISubmissionService submissionService)
        {
            _submissionService = submissionService;
        }

        [HttpPost("create")]
        [Authorize]
        public async Task<IActionResult> CreateSubmission(
            [FromBody] SubmissionAddRequestDto request
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

            var result = await _submissionService.CreateSubmissionAsync(request, userId);

            if (result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        [HttpGet("enrollments")]
        [Authorize]
        public async Task<IActionResult> GetAllCourseSubmissions(Guid CourseId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized();
            }

            var result = await _submissionService.GetAllCourseSubmissionsAsync(userId, CourseId);

            if (result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        [HttpPut("grade")]
        [Authorize]
        public async Task<IActionResult> SetSubmissionGrade(
            [FromBody] SubmissionGradeRequestDto request
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

            var result = await _submissionService.SetSubmissionGradeAsync(userId, request);

            if (result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }
    }
}
