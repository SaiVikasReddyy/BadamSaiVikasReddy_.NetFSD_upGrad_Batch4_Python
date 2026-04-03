const dashboardService = {
    getSummary: () => {
        const emps = employeeService.getAll();
        const total = emps.length;
        const active = emps.filter(e => e.status === 'Active').length;
        const inactive = emps.filter(e => e.status === 'Inactive').length;
        const departments = new Set(emps.map(e => e.department)).size;

        return { total, active, inactive, departments };
    },
    getDepartmentBreakdown: () => {
        const emps = employeeService.getAll();
        const total = emps.length;
        const breakdown = {};
        
        emps.forEach(e => {
            breakdown[e.department] = (breakdown[e.department] || 0) + 1;
        });

        return Object.entries(breakdown).map(([dept, count]) => ({
            department: dept,
            count: count,
            percentage: total ? Math.round((count / total) * 100) : 0
        })).sort((a, b) => b.count - a.count);
    },
    getRecentEmployees: (n = 5) => {
        // Sort by ID descending to get the newest added
        const emps = employeeService.getAll();
        return [...emps].sort((a, b) => b.id - a.id).slice(0, n);
    }
};

if (typeof module !== 'undefined') module.exports = dashboardService;