namespace didaktos.backend.Models.DTOs
{
    public class LessonDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public Guid ModuleId { get; set; }
    }
}
