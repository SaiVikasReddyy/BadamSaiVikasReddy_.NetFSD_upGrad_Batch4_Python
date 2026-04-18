const uiService = {
    formatCurrency: (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount),
    getInitials: (fName, lName) => `${fName.charAt(0)}${lName.charAt(0)}`.toUpperCase(),
    getDeptColor: (dept) => {
        const map = { 'Engineering': 'primary', 'Marketing': 'warning text-dark', 'HR': 'info text-dark', 'Finance': 'success', 'Operations': 'secondary' };
        return map[dept] || 'dark';
    },

    // --- NEW: Role Based UI Control ---
    applyRoleUI: () => {
        const isAdmin = authService.isAdmin();
        if (isAdmin) {
            $('#nav-add-btn').removeClass('d-none');
            $('#readonly-notice').remove();
            $('.admin-only').removeClass('d-none'); // Show action buttons in table
        } else {
            $('#nav-add-btn').addClass('d-none');
            $('.admin-only').addClass('d-none'); // Hide action buttons in table
            
            // Add a read-only notice if it doesn't exist
            if ($('#readonly-notice').length === 0) {
                $('#employees-view h2').after(`
                    <div id="readonly-notice" class="alert alert-info py-2 small mb-3">
                        <i class="bi bi-info-circle"></i> You have read-only Viewer access. Contact an Admin to make changes.
                    </div>
                `);
            }
        }
    },

    renderDashboardCards: (summary) => {
        $('#kpi-total').text(summary.total);
        $('#kpi-active').text(summary.active);
        $('#kpi-inactive').text(summary.inactive);
        $('#kpi-departments').text(summary.departments);
    },

    renderDepartmentBreakdown: (data) => {
        const container = $('#dept-breakdown-container');
        container.empty();
        data.forEach(item => {
            const colorClass = uiService.getDeptColor(item.department);
            const barBgClass = colorClass.includes('text-dark') ? colorClass.replace(' text-dark', '') : colorClass;
            const html = `
                <div class="mb-3">
                    <div class="d-flex justify-content-between mb-1">
                        <span class="small fw-bold text-${colorClass}">${item.department}</span>
                        <span class="small text-muted">${item.count} (${item.percentage}%)</span>
                    </div>
                    <div class="progress" style="height: 6px;">
                        <div class="progress-bar bg-${barBgClass}" style="width: ${item.percentage}%"></div>
                    </div>
                </div>`;
            container.append(html);
        });
    },

    renderRecentEmployees: (employees) => {
        const list = $('#recent-employees-list');
        list.empty();
        employees.forEach(emp => {
            const initial = uiService.getInitials(emp.firstName, emp.lastName);
            const statusClass = emp.status === 'Active' ? 'success' : 'danger';
            const html = `
                <li class="list-group-item d-flex justify-content-between align-items-center py-3">
                    <div class="d-flex align-items-center">
                        <div class="avatar-circle bg-primary me-3">${initial}</div>
                        <div>
                            <h6 class="mb-0">${emp.firstName} ${emp.lastName}</h6>
                            <small class="text-muted">${emp.designation}</small>
                        </div>
                    </div>
                    <div class="text-end">
                        <span class="badge bg-${uiService.getDeptColor(emp.department)} mb-1 d-block">${emp.department}</span>
                        <span class="badge bg-${statusClass}">${emp.status}</span>
                    </div>
                </li>`;
            list.append(html);
        });
    },

   // --- UPDATED: Expects PagedResult JSON from API ---
    renderEmployeeTable: (pagedResult) => {
        const tbody = $('#employee-table-body');
        tbody.empty();
        
        const { data: employees, totalCount, page, pageSize, totalPages, hasNextPage, hasPrevPage } = pagedResult;

        // Calculate showing X to Y
        const start = totalCount === 0 ? 0 : ((page - 1) * pageSize) + 1;
        const end = Math.min(page * pageSize, totalCount);
        $('#showing-count-label').text(`Showing ${start}-${end} of ${totalCount} employees`);

        if (employees.length === 0) {
            $('#empty-state').removeClass('d-none');
            tbody.closest('table').addClass('d-none');
            $('#pagination-container').empty();
            return;
        }

        $('#empty-state').addClass('d-none');
        tbody.closest('table').removeClass('d-none');

        const isAdmin = authService.isAdmin();

        // ADDED 'index' here to calculate the row number
        employees.forEach((emp, index) => {
            const initial = uiService.getInitials(emp.firstName, emp.lastName);
            const statusBadge = emp.status === 'Active' ? 'success' : 'danger';
            const deptColor = uiService.getDeptColor(emp.department);
            
            // CALCULATE THE SEQUENTIAL ROW NUMBER
            const displayId = (page - 1) * pageSize + index + 1;
            
            // Hide edit/delete buttons if not admin by adding 'admin-only d-none' class
            const actionButtons = `
                <button class="btn btn-sm btn-outline-info me-1 btn-view" data-id="${emp.id}"><i class="bi bi-eye"></i></button>
                <button class="btn btn-sm btn-outline-secondary me-1 btn-edit admin-only ${isAdmin ? '' : 'd-none'}" data-id="${emp.id}"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-sm btn-outline-danger btn-delete admin-only ${isAdmin ? '' : 'd-none'}" data-id="${emp.id}"><i class="bi bi-trash"></i></button>
            `;

            const tr = `
                <tr>
                    <td class="align-middle text-muted">#${displayId}</td>
                    <td class="align-middle"><div class="avatar-circle bg-primary" style="width: 30px; height: 30px; font-size: 12px;">${initial}</div></td>
                    <td class="align-middle fw-bold">${emp.firstName} ${emp.lastName}</td>
                    <td class="align-middle text-muted small">${emp.email}</td>
                    <td class="align-middle"><span class="badge bg-${deptColor}">${emp.department}</span></td>
                    <td class="align-middle">${emp.designation}</td>
                    <td class="align-middle">${uiService.formatCurrency(emp.salary)}</td>
                    <td class="align-middle">${emp.joinDate}</td>
                    <td class="align-middle"><span class="badge bg-${statusBadge}">${emp.status}</span></td>
                    <td class="align-middle">${actionButtons}</td>
                </tr>`;
            tbody.append(tr);
        });

        uiService.renderPagination(page, totalPages, hasPrevPage, hasNextPage);
    },
    // --- NEW: Render Pagination Buttons ---
    renderPagination: (page, totalPages, hasPrev, hasNext) => {
        let container = $('#pagination-container');
        if (container.length === 0) {
            // Create container if it doesn't exist in HTML
            $('.table-responsive').after('<div id="pagination-container" class="mt-3 d-flex justify-content-end"></div>');
            container = $('#pagination-container');
        }

        if (totalPages <= 1) {
            container.empty();
            return;
        }

        const prevClass = hasPrev ? '' : 'disabled';
        const nextClass = hasNext ? '' : 'disabled';

        let html = `
            <nav>
                <ul class="pagination pagination-sm mb-0">
                    <li class="page-item ${prevClass}"><a class="page-link page-btn" href="#" data-page="${page - 1}">Previous</a></li>
                    <li class="page-item disabled"><span class="page-link">Page ${page} of ${totalPages}</span></li>
                    <li class="page-item ${nextClass}"><a class="page-link page-btn" href="#" data-page="${page + 1}">Next</a></li>
                </ul>
            </nav>
        `;
        container.html(html);
    },

    populateDepartmentDropdown: (departments) => {
        const select = $('#filter-dept');
        select.find('option:not(:first)').remove(); 
        departments.forEach(d => select.append(`<option value="${d}">${d}</option>`));
    },

    showInlineErrors: (errors) => {
        $('.is-invalid').removeClass('is-invalid');
        $('.invalid-feedback').text('');
        if (errors) {
            Object.keys(errors).forEach(key => {
                const el = $(`#emp-${key}, #signup-${key}`);
                if(el.length) {
                    el.addClass('is-invalid');
                    el.siblings('.invalid-feedback').text(errors[key]);
                }
            });
        }
    },

    clearForm: (formId) => {
        $(`#${formId}`)[0].reset();
        $('#emp-id').val(''); 
        $('.is-invalid').removeClass('is-invalid');
    },

    populateForm: (emp) => {
        $('#emp-id').val(emp.id);
        $('#emp-firstName').val(emp.firstName);
        $('#emp-lastName').val(emp.lastName);
        $('#emp-email').val(emp.email);
        $('#emp-phone').val(emp.phone);
        $('#emp-department').val(emp.department);
        $('#emp-designation').val(emp.designation);
        $('#emp-salary').val(emp.salary);
        $('#emp-joinDate').val(emp.joinDate);
        $('#emp-status').val(emp.status);
    },

    showModal: (type, data = null) => {
        if (type === 'add') {
            uiService.clearForm('employee-form');
            $('#employeeModalTitle').text('Add Employee');
            $('#save-employee-btn').text('Save Employee');
            new bootstrap.Modal('#employeeModal').show();
        } else if (type === 'edit') {
            uiService.clearForm('employee-form');
            $('#employeeModalTitle').text('Edit Employee');
            $('#save-employee-btn').text('Update Employee');
            uiService.populateForm(data);
            new bootstrap.Modal('#employeeModal').show();
        } else if (type === 'view') {
            $('#view-avatar').text(uiService.getInitials(data.firstName, data.lastName));
            $('#view-name').text(`${data.firstName} ${data.lastName}`);
            const badgeClass = `bg-${uiService.getDeptColor(data.department)}`;
            $('#view-dept-badge').removeClass().addClass(`badge ${badgeClass} mt-2 mb-4`).text(data.department);
            $('#view-email').text(data.email);
            $('#view-phone').text(data.phone);
            $('#view-designation').text(data.designation);
            $('#view-salary').text(uiService.formatCurrency(data.salary));
            $('#view-joinDate').text(data.joinDate);
            const statusClass = data.status === 'Active' ? 'success' : 'danger';
            $('#view-status').html(`<span class="badge bg-${statusClass}">${data.status}</span>`);
            new bootstrap.Modal('#viewModal').show();
        } else if (type === 'delete') {
            $('#delete-emp-name').text(`${data.firstName} ${data.lastName}`);
            $('#confirm-delete-btn').data('id', data.id); 
            new bootstrap.Modal('#deleteModal').show();
        }
    },

    closeModal: (modalId) => {
        const modalEl = document.getElementById(modalId);
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();
        // Fallback cleanup if backdrop sticks
        $('.modal-backdrop').remove();
        $('body').removeClass('modal-open').css('overflow', '');
    },

    showToast: (message, type = 'success') => {
        const toastEl = $('#liveToast');
        toastEl.removeClass('bg-success bg-danger bg-info').addClass(`bg-${type}`);
        $('#toast-message').text(message);
        new bootstrap.Toast(toastEl[0]).show();
    }
};