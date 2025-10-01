namespace didaktos.backend.Models.DTOs
{
    public class ModuleResponseDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public Guid CourseId { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
