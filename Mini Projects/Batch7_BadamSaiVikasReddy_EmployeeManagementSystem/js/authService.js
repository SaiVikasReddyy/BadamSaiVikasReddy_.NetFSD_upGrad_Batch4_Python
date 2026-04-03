const authService = {
    signup: (username, password) => {
        const admins = storageService.getAdmins(); // Get the full list
        
        // Check if username already exists in the list
        const exists = admins.find(admin => admin.username === username);
        if (exists) {
            return { success: false, message: "Username already exists." };
        }
        
        // If it doesn't exist, add them to the list
        storageService.addAdmin(username, password);
        return { success: true };
    },
    login: (username, password) => {
        const admins = storageService.getAdmins(); // Get the full list
        
        // Search the list for a matching username AND password
        const validAdmin = admins.find(admin => admin.username === username && admin.password === password);
        
        if (validAdmin) {
            sessionStorage.setItem('isAuth', 'true');
            sessionStorage.setItem('username', username);
            return true;
        }
        return false;
    },
    logout: () => {
        sessionStorage.removeItem('isAuth');
        sessionStorage.removeItem('username');
    },
    isLoggedIn: () => sessionStorage.getItem('isAuth') === 'true',
    getCurrentUser: () => sessionStorage.getItem('username')
};

if (typeof module !== 'undefined') module.exports = authService;