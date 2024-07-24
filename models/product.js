const db = require('../config/config');

const Product = {}  //hanyala object kosong 
//nnti nama meethod di objec kosong mengacu pada nama controller
//dimana nama Model ini managcu pada Db  dan parameter result yg masuk di param
//adalaj calback function  dari controller nanti


//utk get model tidak ada param hanya respons result saja!
Product.getAll= (result)=> {
  //utk yg select tak pakai param lgsung result
  //lewat cb fucntion
     const sql =`SELECT
                  id,
                  name,
                  description,
                  price,
                  image1,
                  image2,
                  image3,
                  id_category
                  created_at,
                  updated_at
                FROM 
                    products
                ORDER 
                    BY name`;
       db.query(sql,(err,data)=> {
            if(err) {
              console.log('Error',err)
              result(err,null)
            }
            else {
              console.log('succesful select products',data)
              result(null,data)
            }

       })         
  
}

//findbyCategory 
//masing2 id dari bigint di convert jadi char krn dlm sql 
Product.findByCategory = (id_category,result)=> {
  const sql = `
      SELECT
           CONVERT(P.id,char) AS id,
           P.name,
           P.description,
           P.price,
           P.image1,
           P.image2,
           P.image3,
           CONVERT(P.id_category,char) AS id_category
     FROM     
         products as P
     WHERE 
         P.id_category = ?     

  
  `;

  db.query(sql,[id_category],(err,res)=> {
    if (err) {
      console.log('Error:', err);
      result(err, null);
    }
else {
    console.log(' NewId from products created!:', res);
    result(null, res);
     }
  })
}


//create 
Product.create =(product,result)=> {
   //result adalah cb function jadi isiya :(err,id)=> {return}

   const sql= `
     INSERT INTO
       products(
        name,
        description,
        price,
        image1,
        image2,
        image3,
        id_category,
        created_at,
        updated_at
       )
    VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)  
   `;
   db.query(
    sql, 
    [
        product.name,
        product.description,
        product.price,
        product.image1,
        product.image2,
        product.image3,
        product.id_category,
        new Date(),
        new Date()
    ],
    (err, res) => {
              if (err) {
                    console.log('Error:', err);
                    result(err, null);
                  }
              else {
                  console.log(' NewId from products created!:', res.insertId);
                  result(null, res.insertId);
                   }
                  }
           )
      }


  
 

//update KALAU MODEL hanya 1 buat update saja 
//utk controller ada 2 yaitu update dan updateWithImage 

Product.update = (product,result)=> {
  const sql = `
   UPDATE
        products
     SET   
          name = ?,
          description = ?,
          price = ?,
          image1= ?,
          image2 = ?,
          image3 = ?,
          id_category = ?,
          updated_at = ? 
     WHERE
          id = ?   
              `;
 
     db.query(sql,
                [
                product.name,
                product.description,
                product.price,
                product.image1,
                product.image2,
                product.image3,
                product.id_category,
                new Date(), //sesuai urutan dari sql diatas ,utk time pakai waktu yg baru!
                product.id //ini stlah where diatas sama dimasukan juga krn dia trmasuk param!
              ],
              
              //cb functionya 
              (err,res)=> {
                if(err){
                  console.log('Error ',err)
                  result(err,null)
                }
                else {
                  console.log('Update product success done :',product.id)
                  result(null,product.id)
                }
              }  )
   

   }




//delete
Product.delete =(id,result)=> {
  const sql = `
     DELETE FROM 
        products
      WHERE 
          id = ?
  `;
  //error dan response bukan result atau data ( default ini kalau delete)
  //(err,res)=> {return} ini callback dari result 
  //nah dicontroler nnti : 
  /*
     products.delete(id,(err,data)=> {
        returnya sama ada 3 return (
               json({success: ,message:,error:})
        )

  */
    db.query(sql,
      [id],
      (err,res)=>{
      if(err) {
        console.log('Error =',err)
        result(err,null)
      }
      else {
        console.log(`id: ${id} :has already delete`)
        result(null,id)
      }
    })

}
module.exports = Product;

