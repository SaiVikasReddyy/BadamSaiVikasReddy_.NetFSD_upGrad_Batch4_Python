using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using EMS.API.Data;
using EMS.API.DTOs;
using EMS.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace EMS.API.Services
{
    public class AuthService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public AuthService(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        public async Task<AuthResponseDto> RegisterAsync(AuthRequestDto request)
        {
            // Reject duplicate usernames
            if (await _context.AppUsers.AnyAsync(u => u.Username.ToLower() == request.Username.ToLower()))
            {
                return new AuthResponseDto { Success = false, Message = "Username already exists." };
            }

            var user = new AppUser
            {
                Username = request.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password), // Hash before saving
                Role = string.IsNullOrWhiteSpace(request.Role) ? "Viewer" : request.Role, // Default to Viewer
                CreatedAt = DateTime.UtcNow
            };

            _context.AppUsers.Add(user);
            await _context.SaveChangesAsync();

            return new AuthResponseDto { Success = true, Message = "Registration successful." };
        }

        public async Task<AuthResponseDto> LoginAsync(AuthRequestDto request)
        {
            var user = await _context.AppUsers.SingleOrDefaultAsync(u => u.Username == request.Username);

            // Verify exists AND password matches hash
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return new AuthResponseDto { Success = false, Message = "Invalid username or password." };
            }

            var token = GenerateToken(user);

            return new AuthResponseDto
            {
                Success = true,
                Username = user.Username,
                Role = user.Role,
                Token = token,
                Message = "Login successful."
            };
        }

        private string GenerateToken(AppUser user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(double.Parse(_config["Jwt:ExpiryHours"] ?? "8")),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}