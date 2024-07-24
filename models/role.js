const db = require('../config/config')

const Role = {}

Role.create = (id_user,id_role,result) => {
   const sql = `
      INSERT INTO
         user_has_roles(
            id_user,
            id_role,
            created_at,
            updated_at
         )
         VALUES(?,?,?,?)
   `;
   db.query(sql,[id_user,id_role,new Date(),new Date()],(err,user)=> {
     if(err) {
        console.log('Error =',err)
        result(err,null)
     } else {
        console.log('user obtained with role')
        result(null,user[0])
     }
   })



}
module.exports =Role;