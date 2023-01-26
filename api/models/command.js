const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./db/rabbitmq.db");

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

const createCommand = async (reqBody) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO command(name, status) VALUES (?,?)";
    const params = [reqBody.name, reqBody.status];
    db.run(sql, params, function (err, result) {
      if (err) {
        reject(err);
      }
      resolve(this.lastID);
    });
  });
};

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
