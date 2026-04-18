# Employee Management System - Mini Project 2

**Name:** Badam Sai Vikas Reddy
**Batch:** Batch 7

## Submission Notes
The frontend `config.js` is set up to support both Visual Studio and VS Code.

## Default Test Credentials
Use these accounts to test the role-based access control (RBAC) in the frontend:
* **Admin Access:**
  * Username: `admin`
  * Password: `admin123`
* **Viewer Access:**
  * Username: `viewer`
  * Password: `viewer123`

## How to Run the API (Backend)
**Option A: Using Visual Studio**
1. Open the solution in Visual Studio.
2. Open the Package Manager Console and run: `Update-Database`
3. Press **F5** or Click **Run** button to start the API (it will launch on port 5000).

**Option B: Using VS Code / CLI**
1. Open your terminal and navigate to the API directory: `cd EMS.API`
2. Apply the database migrations: `dotnet ef database update`
3. Start the backend server using the HTTPS profile: `dotnet run`

## How to Run the Frontend
1. Open Visual Studio Code.
2. Navigate to the `frontend` folder.
3. Right-click on `index.html` and select **"Open with Live Server"**.