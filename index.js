const mysql = require("mysql2");
const inquirer = require("inquirer");
require("console.table")

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3001,
    user: "root",
    password: "q",
    database: "employees_db",
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    // sqlAlter = "ALTER TABLE employees MODIFY COLUMN manager_id int FIRST";
    // run the start function after the connection is made to prompt the user
    start();
});

//////// START ////////
// Prompts the user for what action they should take
function start() {
    inquirer
        .prompt({
            name: "optionList",
            type: "list",
            message: "Would you like to do?",
            choices: ["VIEW", "ADD", "UPDATE", "DELETE", "MANAGER VIEW", "VIEW DEPARTMENT BUDGET", "EXIT"]
        })
        .then(function (answer) {
            // based on their answer, either call the bid or the post functions
            if (answer.optionList === "VIEW") {
                viewPrompt();
            }
            else if (answer.optionList === "ADD") {
                addPrompt();
            }
            else if (answer.optionList === "UPDATE") {
                updatePrompt();
            }
            else if (answer.optionList === "DELETE") {
                deletePrompt();
            }
            else if (answer.optionList === "MANAGER VIEW") {
                managerViewPrompt();
            }
            else if (answer.optionList === "VIEW DEPARTMENT BUDGET") {
                viewDepartmentBudget();
            } else {
                console.log("Program terminated");
                connection.end();
            }
        });
}

//////// VIEW ////////
// View departments, roles, employees 
function viewPrompt() {
    inquirer
        .prompt({
            name: "viewList",
            type: "list",
            message: "Would you like to view departments, roles or employees?",
            choices: ["DEPARTMENTS", "ROLES", "EMPLOYEES", "BACK"]
        })
        .then(function (answer) {
            // based on their answer view respective tables
            if (answer.viewList === "DEPARTMENTS") {
                viewDepartments();
            }
            else if (answer.viewList === "ROLES") {
                viewRoles();
            }
            else if (answer.viewList === "EMPLOYEES") {
                viewEmployees();
            }
            else {
                start();
            }
        });
}

// View departments table
function viewDepartments() {
    connection.query("SELECT id, departments.name AS Department FROM departments", function (err, results) {
        if (err) throw err;
        console.table(results);
        viewGoBack();
    })
};

// View roles table
function viewRoles() {
    connection.query("SELECT roles.id, roles.title, roles.salary, departments.name AS department FROM roles LEFT JOIN departments ON roles.department_id = departments.id", function (err, results) {
        if (err) throw err;
        console.table(results);
        viewGoBack();
    })
};

// View employees table
function viewEmployees() {
    connection.query("SELECT e.id, e.first_name, e.last_name, roles.title, roles.salary, departments.name AS department, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employees e LEFT JOIN employees m ON e.manager_id=m.id INNER JOIN roles ON e.role_id = roles.id INNER JOIN departments ON roles.department_id = departments.id ORDER BY e.id", function (err, results) {
        if (err) throw err;
        console.table(results)
        viewGoBack();
    })
};
// 
//////// ADD ////////
// Add to tables
function addPrompt() {
    inquirer
        .prompt({
            name: "addList",
            type: "list",
            message: "Would you like to add to departments, roles or employees?",
            choices: ["DEPARTMENTS", "ROLES", "EMPLOYEES", "BACK"]
        })
        .then(function (answer) {
            // based on their answer add to respective tables
            if (answer.addList === "DEPARTMENTS") {
                addDepartments();
            }
            else if (answer.addList === "ROLES") {
                addRoles();
            }
            else if (answer.addList === "EMPLOYEES") {
                addEmployees();
            }
            else {
                start();
            }
        });
};

// Add to departments table
function addDepartments() {
    inquirer
        .prompt(
            {
                name: "name",
                type: "input",
                message: "What is the new department name?"
            }
        )
        .then(function (answer) {
            connection.query("INSERT INTO departments SET ?",
                {
                    name: answer.name
                },
                function (err) {
                    if (err) throw err;
                    console.log("New department added successfully.");
                    addGoBack();
                })
        })

};

