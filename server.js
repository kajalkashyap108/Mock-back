const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// Path to db.json
const dbFilePath = path.join(__dirname, "db.json");

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Helper function to read/write db.json
const readDatabase = () => {
  const data = fs.readFileSync(dbFilePath, "utf8");
  return JSON.parse(data);
};

const writeDatabase = (data) => {
  fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2), "utf8");
};

// Routes

// Get all employees
app.get("/employees", (req, res) => {
  const db = readDatabase();
  res.json(db.employees);
});

// Add a new employee
app.post("/employees", (req, res) => {
  const { name, designation, department } = req.body;
  const db = readDatabase();
  const newEmployee = {
    id: db.employees.length ? db.employees[db.employees.length - 1].id + 1 : 1,
    name,
    designation,
    department
  };
  db.employees.push(newEmployee);
  writeDatabase(db);
  res.status(201).json(newEmployee);
});

// Delete an employee by ID
app.delete("/employees/:id", (req, res) => {
  const { id } = req.params;
  const db = readDatabase();
  db.employees = db.employees.filter((employee) => employee.id !== parseInt(id));
  writeDatabase(db);
  res.status(200).json({ message: "Employee deleted successfully" });
});

// Update an employee by ID
app.put("/employees/:id", (req, res) => {
  const { id } = req.params;
  const { name, designation, department } = req.body;
  const db = readDatabase();

  const employeeIndex = db.employees.findIndex((employee) => employee.id === parseInt(id));

  if (employeeIndex !== -1) {
    db.employees[employeeIndex] = { id: parseInt(id), name, designation, department };
    writeDatabase(db);
    res.status(200).json(db.employees[employeeIndex]);
  } else {
    res.status(404).json({ message: "Employee not found" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
