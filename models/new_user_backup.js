const db = require("../config/config");
const bcrypt = require("bcryptjs");

const User = {};

User.findById = (id, result) => {
  const sql = `
    SELECT 
    U.id,
    U.name,
    U.lastname,
    U.email,
    U.image,
    U.phone,
    U.password,
    JSON_ARRAYAGG(JSON_OBJECT(
        'id',CONVERT(R.id,char),
        'name',R.name,
        'image',R.image,
        'route',R.route
       
   )) AS roles 
    FROM users AS U
    INNER JOIN 
    user_has_roles AS UHR
    ON U.id = UHR.id_user  
    INNER JOIN
    roles AS R 
    ON UHR.id_role = R.id
    WHERE U.id = ?
    GROUP BY
       U.id

    `;

  db.query(sql, [id], (err, user) => {
    if (err) {
      console.log("Error:", err);
      result(err, null);
    } else {
      console.log("Usuario obtenido:", user[0]);
      result(null, user[0]);
    }
  });
};

User.findByEmail = (email, result) => {
  const sql = `
    SELECT 
    U.id,
    U.name,
    U.lastname,
    U.email,
    U.image,
    U.phone,
    U.password,
    JSON_ARRAYAGG(JSON_OBJECT(
        'id',CONVERT(R.id,char),
        'name',R.name,
        'image',R.image,
        'route',R.route
       
   )) AS roles 
    FROM users AS U
    INNER JOIN 
    user_has_roles AS UHR
    ON U.id = UHR.id_user  
    INNER JOIN
    roles AS R 
    ON UHR.id_role = R.id
    WHERE U.email = ?;
        `;

  db.query(sql, [email], (err, user) => {
    if (err) {
      console.log("Error:", err);
      result(err, null);
    } else {
      console.log("Usuario obtenido:", user[0]);
      result(null, user[0]);
    }
  });
};

//utk mdel register pada controller nnti
User.create = async (user, result) => {
  const hash = await bcrypt.hash(user.password, 10);

  const sql = `
        INSERT INTO
            users(
                email,
                name,
                lastname,
                phone,
                image,
                password,
                created_at,
                updated_at
            )
        VALUES(?, ?, ?, ?, ?, ?, ?, ?)
    `;

  db.query(
    sql,
    [
      user.email,
      user.name,
      user.lastname,
      user.phone,
      user.image,
      hash,
      new Date(),
      new Date(),
    ],
    (err, res) => {
      if (err) {
        console.log("Error:", err);
        result(err, null);
      } else {
        console.log("Id del nuevo usuario:", res.insertId);
        result(null, res.insertId);
      }
    }
  );
};

//update tanpa image
//ingat fieldnya tertulis di mysql db  yaitu updated_at ! harus ada d nya !
User.updateWithoutImage = (user, result) => {
  const sql = `
         UPDATE 
               users
         SET 
            name = ?,
            lastname = ?,
            phone = ?,
            updated_at = ?
         WHERE
             id =?         
     `;

  db.query(
    sql,
    [user.name, user.lastname, user.phone, new Date(), user.id],
    (err, res) => {
      if (err) {
        console.log("Error", err);
        result(err, null);
      } else {
        console.log("User WithoutImage Updated!", user.id);
        result(null, user.id);
      }
    }
  );
};

//update dgn image
User.update = (user, result) => {
  const sql = `
         UPDATE 
               users
         SET 
            name = ?,
            lastname = ?,
            phone = ?,
            image = ?,
            updated_at = ?
         WHERE
             id = ?         
     `;

  db.query(
    sql,
    [user.name, user.lastname, user.phone, user.image, new Date(), user.id],
    (err, res) => {
      if (err) {
        console.log("Error", err);
        result(err, null);
      } else {
        console.log("User Backend Updated!", user.id);
        result(null, user.id);
      }
    }
  );
};

module.exports = User;
