namespace didaktos.backend.Models.DTOs
{
    public class AssignmentDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime? DueDate { get; set; } = null;
        public Guid ModuleId { get; set; }
    }
}
