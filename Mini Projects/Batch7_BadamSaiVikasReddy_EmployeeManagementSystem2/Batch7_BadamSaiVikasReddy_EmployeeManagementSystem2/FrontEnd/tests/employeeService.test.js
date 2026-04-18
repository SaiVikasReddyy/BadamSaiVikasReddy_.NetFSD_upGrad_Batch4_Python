// Mock storageService globally
global.storageService = {
    getAll: jest.fn(),
    getById: jest.fn(),
    add: jest.fn(),
    update: jest.fn(),
    remove: jest.fn()
};

const employeeService = require('../js/employeeService');

describe('Employee Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('getAll() should pass query params to storageService', async () => {
        // Arrange
        const mockResponse = { data: [], totalCount: 0, page: 1, pageSize: 10 };
        global.storageService.getAll.mockResolvedValue(mockResponse);
        const queryParams = { page: 1, search: 'John' };

        // Act
        const result = await employeeService.getAll(queryParams);

        // Assert
        expect(global.storageService.getAll).toHaveBeenCalledWith(queryParams);
        expect(result).toEqual(mockResponse);
    });

    test('getById() should fetch single employee via storageService', async () => {
        // Arrange
        const mockEmployee = { id: 5, firstName: 'Test' };
        global.storageService.getById.mockResolvedValue(mockEmployee);

        // Act
        const result = await employeeService.getById(5);

        // Assert
        expect(global.storageService.getById).toHaveBeenCalledWith(5);
        expect(result).toEqual(mockEmployee);
    });

    test('add() should call storageService.add', async () => {
        const newEmp = { firstName: 'New', lastName: 'Emp' };
        global.storageService.add.mockResolvedValue(newEmp);

        await employeeService.add(newEmp);

        expect(global.storageService.add).toHaveBeenCalledWith(newEmp);
    });

    test('update() should call storageService.update', async () => {
        const updateData = { salary: 90000 };
        global.storageService.update.mockResolvedValue(updateData);

        await employeeService.update(1, updateData);

        expect(global.storageService.update).toHaveBeenCalledWith(1, updateData);
    });

    test('remove() should call storageService.remove', async () => {
        global.storageService.remove.mockResolvedValue(true);

        await employeeService.remove(99);

        expect(global.storageService.remove).toHaveBeenCalledWith(99);
    });

    test('getDepartments() should return the hardcoded list of 5 departments', () => {
        const depts = employeeService.getDepartments();
        
        expect(depts).toHaveLength(5);
        expect(depts).toContain('Engineering');
        expect(depts).toContain('Finance');
        expect(depts).toContain('HR');
        expect(depts).toContain('Marketing');
        expect(depts).toContain('Operations');
    });
});