const Category = require('../models/category')
const storage = require('../utils/cloud_storage')

//ini mirip sama dgn register copy saja dan ganti dgn category 

module.exports = {
    // cpntoh model result adalah callback function 
    // Category.getAll= (result)=> {
    //     //utk yg select tak pakai param lgsung result
    //     //lewat cb fucntion
    //        const sql =`SELECT
    //                     id,
    //                     name,
    //                     description,
    //                     image
    //                   FROM categories
    //                   ORDER BY name`;
    //          db.query(sql,(err,res)=> {
    //               if(err) {
    //                 console.log('Error',err)
    //                 result(err,null)
    //               }
    //               else {
    //                 console.log('succesful select categories',data)
    //                 result(null,data)
    //               }
      
    //          })         
        
    //   }
      

    //getAll
    async getAll(req,res) {
        Category.getAll((err,data)=> {
            if(err){

                return res.status(501).json({
                    success:false,
                    message:'error select from server ',
                    error:err
                })
            }
            return res.status(201).json(data)
        })
    },

     //create 
    async create(req,res) {
        const category = JSON.parse(req.body.category)
        console.log("req.body.category dari front-end =",category)
        const files = req.files
        if(files.length > 0) {
            const path = `image_${Date.now()}`
            const url = await storage(files[0],path)
          
            if (url != undefined && url != null) {
                category.image = url;}
        }
      Category.create(category,(err,id)=>{
       
        if(err){
            return res.status(501).json({
                success:false,
                message:'There was an error with the category creattion ',
                error:err
            })
        }

        return res.status(201).json({
            success:true,
            message : "Cagtegory creation successful",
            data:`${id}`
        })
      })


    },

    //update with image  kita copay dari updateWithImage
    async updateWithImage(req, res) {

        const category = JSON.parse(req.body.category); // CAPTURO LOS DATOS QUE ME ENVIE EL CLIENTE

        const files = req.files;

        if (files.length > 0) {
            const path = `image_${Date.now()}`;
            const url = await storage(files[0], path);

            if (url != undefined && url != null) {
                category.image = url;
            }
        }

        Category.update(category, (err, id) => {

        
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con la actualizacion de la categoria',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'La categoria se actualizo correctamente',
                data: `${id}`
            });
        });

    },
    async updateWithoutImage(req, res) {
        //kalau yg tanpa image kita tak perlu parse JSON krn udah text tanpa file 
         //const user = JSON.parse(req.body.user); 
         const category = req.body; 
        

         //hapus smua yg files token jwt dkk nya!

        Category.updateWithoutImage(category, (err, id) => {

        
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del usuario',
                    error: err
                });
            }
            //kita delete yg token dan jwt disini gak dipakai karn update 
            
            return res.status(201).json({
                success: true,
                message: 'registration with role success',
                data: `${id}`
            });
            


          

        });

    },


    //delete 
    async delete( req,res) {
        const id = req.params.id
        Category.delete(id,(err,data)=> {
            if(err) {
                return res.status(501).json({
                    success:false,
                    message:'error from server',
                    error:err
                })

            }
            return res.status(201).json({
                success:true,
                message:'success deleted id',
                data:`${id}`
            })
        })
    }




}



/*

tanpa json.parse hasil:
req.body.category dari front-end = {"name":"baju","description":"macam bacu",
"image":"file:///data/user/0/com.rnfoodspain73/cache/rn_image_picker_lib_temp_b5465f96-d2cb-4234-bf84-ed03fbf5b7b9.png"}
tanpa JSON.parse akan ada error sbb:
rror Error: ER_BAD_NULL_ERROR: Column 'name' cannot be null
    at Sequence._packetToError (/home/indra/Project/BackendDeliveryMySQL/node_modules/mysql/lib/protocol/sequences/Sequence.js:47:14)
    at Query.ErrorPacket (/home/indra/Project/BackendDeliveryMy

dgn json.parse() : jadi field di keynya gak boleh ada tanda petik artinya kita simpan itu didalam nodejs /db dalam bentuk OBject!
req.body.category dari front-end = {
  name: 'WIG',
  description: 'macam2 rambut palsu',
  image: 'file:///data/user/0/com.rnfoodspain73/cache/rn_image_picker_lib_temp_f19986bd-7404-45c6-928f-baa13d99cf1c.png'
}

*/