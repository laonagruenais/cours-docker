const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./db/rabbitmq.db");

// Create table command
const createTable = () => {
  return new Promise((resolve, reject) => {
    db.run(
      `CREATE TABLE IF NOT EXISTS command (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            status TEXT NOT NULL
        )`,
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
};

// Get all commands
const getCommands = () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM command", (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// Get a command
const getCommand = (id) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM command WHERE id = ?", id, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

// Create a command
const createCommand = (command) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO command (name, status) VALUES (?, ?)";
    const params = [command.name, command.status];

    db.run(sql, params, function (err, result) {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve(this.lastID);
    });
  });
};

// Update a command
const updateCommand = async (command) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE command SET status = ? WHERE id = ?";
    const params = [command.status, command.commandId];
    db.run(sql, params, function (err, result) {
      if (err) {
        reject(err);
      }
      resolve(this.lastID);
    });
  });
};

module.exports = {
  createTable,
  getCommands,
  getCommand,
  createCommand,
  updateCommand,
};