// Add to roles table
function addRoles() {
    inquirer
        .prompt([
            {
                name: "title",
                type: "input",
                message: "What is the title of the new role?"
            },
            {
                name: "salary",
                type: "input",
                message: "What is the salary of the new role?"
            },
            {
                name: "departmentId",
                type: "input",
                message: "What is the department ID of the new role?"
            }
        ])
        .then(function (answer) {
            connection.query("INSERT INTO roles SET ?",
                {
                    title: answer.title,
                    salary: answer.salary,
                    department_id: answer.departmentId,
                },
                function (err) {
                    if (err) throw err;
                    console.log("New role added successfully.");
                    addGoBack();
                })
        })

};

// Add to employees table
function addEmployees() {
    inquirer
        .prompt([
            {
                name: "firstName",
                type: "input",
                message: "What is the first name of the new employee?"
            },
            {
                name: "lastName",
                type: "input",
                message: "What is the last name of the new employee?"
            },
            {
                name: "roleId",
                type: "input",
                message: "What is the role ID of the new employee?"
            },
            {
                name: "managerId",
                type: "input",
                message: "What is the manager ID of the new employee?"
            }
        ])
        .then(function (answer) {
            connection.query("INSERT INTO employees SET ?",
                {
                    first_name: answer.firstName,
                    last_name: answer.lastName,
                    role_id: answer.roleId,
                    manager_id: answer.managerId
                },
                function (err) {
                    if (err) throw err;
                    console.log("New employee added successfully.");
                    addGoBack();
                })
        })
};

//////// UPDATE ////////
// Update tables
function updatePrompt() {
    inquirer
        .prompt({
            name: "updateList",
            type: "list",
            message: "Would you like to update departments, roles or employees?",
            choices: ["DEPARTMENTS", "ROLES", "EMPLOYEES", "BACK"]
        })
        .then(function (answer) {
            // based on their answer add to respective tables
            if (answer.updateList === "DEPARTMENTS") {
                updateDepartments();
            }
            else if (answer.updateList === "ROLES") {
                updateRoles();
            }
            else if (answer.updateList === "EMPLOYEES") {
                updateEmployees();
            }
            else {
                start();
            }
        });
};

// Update departments table
function updateDepartments() {
    connection.query("SELECT * FROM departments", function (err, results) {
        if (err) throw err;

        // Choose which department to edit from list of all departments
        inquirer
            .prompt([
                {
                    name: "choice",
                    type: "rawlist",
                    choices: function () {
                        var choiceArray = [];
                        for (i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].name);
                        }
                        return choiceArray;
                    },
                    message: "Which department would you like to update?"
                },
                {
                    name: "name",
                    type: "input",
                    message: "What would you like rename the department?"
                }
            ])
            .then(function (answer) {
                // Get the id of the chosen department
                var chosenDeptartment;
                for (var i = 0; i < results.length; i++) {
                    if (results[i].name === answer.choice) {
                        chosenDeptartment = results[i];
                    }
                }
                // Update the table with the changes
                connection.query("UPDATE departments SET ? WHERE ?",
                    [
                        {
                            name: answer.name
                        },
                        {
                            id: chosenDeptartment.id
                        }
                    ],
                    function (err) {
                        if (err) throw err;
                        console.log("Department updated successfully!");
                        updateGoBack();
                    }
                );
            })
    })
};

// Update roles table
function updateRoles() {
    connection.query("SELECT * FROM roles", function (err, results) {
        if (err) throw err;

        // Choose which role to edit from list of all roles
        inquirer
            .prompt([
                {
                    name: "choice",
                    type: "rawlist",
                    choices: function () {
                        var choiceArray = [];
                        for (i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].title);
                        }
                        return choiceArray;
                    },
                    message: "Which role would you like to update?"
                },
                {
                    name: "title",
                    type: "input",
                    message: "What would you like rename the role?"
                },
                {
                    name: "salary",
                    type: "input",
                    message: "What is the updated salary?"
                },
                {
                    name: "departmentId",
                    type: "input",
                    message: "What is the updated department id?"
                },
            ])
            .then(function (answer) {
                // Get the id of the chosen role
                var chosenRole;
                for (var i = 0; i < results.length; i++) {
                    if (results[i].title === answer.choice) {
                        chosenRole = results[i];
                    }
                }
                // Update the table with the changes
                connection.query("UPDATE roles SET ? WHERE ?",
                    [
                        {
                            title: answer.title,
                            salary: answer.salary,
                            department_id: answer.departmentId
                        },
                        {
                            id: chosenRole.id
                        }
                    ],
                    function (err) {
                        if (err) throw err;
                        console.log("Role updated successfully!");
                        updateGoBack();
                    }
                );
            })
    })
};

