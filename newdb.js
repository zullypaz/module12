const pool = require('./server');

class DB {
  constructor() {}

  async query(sql, args = []) {
    const client = await pool.connect();
    try {
      const result = await client.query(sql, args);
      return result;
    } finally {
      client.release();
    }
  }

  
  findAllEmployees() {
    return this.query(
      "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;"
    );
  }

 
  findAllPossibleManagers(employeeId) {
    return this.query(
      'SELECT id, first_name, last_name FROM employee WHERE id != $1',
      [employeeId]
    );
  }

  
  createEmployee(employee) {
    const { first_name, last_name, role_id, manager_id } = employee;
    return this.query(
      'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)',
      [first_name, last_name, role_id, manager_id]
    );
  }



 
  updateEmployeeRole(employeeId, roleId) {
    return this.query('UPDATE employee SET role_id = $1 WHERE id = $2', [
      roleId,
      employeeId,
    ]);
  }

  

  findAllRoles() {
    return this.query(
      'SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;'
    );
  }

  // Create a new role
  createRole(role) {
    const { title, salary, department_id } = role;
    return this.query(
      'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)',
      [title, salary, department_id]
    );
  }


  findAllDepartments() {
    return this.query('SELECT department.id, department.name FROM department;');
  }

  viewDepartmentBudgets() {
    return this.query(
      'SELECT department.id, department.name, SUM(role.salary) AS utilized_budget FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id GROUP BY department.id, department.name;'
    );
  }

 
  createDepartment(department) {
    return this.query('INSERT INTO department (name) VALUES ($1)', [
      department.name,
    ]);
  }



  findAllEmployeesByDepartment(departmentId) {
    return this.query(
      'SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department department on role.department_id = department.id WHERE department.id = $1;',
      [departmentId]
    );
  }

  findAllEmployeesByManager(managerId) {
    return this.query(
      'SELECT employee.id, employee.first_name, employee.last_name, department.name AS department, role.title FROM employee LEFT JOIN role on role.id = employee.role_id LEFT JOIN department ON department.id = role.department_id WHERE manager_id = $1;',
      [managerId]
    );
  }
}

module.exports = new DB();




