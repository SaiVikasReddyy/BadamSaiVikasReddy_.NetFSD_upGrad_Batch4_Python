using EMS.API.DTOs;
using EMS.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EMS.API.Controllers
{
    [Authorize] // Any authenticated user can access this controller by default
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeesController : ControllerBase
    {
        private readonly EmployeeService _employeeService;

        public EmployeesController(EmployeeService employeeService)
        {
            _employeeService = employeeService;
        }

        // GET: api/employees
        [HttpGet]
        public async Task<ActionResult<PagedResult<EmployeeResponseDto>>> GetEmployees([FromQuery] EmployeeQueryParams queryParams)
        {
            var result = await _employeeService.GetEmployeesAsync(queryParams);
            return Ok(result);
        }

        // GET: api/employees/dashboard
        [HttpGet("dashboard")]
        public async Task<ActionResult<DashboardSummaryDto>> GetDashboard()
        {
            var result = await _employeeService.GetDashboardSummaryAsync();
            return Ok(result);
        }

        // GET: api/employees/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EmployeeResponseDto>> GetEmployee(int id)
        {
            var employee = await _employeeService.GetByIdAsync(id);
            if (employee == null) return NotFound();

            return Ok(employee);
        }

        // POST: api/employees
        [Authorize(Roles = "Admin")] // ONLY Admins can create
        [HttpPost]
        public async Task<ActionResult<EmployeeResponseDto>> CreateEmployee([FromBody] EmployeeRequestDto request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var createdEmployee = await _employeeService.CreateAsync(request);

            if (createdEmployee == null)
            {
                // Return 409 Conflict if email already exists (as per requirements)
                return Conflict(new { email = "Email already exists in the system" });
            }

            return CreatedAtAction(nameof(GetEmployee), new { id = createdEmployee.Id }, createdEmployee);
        }

        // PUT: api/employees/5
        [Authorize(Roles = "Admin")] // ONLY Admins can edit
        [HttpPut("{id}")]
        public async Task<ActionResult<EmployeeResponseDto>> UpdateEmployee(int id, [FromBody] EmployeeRequestDto request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            try
            {
                var updatedEmployee = await _employeeService.UpdateAsync(id, request);
                if (updatedEmployee == null) return NotFound();

                return Ok(updatedEmployee);
            }
            catch (InvalidOperationException ex) when (ex.Message == "EmailConflict")
            {
                return Conflict(new { email = "Email already exists with another employee." });
            }
        }

        // DELETE: api/employees/5
        [Authorize(Roles = "Admin")] // ONLY Admins can delete
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            var success = await _employeeService.DeleteAsync(id);
            if (!success) return NotFound();

            return Ok(); // 200 OK
        }
    }
}