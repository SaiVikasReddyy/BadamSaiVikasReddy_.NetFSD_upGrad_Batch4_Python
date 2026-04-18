using System.ComponentModel.DataAnnotations;

namespace EMS.API.DTOs
{
    // Used for POST and PUT requests with server-side validation
    public class EmployeeRequestDto
    {
        [Required] public string FirstName { get; set; } = string.Empty;
        [Required] public string LastName { get; set; } = string.Empty;
        [Required, EmailAddress] public string Email { get; set; } = string.Empty;

        [Required, RegularExpression(@"^\d{10}$", ErrorMessage = "Must be a 10-digit number")]
        public string Phone { get; set; } = string.Empty;

        [Required] public string Department { get; set; } = string.Empty;
        [Required] public string Designation { get; set; } = string.Empty;

        [Required, Range(1, double.MaxValue, ErrorMessage = "Must be a positive number")]
        public decimal Salary { get; set; }

        [Required] public DateTime JoinDate { get; set; }
        [Required] public string Status { get; set; } = string.Empty;
    }

    // What the API sends back (hides internal fields like CreatedAt/UpdatedAt)
    public class EmployeeResponseDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string Designation { get; set; } = string.Empty;
        public decimal Salary { get; set; }
        public string JoinDate { get; set; } = string.Empty; // Sent as a formatted string to match the frontend
        public string Status { get; set; } = string.Empty;
    }

    // Binds query parameters from the GET request URL
    public class EmployeeQueryParams
    {
        public string? Search { get; set; }
        public string? Department { get; set; }
        public string? Status { get; set; }
        public string SortBy { get; set; } = "name";
        public string SortDir { get; set; } = "asc";
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }

    // The pagination envelope expected by the frontend
    public class PagedResult<T>
    {
        public IEnumerable<T> Data { get; set; } = new List<T>();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages => (int)Math.Ceiling((double)TotalCount / (PageSize == 0 ? 1 : PageSize));
        public bool HasNextPage => Page < TotalPages;
        public bool HasPrevPage => Page > 1;
    }

    // Single payload for the dashboard view
    public class DashboardSummaryDto
    {
        public int Total { get; set; }
        public int Active { get; set; }
        public int Inactive { get; set; }
        public int Departments { get; set; }
        public object DepartmentBreakdown { get; set; } = null!; // Will hold anonymous objects with dept/count/percentage
        public IEnumerable<EmployeeResponseDto> RecentEmployees { get; set; } = new List<EmployeeResponseDto>();
    }
}