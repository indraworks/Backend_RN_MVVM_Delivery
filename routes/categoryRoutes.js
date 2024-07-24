const categoryController = require('../controllers/categoryContoller')
const passport = require('passport')


module.exports =(app,upload) => {
    //get
    app.get('/api/categories/getAll',passport.authenticate('jwt',{session:false}),categoryController.getAll)

    //post
    app.post('/api/categories/create',passport.authenticate('jwt',{session:false}),upload.array('image',1),
categoryController.create)

//delete
     app.delete('/api/categories/:id',passport.authenticate('jwt',{session:false}),categoryController.delete)
 

     //update 
     app.put('/api/categories/updateWithImage',passport.authenticate('jwt',{session:false}),upload.array('image',1),
     categoryController.updateWithImage)

     //updateWithImage 
     app.put('/api/categories/update',passport.authenticate('jwt',{session:false}),
     categoryController.updateWithoutImage)

     //habis ini dari update kita ke Domain repository di frontend!
}