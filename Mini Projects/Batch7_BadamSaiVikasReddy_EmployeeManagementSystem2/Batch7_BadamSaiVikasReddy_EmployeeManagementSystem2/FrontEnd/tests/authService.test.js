// Mock the global config object used in authService.js
global.config = { API_BASE_URL: 'http://localhost:5044/api' };

// Import the service
const authService = require('../js/authService'); 

describe('Auth Service', () => {
    beforeEach(() => {
        // Reset fetch mock and clear the session before each test
        global.fetch = jest.fn();
        authService.logout(); 
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('login() should store token and return true on success', async () => {
        // Arrange: Mock a successful API response
        global.fetch.mockResolvedValue({
            ok: true,
            json: async () => ({ success: true, username: 'admin', role: 'Admin', token: 'fake-jwt-token' })
        });

        // Act
        const result = await authService.login('admin', 'admin123');

        // Assert
        expect(result).toBe(true);
        expect(authService.isLoggedIn()).toBe(true);
        expect(authService.getCurrentUser()).toBe('admin');
        expect(authService.isAdmin()).toBe(true);
        expect(authService.getToken()).toBe('fake-jwt-token');
        expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    test('login() should return false on failure (401 Unauthorized)', async () => {
        // Arrange: Mock a failed API response
        global.fetch.mockResolvedValue({
            ok: false,
            json: async () => ({ success: false, message: 'Invalid credentials' })
        });

        // Act
        const result = await authService.login('wrong', 'pass');

        // Assert
        expect(result).toBe(false);
        expect(authService.isLoggedIn()).toBe(false);
        expect(authService.getToken()).toBeNull();
    });

    test('signup() should return success true for valid registration', async () => {
        // Arrange
        global.fetch.mockResolvedValue({
            ok: true,
            json: async () => ({})
        });

        // Act
        const result = await authService.signup('newadmin', 'pass123', 'Admin');

        // Assert
        expect(result.success).toBe(true);
        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('/auth/register'),
            expect.objectContaining({
                method: 'POST',
                body: JSON.stringify({ username: 'newadmin', password: 'pass123', role: 'Admin' })
            })
        );
    });

    test('logout() should clear the session', async () => {
        // First login to set the session
        global.fetch.mockResolvedValue({
            ok: true,
            json: async () => ({ success: true, username: 'viewer', role: 'Viewer', token: 'token' })
        });
        await authService.login('viewer', '123');
        expect(authService.isLoggedIn()).toBe(true);

        // Then logout
        authService.logout();
        
        expect(authService.isLoggedIn()).toBe(false);
        expect(authService.isAdmin()).toBe(false);
        expect(authService.getToken()).toBeNull();
    });
});