const mysql = require("mysql2");
const { database } = require("./keys.js");

const poolSync = mysql.createPool(database);

poolSync.getConnection((err, connection) => {
  if (err) {
    if (err.code === "PROTOCOL_CONNECTION_LOST")
      console.error("DATABASE CONNECTION WAS CLOSED");

    if (err.code === "ER_CON_COUNT_ERROR")
      console.error("DATABASE HAS TOO MANY CONNECTIONS");

    if (err.code === "ECONNREFUSED")
      console.error("DATABASE CONNECTION WAS REFUSED");
    console.error(err.message);
  }

  if (connection) {
    connection.release();
    console.log("DB is connected");
  }

  return;
});

const pool = poolSync.promise();

module.exports = pool;
