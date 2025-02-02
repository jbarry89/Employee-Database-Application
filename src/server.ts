import { QueryResult } from "pg";
import "console.table";
import inquirer from "inquirer";
import { pool, connectToDb } from "./connection.js";

await connectToDb(); // Calling connectToDb() function which is in the connection.js file

// Function that displays a list of options for the user to select
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
        "View Total Budget by Department",
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
    case "View Total Budget by Department":
        await viewTotalBudgetByDept();
        break;
    case "Exit":
      console.log("Goodbye!");
      return process.exit();
  }
  mainMenu();
}

// Function to view all the departments and their unique id
async function viewAllDepartments() {
    try {
        const response: QueryResult = await pool.query("SELECT * FROM department");
        console.table(response.rows);
    } catch (err) {
        console.error("Error Viewing the Departments", err);
    }
}

// Function to view all Roles data: id, job title, salary, and department
async function viewAllRoles() {
    const roleResults = `SELECT role.id, role.title, role.salary, department.name AS department FROM role
    JOIN department ON role.department_id = department.id`;
    try {
        const response: QueryResult = await pool.query(roleResults);
        console.table(response.rows);
    } catch (err) {
        console.error("Error Viewing the Roles", err);
    }
}

// Function to view all employees data: id, first_name, last_name, title, department, salary, and manager
async function viewAllEmployees() {
    try {
        const employeeResults = `SELECT e1.id, e1.first_name, e1.last_name, role.title, department.name AS department, role.salary,
        CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employee e1 
        JOIN role ON e1.role_id = role.id
        JOIN department ON role.department_id = department.id
        LEFT JOIN employee m ON e1.manager_id = m.id`
    
        const response: QueryResult = await pool.query(employeeResults);
        console.table(response.rows);
    } catch (err) {
        console.error("Error Viewing the Employees", err);
    }
}

// Function to add a new Department to the database
async function addDepartment(){
    const {name}: {name: string} = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter the name of the new department: '
        }
    ]);

    try {
        // Inserting new Department name in the database
        await pool.query('INSERT INTO department (name) VALUES ($1)', [name]);
        console.log(`${name} Department was added to the database!`);
    } catch (err) {
        console.error('Error adding department:', err);
    }
}

// Function to add a new role in the database
async function addRole(){
    // Get the list of departments from the database
    const departmentResults: QueryResult = await pool.query('SELECT id, name FROM department');
    const departments = departmentResults.rows.map((department) => ({
        name: department.name,
        value: department.id,
    }));

    // Prompt Questions/Selections for User to input to add new role in database
    const {title , salary, department_id}: {
        title: string; 
        salary: number; 
        department_id: number} = await inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Enter the title of the new role: ',
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter the salary for the new role: ',
            // Checking that user inputs a valid number value for Salary
            validate: (value) => {
                const valid = !isNaN(parseFloat(value)) && isFinite(Number(value));
                if (valid){
                    return true;
                }else{
                    return 'Please enter a valid number for the salary';
                }
            },  
        },
        {
            type: 'list',
            name: 'department_id',
            message: 'Choose the Department for the new role:',
            choices: departments,
        }
    ]);

    try {
        // Inserting new role and salary in the database
        await pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, department_id]);
        console.log(`${title} role was added to the database!`);
    } catch (err) {
        console.error('Error adding role:', err);
    }
}

// Function to add a new employee to the database
async function addEmployee(){
    // Get the list of roles from the database
    const rolesResults: QueryResult = await pool.query('SELECT id, title FROM role');
    const roles = rolesResults.rows.map((role) =>({
        name: role.title,
        value: role.id,
    }));

    // Get the list of employees from the database
    const employeesResults: QueryResult = await pool.query('SELECT id, first_name, last_name FROM employee');
    const managers = employeesResults.rows.map((employee) =>({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
    }));

    // Add option 'None' to the top of the list. If 'None' is selected, then value will be NULL.
    managers.unshift({name: 'None', value: null});

    // Prompt Questions/Selections for User to input to add new employee
    const {first_name, last_name, role_id, manager_id}: {first_name: string; last_name: string; role_id: number; manager_id: number} = await inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'Enter the first name of the new employee: ',
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'Enter the last name of the new employee: ',
        },
        {
            type: 'list',
            name: 'role_id',
            message: 'Choose the role for the new emplpoyee: ',
            choices: roles,    
        },
        {    
            type: 'list',
            name: 'manager_id',
            message: 'Who is the employee manager?',
            choices: managers,
        },
    ]);

    try {
        // Inserting new employee in the database
        await pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [first_name, last_name, role_id, manager_id]);
        console.log(`New employee ${first_name} ${last_name} was added to the database!`);
    } catch (err) {
        console.error('Error adding employee:', err);
    }
}

// Function to Update Existing Employee Role in the Database
async function updateEmployeeRole(){
    // Get the list of employees from the database
    const employeesResults: QueryResult = await pool.query('SELECT id, first_name, last_name FROM employee');
    const employees = employeesResults.rows.map((employee) =>({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
    }));
    
    // Get the list of roles from the database
    const rolesResults: QueryResult = await pool.query('SELECT id, title FROM role');
    const roles = rolesResults.rows.map((role) =>({
        name: role.title,
        value: role.id,
    }));


    
    const {employee_id, newRole_id}: {employee_id: number; newRole_id: number} = await inquirer.prompt([
        {
            type: 'list',
            name: 'employee_id',
            message: 'Which employee role you would like to update? ',
            choices: employees,
        },
        {
            type: 'list',
            name: 'newRole_id',
            message: 'Which role would you like to assign the employee? ',
            choices: roles,
        }  
    ]);

    try {
        // Updating new role that was assigned to the selected employee
        await pool.query('UPDATE employee SET role_id = $1 WHERE id = $2', [newRole_id, employee_id]);
        console.log('Updated Employee Role');
    } catch (err) {
        console.error('Error Updating Employee Role', err);
    }
}

// Function to calculate the sum of All Salaries per Department
async function viewTotalBudgetByDept(){
    try {
        const budgetQuery = `SELECT department.id, department.name AS department,
        SUM(role.salary) AS total_salary FROM department
        JOIN role ON department.id = role.department_id
        JOIN employee ON role.id = employee.role_id
        GROUP BY department.id, department.name;`;

        const result: QueryResult = await pool.query(budgetQuery);
        console.table(result.rows);
    } catch (err) {
        console.error('Error Viewing the Total Budget by Department:', err);  
    }    
}

connectToDb().then(() => {
    // Call the mainMenu function to display the menu
    mainMenu(); 
});