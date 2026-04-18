using EMS.API.Data;
using EMS.API.Models;
using Microsoft.EntityFrameworkCore;

namespace EMS.API.Services
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly AppDbContext _context;

        public EmployeeRepository(AppDbContext context)
        {
            _context = context;
        }

        public IQueryable<Employee> GetAllAsQueryable() => _context.Employees.AsQueryable();

        public async Task<Employee?> GetByIdAsync(int id) => await _context.Employees.FindAsync(id);

        public async Task<Employee?> GetByEmailAsync(string email)
            => await _context.Employees.FirstOrDefaultAsync(e => e.Email.ToLower() == email.ToLower());

        public async Task AddAsync(Employee employee) => await _context.Employees.AddAsync(employee);

        public Task UpdateAsync(Employee employee)
        {
            _context.Employees.Update(employee);
            return Task.CompletedTask;
        }

        public Task DeleteAsync(Employee employee)
        {
            _context.Employees.Remove(employee);
            return Task.CompletedTask;
        }

        public async Task<int> SaveChangesAsync() => await _context.SaveChangesAsync();

        // --- Dashboard Methods ---
        public async Task<int> GetTotalCountAsync() => await _context.Employees.CountAsync();
        public async Task<int> GetActiveCountAsync() => await _context.Employees.CountAsync(e => e.Status == "Active");
        public async Task<int> GetInactiveCountAsync() => await _context.Employees.CountAsync(e => e.Status == "Inactive");
        public async Task<int> GetDepartmentsCountAsync() => await _context.Employees.Select(e => e.Department).Distinct().CountAsync();

        public async Task<List<KeyValuePair<string, int>>> GetDepartmentBreakdownAsync()
        {
            // Step 1: Query the database using an anonymous object (EF Core CAN translate this to SQL)
            var rawData = await _context.Employees
                .GroupBy(e => e.Department)
                .Select(g => new { Key = g.Key, Value = g.Count() })
                .ToListAsync();

            // Step 2: Convert it to a KeyValuePair list in server memory, and sort it
            return rawData
                .OrderBy(x => x.Key)
                .Select(x => new KeyValuePair<string, int>(x.Key, x.Value))
                .ToList();
        }
        public async Task<List<Employee>> GetRecentEmployeesAsync(int count)
        {
            return await _context.Employees
                .OrderByDescending(e => e.CreatedAt)
                .ThenByDescending(e => e.Id)
                .Take(count)
                .ToListAsync();
        }
    }
}