namespace didaktos.backend.Models.DTOs
{
    public class AssignmentResponseDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime? DueDate { get; set; }
        public Guid ModuleId { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
