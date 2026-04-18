using EMS.API.Models;

namespace EMS.API.Services
{
    public interface IEmployeeRepository
    {
        // Exposing IQueryable allows the Service layer to attach WHERE and ORDER BY clauses 
        // before the query is actually executed in SQL Server.
        IQueryable<Employee> GetAllAsQueryable();

        Task<Employee?> GetByIdAsync(int id);
        Task<Employee?> GetByEmailAsync(string email);
        Task AddAsync(Employee employee);
        Task UpdateAsync(Employee employee);
        Task DeleteAsync(Employee employee);
        Task<int> SaveChangesAsync();

        // Dashboard specific queries
        Task<int> GetTotalCountAsync();
        Task<int> GetActiveCountAsync();
        Task<int> GetInactiveCountAsync();
        Task<int> GetDepartmentsCountAsync();
        Task<List<KeyValuePair<string, int>>> GetDepartmentBreakdownAsync();
        Task<List<Employee>> GetRecentEmployeesAsync(int count);
    }
}