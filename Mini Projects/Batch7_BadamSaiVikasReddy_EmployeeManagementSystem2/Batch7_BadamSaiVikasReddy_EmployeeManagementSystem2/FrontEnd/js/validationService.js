const validationService = {
    validateEmployeeForm: (data, isEdit, currentId) => {
        const errors = {};
        
        if (!data.firstName.trim()) errors.firstName = "First Name is required";
        if (!data.lastName.trim()) errors.lastName = "Last Name is required";
        
        // Email validation (Format check only. Backend checks for duplicates!)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email.trim()) {
            errors.email = "Email is required";
        } else if (!emailRegex.test(data.email)) {
            errors.email = "Invalid Email format";
        }

        if (!data.phone.trim()) {
            errors.phone = "Phone Number is required";
        } else if (!/^\d{10}$/.test(data.phone)) {
            errors.phone = "Must be a 10-digit number";
        }

        if (!data.department) errors.department = "Select a Department";
        if (!data.designation.trim()) errors.designation = "Designation is required";
        
        if (!data.salary) {
            errors.salary = "Salary is required";
        } else if (Number(data.salary) <= 0) {
            errors.salary = "Must be a positive number";
        }

        if (!data.joinDate) errors.joinDate = "Join Date is required";
        if (!data.status) errors.status = "Select a Status";

        return Object.keys(errors).length > 0 ? errors : null;
    },
    
    validateAuthForm: (username, password, confirmPassword = null) => {
        const errors = {};
        if (!username.trim()) errors.username = "Username required";
        if (!password) errors.password = "Password required";
        else if (password.length < 6) errors.password = "Minimum 6 characters";
        
        if (confirmPassword !== null && password !== confirmPassword) {
            errors.confirm = "Passwords do not match";
        }
        return Object.keys(errors).length > 0 ? errors : null;
    }
};
if (typeof module !== 'undefined') module.exports = validationService;