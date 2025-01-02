import { QueryResult } from "pg";
import inquirer from "inquirer";
import { pool, connectToDb } from "./connection.js";

await connectToDb();

// interface Department {
//   id: number;
//   name: string;
// }

// interface Role {
//   id: number;
//   title: string;
//   salary: number;
//   department_id: number;
// }

// interface Employee {
//   id: number;
//   first_name: string;
//   last_name: string;
//   role_id: number;
//   manager_id: number | null;
// }

async function mainMenu() {
  const { action }: {action: string} = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: [
        "View All Departments",
        "View All Roles",
        "View All Employees",
        "Add Department",
        "Add Role",
        "Add Employee",
        "Update Employee Role",
        "Exit",
      ],
    },
  ]);

  switch (action) {
    case "View All Departments":
      await viewAllDepartments();
      break;
    case "View All Roles":
      await viewAllRoles();
      break;
    case "View All Employees":
      await viewAllEmployees();
      break;
    case "Add Department":
      await addDepartment();
      break;
    case "Add Role":
      await addRole();
      break;
    case "Add Employee":
      await addEmployee();
      break;
    case "Update Employee Role":
      await updateEmployeeRole();
      break;
    case "Exit":
      console.log("Goodbye!");
      return process.exit();
  }
  mainMenu();
}

async function viewAllDepartments() {
    try {
        const response: QueryResult = await pool.query("SELECT * FROM department");
        console.table(response.rows);
    } catch (err) {
        console.error("Error Viewing the Departments", err);
    }
}

async function viewAllRoles() {
    try {
        const response: QueryResult = await pool.query("SELECT * FROM role");
        console.table(response.rows);
    } catch (err) {
        console.error("Error Viewing the Roles", err);
    }
}

async function viewAllEmployees() {
    try {
        const response: QueryResult = await pool.query("SELECT * FROM employee");
        console.table(response.rows);
    } catch (err) {
        console.error("Error Viewing the Employees", err);
    }
}

async function addDepartment(){
    const {name}: {name: string} = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter the name of the new department: '
        }
    ]);

    try {
        await pool.query('INSERT INTO department (name) VALUES ($1)', [name]);
        console.log(`${name} Department was added!`);
    } catch (err) {
        console.error('Error adding department:', err);
    }
}

async function addRole(){
    const {title , salary, department_id}: {title: string; salary: number; department_id: number} = await inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Enter the title of the new role: '
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter the salary of the new role: '
        },
        {
            type: 'input',
            name: 'department_id',
            message: 'Enter the department ID for the new role: '
        }
    ]);

    try {
        await pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, department_id]);
        console.log(`${title} role was added!`);
    } catch (err) {
        console.error('Error adding role:', err);
    }
}

async function addEmployee(){
    const {first_name, last_name, role_id, manager_id}: {first_name: string; last_name: string; role_id: number; manager_id: number} = await inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'Enter the first name of the new employee: '
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'Enter the last name of the new employee: '
        },
        {
            type: 'input',
            name: 'role_id',
            message: 'Enter the role ID for the new emplpoyee: '
        },
        {
            type: 'input',
            name: 'manager_id',
            message: 'Enter the manager ID for the new emplpoyee (if any): '
        }
    ]);

    try {
        await pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [first_name, last_name, role_id, manager_id]);
        console.log(`New employee ${first_name} ${last_name} was added!`);
    } catch (err) {
        console.error('Error adding employee:', err);
    }
}

async function updateEmployeeRole(){
    const {employee_id, newRole_id}: {employee_id: number; newRole_id: number} = await inquirer.prompt([
        {
            type: 'input',
            name: 'employee_id',
            message: 'Enter the employee ID for whose role you want to update: '
        },
        {
            type: 'input',
            name: 'newRole_id',
            message: 'Enter the new role ID for the new emplpoyee: '
        }  
    ]);

    try {
        await pool.query('UPDATE employee SET role_id = $1 WHERE id = $2', [newRole_id, employee_id]);
        console.log('Updated employee role');
    } catch (err) {
        console.error('Error Updating Employee Role', err);
    }
}

connectToDb().then(() => {
    mainMenu();
});