const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));

let db;

// connect with retry
const connectDB = () => {

  db = mysql.createConnection({
    host: "db",
    user: "root",
    password: "root",
    database: "testdb"
  });

  db.connect((err) => {
    if (err) {
      console.log("Waiting for MySQL to start...");
      setTimeout(connectDB, 2000);
    } else {
      console.log("Connected to MySQL");

      // create table after successful connection
      db.query(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100),
          email VARCHAR(100)
        )
      `);
    }
  });

};

connectDB();

// show form
app.get("/", (req, res) => {
  res.render("index");
});

// handle form submission
app.post("/add-user", (req, res) => {

  const { name, email } = req.body;

  const sql = "INSERT INTO users (name, email) VALUES (?, ?)";

  db.query(sql, [name, email], (err) => {
    if (err) {
      return res.send("Error inserting user");
    }

    res.send("User added successfully!");
  });

});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
