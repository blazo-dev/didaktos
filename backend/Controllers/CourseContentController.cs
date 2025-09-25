using System.Security.Claims;
using didaktos.backend.Interfaces;
using didaktos.backend.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace didaktos.backend.Controllers
{
    [ApiController]
    [Route("api/")]
    [Authorize] // Require authentication for all endpoints
    public class CourseContentController : ControllerBase
    {
        private readonly IModuleService _moduleService;
        private readonly ILessonService _lessonService;

        private readonly IAssignmentService _assignmentService;

        public CourseContentController(
            IModuleService moduleService,
            ILessonService lessonService,
            IAssignmentService assignmentService
        )
        {
            _moduleService = moduleService;
            _lessonService = lessonService;
            _assignmentService = assignmentService;
        }

        #region Module Endpoints

        /// <summary>
        /// Get all modules for a specific course
        /// </summary>
        /// <param name="courseId">Course ID</param>
        /// <returns>List of modules for the course</returns>
        [HttpGet("courses/{courseId}/modules")]
        public async Task<ActionResult<HttpResponseDto<List<ModuleDto>>>> GetCourseModules(
            Guid courseId
        )
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

            var result = await _moduleService.GetCourseModulesAsync(courseId, userId);

            if (result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        /// <summary>
        /// Add a module to a course
        /// </summary>
        /// <param name="courseId">Course ID</param>
        /// <param name="request">Module creation request</param>
        /// <returns>Created module</returns>
        [HttpPost("courses/{courseId}/modules")]
        public async Task<ActionResult<HttpResponseDto<ModuleDto>>> CreateCourseModule(
            Guid courseId,
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

            var result = await _moduleService.CreateModuleAsync(courseId, request, userId);

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
        [HttpPut("modules/lessons/{lessonId}")]
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
        [HttpDelete("modules/lessons/{lessonId}")]
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

        #region Assignment Endpoints

        /// <summary>
        /// Get all assignments for a specific module
        /// </summary>
        /// <param name="moduleId">Module ID</param>
        /// <returns>List of assignments for the module</returns>
        [HttpGet("modules/{moduleId}/assignments")]
        public async Task<ActionResult<HttpResponseDto<List<AssignmentDto>>>> GetModuleAssignments(
            Guid moduleId
        )
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(
                    new HttpResponseDto<List<AssignmentDto>>
                    {
                        Success = false,
                        Message = "Invalid or missing authentication token",
                    }
                );
            }

            var result = await _assignmentService.GetModuleAssignmentsAsync(moduleId, userId);

            if (result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        /// <summary>
        /// Create a new assignment in a module
        /// </summary>
        /// <param name="moduleId">Module ID</param>
        /// <param name="request">Assignment creation request</param>
        /// <returns>Created assignment</returns>
        [HttpPost("modules/{moduleId}/assignments")]
        public async Task<ActionResult<HttpResponseDto<AssignmentDto>>> CreateAssignment(
            Guid moduleId,
            [FromBody] CreateAssignmentRequestDto request
        )
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(
                    new HttpResponseDto<AssignmentDto>
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
                    new HttpResponseDto<AssignmentDto>
                    {
                        Success = false,
                        Message = "Invalid or missing authentication token",
                    }
                );
            }

            var result = await _assignmentService.CreateAssignmentAsync(moduleId, request, userId);

            if (result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        /// <summary>
        /// Update an assignment's title and content
        /// </summary>
        /// <param name="assignmentId">Assignment ID</param>
        /// <param name="request">Assignment update request</param>
        /// <returns>Updated assignment</returns>
        [HttpPut("modules/assignments/{assignmentId}")]
        public async Task<ActionResult<HttpResponseDto<AssignmentResponseDto>>> UpdateAssignment(
            Guid assignmentId,
            [FromBody] UpdateAssignmentRequestDto request
        )
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(
                    new HttpResponseDto<AssignmentResponseDto>
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
                    new HttpResponseDto<AssignmentResponseDto>
                    {
                        Success = false,
                        Message = "Invalid or missing authentication token",
                    }
                );
            }

            var result = await _assignmentService.UpdateAssignmentAsync(
                assignmentId,
                request,
                userId
            );

            if (result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        /// <summary>
        /// Delete an assignment
        /// </summary>
        /// <param name="assignmentId">Assignment ID</param>
        /// <returns>Success response</returns>
        [HttpDelete("modules/assignments/{assignmentId}")]
        public async Task<ActionResult<HttpResponseDto<object>>> DeleteAssignment(Guid assignmentId)
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

            var result = await _assignmentService.DeleteAssignmentAsync(assignmentId, userId);

            if (result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        #endregion
    }
}
