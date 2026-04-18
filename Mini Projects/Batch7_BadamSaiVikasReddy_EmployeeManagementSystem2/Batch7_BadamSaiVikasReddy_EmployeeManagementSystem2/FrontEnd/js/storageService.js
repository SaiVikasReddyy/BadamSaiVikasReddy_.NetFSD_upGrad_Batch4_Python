const storageService = {
    // Helper function to generate headers with the JWT token
    _headers: (withAuth = true) => {
        const headers = { "Content-Type": "application/json" };
        if (withAuth) {
            const token = authService.getToken();
            if (token) headers["Authorization"] = `Bearer ${token}`;
        }
        return headers;
    },

    getAll: async (queryParams = {}) => {
        // Convert the query parameters object into a URL query string (e.g., ?page=1&search=John)
        const params = new URLSearchParams(queryParams).toString();
        const url = `${config.API_BASE_URL}/employees${params ? '?' + params : ''}`;
        
        const response = await fetch(url, { headers: storageService._headers() });
        if (!response.ok) throw new Error('Failed to fetch employees');
        
        return await response.json(); // Returns the PagedResult JSON from your C# API
    },

    getById: async (id) => {
        const response = await fetch(`${config.API_BASE_URL}/employees/${id}`, { headers: storageService._headers() });
        if (!response.ok) throw new Error('Failed to fetch employee');
        return await response.json();
    },

    add: async (employee) => {
        const response = await fetch(`${config.API_BASE_URL}/employees`, {
            method: 'POST',
            headers: storageService._headers(),
            body: JSON.stringify(employee)
        });
        
        if (response.status === 409) {
            const data = await response.json();
            throw { status: 409, data }; // Throwing this so app.js can show the duplicate email error
        }
        if (!response.ok) throw new Error('Failed to add employee');
        return await response.json();
    },

    update: async (id, employee) => {
        const response = await fetch(`${config.API_BASE_URL}/employees/${id}`, {
            method: 'PUT',
            headers: storageService._headers(),
            body: JSON.stringify(employee)
        });
        
        if (response.status === 409) {
            const data = await response.json();
            throw { status: 409, data }; 
        }
        if (!response.ok) throw new Error('Failed to update employee');
        return await response.json();
    },

    remove: async (id) => {
        const response = await fetch(`${config.API_BASE_URL}/employees/${id}`, {
            method: 'DELETE',
            headers: storageService._headers()
        });
        if (!response.ok) throw new Error('Failed to delete employee');
        return true;
    },

    // A single API call replaces three separate methods!
    getDashboard: async () => {
        const response = await fetch(`${config.API_BASE_URL}/employees/dashboard`, { headers: storageService._headers() });
        if (!response.ok) throw new Error('Failed to fetch dashboard summary');
        return await response.json();
    }
};
if (typeof module !== 'undefined') module.exports = storageService;