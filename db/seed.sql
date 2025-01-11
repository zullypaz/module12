
INSERT INTO department
    (name)
VALUES
    ('Marketing'),
    ('Operations'),
    ('Human Resources'),
    ('Information Technology');


INSERT INTO role
    (title, salary, department_id)
VALUES
    ('Marketing Manager', 120000, 1),
    ('Financial Analyst', 90000, 1),
    ('Operations Manager', 130000, 2),
    ('Production Supervisor', 90000, 2),
    ('HR Recruiter', 95000, 3),
    ('Network Administrator', 110000, 3),
    ('System Analyst', 105000, 4),
    ('Accountant', 90000, 4);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Adriana', 'Meyers', 1, NULL),
    ('John', 'Smith', 2, 1),
    ('Alex', 'Johnson', 3, NULL),
    ('Nicolle', 'Brown', 4, 3),
    ('Abella', 'Davis', 5, NULL),
    ('Eric', 'Williams', 6, 5),
    ('James', 'Rodriguez', 7, NULL),
    ('Bruce', 'Miller', 8, 7);

    

