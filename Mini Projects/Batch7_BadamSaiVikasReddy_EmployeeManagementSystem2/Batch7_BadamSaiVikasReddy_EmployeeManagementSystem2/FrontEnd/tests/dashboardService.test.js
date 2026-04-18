// Mock storageService globally
global.storageService = {
    getDashboard: jest.fn()
};

const dashboardService = require('../js/dashboardService');

describe('Dashboard Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('getSummary() should call storageService and return data', async () => {
        // Arrange: Mock the backend response
        const mockDashboardData = {
            total: 15,
            active: 10,
            inactive: 5,
            departments: 3,
            departmentBreakdown: [],
            recentEmployees: []
        };
        global.storageService.getDashboard.mockResolvedValue(mockDashboardData);

        // Act
        const result = await dashboardService.getSummary();

        // Assert
        expect(global.storageService.getDashboard).toHaveBeenCalledTimes(1);
        expect(result).toEqual(mockDashboardData);
        expect(result.total).toBe(15);
    });
});