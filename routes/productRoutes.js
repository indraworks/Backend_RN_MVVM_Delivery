const productsController = require('../controllers/productsController')
const categoryController = require('../controllers/productsController')
const passport = require('passport')


module.exports =(app,upload) => {
    //get
    app.get('/api/products/findByCategory/:id_category',passport.authenticate('jwt',{session:false}),productsController.findByCategory)

    //post
    app.post('/api/products/create',passport.authenticate('jwt',{session:false}),upload.array('image',3),
        productsController.create)

//delete
     app.delete('/api/products/delete/:id',passport.authenticate('jwt',{session:false}),productsController.delete)
 

     //update 
     app.put('/api/products/updateWithImage',passport.authenticate('jwt',{session:false}),upload.array('image',3),
     productsController.updateWithImage)

     //updateWithImage 
     app.put('/api/products/update',passport.authenticate('jwt',{session:false}),
     productsController.update)


      //menuju ke server.js import ini route!declare disana ! 
     //habis ini dari update kita ke Domain repository di frontend!
     
}