// Update employees table
function updateEmployees() {
    connection.query("SELECT * FROM employees", function (err, results) {
        if (err) throw err;

        // Choose which employee to edit from list of all employees
        inquirer
            .prompt([
                {
                    name: "choice",
                    type: "rawlist",
                    choices: function () {
                        var choiceArray = [];
                        for (i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].first_name + ' ' + results[i].last_name);
                        }
                        return choiceArray;
                    },
                    message: "Which employee would you like to update?"
                },
                {
                    name: "firstName",
                    type: "input",
                    message: "What would you like rename their first name?"
                },
                {
                    name: "lastName",
                    type: "input",
                    message: "What would you like rename their last name?"
                },
                {
                    name: "roleId",
                    type: "input",
                    message: "What is their updated role id?"
                },
                {
                    name: "managerId",
                    type: "input",
                    message: "What is their updated manager id?"
                }
            ])
            .then(function (answer) {
                // Get the id of the chosen employee
                var chosenEmployee;
                // Parse only first name from the prompt
                var firstNameParse = answer.choice.split(" ", 1).toString();
                for (var i = 0; i < results.length; i++) {
                    if (results[i].first_name === firstNameParse) {
                        chosenEmployee = results[i];
                    }
                }

                // Update the table with the changes
                connection.query("UPDATE employees SET ? WHERE ?",
                    [
                        {
                            first_name: answer.firstName,
                            last_name: answer.lastName,
                            role_id: answer.roleId,
                            manager_id: answer.managerId
                        },
                        {
                            id: chosenEmployee.id
                        },
                    ],
                    function (err) {
                        if (err) throw err;
                        console.log("Employee updated successfully!");
                        updateGoBack();
                    }
                );
            })
    })
};

//////// DELETE ////////
function deletePrompt() {
    inquirer
        .prompt({
            name: "deleteList",
            type: "list",
            message: "Would you like to make deletions from departments, roles or employees?",
            choices: ["DEPARTMENTS", "ROLES", "EMPLOYEES", "BACK"]
        })
        .then(function (answer) {
            // based on their answer add to respective tables
            if (answer.deleteList === "DEPARTMENTS") {
                deleteDepartments();
            }
            else if (answer.deleteList === "ROLES") {
                deleteRoles();
            }
            else if (answer.deleteList === "EMPLOYEES") {
                deleteEmployees();
            }
            else {
                start();
            }
        });
};

// Delete departments table
function deleteDepartments() {
    connection.query("SELECT * FROM departments", function (err, results) {
        if (err) throw err;

        // Choose which department to delete from the list of all departments
        inquirer
            .prompt([
                {
                    name: "choice",
                    type: "rawlist",
                    choices: function () {
                        var choiceArray = [];
                        for (i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].name);
                        }
                        return choiceArray;
                    },
                    message: "Which department would you like to delete?"
                },
                {
                    name: "confirm",
                    type: "list",
                    choices: ["NO", "YES"],
                    message: "Are you sure you want to delete this department?"
                }
            ])
            .then(function (answer) {
                // If NO selected, go back
                if (answer.confirm === "NO") {
                    deleteDepartments();
                } else {
                    // Get the id of the chosen department
                    var chosenDeptartment;
                    for (var i = 0; i < results.length; i++) {
                        if (results[i].name === answer.choice) {
                            chosenDeptartment = results[i];
                        }
                    }
                    // Update the table with the changes
                    connection.query("DELETE FROM departments WHERE ?",
                        {
                            id: chosenDeptartment.id
                        },
                        function (err) {
                            if (err) throw err;
                            console.log("Department deleted successfully!");
                            deleteGoBack();
                        }
                    );
                }
            })
    })
};

