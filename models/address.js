const db = require('../config/config')
const Address = {} //address adalah object atau varaible object

//sekarang utk buat list kita akan cari addres masing2 user ada berapa address 
//yg dipakai?
//(,result)=> {} rsult disini adalah sbuat calback 
Address.findByUser =(id_user,result) => {
   const sql = `
      SELECT 
           CONVERT(id,char) AS id,
           address,
           neighborhood,
           lat,
           lng,
           id_user
      FROM
          address
      WHERE
          id_user = ?         
   
   `
   db.query(
      sql,
      id_user,
      //data itu sllau response dfault dati backend!
      (err,data) => {
        if(err) {
          console.log('Error =',err)
           result(err,null)
        } else {
            result(null,data)
        }
      }
   )
}



//jadi nama object dot create ini sbgai sbuah variable dari function
//dimana nnti ada paramter address yg mrupakan variable dari req.body
//address = req.body masuk dari controll (pd addressController)
//masuk ke function model ini !
Address.create =(address,result)=> {
   const sql =`
     INSERT INTO address(
       address,
       neighborhood,
       lat,
       lng,
       id_user,
       created_at,
       updated_at
     ) VALUES(
      ?,?,?,?,?,?,?
      ) 
   
   `;
   db.query(
    sql, //yg kotak array berisi field2 yg akan masuk sbgai param yg berasal dari req.body atau variable address
    [
     address.address,
     address.neighborhood,
     address.lat,
     address.lng,
     address.id_user,
     new Date(),
     new Date()
     
    ],
    (err,res)=> {
        if(err){
            console.log('err =',err)
            result(err,null) //ini function cd di controller yg nnti ada kembalian jika error
        } else {
            console.log('new Address Id createe ', res.insertId)
            result(null,res.insertId) // ini  dicontroler adalah param id yg mewakili res.insertId yg masuk 
        }
        
    }
   )


}


module.exports = Address

