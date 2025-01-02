-- Go into the employee_db Database
\c employees_db

-- Insert data into Department Table
INSERT INTO department (name)
VALUES ('Engineering'),
       ('Sales'),
       ('Human Resources'),
       ('Marketing');


-- Insert data into Role Table
INSERT INTO role (title, salary, department_id)
VALUES ('Software Engineer', 90000, 1),
       ('Sales Representative'60000, 2),
       ('Human Manager', 70000, 3),
       ('Marketing Coordinator', 55000, 4);

-- Insert data into Employee Table
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Joseph', 'Smith', 1, 1),
       ('Jane', 'Lacey',2, 2),
       ('Susan', 'Clark', 4, NULL),
       ('Emily', 'James', 3, NULL),
       ('David', 'Wilson', 1, 1);