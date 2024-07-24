//acuan mysql2 =https://sidorares.github.io/node-mysql2/docs

const mysql = require("mysql");
//utk mysql di kembalikan dari mysql2 ke mysql
//karena dibagian order berupa [object object ] maka kita harus parse 1 persatu 1

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "brezn3v_2005",
  database: "udemy_delivery",
});

db.connect(function (err) {
  if (err) throw err;
  console.log("DATABASE CONNECTED!");
});

module.exports = db;
