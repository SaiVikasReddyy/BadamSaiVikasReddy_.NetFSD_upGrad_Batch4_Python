using EMS.API.DTOs;
using EMS.API.Models;
using EMS.API.Services;
using Moq;
using NUnit.Framework;

namespace EMS.Tests.Services
{
    [TestFixture]
    public class EmployeeServiceTests
    {
        private Mock<IEmployeeRepository> _repoMock;
        private EmployeeService _service;

        [SetUp]
        public void Setup()
        {
            _repoMock = new Mock<IEmployeeRepository>();
            // Inject the mocked repository into the service
            _service = new EmployeeService(_repoMock.Object);
        }

        [Test]
        public async Task GetByIdAsync_ValidId_ReturnsMappedDto()
        {
            // Arrange
            var fakeEmployee = new Employee
            {
                Id = 1,
                FirstName = "Priya",
                LastName = "Prabhu",
                Email = "p@h.com",
                Status = "Active"
            };

            _repoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(fakeEmployee);

            // Act
            var result = await _service.GetByIdAsync(1);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result!.FirstName, Is.EqualTo("Priya"));
            Assert.That(result.Email, Is.EqualTo("p@h.com"));
            _repoMock.Verify(r => r.GetByIdAsync(1), Times.Once); // Confirm mock interaction
        }

        [Test]
        public async Task GetByIdAsync_InvalidId_ReturnsNull()
        {
            // Arrange
            _repoMock.Setup(r => r.GetByIdAsync(9999)).ReturnsAsync((Employee?)null);

            // Act
            var result = await _service.GetByIdAsync(9999);

            // Assert
            Assert.That(result, Is.Null);
            _repoMock.Verify(r => r.GetByIdAsync(9999), Times.Once);
        }

        [Test]
        public async Task CreateAsync_ValidData_CallsAddAsyncOnRepo()
        {
            // Arrange
            var newEmpDto = new EmployeeRequestDto
            {
                FirstName = "Test",
                LastName = "User",
                Email = "test@user.com",
                Status = "Active"
            };

            // Simulate that the email does not exist yet
            _repoMock.Setup(r => r.GetByEmailAsync(newEmpDto.Email)).ReturnsAsync((Employee?)null);

            // Act
            var result = await _service.CreateAsync(newEmpDto);

            // Assert
            Assert.That(result, Is.Not.Null);
            _repoMock.Verify(r => r.AddAsync(It.IsAny<Employee>()), Times.Once);
            _repoMock.Verify(r => r.SaveChangesAsync(), Times.Once);
        }
    }
}