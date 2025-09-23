using System.Security.Claims;
using didaktos.backend.Interfaces;
using didaktos.backend.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace didaktos.backend.Controllers
{
    [ApiController]
    [Route("api/courses")]
    [Authorize] // Require authentication for all endpoints
    public class CourseContentController : ControllerBase
    {
        private readonly IModuleService _moduleService;

        // private readonly ILessonService _lessonService;
        // private readonly IAssignmentService _assignmentService;

        public CourseContentController(IModuleService moduleService)
        {
            _moduleService = moduleService;
            // _lessonService = lessonService;
            // _assignmentService = assignmentService;
        }

        #region Module Endpoints

        /// <summary>
        /// Get all modules for a specific course
        /// </summary>
        /// <param name="id">Course ID</param>
        /// <returns>List of modules for the course</returns>
        [HttpGet("{id}/modules")]
        public async Task<ActionResult<HttpResponseDto<List<ModuleDto>>>> GetCourseModules(Guid id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            Console.WriteLine(userIdClaim ?? "No userId claim found");
            if (userIdClaim == null || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(
                    new HttpResponseDto<List<ModuleDto>>
                    {
                        Success = false,
                        Message = "Invalid or missing authentication token",
                    }
                );
            }

            var result = await _moduleService.GetCourseModulesAsync(id, userId);

            return result.Success switch
            {
                true => Ok(result),
                false when result.Message == "Course not found" => NotFound(result),
                false when result.Message.Contains("Access denied") => Forbid(),
                _ => BadRequest(result),
            };
        }

        /// <summary>
        /// Add a module to a course
        /// </summary>
        /// <param name="id">Course ID</param>
        /// <param name="request">Module creation request</param>
        /// <returns>Created module</returns>
        [HttpPost("{id}/modules")]
        public async Task<ActionResult<HttpResponseDto<ModuleDto>>> CreateCourseModule(
            Guid id,
            [FromBody] CreateModuleRequestDto request
        )
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(
                    new HttpResponseDto<ModuleDto>
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
                    new HttpResponseDto<ModuleDto>
                    {
                        Success = false,
                        Message = "Invalid or missing authentication token",
                    }
                );
            }

            var result = await _moduleService.CreateModuleAsync(id, request, userId);

            return result.Success switch
            {
                true => CreatedAtAction(nameof(GetCourseModules), new { id }, result),
                false when result.Message == "Course not found" => NotFound(result),
                false
                    when result.Message.Contains(
                        "Access denied. User is not the owner of the Course"
                    ) => Forbid(),
                _ => BadRequest(result),
            };
        }

        /// <summary>
        /// Update a module's title
        /// </summary>
        /// <param name="moduleId">Module ID</param>
        /// <param name="request">Module update request</param>
        /// <returns>Updated module</returns>
        [HttpPut("modules/{moduleId}")]
        public async Task<ActionResult<HttpResponseDto<ModuleDto>>> UpdateModule(
            Guid moduleId,
            [FromBody] UpdateModuleRequestDto request
        )
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(
                    new HttpResponseDto<ModuleDto>
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
                    new HttpResponseDto<ModuleDto>
                    {
                        Success = false,
                        Message = "Invalid or missing authentication token",
                    }
                );
            }

            var result = await _moduleService.UpdateModuleAsync(moduleId, request, userId);

            return result.Success switch
            {
                true => Ok(result),
                false when result.Message == "Module not found" => NotFound(result),
                false when result.Message.Contains("Access denied") => Forbid(),
                _ => BadRequest(result),
            };
        }

        /// <summary>
        /// Delete a module (cascade deletes all lessons and assignments)
        /// </summary>
        /// <param name="moduleId">Module ID</param>
        /// <returns>Success response</returns>
        [HttpDelete("modules/{moduleId}")]
        public async Task<ActionResult<HttpResponseDto<object>>> DeleteModule(Guid moduleId)
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

            var result = await _moduleService.DeleteModuleAsync(moduleId, userId);

            return result.Success switch
            {
                true => Ok(result),
                false when result.Message == "Module not found" => NotFound(result),
                false when result.Message.Contains("Access denied") => Forbid(),
                _ => BadRequest(result),
            };
        }

        #endregion

        #region Lesson Endpoints (Placeholder for future implementation)

        // TODO: Implement lesson endpoints
        // [HttpGet("{courseId}/modules/{moduleId}/lessons")]
        // [HttpPost("{courseId}/modules/{moduleId}/lessons")]

        #endregion
    }
}
