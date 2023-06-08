INSERT INTO departments (name)
VALUES ("Sales"), ("Engineering"), ("Legal"), ("Finance");

INSERT INTO roles (title, salary, department_id)
VALUES ("Lead Salesperson", 80000, 1),
    ("Junior Salesperson", 50000, 1),
    ("Senior Software Engineer", 150000, 2),
    ("Junior Software Engineer", 80000, 2),
    ("Lawyer", 140000, 3),
    ("Paralegal", 110000, 3),
    ("Accountant", 100000, 4);

    INSERT INTO employees (first_name, last_name, role_id, manager_id)
    VALUES ("Jack", "Sparrow", 1, null),
    ("Hector", "Barbosa", 2, 1),
    ("Carina", "Smyth", 2, 1),
    ("Elizabeth", "Swann", 3, null),
    ("Will", "Turner", 4, 3),
    ("Sao", "Feng", 4, 3),
    ("Weatherby", "Swann", 4, 3),
    ("Davy", "Jones", 6, null),
    ("Tia", "Dalma", 6, 5),
    ("Henry", "Turner", 6, 5),
    ("Joshamee", "Gibs", 7, null),
    ("James", "Norington", 7, 7),
    ("Armando", "Salazar", 7, 7);