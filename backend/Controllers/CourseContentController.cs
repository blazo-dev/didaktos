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
        private readonly ILessonService _lessonService;

        // private readonly IAssignmentService _assignmentService;

        public CourseContentController(IModuleService moduleService, ILessonService lessonService)
        {
            _moduleService = moduleService;
            _lessonService = lessonService;
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

            if (result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
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

            if (result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
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

            if (result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
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

            if (result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        #endregion

        #region Lesson Endpoints

        /// <summary>
        /// Get all lessons for a specific module
        /// </summary>
        /// <param name="moduleId">Module ID</param>
        /// <returns>List of lessons for the module</returns>
        [HttpGet("modules/{moduleId}/lessons")]
        public async Task<ActionResult<HttpResponseDto<List<LessonDto>>>> GetModuleLessons(
            Guid moduleId
        )
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(
                    new HttpResponseDto<List<LessonDto>>
                    {
                        Success = false,
                        Message = "Invalid or missing authentication token",
                    }
                );
            }

            var result = await _lessonService.GetModuleLessonsAsync(moduleId, userId);

            if (result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        /// <summary>
        /// Create a new lesson in a module
        /// </summary>
        /// <param name="moduleId">Module ID</param>
        /// <param name="request">Lesson creation request</param>
        /// <returns>Created lesson</returns>
        [HttpPost("modules/{moduleId}/lessons")]
        public async Task<ActionResult<HttpResponseDto<LessonDto>>> CreateLesson(
            Guid moduleId,
            [FromBody] CreateLessonRequestDto request
        )
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(
                    new HttpResponseDto<LessonDto>
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
                    new HttpResponseDto<LessonDto>
                    {
                        Success = false,
                        Message = "Invalid or missing authentication token",
                    }
                );
            }

            var result = await _lessonService.CreateLessonAsync(moduleId, request, userId);

            if (result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        /// <summary>
        /// Update a lesson's title and content
        /// </summary>
        /// <param name="lessonId">Lesson ID</param>
        /// <param name="request">Lesson update request</param>
        /// <returns>Updated lesson</returns>
        [HttpPut("lessons/{lessonId}")]
        public async Task<ActionResult<HttpResponseDto<LessonResponseDto>>> UpdateLesson(
            Guid lessonId,
            [FromBody] UpdateLessonRequestDto request
        )
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(
                    new HttpResponseDto<LessonResponseDto>
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
                    new HttpResponseDto<LessonResponseDto>
                    {
                        Success = false,
                        Message = "Invalid or missing authentication token",
                    }
                );
            }

            var result = await _lessonService.UpdateLessonAsync(lessonId, request, userId);

            if (result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        /// <summary>
        /// Delete a lesson
        /// </summary>
        /// <param name="lessonId">Lesson ID</param>
        /// <returns>Success response</returns>
        [HttpDelete("lessons/{lessonId}")]
        public async Task<ActionResult<HttpResponseDto<object>>> DeleteLesson(Guid lessonId)
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

            var result = await _lessonService.DeleteLessonAsync(lessonId, userId);

            if (result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        #endregion

        #region Assignment Endpoints (Placeholder for future implementation)

        // TODO: Implement assignment endpoints
        // [HttpGet("modules/{moduleId}/assignments")]
        // [HttpPost("modules/{moduleId}/assignments")]
        // [HttpPut("assignments/{assignmentId}")]
        // [HttpDelete("assignments/{assignmentId}")]

        #endregion
    }
}
