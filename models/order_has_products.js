const db = require('../config/config')

const OrderHasProducts = {}

//utk order has product punya 2 kuci primary tamu 
//id_order dan id_product maka 2 2 nya harus ditutlis dan jumlah yg dipesan 
//utk result adalah cb() functiuon
OrderHasProducts.create =(id_order,id_product,quantity,result) => {

     const sql =`
        INSERT INTO
               order_has_products
               (
                  id_order,
                  id_product,
                  quantity,
                  created_at,
                  updated_at
               )
        VALUES(?,?,?,?,?)          
     `;
    db.query(
        sql,
        [
            id_order,
            id_product,
            quantity,
            new Date(),
            new Date()
        ],
        (err,res)=> {
            if(err){
                console.log('Error :',err)
                result(err,null)
            }
            else {
                console.log('new orderhasproductId :',res.insertId)
                result(null,res.insertId)
            }
        }
          
    ) 




}

module.exports = OrderHasProducts
