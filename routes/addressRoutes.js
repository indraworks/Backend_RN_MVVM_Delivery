const passport = require('../config/passport')
const addressController = require('../controllers/addressController')
const pasport = require('passport')


module.exports =(app)=> {
    //app.get
    app.get('/api/address/:id_user',pasport.authenticate('jwt',{session:false}),addressController.findByUser)

    //app.post
    app.post('/api/address/create',pasport.authenticate('jwt',{session:false}),addressController.create)

    
}