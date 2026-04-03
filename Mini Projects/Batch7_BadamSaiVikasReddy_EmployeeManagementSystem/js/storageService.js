const storageService = {
    // 1. Helper function to sync current data to localStorage
    saveEmployees: () => {
        localStorage.setItem('ems_employees', JSON.stringify(appData.employees));
    },

    // 2. Helper function to load data when the app starts
    initEmployees: () => {
        const savedData = localStorage.getItem('ems_employees');
        if (savedData) {
            // If we have saved data, overwrite the default array with it
            appData.employees = JSON.parse(savedData);
        } else {
            // If it's the first time, save the default data.js list to localStorage
            storageService.saveEmployees();
        }
    },

    getAll: () => [...appData.employees],
    getById: (id) => appData.employees.find(emp => emp.id === id),
    
    add: (employee) => {
        appData.employees.push(employee);
        storageService.saveEmployees(); // Save to local storage after adding
    },
    
    update: (id, updatedData) => {
        const index = appData.employees.findIndex(emp => emp.id === id);
        if (index !== -1) {
            appData.employees[index] = { ...appData.employees[index], ...updatedData };
            storageService.saveEmployees(); // Save to local storage after editing
        }
    },
    
    remove: (id) => {
        appData.employees = appData.employees.filter(emp => emp.id !== id);
        storageService.saveEmployees(); // Save to local storage after deleting
    },
    
    nextId: () => {
        return appData.employees.length > 0 
            ? Math.max(...appData.employees.map(emp => emp.id)) + 1 
            : 1;
    },
    
    // Admin methods remain exactly the same
    getAdmins: () => {
        const savedAdmins = localStorage.getItem('ems_admins');
        return savedAdmins ? JSON.parse(savedAdmins) : [appData.admin];
    },
    addAdmin: (username, password) => {
        const admins = storageService.getAdmins();
        admins.push({ username, password }); 
        localStorage.setItem('ems_admins', JSON.stringify(admins)); 
    }
};

// Initialize the employee data immediately when this file loads
storageService.initEmployees();

if (typeof module !== 'undefined') module.exports = storageService;