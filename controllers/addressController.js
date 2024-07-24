const Address = require('../models/address')

module.exports = {

  //ingat utk pada routes /:id berawrti pakai params 
 findByUser(req,res) {
   const id_user = req.params.id_user
   //id_user yg dibawah ini dari id_user yg isinya req.params 
   //sblahnya callback 
   Address.findByUser(id_user,(err,data)=> {
    //id_user masik kemodel dgn sqlnya itu diexcute 
       if(err) {
         return res.status(501).json({
           success:false,
           message:'Error by server',
           error:err
         })
       }
       return res.status(201).json(data)
   })

 } ,

 create(req,res) {
     const address = req.body
     console.log('Address :',address)
     Address.create(address,(err,id)=> {
        //jadi intinya yg di model result =(err,id)=>{} makanya harus ada return 
        //nah yg masuk di sini param  id adalah res.insertedId ( dari model )
          if(err) {
            //ada retrun disini yg mana masuk ke result (cb function )
            return res.status(501).json({
                success:false,
                message:' Error cant created address',
                error:err

            })}
          
          return res.status(201).json({
            success:true,
            message:'Created address success!',
            data:`${id}`
          })
     })
}

}