const Product = require("../models/product");
const storage = require("../utils/cloud_storage");
const asyncForEach = require("../utils/async_foreach");

//ini mirip sama dgn register copy saja dan ganti dgn category

module.exports = {
  //getAllcontrollers/categoryContoller.js
  async getAll(req, res) {
    Product.getAll((err, data) => {
      if (err) {
        return res.status(501).json({
          success: false,
          message: "error select from server ",
          error: err,
        });
      }
      return res.status(201).json(data);
    });
  },

  //find by Category
  findByCategory(req, res) {
    const id_category = req.params.id_category;
    Product.findByCategory(id_category, (err, data) => {
      if (err) {
        return res.status(501).json({
          success: false,
          message: "Hubo un error con la actualizacion de la categoria",
          error: err,
        });
      }
      return res.status(201).json(data);
    });
  },

  async update(req, res) {
    //kalau yg tanpa image kita tak perlu parse JSON krn udah text tanpa file
    //const user = JSON.parse(req.body.user);
    const product = req.body;

    //hapus smua yg files token jwt dkk nya!

    Product.update(product, (err, data) => {
      if (err) {
        return res.status(501).json({
          success: false,
          message: "Errror from server failure update",
          error: err,
        });
      }
      //kita delete yg token dan jwt disini gak dipakai karn update

      return res.status(201).json({
        success: true,
        message: "Product update success",
        data: data,
      });
    });
  },

  //update with image  kita copay dari updateWithImage
  async updateWithImage(req, res) {
    const product = JSON.parse(req.body.product); // CAPTURO LOS DATOS QUE ME ENVIE EL CLIENTE

    const files = req.files;
    //yg updateWithImage mirip atau sama persis dgn create !
    let inserts = 0;

    if (files === 0) {
      return res.status(501).json({
        success: false,
        message: "there was error cause no image detect to insert ",
      });
    } else {
      Product.update(product, (err, id_product) => {
        if (err) {
          return res.status(501).json({
            success: false,
            message: "There was an error with the product creattion ",
            error: err,
          });
        }

        //ini 3x insert
        product.id = id_product;
        const start = async () => {
          await asyncForEach(files, async (file) => {
            const path = `image_${Date.now()}`;
            const url = await storage(files[0], path);

            if (url != undefined && url != null) {
              //update image on firebase

              if (inserts === 0) {
                product.image1 = url;
              } //image 1
              else if (inserts === 1) {
                product.image2 = url;
              } //image 2
              else if (inserts === 2) {
                product.image3 = url;
              } //image 3
            }
            //ambil dari model utk yg update stlah update
            await Product.update(product, (err, data) => {
              if (err) {
                return res.status(501).json({
                  success: false,
                  message: "There was an error with the product creattion ",
                  error: err,
                });
              }
              inserts = inserts + 1;
              if (inserts === files.length) {
                return res.status(201).json({
                  success: true,
                  message: "Cagtegory creation successful",
                  data: data,
                });
              }
            });
          });
        };
        start();
      });
    }
  },

  //delete
  async delete(req, res) {
    const id = req.params.id;
    Product.delete(id, (err, data) => {
      if (err) {
        return res.status(501).json({
          success: false,
          message: "error from server",
          error: err,
        });
      }
      return res.status(201).json({
        success: true,
        message: "success deleted id",
        data: `${id}`,
      });
    });
  },

  create(req, res) {
    const product = JSON.parse(req.body.product); // CAPTURO LOS DATOS QUE ME ENVIE EL CLIENTE

    const files = req.files;

    let inserts = 0;

    if (files.length === 0) {
      return res.status(501).json({
        success: false,
        message: "Error al registrar el producto no tiene imagenes",
      });
    } else {
      Product.create(product, (err, id_product) => {
        if (err) {
          return res.status(501).json({
            success: false,
            message: "Hubo un error con el registro del producto",
            error: err,
          });
        }

        product.id = id_product;
        const start = async () => {
          await asyncForEach(files, async (file) => {
            const path = `image_${Date.now()}`;
            const url = await storage(file, path);

            if (url != undefined && url != null) {
              // CREO LA IMAGEN EN FIREBASE
              if (inserts == 0) {
                //IMAGEN 1
                product.image1 = url;
              } else if (inserts == 1) {
                //IMAGEN 2
                product.image2 = url;
              } else if (inserts == 2) {
                //IMAGEN 3
                product.image3 = url;
              }
            }

            await Product.update(product, (err, data) => {
              if (err) {
                return res.status(501).json({
                  success: false,
                  message: "Hubo un error con el registro del producto",
                  error: err,
                });
              }

              inserts = inserts + 1;

              if (inserts == files.length) {
                // TERMINO DE ALAMACENAR LAS TRES IMAGENES
                return res.status(201).json({
                  success: true,
                  message: "El producto se almaceno correctamente",
                  data: data,
                });
              }
            });
          });
        };

        start();
      });
    }
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