// Delete roles table
function deleteRoles() {
    connection.query("SELECT * FROM roles", function (err, results) {
        if (err) throw err;

        // Choose which role to delete from the list of all roles
        inquirer
            .prompt([
                {
                    name: "choice",
                    type: "rawlist",
                    choices: function () {
                        var choiceArray = [];
                        for (i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].title);
                        }
                        return choiceArray;
                    },
                    message: "Which role would you like to delete?"
                },
                {
                    name: "confirm",
                    type: "list",
                    choices: ["NO", "YES"],
                    message: "Are you sure you want to delete this role?"
                }
            ])
            .then(function (answer) {
                // If NO selected, go back
                if (answer.confirm === "NO") {
                    deleteRoles();
                } else {
                    // Get the id of the chosen role
                    var chosenRole;
                    for (var i = 0; i < results.length; i++) {
                        if (results[i].title === answer.choice) {
                            chosenRole = results[i];
                        }
                    }
                    // Update the table with the changes
                    connection.query("DELETE FROM roles WHERE ?",
                        {
                            id: chosenRole.id
                        },
                        function (err) {
                            if (err) throw err;
                            console.log("Role deleted successfully!");
                            deleteGoBack();
                        }
                    );
                }
            })
    })
};

// Delete employees table
function deleteEmployees() {
    connection.query("SELECT * FROM employees", function (err, results) {
        if (err) throw err;

        // Choose which employee to delete from the list of all employees
        inquirer
            .prompt([
                {
                    name: "choice",
                    type: "rawlist",
                    choices: function () {
                        var choiceArray = [];
                        for (i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].first_name + ' ' + results[i].last_name);
                        }
                        return choiceArray;
                    },
                    message: "Which emplooyee would you like to delete?"
                },
                {
                    name: "confirm",
                    type: "list",
                    choices: ["NO", "YES"],
                    message: "Are you sure you want to delete this employee?"
                }
            ])
            .then(function (answer) {
                // If NO selected, go back
                if (answer.confirm === "NO") {
                    deleteEmployees();
                } else {
                    // Get the id of the chosen department
                    var chosenEmployee;
                    // Parse only first name from the prompt
                    var firstNameParse = answer.choice.split(" ", 1).toString();
                    for (var i = 0; i < results.length; i++) {
                        if (results[i].first_name === firstNameParse) {
                            chosenEmployee = results[i];
                        }
                    }
                    // Update the table with the changes
                    connection.query("DELETE FROM employees WHERE ?",
                        {
                            id: chosenEmployee.id
                        },
                        function (err) {
                            if (err) throw err;
                            console.log("Employee deleted successfully!");
                            deleteGoBack();
                        }
                    );
                }
            })
    })
};

//////// MANAGER VIEW ////////
// Sort employees by manager
function managerViewPrompt() {
    inquirer
        .prompt({
            name: "managerList",
            type: "list",
            message: "Would you like to view all employees by managers or all employees under a specific manager?",
            choices: ["ALL", "SPECIFIC MANAGER", "BACK"]
        })
        .then(function (answer) {
            // based on their answer add to respective tables
            if (answer.managerList === "ALL") {
                managerViewAll();
            }
            else if (answer.managerList === "SPECIFIC MANAGER") {
                // managerViewSpecific(); Can't implement due to limitations of project manager details
                managerViewSpecific();
            } else {
                start();
            }
        });
};

// View all employees sorted by manager
function managerViewAll() {
    connection.query("SELECT e.id, e.first_name, e.last_name, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employees e LEFT JOIN employees m ON m.id=e.manager_id ORDER BY -e.manager_id DESC, id ASC", function (err, results) {
        if (err) throw err;
        console.table(results)
        managerViewAllGoBack();
    })
};

// View all employees by specific manager
function managerViewSpecific() {
    connection.query("SELECT * FROM employees WHERE manager_id IS NOT NULL", function (err, results) {
        if (err) throw err;

        // Choose which manager id to view by
        inquirer
            .prompt(
                {
                    name: "choice",
                    type: "rawlist",
                    choices: function () {
                        var choiceArray = [];
                        for (i = 0; i < results.length; i++) {
                            if (choiceArray.includes(results[i].manager_id) == false) {
                                choiceArray.push(results[i].manager_id);
                            }
                        }
                        return choiceArray;
                    },
                    message: "Which manager would you like to view by?"
                })
            .then(function (answer) {
                    // Display the employees of selected manager
                    connection.query("SELECT e.id, e.first_name, e.last_name, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employees e LEFT JOIN employees m ON m.id=e.manager_id WHERE e.?",
                        {
                            manager_id: answer.choice
                        },
                        function (err, results) {
                            if (err) throw err;
                            console.log("Manager "+ answer.choice);
                            console.table(results);
                            managerViewSpecificGoBack();
                        }
                    );
            })
    })
};

