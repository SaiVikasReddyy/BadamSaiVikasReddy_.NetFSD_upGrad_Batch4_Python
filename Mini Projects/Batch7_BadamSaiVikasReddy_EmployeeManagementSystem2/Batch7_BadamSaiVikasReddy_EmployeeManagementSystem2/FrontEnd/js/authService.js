let _session = null;

const authService = {
    signup: async (username, password, role = 'Viewer') => {
        try {
            const response = await fetch(`${config.API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, role }) // Passing Role here
            });
            
            if (response.status === 409) {
                const data = await response.json();
                return { success: false, message: data.message || "Username already exists." };
            }
            if (!response.ok) return { success: false, message: "Registration failed." };
            
            return { success: true };
        } catch (error) {
            console.error("Signup error:", error);
            return { success: false, message: "Network error." };
        }
    },
    
    login: async (username, password) => {
        try {
            const response = await fetch(`${config.API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Store JWT and user info securely in memory
                _session = {
                    username: data.username,
                    role: data.role,
                    token: data.token
                };
                return true;
            }
            return false;
        } catch (error) {
            console.error("Login error:", error);
            return false;
        }
    },
    
    logout: () => {
        _session = null; // Wipe the memory
    },
    
    isLoggedIn: () => _session !== null && _session.token !== undefined,
    
    getCurrentUser: () => _session ? _session.username : null,
    
    // New methods needed for the API and Role-Based UI
    getToken: () => _session ? _session.token : null,
    
    isAdmin: () => _session ? _session.role === 'Admin' : false
};
if (typeof module !== 'undefined') module.exports = authService;