namespace didaktos.backend.Models.DTOs
{
    public class HttpResponseDto<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public T? Data { get; set; } = default!;
        public object? Errors { get; set; } = null!;
    }
}
