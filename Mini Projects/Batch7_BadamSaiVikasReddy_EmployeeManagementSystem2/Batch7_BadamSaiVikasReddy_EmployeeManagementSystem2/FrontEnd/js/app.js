$(document).ready(() => {

    // --- State Management ---
    let _state = {
        search: '',
        department: '',
        status: '',
        sortBy: 'name',
        sortDir: 'asc',
        page: 1,
        pageSize: config.PAGE_SIZE // From config.js
    };

    // --- Routing & Initialization ---
    const checkAuthAndRoute = async () => {
        if (authService.isLoggedIn()) {
            $('#main-nav').removeClass('d-none');
            $('#login-view, #signup-view').addClass('d-none');
            
            const user = authService.getCurrentUser();
            const role = authService.isAdmin() ? '<span class="badge bg-danger ms-1">Admin</span>' : '<span class="badge bg-secondary ms-1">Viewer</span>';
            $('#nav-username').html(`${user.charAt(0).toUpperCase() + user.slice(1)} ${role}`);

            uiService.applyRoleUI(); // Enforce RBAC in UI
            showView('dashboard');
            await refreshAppContent();
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

    const refreshAppContent = async () => {
        try {
            // Dashboard Data
            const summary = await dashboardService.getSummary();
            uiService.renderDashboardCards(summary);
            uiService.renderDepartmentBreakdown(summary.departmentBreakdown);
            uiService.renderRecentEmployees(summary.recentEmployees);

            // Table Data
            uiService.populateDepartmentDropdown(employeeService.getDepartments());
            await triggerFilterSortUpdate();
        } catch (error) {
            console.error("Failed to refresh content:", error);
            if(error.message.includes('401')) authService.logout(); checkAuthAndRoute();
        }
    };

    const triggerFilterSortUpdate = async () => {
        try {
            const pagedResult = await employeeService.getAll(_state);
            uiService.renderEmployeeTable(pagedResult);
        } catch (error) {
            console.error("Error fetching table data:", error);
            uiService.showToast('Error loading employees', 'danger');
        }
    };

    // --- Authentication Events ---
    $('#login-form').submit(async (e) => {
        e.preventDefault();
        const username = $('#login-username').val();
        const password = $('#login-password').val();

        const success = await authService.login(username, password);
        if (success) {
            $('#login-error').addClass('d-none');
            uiService.showToast('Login successful!');
            await checkAuthAndRoute();
        } else {
            $('#login-error').text('Invalid credentials. Please try again.').removeClass('d-none');
        }
    });

    $('#signup-form').submit(async (e) => {
        e.preventDefault();
        const u = $('#signup-username').val();
        const p = $('#signup-password').val();
        const c = $('#signup-confirm').val();

        const errors = validationService.validateAuthForm(u, p, c);
        uiService.showInlineErrors(errors);

        if (!errors) {
            const res = await authService.signup(u, p);
            if (res.success) {
                uiService.showToast('Signup successful. Please login.');
                uiService.clearForm('signup-form');
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

    // --- Table Filtering, Sorting & Pagination Events ---
    
    // Debounce search (wait 350ms before firing API call)
    let searchTimeout;
    $('#search-input').on('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            _state.search = $(this).val();
            _state.page = 1; // Reset to page 1 on search
            triggerFilterSortUpdate();
        }, 350);
    });

    $('#filter-dept').change(function() {
        _state.department = $(this).val();
        _state.page = 1;
        triggerFilterSortUpdate();
    });

    $('input[name="statusFilter"]').change(function() {
        _state.status = $(this).val();
        _state.page = 1;
        triggerFilterSortUpdate();
    });

    $('.sortable').click(function () {
        const field = $(this).data('sort');
        if (_state.sortBy === field) {
            _state.sortDir = _state.sortDir === 'asc' ? 'desc' : 'asc';
        } else {
            _state.sortBy = field;
            _state.sortDir = 'asc';
        }
        _state.page = 1;

        $('.sortable i').removeClass('bi-arrow-up bi-arrow-down').addClass('bi-arrow-down-up text-muted');
        const icon = $(this).find('i');
        icon.removeClass('bi-arrow-down-up text-muted').addClass(_state.sortDir === 'asc' ? 'bi-arrow-up text-primary' : 'bi-arrow-down text-primary');

        triggerFilterSortUpdate();
    });

    // Pagination Click
    $(document).on('click', '.page-btn', function(e) {
        e.preventDefault();
        _state.page = parseInt($(this).data('page'));
        triggerFilterSortUpdate();
    });

    // --- CRUD Events ---
    $('#nav-add-btn').click(() => uiService.showModal('add'));

    $('#save-employee-btn').click(async () => {
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

        const errors = validationService.validateEmployeeForm(data, isEdit, id ? parseInt(id) : null);
        uiService.showInlineErrors(errors);

        if (!errors) {
            try {
                if (isEdit) {
                    await employeeService.update(parseInt(id), data);
                    uiService.showToast('Employee updated successfully');
                } else {
                    await employeeService.add(data);
                    uiService.showToast('Employee added successfully');
                    _state.page = 1; // Go to first page to see new record if sorted by recent
                }
                uiService.closeModal('employeeModal');
                await refreshAppContent(); 
            } catch (error) {
                // Handle 409 Conflict (Duplicate Email)
                if (error.status === 409) {
                    $('#emp-email').addClass('is-invalid').siblings('.invalid-feedback').text(error.data.email || 'Email already exists');
                } else {
                    uiService.showToast('An error occurred.', 'danger');
                }
            }
        }
    });

    $('#employee-table-body').on('click', '.btn-view', async function () {
        const id = $(this).data('id');
        try {
            const emp = await employeeService.getById(id);
            uiService.showModal('view', emp);
        } catch (e) {
            uiService.showToast('Could not load employee details', 'danger');
        }
    });

    $('#employee-table-body').on('click', '.btn-edit', async function () {
        const id = $(this).data('id');
        try {
            const emp = await employeeService.getById(id);
            uiService.showModal('edit', emp);
        } catch (e) {
            uiService.showToast('Could not load employee details', 'danger');
        }
    });

    $('#employee-table-body').on('click', '.btn-delete', async function () {
        const id = $(this).data('id');
        try {
            const emp = await employeeService.getById(id);
            uiService.showModal('delete', emp);
        } catch (e) {
            uiService.showToast('Could not load employee details', 'danger');
        }
    });

    $('#confirm-delete-btn').click(async function () {
        const id = $(this).data('id');
        try {
            await employeeService.remove(id);
            uiService.closeModal('deleteModal');
            uiService.showToast('Employee deleted successfully', 'success');
            
            // If we deleted the last item on the page, go back a page
            const tableRows = $('#employee-table-body tr').length;
            if (tableRows === 1 && _state.page > 1) {
                _state.page--;
            }
            
            await refreshAppContent();
        } catch (e) {
            uiService.showToast('Failed to delete employee', 'danger');
        }
    });

    // --- Boot App ---
    checkAuthAndRoute();
});