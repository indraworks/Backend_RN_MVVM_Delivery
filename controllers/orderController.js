const Order = require("../models/order");
const storage = require("../utils/cloud_storage");
const OrderHasProducts = require("../models/order_has_products");

//OrderHasProductController masuk sini

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

  getClientAndStatus(req, res) {
    const id_client = req.params.id_client;
    const status = req.params.status;
    //result dimodel diwakili oleh cb yaitu (err,data)=>{}
    Order.findByClientAndStatus(id_client, status, (err, data) => {
      if (err) {
        return res.status(501).json({
          success: false,
          message: "data client found !",
          error: err,
        });
      }
      for (d in data) {
        d.address = JSON.parse(d.address);
        d.client = JSON.parse(d.client);
        d.products = JSON.parse(d.products);
      }

      return res.status(201).json({
        success: true,
        message: "data client-status found it!",
        data: data,
      });
    });
  },

  getDeliveryAndStatus(req, res) {
    const id_delivery = req.params.id_delivery;
    const status = req.params.status;
    Order.findByDeliveryAndStatus(id_delivery, status, (err, data) => {
      if (err) {
        return res.status(501).json({
          success: false,
          message: "data not found !",
          error: err,
        });
      }
      for (d in data) {
        d.address = JSON.parse(d.address);
        d.client = JSON.parse(d.client);
        d.products = JSON.parse(d.products);
      }
      return res.status(201).json(
        data
        //  { success: true,
        //   message: "data delivery-status found it!",
        //   data: data,
      );
    });
  },

  //getFindByStatus
  getStatus(req, res) {
    const status = req.params.status;
    console.log("status", status);
    // CAPTURO LOS DATOS QUE ME ENVIE EL CLIENTE
    Order.findByStatus(status, (err, data) => {
      //kita panggil mdelnya masukan param user
      //pada Model :async (user, result) => {}

      if (err) {
        return res.status(501).json({
          success: false,
          message: "data not found !",
          error: err,
        });
      }

      //utk data di parse dulu tapi punya kita yg sql2 ini sudah bisa !
      for (const d of data) {
        d.address = JSON.parse(d.address);
        d.client = JSON.parse(d.client);
        d.products = JSON.parse(d.products);
      }

      return res.status(201).json(
        data
        //{} success: true,
        // message: "data found it!",
        // data: data,} // EL ID DEL NUEVO USUARIO QUE SE REGISTRO
      );
    });
  },

  findByStatus(req, res) {
    //status adalah param
    const status = req.params.status;
    console.log("status params =", status);
    Order.findByStatus(status, (err, data) => {
      if (err) {
        return res.status(501).json({
          success: false,
          message: "error form server to check status",
          error: err,
        });
      }
      for (const d of data) {
        d.address = JSON.parse(d.address);
        d.client = JSON.parse(d.client);
        d.products = JSON.parse(d.products);
        d.delivery = JSON.parse(d.delivery);
      }
      return res.status(201).json(data);
    });
  },

  //create
  async create(req, res) {
    const order = req.body;
    console.log("req.body.order dari front-end =", order);

    Order.create(order, async (err, id) => {
      if (err) {
        return res.status(501).json({
          success: false,
          message: "There was an error with the order creattion ",
          error: err,
        });
      }
      //ini order = req.body
      //utk isi order ini smacam array objec terdiri dari product.id dan quantity masing2
      //kalau id (order.id) yg dicreate diartas ,
      //otomatis dari Order.create(order, async (err,"id")=>{} yg masuk kebawah
      for (const product of order.products) {
        await OrderHasProducts.create(
          id,
          product.id,
          product.quantity,
          (err, data) => {
            if (err) {
              return res.status(501).json({
                success: false,
                message: "There was an error with the order creattion ",
                error: err,
              });
            }
          }
        );
      }

      return res.status(201).json({
        success: true,
        message: "Order creation successful",
        data: `${id}`, //THE NEW ORDER ID
      });
    });
  },

  /*

     keterangan isi products ini kita dapat dari front-end isinya :
      const order:Order = {
         //isi id_client diambil dari userContext
         id_client:user.id!,
         //isi address diambil dari userContext
         id_address:user.address?.id!,

         //utk products yg dipilih /diorder diambil dari 
         products:shoppingBag
      }


    */

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
          message: "Hubo un error con la actualizacion de la categoria",
          error: err,
        });
      }

      return res.status(201).json({
        success: true,
        message: "La categoria se actualizo correctamente",
        data: `${id}`,
      });
    });
  },
};

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
