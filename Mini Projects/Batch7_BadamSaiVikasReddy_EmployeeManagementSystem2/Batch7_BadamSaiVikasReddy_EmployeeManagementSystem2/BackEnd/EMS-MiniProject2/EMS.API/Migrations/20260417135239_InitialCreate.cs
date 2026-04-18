using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace EMS.API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AppUsers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Username = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Role = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Employees",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FirstName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: false),
                    Department = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Designation = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Salary = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    JoinDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Employees", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "AppUsers",
                columns: new[] { "Id", "CreatedAt", "PasswordHash", "Role", "Username" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 4, 17, 13, 52, 37, 600, DateTimeKind.Utc).AddTicks(3913), "$2a$11$pJv3y.ac.7yL30S27a3BKeQpAc6W2oQNthYM8c8pleP3gdJNFWiHu", "Admin", "admin" },
                    { 2, new DateTime(2026, 4, 17, 13, 52, 37, 600, DateTimeKind.Utc).AddTicks(3920), "$2a$11$WwnZNU.xTPqLlG2IA4vWE.KcnfzpTf6SIdmRxShy2LJA71OPFbJoe", "Viewer", "viewer" }
                });

            migrationBuilder.InsertData(
                table: "Employees",
                columns: new[] { "Id", "CreatedAt", "Department", "Designation", "Email", "FirstName", "JoinDate", "LastName", "Phone", "Salary", "Status", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 4, 17, 13, 52, 37, 600, DateTimeKind.Utc).AddTicks(4296), "Engineering", "Software Engineer", "saivikasreddy.b@gmail.com", "Sai Vikas Reddy", new DateTime(2021, 3, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "Badam", "9876543210", 850000m, "Active", new DateTime(2026, 4, 17, 13, 52, 37, 600, DateTimeKind.Utc).AddTicks(4297) },
                    { 2, new DateTime(2026, 4, 17, 13, 52, 37, 600, DateTimeKind.Utc).AddTicks(4300), "Marketing", "Marketing Executive", "mohith.k@gmail.com", "Mohith", new DateTime(2021, 5, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "Kankanala", "9123456780", 610000m, "Active", new DateTime(2026, 4, 17, 13, 52, 37, 600, DateTimeKind.Utc).AddTicks(4301) },
                    { 3, new DateTime(2026, 4, 17, 13, 52, 37, 600, DateTimeKind.Utc).AddTicks(4305), "HR", "HR Manager", "sandeep.k@gmail.com", "Sandeep", new DateTime(2018, 10, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), "Konda", "9876512340", 720000m, "Active", new DateTime(2026, 4, 17, 13, 52, 37, 600, DateTimeKind.Utc).AddTicks(4305) },
                    { 4, new DateTime(2026, 4, 17, 13, 52, 37, 600, DateTimeKind.Utc).AddTicks(4310), "Finance", "Senior Accountant", "vineeth.g@gmail.com", "Vineeth", new DateTime(2020, 2, 18, 0, 0, 0, 0, DateTimeKind.Unspecified), "Gontla", "9988776655", 760000m, "Active", new DateTime(2026, 4, 17, 13, 52, 37, 600, DateTimeKind.Utc).AddTicks(4310) },
                    { 5, new DateTime(2026, 4, 17, 13, 52, 37, 600, DateTimeKind.Utc).AddTicks(4312), "Operations", "Operations Manager", "santosh.s@gmail.com", "Santosh", new DateTime(2017, 4, 21, 0, 0, 0, 0, DateTimeKind.Unspecified), "Sane", "9123123123", 950000m, "Active", new DateTime(2026, 4, 17, 13, 52, 37, 600, DateTimeKind.Utc).AddTicks(4312) },
                    { 6, new DateTime(2026, 4, 17, 13, 52, 37, 600, DateTimeKind.Utc).AddTicks(4315), "Engineering", "Software Developer", "manohar.g@gmail.com", "Manohar", new DateTime(2019, 10, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), "Gundu", "8456739021", 1150000m, "InActive", new DateTime(2026, 4, 17, 13, 52, 37, 600, DateTimeKind.Utc).AddTicks(4315) },
                    { 7, new DateTime(2026, 4, 17, 13, 52, 37, 600, DateTimeKind.Utc).AddTicks(4317), "Operations", "Operations Executive", "sarayu.s@gmail.com", "Sarayu", new DateTime(2018, 7, 11, 0, 0, 0, 0, DateTimeKind.Unspecified), "Sigatapu", "6301832568", 650000m, "Active", new DateTime(2026, 4, 17, 13, 52, 37, 600, DateTimeKind.Utc).AddTicks(4318) },
                    { 8, new DateTime(2026, 4, 17, 13, 52, 37, 600, DateTimeKind.Utc).AddTicks(4320), "Engineering", "Associate Software Engineer", "vignesh.g@gmail.com", "Vignesh", new DateTime(2021, 6, 9, 0, 0, 0, 0, DateTimeKind.Unspecified), "Gontla", "9076438215", 1000000m, "Active", new DateTime(2026, 4, 17, 13, 52, 37, 600, DateTimeKind.Utc).AddTicks(4320) },
                    { 9, new DateTime(2026, 4, 17, 13, 52, 37, 600, DateTimeKind.Utc).AddTicks(4322), "Operations", "Operations Executive", "rohith.k@gmail.com", "Rohith", new DateTime(2023, 9, 8, 0, 0, 0, 0, DateTimeKind.Unspecified), "kallepalli", "9703467210", 750000m, "Active", new DateTime(2026, 4, 17, 13, 52, 37, 600, DateTimeKind.Utc).AddTicks(4323) },
                    { 10, new DateTime(2026, 4, 17, 13, 52, 37, 600, DateTimeKind.Utc).AddTicks(4325), "Finance", "Accountant", "saleem.s@gmail.com", "Saleem", new DateTime(2024, 5, 23, 0, 0, 0, 0, DateTimeKind.Unspecified), "Shaik", "8075239416", 860000m, "Active", new DateTime(2026, 4, 17, 13, 52, 37, 600, DateTimeKind.Utc).AddTicks(4325) },
                    { 11, new DateTime(2026, 4, 17, 13, 52, 37, 600, DateTimeKind.Utc).AddTicks(4327), "HR", "HR Executive", "venkatesh.n@gmail.com", "Venkatesh", new DateTime(2025, 2, 18, 0, 0, 0, 0, DateTimeKind.Unspecified), "Namasani", "7672398451", 620000m, "Active", new DateTime(2026, 4, 17, 13, 52, 37, 600, DateTimeKind.Utc).AddTicks(4328) },
                    { 12, new DateTime(2026, 4, 17, 13, 52, 37, 600, DateTimeKind.Utc).AddTicks(4330), "Marketing", "Marketing Manager", "pradeep.ch@gmail.com", "Pradeep", new DateTime(2025, 5, 27, 0, 0, 0, 0, DateTimeKind.Unspecified), "Cheekati", "8934021786", 900000m, "Active", new DateTime(2026, 4, 17, 13, 52, 37, 600, DateTimeKind.Utc).AddTicks(4330) },
                    { 13, new DateTime(2026, 4, 17, 13, 52, 37, 600, DateTimeKind.Utc).AddTicks(4332), "Engineering", "App Developer", "tharun.p@gmail.com", "Tharun", new DateTime(2025, 7, 29, 0, 0, 0, 0, DateTimeKind.Unspecified), "Putta", "9803672482", 950000m, "Active", new DateTime(2026, 4, 17, 13, 52, 37, 600, DateTimeKind.Utc).AddTicks(4332) },
                    { 14, new DateTime(2026, 4, 17, 13, 52, 37, 600, DateTimeKind.Utc).AddTicks(4334), "Engineering", "Advance Associate Software Engineer", "vamsi.b@gmail.com", "Vamsi", new DateTime(2025, 10, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), "Badam", "7285634021", 1100000m, "Active", new DateTime(2026, 4, 17, 13, 52, 37, 600, DateTimeKind.Utc).AddTicks(4358) },
                    { 15, new DateTime(2026, 4, 17, 13, 52, 37, 600, DateTimeKind.Utc).AddTicks(4360), "Marketing", "marketing Manager", "rahul.s@gmail.com", "Rahul", new DateTime(2026, 8, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "Sura", "8356012987", 850000m, "Active", new DateTime(2026, 4, 17, 13, 52, 37, 600, DateTimeKind.Utc).AddTicks(4360) }
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppUsers_Username",
                table: "AppUsers",
                column: "Username",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Employees_Email",
                table: "Employees",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppUsers");

            migrationBuilder.DropTable(
                name: "Employees");
        }
    }
}
