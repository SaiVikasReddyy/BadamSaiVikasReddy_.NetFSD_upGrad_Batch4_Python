using EMS.API.DTOs;
using EMS.API.Models;
using Microsoft.EntityFrameworkCore;

namespace EMS.API.Services
{
    public class EmployeeService
    {
        private readonly IEmployeeRepository _repository;

        public EmployeeService(IEmployeeRepository repository)
        {
            _repository = repository;
        }

        public async Task<PagedResult<EmployeeResponseDto>> GetEmployeesAsync(EmployeeQueryParams queryParams)
        {
            var query = _repository.GetAllAsQueryable();

            // 1. Search (translates to SQL LIKE automatically by EF Core)
            if (!string.IsNullOrWhiteSpace(queryParams.Search))
            {
                var search = queryParams.Search.ToLower();
                query = query.Where(e =>
                    (e.FirstName + " " + e.LastName).ToLower().Contains(search) ||
                    e.Email.ToLower().Contains(search));
            }

            // 2. Filters
            if (!string.IsNullOrWhiteSpace(queryParams.Department))
                query = query.Where(e => e.Department == queryParams.Department);

            if (!string.IsNullOrWhiteSpace(queryParams.Status))
                query = query.Where(e => e.Status == queryParams.Status);

            // 3. Sorting
            bool isAsc = queryParams.SortDir?.ToLower() == "asc";
            query = queryParams.SortBy?.ToLower() switch
            {
                "salary" => isAsc ? query.OrderBy(e => e.Salary) : query.OrderByDescending(e => e.Salary),
                "joindate" => isAsc ? query.OrderBy(e => e.JoinDate) : query.OrderByDescending(e => e.JoinDate),
                // Default sort by Name (LastName, then FirstName)
                _ => isAsc ? query.OrderBy(e => e.LastName).ThenBy(e => e.FirstName)
                           : query.OrderByDescending(e => e.LastName).ThenByDescending(e => e.FirstName)
            };

            // 4. Pagination
            var totalCount = await query.CountAsync(); // Count total matches before skipping

            // Apply default limits
            var pageSize = queryParams.PageSize > 0 ? Math.Min(queryParams.PageSize, 100) : 10;
            var page = queryParams.Page > 0 ? queryParams.Page : 1;

            // Execute SQL with Skip/Take
            var employees = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(e => MapToDto(e))
                .ToListAsync();

            return new PagedResult<EmployeeResponseDto>
            {
                Data = employees,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            };
        }

        public async Task<DashboardSummaryDto> GetDashboardSummaryAsync()
        {
            var total = await _repository.GetTotalCountAsync();
            var rawBreakdown = await _repository.GetDepartmentBreakdownAsync();

            var breakdownWithPercentage = rawBreakdown.Select(x => new
            {
                Department = x.Key,
                Count = x.Value,
                Percentage = total == 0 ? 0 : (int)Math.Round((double)x.Value / total * 100)
            });

            var recent = await _repository.GetRecentEmployeesAsync(5);

            return new DashboardSummaryDto
            {
                Total = total,
                Active = await _repository.GetActiveCountAsync(),
                Inactive = await _repository.GetInactiveCountAsync(),
                Departments = await _repository.GetDepartmentsCountAsync(),
                DepartmentBreakdown = breakdownWithPercentage,
                RecentEmployees = recent.Select(MapToDto).ToList()
            };
        }

        public async Task<EmployeeResponseDto?> GetByIdAsync(int id)
        {
            var emp = await _repository.GetByIdAsync(id);
            return emp == null ? null : MapToDto(emp);
        }

        public async Task<EmployeeResponseDto?> CreateAsync(EmployeeRequestDto dto)
        {
            // Verify unique email
            if (await _repository.GetByEmailAsync(dto.Email) != null)
                return null;

            var employee = new Employee
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                Phone = dto.Phone,
                Department = dto.Department,
                Designation = dto.Designation,
                Salary = dto.Salary,
                JoinDate = dto.JoinDate,
                Status = dto.Status,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _repository.AddAsync(employee);
            await _repository.SaveChangesAsync();
            return MapToDto(employee);
        }

        public async Task<EmployeeResponseDto?> UpdateAsync(int id, EmployeeRequestDto dto)
        {
            var employee = await _repository.GetByIdAsync(id);
            if (employee == null) return null;

            // Check if email is changing and if it conflicts with someone else
            var existingWithEmail = await _repository.GetByEmailAsync(dto.Email);
            if (existingWithEmail != null && existingWithEmail.Id != id)
                throw new InvalidOperationException("EmailConflict");

            employee.FirstName = dto.FirstName;
            employee.LastName = dto.LastName;
            employee.Email = dto.Email;
            employee.Phone = dto.Phone;
            employee.Department = dto.Department;
            employee.Designation = dto.Designation;
            employee.Salary = dto.Salary;
            employee.JoinDate = dto.JoinDate;
            employee.Status = dto.Status;
            employee.UpdatedAt = DateTime.UtcNow;

            await _repository.UpdateAsync(employee);
            await _repository.SaveChangesAsync();
            return MapToDto(employee);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var employee = await _repository.GetByIdAsync(id);
            if (employee == null) return false;

            await _repository.DeleteAsync(employee);
            await _repository.SaveChangesAsync();
            return true;
        }

        // Helper to convert DB Model to JSON DTO
        private static EmployeeResponseDto MapToDto(Employee e)
        {
            return new EmployeeResponseDto
            {
                Id = e.Id,
                FirstName = e.FirstName,
                LastName = e.LastName,
                Email = e.Email,
                Phone = e.Phone,
                Department = e.Department,
                Designation = e.Designation,
                Salary = e.Salary,
                JoinDate = e.JoinDate.ToString("yyyy-MM-dd"), // Matches HTML5 date input format
                Status = e.Status
            };
        }
    }
}