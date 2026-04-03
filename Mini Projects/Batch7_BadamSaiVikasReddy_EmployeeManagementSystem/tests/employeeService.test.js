/** @jest-environment jsdom */
// Mimic browser global scope
global.appData = require('../js/data');
global.storageService = require('../js/storageService');
const employeeService = require('../js/employeeService');

describe('Employee Service', () => {
    test('getAll() should return data from storageService', () => {
        const mockData = [{ id: 1, firstName: 'Priya', lastName: 'Prabhu' }];
        global.storageService.getAll = jest.fn().mockReturnValue(mockData);
        const result = employeeService.getAll();
        expect(result).toEqual(mockData);
    });

    test('add() should assign a new ID and push to storage', () => {
        global.storageService.nextId = jest.fn().mockReturnValue(99);
        global.storageService.add = jest.fn();
        employeeService.add({ firstName: 'John', lastName: 'Doe', department: 'IT' });
        expect(global.storageService.add).toHaveBeenCalledWith({ id: 99, firstName: 'John', lastName: 'Doe', department: 'IT' });
    });

    test('applyFilters() should filter by search query (name) and status using AND logic', () => {
        const mockData = [
            { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@test.com', status: 'Active' },
            { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@test.com', status: 'Inactive' },
            { id: 3, firstName: 'Johnny', lastName: 'Appleseed', email: 'ja@test.com', status: 'Active' }
        ];
        global.storageService.getAll = jest.fn().mockReturnValue(mockData);
        const result = employeeService.applyFilters('john', '', 'Active');
        expect(result.length).toBe(2);
        expect(result[0].firstName).toBe('John');
    });

    test('sortBy() should correctly sort by salary in descending order', () => {
        const mockData = [{ id: 1, salary: 50000 }, { id: 2, salary: 100000 }, { id: 3, salary: 75000 }];
        const result = employeeService.sortBy(mockData, 'salary', 'desc');
        expect(result[0].salary).toBe(100000);
    });
});