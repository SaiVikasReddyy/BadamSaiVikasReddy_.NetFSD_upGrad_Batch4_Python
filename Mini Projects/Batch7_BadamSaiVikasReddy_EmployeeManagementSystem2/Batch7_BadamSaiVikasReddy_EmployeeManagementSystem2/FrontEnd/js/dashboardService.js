const dashboardService = {
    // The C# backend now calculates KPIs, breakdown, and recent employees in a single response
    getSummary: async () => {
        return await storageService.getDashboard();
    }
};

if (typeof module !== 'undefined') module.exports = dashboardService;