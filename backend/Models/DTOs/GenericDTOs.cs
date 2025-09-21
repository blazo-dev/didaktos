namespace didaktos.backend.Models.DTOs
{
    public class HttpResponseDto<T>
    {
        public bool Success { get; set; } // Indicates if the operation was successful
        public string Message { get; set; } = string.Empty; // Human-readable message
        public T? Data { get; set; } = default!; // Generic payload (user, token, list, etc.)
        public object? Errors { get; set; } = null!; // Optional errors (null if none)
    }
}
