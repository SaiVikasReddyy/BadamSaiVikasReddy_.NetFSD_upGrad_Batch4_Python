/** @jest-environment jsdom */
// Mimic browser global scope
global.appData = require('../js/data');
global.storageService = require('../js/storageService');
const authService = require('../js/authService');

describe('Auth Service', () => {
    beforeEach(() => {
        Object.defineProperty(window, 'sessionStorage', {
            value: { getItem: jest.fn(), setItem: jest.fn(), removeItem: jest.fn() },
            writable: true
        });
    });

    test('signup() should reject duplicate usernames', () => {
        // Mock getAdmins to return an array of admins
        global.storageService.getAdmins = jest.fn().mockReturnValue([{ username: 'admin' }]);
        const result = authService.signup('admin', 'newpassword123');
        expect(result.success).toBe(false);
        expect(result.message).toBe("Username already exists.");
    });

    test('signup() should succeed with a new username', () => {
        global.storageService.getAdmins = jest.fn().mockReturnValue([{ username: 'oldadmin' }]);
        // Mock the new addAdmin function
        global.storageService.addAdmin = jest.fn(); 
        
        const result = authService.signup('newadmin', 'password123');
        expect(result.success).toBe(true);
        expect(global.storageService.addAdmin).toHaveBeenCalledWith('newadmin', 'password123');
    });

    test('login() should fail with an incorrect password', () => {
        global.storageService.getAdmins = jest.fn().mockReturnValue([{ username: 'admin', password: 'password123' }]);
        const result = authService.login('admin', 'wrongpassword');
        expect(result).toBe(false);
    });

    test('login() should succeed with correct credentials and set session', () => {
        global.storageService.getAdmins = jest.fn().mockReturnValue([{ username: 'admin', password: 'password123' }]);
        const result = authService.login('admin', 'password123');
        expect(result).toBe(true);
        expect(window.sessionStorage.setItem).toHaveBeenCalledWith('isAuth', 'true');
    });

    test('logout() should clear session storage', () => {
        authService.logout();
        expect(window.sessionStorage.removeItem).toHaveBeenCalledWith('isAuth');
    });
});