const employeeService = {
    getAll: () => storageService.getAll(),
    getById: (id) => storageService.getById(id),
    add: (data) => {
        const newEmp = { id: storageService.nextId(), ...data };
        storageService.add(newEmp);
    },
    update: (id, data) => storageService.update(id, data),
    remove: (id) => storageService.remove(id),
    
    // Aggregation for dropdowns
    getUniqueDepartments: () => {
        const emps = storageService.getAll();
        return [...new Set(emps.map(e => e.department))].sort();
    },

    // Handles Search, Dept, and Status filtering with AND logic
    applyFilters: (query, dept, status) => {
        let results = storageService.getAll();
        
        if (query) {
            const q = query.toLowerCase();
            results = results.filter(e => 
                `${e.firstName} ${e.lastName}`.toLowerCase().includes(q) || 
                e.email.toLowerCase().includes(q)
            );
        }
        if (dept) {
            results = results.filter(e => e.department === dept);
        }
        if (status) {
            results = results.filter(e => e.status === status);
        }
        return results;
    },

    sortBy: (dataArray, field, direction) => {
        return [...dataArray].sort((a, b) => {
            let valA = a[field];
            let valB = b[field];

            if (field === 'name') {
                valA = a.lastName.toLowerCase();
                valB = b.lastName.toLowerCase();
            } else if (field === 'joinDate') {
                valA = new Date(a.joinDate);
                valB = new Date(b.joinDate);
            }

            if (valA < valB) return direction === 'asc' ? -1 : 1;
            if (valA > valB) return direction === 'asc' ? 1 : -1;
            return 0;
        });
    }
};

if (typeof module !== 'undefined') module.exports = employeeService;