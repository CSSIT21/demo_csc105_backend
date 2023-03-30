const express = require("express");
const mysql = require("mysql2");
const app = express();
const port = 3000;

// Database configuration before connect
const connection = mysql.createConnection({
  host: "server2.mixkoap.com",
  port: "7777",
  user: "user",
  password: "password",
  database: "csc105-workshop",
});

// Connect to database
connection.connect();

// Query for testing
// Just show 1+1 is equal what
connection.query("SELECT 1 + 1 AS solution", (err, rows) => {
  if (err) throw err;

  // If it runs correctly then show the solution
  console.log("The solution is: ", rows[0].solution);
});

// GET `/` (http://127.0.0.1:{port}/ or http://localhost:{port}/)
app.get("/", (req, res) => {
  return res.json({
    success: true,
    data: "Welcome to sample todo-list API",
    error: null,
  });
});

// GET `/todo/all` (http://127.0.0.1:{port}/todo/all or http://localhost:{port}/todo/all)
app.get("/todo/all", (req, res) => {
  connection.query("SELECT * FROM items", (err, rows) => {
    // Check if cannot find the data in the database then return the error
    if (err) {
      return res.json({
        success: false,
        data: null,
        error: `Data not found ${err.message}`,
      });
    } else {
      // Return data to the client if success
      return res.json({
        success: true,
        data: rows,
        error: null,
      });
    }
  });
});

// GET `/todo?todo_id=32` (http://127.0.0.1:{port}/todo?todo_id=32 or http://localhost:{port}/todo?todo_id=32)
app.get("/todo", (req, res) => {
  // Assign the params as a variable
  // https://medium.com/@joseph.pyram/9-parts-of-a-url-that-you-should-know-89fea8e11713
  const todoId = req.query.todo_id;

  // Regex to check the todo_is is a number only or not
  const checkTodoId = new RegExp(/^\d+$/).test(todoId); // Boolean

  // Check if the todo_id is not exist or is not a number, return json with an error
  if (!todoId || !checkTodoId) {
    return res.json({
      success: false,
      data: null,
      error: "todo_id is invalid",
    });
  }

  connection.query(`SELECT * FROM items WHERE id = ${todoId}`, (err, rows) => {
    // Check if cannot find the data in the database then return the error
    if (err) {
      return res.json({
        success: false,
        data: null,
        error: `Data not found ${err.message}`,
      });
    } else {
      // Return data to the client if success
      if (rows[0]) {
        return res.json({
          success: true,
          data: rows[0],
          error: null,
        });
      } else {
        return res.json({
          success: true,
          data: null,
          error: null,
        });
      }
    }
  });
});

// GET `/todo/sort` (http://127.0.0.1:{port}/todo/sort or http://localhost:{port}/todo/sort)
app.get("/todo/sort", (req, res) => {
  connection.query(`SELECT * FROM items order by due`, (err, rows) => {
    // Check if cannot find the data in the database then return the error
    if (err) {
      return res.json({
        success: false,
        data: null,
        error: `Data not found ${err.message}`,
      });
    } else {
      // Return data to the client if success
      return res.json({
        success: true,
        data: rows,
        error: null,
      });
    }
  });
});

// GET `/todo/user?user_id=32` (http://127.0.0.1:{port}/todo/user?user_id=32 or http://localhost:{port}/user?user_id=32)
app.get("/todo/user", (req, res) => {
  // Assign the params as a variable
  // https://medium.com/@joseph.pyram/9-parts-of-a-url-that-you-should-know-89fea8e11713
  const userId = req.query.user_id;

  // Regex to check the user_id is a number only or not
  const checkUserId = new RegExp(/^\d+$/).test(userId); // Boolean

  // Check if the user_id is not exist or is not a number, return json with an error
  if (!userId || !checkUserId) {
    return res.json({
      success: false,
      data: null,
      error: "user_id is invalid",
    });
  }
  connection.query(
    `SELECT * FROM items WHERE owner_id = ${userId}`,
    (err, rows) => {
      // Check if cannot find the data in the database then return the error
      if (err) {
        return res.json({
          success: false,
          data: null,
          error: `Data not found ${err.message}`,
        });
      } else {
        // Return data to the client if success
        return res.json({
          success: true,
          data: rows,
          error: null,
        });
      }
    }
  );
});

// Keep your app runs on the port that we specify
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
