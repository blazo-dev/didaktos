using System.ComponentModel.DataAnnotations;

namespace didaktos.backend.Models
{
    public class SubmissionGradeRequestDto
    {
        [Required]
        public Guid Id { get; set; }

        public Guid CourseId { get; set; }

        public int? Grade { get; set; }
    }
}
