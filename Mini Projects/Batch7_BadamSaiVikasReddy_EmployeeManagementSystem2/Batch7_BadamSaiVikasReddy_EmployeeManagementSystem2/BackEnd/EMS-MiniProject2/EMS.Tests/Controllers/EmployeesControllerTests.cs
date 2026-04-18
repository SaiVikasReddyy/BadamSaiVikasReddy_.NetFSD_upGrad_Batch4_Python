using EMS.API.Controllers;
using EMS.API.DTOs;
using EMS.API.Models;
using EMS.API.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using NUnit.Framework;

namespace EMS.Tests.Controllers
{
    [TestFixture]
    public class EmployeesControllerTests
    {
        private Mock<IEmployeeRepository> _repoMock;
        private EmployeeService _service;
        private EmployeesController _controller;

        [SetUp]
        public void Setup()
        {
            // 1. Mock the repository layer
            _repoMock = new Mock<IEmployeeRepository>();

            // 2. Pass the mock into the real service
            _service = new EmployeeService(_repoMock.Object);

            // 3. Pass the service into the controller we want to test
            _controller = new EmployeesController(_service);
        }

        [Test]
        public async Task GetEmployee_ValidId_ReturnsOkResult()
        {
            // Arrange - Setup the mock to return a fake employee
            var fakeEmployee = new Employee
            {
                Id = 1,
                FirstName = "Test",
                LastName = "User",
                Email = "test@user.com"
            };
            _repoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(fakeEmployee);

            // Act - Call the controller endpoint
            var actionResult = await _controller.GetEmployee(1);

            // Assert - Check if it returned a 200 OK
            Assert.That(actionResult.Result, Is.InstanceOf<OkObjectResult>());

            // Extract the data from the 200 OK response
            var okResult = (OkObjectResult)actionResult.Result!;
            var returnedDto = (EmployeeResponseDto)okResult.Value!;

            Assert.That(returnedDto.FirstName, Is.EqualTo("Test"));
            Assert.That(returnedDto.Email, Is.EqualTo("test@user.com"));
        }

        [Test]
        public async Task GetEmployee_InvalidId_ReturnsNotFound()
        {
            // Arrange - Setup the mock to return null (not found)
            _repoMock.Setup(r => r.GetByIdAsync(999)).ReturnsAsync((Employee?)null);

            // Act
            var actionResult = await _controller.GetEmployee(999);

            // Assert - Check if it correctly returned a 404 Not Found
            Assert.That(actionResult.Result, Is.InstanceOf<NotFoundResult>());
        }

        [Test]
        public async Task CreateEmployee_ValidData_ReturnsCreatedAtAction()
        {
            // Arrange
            var newEmployeeReq = new EmployeeRequestDto
            {
                FirstName = "Jane",
                LastName = "Doe",
                Email = "jane@doe.com",
                Status = "Active"
            };

            // Setup mock to confirm email doesn't already exist
            _repoMock.Setup(r => r.GetByEmailAsync("jane@doe.com")).ReturnsAsync((Employee?)null);

            // Act
            var actionResult = await _controller.CreateEmployee(newEmployeeReq);

            // Assert - Check if it returned a 201 Created status
            Assert.That(actionResult.Result, Is.InstanceOf<CreatedAtActionResult>());

            var createdResult = (CreatedAtActionResult)actionResult.Result!;

            // Verify it points to the "GetEmployee" method to fetch the new record
            Assert.That(createdResult.ActionName, Is.EqualTo(nameof(_controller.GetEmployee)));

            var returnedDto = (EmployeeResponseDto)createdResult.Value!;
            Assert.That(returnedDto.FirstName, Is.EqualTo("Jane"));
        }

        [Test]
        public async Task CreateEmployee_DuplicateEmail_ReturnsConflict()
        {
            // Arrange
            var req = new EmployeeRequestDto { Email = "duplicate@test.com" };
            var existingEmp = new Employee { Id = 5, Email = "duplicate@test.com" };

            // Setup mock to simulate an existing user with this email
            _repoMock.Setup(r => r.GetByEmailAsync("duplicate@test.com")).ReturnsAsync(existingEmp);

            // Act
            var actionResult = await _controller.CreateEmployee(req);

            // Assert - Check if it returned a 409 Conflict
            Assert.That(actionResult.Result, Is.InstanceOf<ConflictObjectResult>());
        }
    }
}