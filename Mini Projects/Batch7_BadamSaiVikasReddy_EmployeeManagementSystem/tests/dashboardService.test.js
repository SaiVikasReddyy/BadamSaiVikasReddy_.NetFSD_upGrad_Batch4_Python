/** @jest-environment jsdom */
// Mimic browser global scope
global.appData = require('../js/data');
global.storageService = require('../js/storageService');
global.employeeService = require('../js/employeeService');
const dashboardService = require('../js/dashboardService');

describe('Dashboard Service', () => {
    test('getSummary() should return correct aggregate counts for KPI cards', () => {
        const mockEmps = [
            { id: 1, status: 'Active', department: 'HR' },
            { id: 2, status: 'Inactive', department: 'HR' },
            { id: 3, status: 'Active', department: 'Engineering' }
        ];
        global.employeeService.getAll = jest.fn().mockReturnValue(mockEmps);
        const summary = dashboardService.getSummary();
        expect(summary.total).toBe(3);
        expect(summary.active).toBe(2);
        expect(summary.inactive).toBe(1);
    });

    test('getDepartmentBreakdown() should group and calculate percentages correctly', () => {
        const mockEmps = [
            { id: 1, department: 'IT' }, { id: 2, department: 'IT' },
            { id: 3, department: 'Sales' }, { id: 4, department: 'Sales' }
        ];
        global.employeeService.getAll = jest.fn().mockReturnValue(mockEmps);
        const breakdown = dashboardService.getDepartmentBreakdown();
        expect(breakdown.length).toBe(2);
        expect(breakdown.find(d => d.department === 'IT').count).toBe(2);
        expect(breakdown.find(d => d.department === 'IT').percentage).toBe(50);
    });

    test('getRecentEmployees() should return the N most recent based on highest ID', () => {
        const mockEmps = [
            { id: 10, name: 'Older Employee' },
            { id: 12, name: 'Newest Employee' },
            { id: 11, name: 'Newer Employee' }
        ];
        global.employeeService.getAll = jest.fn().mockReturnValue(mockEmps);
        const recent = dashboardService.getRecentEmployees(2);
        expect(recent.length).toBe(2);
        expect(recent[0].id).toBe(12);
    });
});