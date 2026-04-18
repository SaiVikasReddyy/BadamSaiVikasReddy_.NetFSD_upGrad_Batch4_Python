using EMS.API.Models;
using Microsoft.EntityFrameworkCore;

namespace EMS.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Employee> Employees { get; set; }
        public DbSet<AppUser> AppUsers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // 1. Enforce Unique Indexes
            modelBuilder.Entity<Employee>()
                .HasIndex(e => e.Email)
                .IsUnique();

            modelBuilder.Entity<AppUser>()
                .HasIndex(u => u.Username)
                .IsUnique();

            // 2. Seed Default Users (Passwords hashed using BCrypt cost 10)
            // "admin123" and "viewer123"
            string adminHash = BCrypt.Net.BCrypt.HashPassword("admin123");
            string viewerHash = BCrypt.Net.BCrypt.HashPassword("viewer123");

            modelBuilder.Entity<AppUser>().HasData(
                new AppUser { Id = 1, Username = "admin", PasswordHash = adminHash, Role = "Admin", CreatedAt = DateTime.UtcNow },
                new AppUser { Id = 2, Username = "viewer", PasswordHash = viewerHash, Role = "Viewer", CreatedAt = DateTime.UtcNow }
            );

            // 3. Seed Initial Employees (From Mini Project 1 data.js)
            modelBuilder.Entity<Employee>().HasData(
                new Employee { Id = 1, FirstName = "Sai Vikas Reddy", LastName = "Badam", Email = "saivikasreddy.b@gmail.com", Phone = "9876543210", Department = "Engineering", Designation = "Software Engineer", Salary = 850000, JoinDate = new DateTime(2021, 3, 15), Status = "Active", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Employee { Id = 2, FirstName = "Mohith", LastName = "Kankanala", Email = "mohith.k@gmail.com", Phone = "9123456780", Department = "Marketing", Designation = "Marketing Executive", Salary = 610000, JoinDate = new DateTime(2021, 5, 10), Status = "Active", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Employee { Id = 3, FirstName = "Sandeep", LastName = "Konda", Email = "sandeep.k@gmail.com", Phone = "9876512340", Department = "HR", Designation = "HR Manager", Salary = 720000, JoinDate = new DateTime(2018, 10, 12), Status = "Active", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Employee { Id = 4, FirstName = "Vineeth", LastName = "Gontla", Email = "vineeth.g@gmail.com", Phone = "9988776655", Department = "Finance", Designation = "Senior Accountant", Salary = 760000, JoinDate = new DateTime(2020, 2, 18), Status = "Active", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Employee { Id = 5, FirstName = "Santosh", LastName = "Sane", Email = "santosh.s@gmail.com", Phone = "9123123123", Department = "Operations", Designation = "Operations Manager", Salary = 950000, JoinDate = new DateTime(2017, 4, 21), Status = "Active", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Employee { Id = 6, FirstName = "Manohar", LastName = "Gundu", Email = "manohar.g@gmail.com", Phone = "8456739021", Department = "Engineering", Designation = "Software Developer", Salary = 1150000, JoinDate = new DateTime(2019, 10, 25), Status = "InActive", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Employee { Id = 7, FirstName = "Sarayu", LastName = "Sigatapu", Email = "sarayu.s@gmail.com", Phone = "6301832568", Department = "Operations", Designation = "Operations Executive", Salary = 650000, JoinDate = new DateTime(2018, 7, 11), Status = "Active", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Employee { Id = 8, FirstName = "Vignesh", LastName = "Gontla", Email = "vignesh.g@gmail.com", Phone = "9076438215", Department = "Engineering", Designation = "Associate Software Engineer", Salary = 1000000, JoinDate = new DateTime(2021, 6, 9), Status = "Active", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Employee { Id = 9, FirstName = "Rohith", LastName = "kallepalli", Email = "rohith.k@gmail.com", Phone = "9703467210", Department = "Operations", Designation = "Operations Executive", Salary = 750000, JoinDate = new DateTime(2023, 9, 8), Status = "Active", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Employee { Id = 10,FirstName = "Saleem", LastName = "Shaik", Email = "saleem.s@gmail.com", Phone = "8075239416", Department = "Finance", Designation = "Accountant", Salary = 860000, JoinDate = new DateTime(2024, 5, 23), Status = "Active", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Employee { Id = 11,FirstName = "Venkatesh", LastName = "Namasani", Email = "venkatesh.n@gmail.com", Phone = "7672398451", Department = "HR", Designation = "HR Executive", Salary = 620000, JoinDate = new DateTime(2025, 2, 18), Status = "Active", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Employee { Id = 12,FirstName = "Pradeep", LastName = "Cheekati", Email = "pradeep.ch@gmail.com", Phone = "8934021786", Department = "Marketing", Designation = "Marketing Manager", Salary = 900000, JoinDate = new DateTime(2025, 5, 27), Status = "Active", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Employee { Id = 13,FirstName = "Tharun", LastName = "Putta", Email = "tharun.p@gmail.com", Phone = "9803672482", Department = "Engineering", Designation = "App Developer", Salary = 950000, JoinDate = new DateTime(2025, 7, 29), Status = "Active", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Employee { Id = 14,FirstName = "Vamsi", LastName = "Badam", Email = "vamsi.b@gmail.com", Phone = "7285634021", Department = "Engineering", Designation = "Advance Associate Software Engineer", Salary = 1100000, JoinDate = new DateTime(2025, 10, 12), Status = "Active", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Employee { Id = 15,FirstName = "Rahul", LastName = "Sura", Email = "rahul.s@gmail.com", Phone = "8356012987", Department = "Marketing", Designation = "marketing Manager", Salary = 850000, JoinDate = new DateTime(2026, 8, 10), Status = "Active", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow }
            // NOTE: Add the remaining 10 employees from your data.js here following the exact same format to meet the "15 records seeded" requirement.
            );
        }
    }
}