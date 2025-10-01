using System.ComponentModel.DataAnnotations;

namespace didaktos.backend.Models
{
    public class SubmissionGradeResponseDto
    {
        [Required]
        public Guid Id { get; set; }

        public int? Grade { get; set; }
    }
}
