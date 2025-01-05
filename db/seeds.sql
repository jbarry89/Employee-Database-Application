-- Insert data into Department Table
INSERT INTO department (name)
VALUES ('Engineering'),
       ('Sales'),
       ('Human Resources'),
       ('Marketing'),
       ('Production'),
       ('Shipping');


-- Insert data into Role Table
INSERT INTO role (title, salary, department_id)
VALUES ('Software Engineer', 115000, 1),
       ('Sales Representative', 60000, 2),
       ('Human Resource Manager', 75000, 3),
       ('Marketing Coordinator', 55000, 4),
       ('Production Manager', 85000, 5),
       ('Shipping Clerk', 44000, 6),
       ('Recruiter', 50000, 3);

-- Insert data into Employee Table
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Joseph', 'Smith', 1, 5),
       ('Jane', 'Lacey',2, 5),
       ('Susan', 'Clark', 7, 4),
       ('Emily', 'James', 3, NULL),
       ('David', 'Wilson', 1, 5),
       ('Nathan', 'Howard', 5, NULL),
       ('Megan', 'Fuller', 4, 5),
       ('Robert', 'Cummings', 6, 5);
       

-- SELECT * FROM department;
-- SELECT * FROM role;
-- SELECT * FROM employee;