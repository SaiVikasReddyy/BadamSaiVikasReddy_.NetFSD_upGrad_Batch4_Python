using System.ComponentModel.DataAnnotations;

namespace EMS.API.DTOs
{
    public class AuthRequestDto
    {
        [Required]
        public string Username { get; set; } = string.Empty;

        [Required, MinLength(6, ErrorMessage = "Password must be at least 6 characters")]
        public string Password { get; set; } = string.Empty;

        public string? Role { get; set; } // 'Admin' or 'Viewer'. Defaults to 'Viewer' in the service layer if empty.
    }

    public class AuthResponseDto
    {
        public bool Success { get; set; }
        public string? Username { get; set; }
        public string? Role { get; set; }
        public string? Token { get; set; }
        public string? Message { get; set; }
    }
}