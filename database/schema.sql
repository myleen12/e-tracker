DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

USE employees_db;

CREATE TABLE departments (
    id int AUTO_INCREMENT NOT NULL,
    name varchar(30) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE roles (
    id int AUTO_INCREMENT NOT NULL,
    title varchar(30) NOT NULL,
    salary DECIMAL(6, 0),
    department_id int NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE employees (
    id int AUTO_INCREMENT NOT NULL,
    first_name varchar(30) NOT NULL,
    last_name varchar(30) NOT NULL,
    role_id int NOT NULL,
    manager_id int,
    PRIMARY KEY(id)
);

