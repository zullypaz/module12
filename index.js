const { prompt } = require('inquirer');
const db = require('./newdb');



function viewEmployees() {
  db.findAllEmployees()
    .then(({ rows }) => {
      let employees = rows;
      console.log('\n');
      console.table(employees);
    })
    .then(() => loadMainPrompts());
}

function viewEmployeesByDepartment() {
  db.findAllDepartments().then(({ rows }) => {
    let departments = rows;
    const departmentChoices = departments.map(({ id, name }) => ({
      name: name,
      value: id,
    }));

    
function loadMainPrompts() {
    prompt([
      {
        type: 'list',
        name: 'action',
        message: 'Choose an action',
        choices: [
          {
            name: 'View All Employees',
            value: 'VIEW_EMPLOYEES',
          },
          {
            name: 'View employees by department',
            value: 'VIEW_EMPLOYEES_BY_DEPARTMENT',
          },
          {
            name: 'View employees by manager',
            value: 'VIEW_EMPLOYEES_BY_MANAGER',
          },
          {
            name: 'Add an employee',
            value: 'ADD_EMPLOYEE',
          },
          {
            name: 'Remove an employee',
            value: 'REMOVE_EMPLOYEE',
          },
          {
            name: 'Update employee role',
            value: 'UPDATE_EMPLOYEE_ROLE',
          },
          {
            name: 'Update employee manager',
            value: 'UPDATE_EMPLOYEE_MANAGER',
          },
          {
            name: 'View roles',
            value: 'VIEW_ROLES',
          },
          {
            name: 'Add role',
            value: 'ADD_ROLE',
          },
          {
            name: 'Remove role',
            value: 'REMOVE_ROLE',
          },
          {
            name: 'View all departments',
            value: 'VIEW_DEPARTMENTS',
          },
          {
            name: 'Add department',
            value: 'ADD_DEPARTMENT',
          },
          {
            name: 'Remove department',
            value: 'REMOVE_DEPARTMENT',
          },
          
          {
            name: 'Quit',
            value: 'QUIT',
          },
        ],
      },
    ]).then((res) => {
      let choice = res.choice;
     
      switch (choice) {
        case 'VIEW_EMPLOYEES':
          viewEmployees();
          break;
        case 'VIEW_EMPLOYEES_BY_DEPARTMENT':
          viewEmployeesByDepartment();
          break;
        case 'VIEW_EMPLOYEES_BY_MANAGER':
          viewEmployeesByManager();
          break;
        case 'ADD_EMPLOYEE':
          addEmployee();
          break;
        case 'REMOVE_EMPLOYEE':
          removeEmployee();
          break;
        case 'UPDATE_EMPLOYEE_ROLE':
          updateEmployeeRole();
          break;
        case 'UPDATE_EMPLOYEE_MANAGER':
          updateEmployeeManager();
          break;
        case 'VIEW_DEPARTMENTS':
          viewDepartments();
          break;
        case 'ADD_DEPARTMENT':
          addDepartment();
          break;
        case 'REMOVE_DEPARTMENT':
          removeDepartment();
          break;
        case 'VIEW_UTILIZED_BUDGET_BY_DEPARTMENT':
          viewUtilizedBudgetByDepartment();
          break;
        case 'VIEW_ROLES':
          viewRoles();
          break;
        case 'ADD_ROLE':
          addRole();
          break;
        case 'REMOVE_ROLE':
          removeRole();
          break;
        default:
          quit();
      }
    });
  }
  
    prompt([
      {
        type: 'list',
        name: 'departmentId',
        message: 'Which department do you want to display?',
        choices: departmentChoices,
      },
    ])
      .then((res) => db.findAllEmployeesByDepartment(res.departmentId))
      .then(({ rows }) => {
        let employees = rows;
        console.log('\n');
        console.table(employees);
      })
      .then(() => loadMainPrompts());
  });
}

function viewEmployeesByManager() {
  db.findAllEmployees().then(({ rows }) => {
    let managers = rows;
    const managerChoices = managers.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    }));

    prompt([
      {
        type: 'list',
        name: 'manager',
        message: 'Which employee do you want to see?',
        choices: managerChoices,
      },
    ])
      .then((res) => db.findAllEmployeesByManager(res.managerId))
      .then(({ rows }) => {
        let employees = rows;
        console.log('\n');
        if (employees.length === 0) {
          console.log('The employee has no direct reports');
        } else {
          console.table(employees);
        }
      })
      .then(() => loadMainPrompts());
  });
}

// Delete an employee
function removeEmployee() {
  db.findAllEmployees().then(({ rows }) => {
    let employees = rows;
    const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    }));

    prompt([
      {
        type: 'list',
        name: 'employeeId',
        message: 'Who do you want to remove?',
        choices: employeeChoices,
      },
    ])
      .then((res) => db.removeEmployee(res.employeeId))
      .then(() => console.log('Removed'))
      .then(() => loadMainPrompts());
  });
}

