namespace didaktos.backend.Models.DTOs
{
    public class ModuleDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public Guid CourseId { get; set; }
        public List<LessonDto> Lessons { get; set; } = new List<LessonDto>();
        public List<AssignmentDto> Assignments { get; set; } = new List<AssignmentDto>();
    }
}
