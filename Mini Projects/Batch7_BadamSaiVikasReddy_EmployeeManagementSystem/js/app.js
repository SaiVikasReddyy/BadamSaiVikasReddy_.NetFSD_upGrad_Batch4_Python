$(document).ready(() => {

    // State
    let currentSort = { field: 'id', direction: 'asc' };

    // --- Routing & Initialization ---
    const checkAuthAndRoute = () => {
        if (authService.isLoggedIn()) {
            $('#main-nav').removeClass('d-none');
            $('#login-view, #signup-view').addClass('d-none');

            // --- ADD THIS LINE TO UPDATE THE USERNAME ---
            const user = authService.getCurrentUser();
            $('#nav-username').text(user.charAt(0).toUpperCase() + user.slice(1));

            showView('dashboard');
            refreshAppContent();
        } else {
            $('#main-nav').addClass('d-none');
            $('.view-section').addClass('d-none');
            $('#login-view').removeClass('d-none');
        }
    };

    const showView = (viewName) => {
        $('.view-section').addClass('d-none');
        $(`#${viewName}-view`).removeClass('d-none');
        $('.nav-link').removeClass('active');
        $(`#nav-${viewName}`).addClass('active');
    };

    const refreshAppContent = () => {
        // Refresh Dashboard Cards
        uiService.renderDashboardCards(dashboardService.getSummary());
        uiService.renderDepartmentBreakdown(dashboardService.getDepartmentBreakdown());
        uiService.renderRecentEmployees(dashboardService.getRecentEmployees());

        // Refresh Employee Table logic
        uiService.populateDepartmentDropdown(employeeService.getUniqueDepartments());
        triggerFilterSortUpdate();
    };

    const triggerFilterSortUpdate = () => {
        const query = $('#search-input').val();
        const dept = $('#filter-dept').val();
        const status = $('input[name="statusFilter"]:checked').val();

        let filtered = employeeService.applyFilters(query, dept, status);
        let sorted = employeeService.sortBy(filtered, currentSort.field, currentSort.direction);

        uiService.renderEmployeeTable(sorted);
    };

    // --- Authentication Events ---
    $('#login-form').submit((e) => {
        e.preventDefault();
        const username = $('#login-username').val();
        const password = $('#login-password').val();

        if (authService.login(username, password)) {
            $('#login-error').addClass('d-none');
            checkAuthAndRoute();
            uiService.showToast('Login successful!');
        } else {
            $('#login-error').removeClass('d-none');
        }
    });

    $('#signup-form').submit((e) => {
        e.preventDefault();
        const u = $('#signup-username').val();
        const p = $('#signup-password').val();
        const c = $('#signup-confirm').val();

        const errors = validationService.validateAuthForm(u, p, c);
        uiService.showInlineErrors(errors);

        if (!errors) {
            const res = authService.signup(u, p);
            if (res.success) {
                uiService.showToast('Signup successful. Please login.');
                $('#signup-view').addClass('d-none');
                $('#login-view').removeClass('d-none');
            } else {
                $('#err-signup-username').text(res.message).closest('.mb-3').find('input').addClass('is-invalid');
            }
        }
    });

    $('#logout-btn').click(() => {
        authService.logout();
        checkAuthAndRoute();
        uiService.clearForm('login-form');
    });

    $('#link-to-signup').click((e) => { e.preventDefault(); $('#login-view').addClass('d-none'); $('#signup-view').removeClass('d-none'); });
    $('#link-to-login').click((e) => { e.preventDefault(); $('#signup-view').addClass('d-none'); $('#login-view').removeClass('d-none'); });

    // --- Navigation Events ---
    $('#nav-dashboard').click((e) => { e.preventDefault(); showView('dashboard'); });
    $('#nav-employees').click((e) => { e.preventDefault(); showView('employees'); });
    $('.navbar-brand').click((e) => { e.preventDefault(); showView('dashboard'); });

    // --- Table Filtering & Sorting Events ---
    $('#search-input').on('input', triggerFilterSortUpdate);
    $('#filter-dept').change(triggerFilterSortUpdate);
    $('input[name="statusFilter"]').change(triggerFilterSortUpdate);

    $('.sortable').click(function () {
        const field = $(this).data('sort');
        if (currentSort.field === field) {
            currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
        } else {
            currentSort.field = field;
            currentSort.direction = 'asc';
        }

        // Update UI icons
        $('.sortable i').removeClass('bi-arrow-up bi-arrow-down').addClass('bi-arrow-down-up text-muted');
        const icon = $(this).find('i');
        icon.removeClass('bi-arrow-down-up text-muted').addClass(currentSort.direction === 'asc' ? 'bi-arrow-up text-primary' : 'bi-arrow-down text-primary');

        triggerFilterSortUpdate();
    });

    // --- CRUD Events ---
    $('#nav-add-btn').click(() => uiService.showModal('add'));

    $('#save-employee-btn').click(() => {
        // Collect data
        const id = $('#emp-id').val();
        const isEdit = !!id;

        const data = {
            firstName: $('#emp-firstName').val(),
            lastName: $('#emp-lastName').val(),
            email: $('#emp-email').val(),
            phone: $('#emp-phone').val(),
            department: $('#emp-department').val(),
            designation: $('#emp-designation').val(),
            salary: Number($('#emp-salary').val()),
            joinDate: $('#emp-joinDate').val(),
            status: $('#emp-status').val()
        };

        // Validate
        const errors = validationService.validateEmployeeForm(data, isEdit, id ? parseInt(id) : null);
        uiService.showInlineErrors(errors);

        if (!errors) {
            if (isEdit) {
                employeeService.update(parseInt(id), data);
                uiService.showToast('Employee updated successfully');
            } else {
                employeeService.add(data);
                uiService.showToast('Employee added successfully');
            }
            uiService.closeModal('employeeModal');
            refreshAppContent(); // triggers UI re-renders
        }
    });

    // Event Delegation for action buttons (since table rows are dynamic)
    $('#employee-table-body').on('click', '.btn-view', function () {
        const id = $(this).data('id');
        uiService.showModal('view', employeeService.getById(id));
    });

    $('#employee-table-body').on('click', '.btn-edit', function () {
        const id = $(this).data('id');
        uiService.showModal('edit', employeeService.getById(id));
    });

    $('#employee-table-body').on('click', '.btn-delete', function () {
        const id = $(this).data('id');
        uiService.showModal('delete', employeeService.getById(id));
    });

    $('#confirm-delete-btn').click(function () {
        const id = $(this).data('id');
        employeeService.remove(id);
        uiService.closeModal('deleteModal');
        uiService.showToast('Employee deleted successfully', 'danger');
        refreshAppContent();
    });

    // --- Boot App ---
    checkAuthAndRoute();
});