// Update an employee's role
function updateEmployeeRole() {
  db.findAllEmployees().then(({ rows }) => {
    let employees = rows;
    const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    }));

    prompt([
      {
        type: 'list',
        name: 'employeeId',
        message: "Who do you want to update?",
        choices: employeeChoices,
      },
    ]).then((res) => {
      let employeeId = res.employeeId;
      db.findAllRoles().then(({ rows }) => {
        let roles = rows;
        const roleChoices = roles.map(({ id, title }) => ({
          name: title,
          value: id,
        }));

        prompt([
          {
            type: 'list',
            name: 'roleId',
            message: 'Which role are you assigning?',
            choices: roleChoices,
          },
        ])
          .then((res) => db.updateEmployeeRole(employeeId, res.roleId))
          .then(() => console.log("Updated employee's role"))
          .then(() => loadMainPrompts());
      });
    });
  });
}


function updateEmployeeManager() {
  db.findAllEmployees().then(({ rows }) => {
    let employees = rows;
    const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    }));

    prompt([
      {
        type: 'list',
        name: 'employeeId',
        message: "Which employee's manager do you want to update?",
        choices: employeeChoices,
      },
    ]).then((res) => {
      let employeeId = res.employeeId;
      db.findAllPossibleManagers(employeeId).then(({ rows }) => {
        let managers = rows;
        const managerChoices = managers.map(
          ({ id, first_name, last_name }) => ({
            name: `${first_name} ${last_name}`,
            value: id,
          })
        );

        prompt([
          {
            type: 'list',
            name: 'managerId',
            message:
              'Select a manager',
            choices: managerChoices,
          },
        ])
          .then((res) => db.updateEmployeeManager(employeeId, res.managerId))
          .then(() => console.log("Updated employee's manager"))
          .then(() => loadMainPrompts());
      });
    });
  });
}


function viewRoles() {
  db.findAllRoles()
    .then(({ rows }) => {
      let roles = rows;
      console.log('\n');
      console.table(roles);
    })
    .then(() => loadMainPrompts());
}


function addRole() {
  db.findAllDepartments().then(({ rows }) => {
    let departments = rows;
    const departmentChoices = departments.map(({ id, name }) => ({
      name: name,
      value: id,
    }));

    prompt([
      {
        name: 'title',
        message: 'Enter role?',
      },
      {
        name: 'salary',
        message: 'Enter the salary',
      },
      {
        type: 'list',
        name: 'department_id',
        message: 'Enter a department for the role?',
        choices: departmentChoices,
      },
    ]).then((role) => {
      db.createRole(role)
        .then(() => console.log(`Added ${role.title} to the database`))
        .then(() => loadMainPrompts());
    });
  });
}


function viewDepartments() {
  db.findAllDepartments()
    .then(({ rows }) => {
      let departments = rows;
      console.log('\n');
      console.table(departments);
    })
    .then(() => loadMainPrompts());
}


function addDepartment() {
  prompt([
    {
      name: 'name',
      message: 'Enter the Department',
    },
  ]).then((res) => {
    let name = res;
    db.createDepartment(name)
      .then(() => console.log(`Added ${name.name} to the database`))
      .then(() => loadMainPrompts());
  });
}


function addEmployee() {
  prompt([
    {
      name: 'first_name',
      message: "Enter employee's first name?",
    },
    {
      name: 'last_name',
      message: "Enter employee's last name?",
    },
  ]).then((res) => {
    let firstName = res.first_name;
    let lastName = res.last_name;

    db.findAllRoles().then(({ rows }) => {
      let roles = rows;
      const roleChoices = roles.map(({ id, title }) => ({
        name: title,
        value: id,
      }));

      prompt({
        type: 'list',
        name: 'roleId',
        message: "Enter employee's role?",
        choices: roleChoices,
      }).then((res) => {
        let roleId = res.roleId;

        db.findAllEmployees().then(({ rows }) => {
          let employees = rows;
          const managerChoices = employees.map(
            ({ id, first_name, last_name }) => ({
              name: `${first_name} ${last_name}`,
              value: id,
            })
          );

          managerChoices.unshift({ name: 'None', value: null });

          prompt({
            type: 'list',
            name: 'managerId',
            message: "Enter employee's manager?",
            choices: managerChoices,
          })
            .then((res) => {
              let employee = {
                manager_id: res.managerId,
                role_id: roleId,
                first_name: firstName,
                last_name: lastName,
              };

              db.createEmployee(employee);
            })
            .then(() =>
              console.log(`Added ${firstName} ${lastName} to the database`)
            )
            .then(() => loadMainPrompts());
        });
      });
    });
  });
}

function quit() {
  console.log('Exit!');
  process.exit();
}