//////// VIEW DEPARTMENT BUDGET ////////
// View total utilized budget of a specific department
function viewDepartmentBudget() {
    connection.query("SELECT * FROM departments", function (err, results) {
        if (err) throw err;

        // Choose which department to view from the list of all departments
        inquirer
            .prompt(
                {
                    name: "choice",
                    type: "rawlist",
                    choices: function () {
                        var choiceArray = [];
                        for (i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].name);
                        }
                        return choiceArray;
                    },
                    message: "Which department would you like to view?"
                }
            )
            .then(function (answer) {
                // Get the id of the chosen department
                var chosenDeptartment;
                for (var i = 0; i < results.length; i++) {
                    if (results[i].name === answer.choice) {
                        chosenDeptartment = results[i];
                    }
                }
                // Update the table with the changes
                connection.query("SELECT departments.name AS department, employees.first_name, employees.last_name, roles.title, roles.salary FROM employees INNER JOIN roles ON employees.role_id=roles.id INNER JOIN departments ON roles.department_id = departments.id WHERE ?",
                    {
                        department_id: chosenDeptartment.id
                    },
                    function (err, results) {
                        if (err) throw err;
                        // Print the table
                        console.table(results);
                        // Print the total budget
                        var budget = 0;
                        results.forEach((result, index) => {
                            budget += results[index].salary;
                        })
                        console.log("Total department utilized budget: " + budget);
                        viewDepartmentBudgetGoBack();
                    }
                );
            })
    })
};

//////// GO BACK FUNCTIONS ////////
// View go back
function viewGoBack() {
    inquirer
        .prompt(
            {
                name: "choice",
                type: "list",
                choices: ["BACK", "MAIN"],
                message: "Proceed:"
            }
        )
        .then(function(answer) {
            switch (answer.choice) {
                case "BACK":
                    viewPrompt();
                    break;
                case "MAIN":
                    start();
                    break;
            }
        })
}
// Add go back
function addGoBack() {
    inquirer
        .prompt(
            {
                name: "choice",
                type: "list",
                choices: ["BACK", "MAIN"],
                message: "Proceed:"
            }
        )
        .then(function(answer) {
            switch (answer.choice) {
                case "BACK":
                    addPrompt();
                    break;
                case "MAIN":
                    start();
                    break;
            }
        })
}
// Update go back
function updateGoBack() {
    inquirer
        .prompt(
            {
                name: "choice",
                type: "list",
                choices: ["BACK", "MAIN"],
                message: "Proceed:"
            }
        )
        .then(function(answer) {
            switch (answer.choice) {
                case "BACK":
                    updatePrompt();
                    break;
                case "MAIN":
                    start();
                    break;
            }
        })
}
// Delete go back
function deleteGoBack() {
    inquirer
        .prompt(
            {
                name: "choice",
                type: "list",
                choices: ["BACK", "MAIN"],
                message: "Proceed:"
            }
        )
        .then(function(answer) {
            switch (answer.choice) {
                case "BACK":
                    deletePrompt();
                    break;
                case "MAIN":
                    start();
                    break;
            }
        })
}
// Manager view go back
function managerViewAllGoBack() {
    inquirer
        .prompt(
            {
                name: "choice",
                type: "list",
                choices: ["BACK", "MAIN"],
                message: "Proceed:"
            }
        )
        .then(function(answer) {
            switch (answer.choice) {
                case "BACK":
                    managerViewPrompt();
                    break;
                case "MAIN":
                    start();
                    break;
            }
        })
}
// Manager view go back
function managerViewSpecificGoBack() {
    inquirer
        .prompt(
            {
                name: "choice",
                type: "list",
                choices: ["BACK", "MAIN"],
                message: "Proceed:"
            }
        )
        .then(function(answer) {
            switch (answer.choice) {
                case "BACK":
                    managerViewPrompt();
                    break;
                case "MAIN":
                    start();
                    break;
            }
        })
}
// Department Budget go back
function viewDepartmentBudgetGoBack() {
    inquirer
        .prompt(
            {
                name: "choice",
                type: "list",
                choices: ["BACK", "MAIN"],
                message: "Proceed:"
            }
        )
        .then(function(answer) {
            switch (answer.choice) {
                case "BACK":
                    viewDepartmentBudget()
                    break;
                case "MAIN":
                    start();
                    break;
            }
        })
}

// add cancel to delete
// 