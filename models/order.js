const db = require("../config/config");
const Order = {};

Order.findByClientAndStatus = (id_client, status, result) => {
  const sql = `
      SELECT
    CONVERT(O.id, char) AS id,
    CONVERT(O.id_client, char) AS id_client,
    CONVERT(O.id_address, char) AS id_address,
    CONVERT(O.id_delivery, char) AS id_delivery,
    O.status,
    O.timestamp,
    JSON_OBJECT(
        'id', CONVERT(A.id, char),
        'address', A.address,
        'neighborhood', A.neighborhood,
        'lat', A.lat,
        'lng', A.lng
    ) AS address,
    JSON_OBJECT(
        'id', CONVERT(U.id, char),
        'name', U.name,
        'lastname', U.lastname,
        'image', U.image,
        'phone', U.phone
    ) AS client,
    JSON_OBJECT(
        'id', CONVERT(U2.id, char),
        'name', U2.name,
        'lastname', U2.lastname,
        'image', U2.image,
        'phone', U2.phone
    ) AS delivery,
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'id', CONVERT(P.id, char),
            'name', P.name,
            'description', P.description,
            'image1', P.image1,
            'image2', P.image2,
            'image3', P.image3,
            'price', P.price,
            'quantity', OHP.quantity
        )
    ) AS products
FROM 
    orders AS O
INNER JOIN
    users AS U
ON
    U.id = O.id_client
LEFT JOIN
    users AS U2
ON
    U2.id = O.id_delivery
INNER JOIN
    address AS A
ON
    A.id = O.id_address 
INNER JOIN
    order_has_products AS OHP
ON
    OHP.id_order = O.id
INNER JOIN
    products AS P
ON
    P.id = OHP.id_product
WHERE 
    O.id_client = ? AND O.status = ?
GROUP BY
    O.id;
`;

  db.query(sql, [id_client, status], (err, data) => {
    if (err) {
      console.log();
      result(err, null);
    } else {
      result(null, data);
    }
  });
};

Order.findByDeliveryAndStatus = (id_delivery, status, result) => {
  const sql = `
       SELECT
    CONVERT(O.id, char) AS id,
    CONVERT(O.id_client, char) AS id_client,
    CONVERT(O.id_address, char) AS id_address,
    CONVERT(O.id_delivery, char) AS id_delivery,
    O.status,
    O.timestamp,
    JSON_OBJECT(
        'id', CONVERT(A.id, char),
        'address', A.address,
        'neighborhood', A.neighborhood,
        'lat', A.lat,
        'lng', A.lng
    ) AS address,
    JSON_OBJECT(
        'id', CONVERT(U.id, char),
        'name', U.name,
        'lastname', U.lastname,
        'image', U.image,
        'phone', U.phone
    ) AS client,
    JSON_OBJECT(
        'id', CONVERT(U2.id, char),
        'name', U2.name,
        'lastname', U2.lastname,
        'image', U2.image,
        'phone', U2.phone
    ) AS delivery,
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'id', CONVERT(P.id, char),
            'name', P.name,
            'description', P.description,
            'image1', P.image1,
            'image2', P.image2,
            'image3', P.image3,
            'price', P.price,
            'quantity', OHP.quantity
        )
    ) AS products
FROM 
    orders AS O
INNER JOIN
    users AS U
ON
    U.id = O.id_client
LEFT JOIN
    users AS U2
ON
    U2.id = O.id_delivery
INNER JOIN
    address AS A
ON
    A.id = O.id_address 
INNER JOIN
    order_has_products AS OHP
ON
    OHP.id_order = O.id
INNER JOIN
    products AS P
ON
    P.id = OHP.id_product
WHERE 
    O.id_delivery = ? AND O.status = ?
GROUP BY
    O.id;
`;

  db.query(sql, [id_delivery, status], (err, data) => {
    if (err) {
      console.log("Error =", err);
      result(err, null);
    } else {
      result(null, data);
    }
  });
};

Order.findByStatus = (status, result) => {
  //ini test ok
  //   const sql = `
  //     SELECT
  //         CONVERT(O.id, char) AS id,
  //         CONVERT(O.id_client, char) AS id_client,
  //         CONVERT(O.id_address, char) AS id_address,
  //         CONVERT(O.id_delivery, char) AS id_delivery,
  //         O.status,
  //         O.timestamp
  //       FROM orders as O
  //       WHERE O.status = ?

  //     `;

  const sql = `
SELECT
    CONVERT(O.id, char) AS id,
    CONVERT(O.id_client, char) AS id_client,
    CONVERT(O.id_address, char) AS id_address,
    CONVERT(O.id_delivery, char) AS id_delivery,
    O.status,
    O.timestamp,
    JSON_OBJECT(
        'id', CONVERT(A.id, char),
        'address', A.address,
        'neighborhood', A.neighborhood,
        'lat', A.lat,
        'lng', A.lng
    ) AS address,
    JSON_OBJECT(
        'id', CONVERT(U.id, char),
        'name', U.name,
        'lastname', U.lastname,
        'image', U.image,
        'phone', U.phone
    ) AS client,
    JSON_OBJECT(
        'id', CONVERT(U2.id, char),
        'name', U2.name,
        'lastname', U2.lastname,
        'image', U2.image,
        'phone', U2.phone
    ) AS delivery,
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'id', CONVERT(P.id, char),
            'name', P.name,
            'description', P.description,
            'image1', P.image1,
            'image2', P.image2,
            'image3', P.image3,
            'price', P.price,
            'quantity', OHP.quantity
        )
    ) AS products
FROM 
    orders AS O
INNER JOIN
    users AS U
ON
    U.id = O.id_client
LEFT JOIN
    users AS U2
ON
    U2.id = O.id_delivery
INNER JOIN
    address AS A
ON
    A.id = O.id_address 
INNER JOIN
    order_has_products AS OHP
ON
    OHP.id_order = O.id
INNER JOIN
    products AS P
ON
    P.id = OHP.id_product
WHERE 
    status = ?
GROUP BY
    O.id;
`;
  db.query(sql, [status], (err, data) => {
    if (err) {
      console.log("Error:", err);
      result(err, null);
    } else {
      result(null, data);
    }
  });
};

Order.create = (order, result) => {
  const sql = `
    INSERT INTO orders(
                  id_client,
                    id_address,
                    status,
                 timestamp,
                 created_at,
                 updated_at 
                  )
    VALUES(?, ?, ?, ?, ?,?)
    `;
  //jadi kalau ada 2 primary maka yg masuk disini dimasukan 2 2 nya
  db.query(
    sql,
    [
      order.id_client,
      order.id_address,
      "PAID", //1. PAID 2. SHIPPED 3. ON_WAY 4. DELIVERED
      Date.now(),
      new Date(),
      new Date(),
    ],
    (err, res) => {
      if (err) {
        console.log("Error:", err);
        result(err, null);
      } else {
        console.log("New Order Id:", res.insertId);
        result(null, res.insertId);
      }
    }
  );
};

module.exports = Order;
