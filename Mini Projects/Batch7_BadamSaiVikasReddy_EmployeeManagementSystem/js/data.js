const appData = {
    admin: { username: 'admin', password: 'admin@123' },
    employees: [
        { id: 1, firstName: 'Sai Vikas Reddy', lastName: 'Badam', email: 'saivikasreddy.b@gmail.com', phone: '9876543210', department: 'Engineering', designation: 'Software Engineer', salary: 850000, joinDate: '2021-03-15', status: 'Active' },
        { id: 2, firstName: 'Mohith', lastName: 'Kankanala', email: 'mohith.k@gmail.com', phone: '9123456780', department: 'Marketing', designation: 'Marketing Executive', salary: 610000, joinDate: '2021-05-10', status: 'Active' },
        { id: 3, firstName: 'Sandeep', lastName: 'Konda', email: 'sandeep.k@gmail.com', phone: '9876512340', department: 'HR', designation: 'HR Manager', salary: 720000, joinDate: '2018-10-12', status: 'Active' },
        { id: 4, firstName: 'Vineeth', lastName: 'Gontla', email: 'vineeth.g@gmail.com', phone: '9988776655', department: 'Finance', designation: 'Senior Accountant', salary: 760000, joinDate: '2020-02-18', status: 'Active' },
        { id: 5, firstName: 'Santosh', lastName: 'Sane', email: 'santosh.s@gmail.com', phone: '9123123123', department: 'Operations', designation: 'Operations Manager', salary: 950000, joinDate: '2017-04-21', status: 'Active' },
        { id: 6, firstName: 'Pradeep', lastName: 'Cheekati', email: 'pradeep.ch@gmail.com', phone: '9988998899', department: 'Engineering', designation: 'Senior Developer', salary: 1100000, joinDate: '2016-08-05', status: 'Active' },
        { id: 7, firstName: 'Vignesh', lastName: 'Gontla', email: 'vignesh.g@gmail.com', phone: '9001002003', department: 'Marketing', designation: 'Content Strategist', salary: 560000, joinDate: '2023-01-14', status: 'Inactive' },
        { id: 8, firstName: 'Tharun', lastName: 'Putta', email: 'tharun.p@gmail.com', phone: '9112233445', department: 'Finance', designation: 'Accounts Manager', salary: 810000, joinDate: '2019-09-03', status: 'Active' },
        { id: 9, firstName: 'Pravallika', lastName: 'Sukka', email: 'pravallika.s@gmail.com', phone: '9998887776', department: 'Engineering', designation: 'DevOps Engineer', salary: 930000, joinDate: '2022-06-30', status: 'Active' },
        { id: 10, firstName: 'Sarayu', lastName: 'Sigatapu', email: 'Sarayu.s@gmail.com', phone: '9887766554', department: 'Operations', designation: 'Supply Chain Analyst', salary: 640000, joinDate: '2021-12-01', status: 'Active' },
        { id: 11, firstName: 'Manohar', lastName: 'Gundu', email: 'manohar.g@gmail.com', phone: '9776655443', department: 'Marketing', designation: 'Brand Manager', salary: 820000, joinDate: '2018-07-15', status: 'Active' },
        { id: 12, firstName: 'Sindhu', lastName: 'Paila', email: 'sindhu.p@gmail.com', phone: '9665544332', department: 'Finance', designation: 'Tax Consultant', salary: 750000, joinDate: '2020-03-22', status: 'Inactive' },
        { id: 13, firstName: 'Ramakrishna', lastName: 'Madam', email: 'ramakrishna.m@gmail.com', phone: '9554433221', department: 'Engineering', designation: 'QA Engineer', salary: 690000, joinDate: '2022-02-11', status: 'Active' },
        { id: 14, firstName: 'Joshith', lastName: 'Polinati', email: 'joshith.p@gmail.com', phone: '9554433221', department: 'Engineering', designation: 'QA Analyst', salary: 670000, joinDate: '2021-08-19', status: 'Active' },
        { id: 15, firstName: 'Rohith', lastName: 'Kallepalli', email: 'rohith.k@gmail.com', phone: '9554433221', department: 'Engineering', designation: 'Frontend Developer', salary: 720000, joinDate: '2023-04-02', status: 'Active' },
        { id: 16, firstName: 'Sravani', lastName: 'Regula', email: 'ramakrishna.m@gmail.com', phone: '9554433221', department: 'Engineering', designation: 'Backend Developer', salary: 760000, joinDate: '2022-05-27', status: 'Active' },
        { id: 17, firstName: 'Mahesh', lastName: 'Chintapu', email: 'mahesh.ch@gmail.com', phone: '9554433221', department: 'Engineering', designation: 'Data Engineer', salary: 740000, joinDate: '2021-11-09', status: 'Active' },
        { id: 18, firstName: 'Sanjana', lastName: 'Thumu', email: 'sanjana.t@gmail.com', phone: '9554433221', department: 'HR', designation: 'HR Executive', salary: 630000, joinDate: '2022-07-13', status: 'Active' },
        { id: 19, firstName: 'Chalika', lastName: 'Chukka', email: 'chalika.c@gmail.com', phone: '9554433221', department: 'Marketing', designation: 'Digital Marketing Specialist', salary: 660000, joinDate: '2023-01-08', status: 'Active' },
        { id: 20, firstName: 'Saleem', lastName: 'Shaik', email: 'saleem.sk@gmail.com', phone: '9554433221', department: 'Operations', designation: 'Operations Analyst', salary: 700000, joinDate: '2020-10-30', status: 'Active' },
    ]
};

if (typeof module !== 'undefined') module.exports = appData;