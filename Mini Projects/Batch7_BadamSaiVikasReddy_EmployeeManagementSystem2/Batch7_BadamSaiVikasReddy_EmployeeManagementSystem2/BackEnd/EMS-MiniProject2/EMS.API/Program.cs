using Microsoft.OpenApi.Models;
using System.Text;
using EMS.API.Data;
using EMS.API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// --------------------------------------------------------
// 1. DATABASE CONFIGURATION
// --------------------------------------------------------
var connStr = builder.Configuration.GetConnectionString("DefaultConnection");
if (string.IsNullOrEmpty(connStr))
{
    throw new InvalidOperationException("DefaultConnection is missing in configuration.");
}
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connStr));

// --------------------------------------------------------
// 2. DEPENDENCY INJECTION (Services & Repositories)
// --------------------------------------------------------
builder.Services.AddScoped<IEmployeeRepository, EmployeeRepository>();
builder.Services.AddScoped<EmployeeService>();
builder.Services.AddScoped<AuthService>();

// --------------------------------------------------------
// 3. CORS CONFIGURATION (Allow frontend to connect)
// --------------------------------------------------------
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://127.0.0.1:5500", "http://localhost:5500")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// --------------------------------------------------------
// 4. JWT AUTHENTICATION CONFIGURATION
// --------------------------------------------------------
var jwtKey = builder.Configuration["Jwt:Key"];
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(o =>
    {
        o.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey!)),
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"],
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero // No grace period on expiry
        };
    });
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "EMS.API", Version = "v1" });

    // 1. Define the Security Scheme (How the token is passed)
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. \r\n\r\n Enter 'Bearer' [space] and then your token in the text input below.\r\n\r\nExample: \"Bearer eyJhbGciOiJIUzI1NiIsIn...\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    // 2. Apply the Security Requirement Globally
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});
// Add standard services
builder.Services.AddAuthorization();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// --------------------------------------------------------
// 5. HTTP REQUEST PIPELINE (Middleware Order Matters!)
// --------------------------------------------------------

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("AllowFrontend"); // MUST be before Auth and Controllers

app.UseAuthentication();      // Who are you? (Must be before Authorization)
app.UseAuthorization();       // Are you allowed here?

app.MapControllers();
app.MapGet("/", () => Results.Redirect("/swagger/index.html"));
app.Run();
