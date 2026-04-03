const uiService = {
    formatCurrency: (amount) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
    },
    getInitials: (fName, lName) => `${fName.charAt(0)}${lName.charAt(0)}`.toUpperCase(),
    getDeptColor: (dept) => {
        const map = { 'Engineering': 'primary', 'Marketing': 'warning text-dark', 'HR': 'info text-dark', 'Finance': 'success', 'Operations': 'secondary' };
        return map[dept] || 'dark';
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
            // using exact class manipulation for progress bar
            const barBgClass = colorClass.includes('text-dark') ? colorClass.replace(' text-dark', '') : colorClass;
            
            const html = `
                <div class="mb-3">
                    <div class="d-flex justify-content-between mb-1">
                        <span class="small fw-bold text-${colorClass}">${item.department}</span>
                        <span class="small text-muted">${item.count} (${item.percentage}%)</span>
                    </div>
                    <div class="progress" style="height: 6px;">
                        <div class="progress-bar bg-${barBgClass}" role="progressbar" style="width: ${item.percentage}%"></div>
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

    renderEmployeeTable: (employees) => {
        const tbody = $('#employee-table-body');
        tbody.empty();
        
        $('#showing-count-label').text(`Showing ${employees.length} of ${storageService.getAll().length} employees`);

        if (employees.length === 0) {
            $('#empty-state').removeClass('d-none');
            tbody.closest('table').addClass('d-none');
            return;
        }

        $('#empty-state').addClass('d-none');
        tbody.closest('table').removeClass('d-none');

        employees.forEach(emp => {
            const initial = uiService.getInitials(emp.firstName, emp.lastName);
            const statusBadge = emp.status === 'Active' ? 'success' : 'danger';
            const deptColor = uiService.getDeptColor(emp.department);
            
            const tr = `
                <tr>
                    <td class="align-middle text-muted">#${emp.id}</td>
                    <td class="align-middle">
                        <div class="avatar-circle bg-primary" style="width: 30px; height: 30px; font-size: 12px;">${initial}</div>
                    </td>
                    <td class="align-middle fw-bold">${emp.firstName} ${emp.lastName}</td>
                    <td class="align-middle text-muted small">${emp.email}</td>
                    <td class="align-middle"><span class="badge bg-${deptColor}">${emp.department}</span></td>
                    <td class="align-middle">${emp.designation}</td>
                    <td class="align-middle">${uiService.formatCurrency(emp.salary)}</td>
                    <td class="align-middle">${emp.joinDate}</td>
                    <td class="align-middle"><span class="badge bg-${statusBadge}">${emp.status}</span></td>
                    <td class="align-middle">
                        <button class="btn btn-sm btn-outline-info me-1 btn-view" data-id="${emp.id}"><i class="bi bi-eye"></i></button>
                        <button class="btn btn-sm btn-outline-secondary me-1 btn-edit" data-id="${emp.id}"><i class="bi bi-pencil"></i></button>
                        <button class="btn btn-sm btn-outline-danger btn-delete" data-id="${emp.id}"><i class="bi bi-trash"></i></button>
                    </td>
                </tr>`;
            tbody.append(tr);
        });
    },

    populateDepartmentDropdown: (departments) => {
        const select = $('#filter-dept');
        select.find('option:not(:first)').remove(); // Keep 'All' option
        departments.forEach(d => select.append(`<option value="${d}">${d}</option>`));
    },

    showInlineErrors: (errors) => {
        // Clear old errors
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
        $('#emp-id').val(''); // Clear hidden ID
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
            $('#confirm-delete-btn').data('id', data.id); // store ID on button
            new bootstrap.Modal('#deleteModal').show();
        }
    },

    closeModal: (modalId) => {
        const modal = bootstrap.Modal.getInstance(document.getElementById(modalId));
        if (modal) modal.hide();
    },

    showToast: (message, type = 'success') => {
        const toastEl = $('#liveToast');
        toastEl.removeClass('bg-success bg-danger bg-info').addClass(`bg-${type}`);
        $('#toast-message').text(message);
        new bootstrap.Toast(toastEl[0]).show();
    }
};