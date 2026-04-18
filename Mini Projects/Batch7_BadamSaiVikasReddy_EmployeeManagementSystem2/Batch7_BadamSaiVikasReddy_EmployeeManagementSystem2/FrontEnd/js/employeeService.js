const employeeService = {
    // All methods are now async wrappers
    getAll: async (queryParams) => await storageService.getAll(queryParams),
    
    getById: async (id) => await storageService.getById(id),
    
    add: async (data) => await storageService.add(data),
    
    update: async (id, data) => await storageService.update(id, data),
    
    remove: async (id) => await storageService.remove(id),
    
    // Departments are strictly defined by the requirements
    getDepartments: () => ['Engineering', 'Finance', 'HR', 'Marketing', 'Operations']
};
if (typeof module !== 'undefined') module.exports = employeeService;