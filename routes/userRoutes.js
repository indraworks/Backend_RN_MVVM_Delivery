const usersController = require("../controllers/usersController");
const passport = require("passport");

module.exports = (app, upload) => {
  // GET -> OBTENER DATOS
  // POST -> ALMACENAR DATOS
  // PUT -> ACTUALIZAR DATOS
  // DELETE -> ELIMINAR DATOS

  app.post("/api/users/create", usersController.register);
  app.post(
    "/api/users/create-with-image",
    upload.array("image", 1),
    usersController.registerWithImage
  );
  app.post("/api/users/login", usersController.login);
  // app.get("/api/users/findById/:id", usersController.getId);
  // //utk put atau update
  // app.put(
  //   "/api/users/update",
  //   passport.authenticate("jwt", { session: false }),
  //   upload.array("image", 1),
  //   usersController.updateWithImage
  // );
  // app.put(
  //   "/api/users/update-without-image",
  //   passport.authenticate("jwt", { session: false }),
  //   usersController.updateWithoutImage
  // );
  //stlkah buat backend update kita ke frontend buat src/Domain/repositories
};

/* baiab 
jika kita mmbuat authentication lewat jwt maka di front end pada abagiana data raepostioty (nbagian dari ApiDelivery) maka kita 
harus buat interceptornya jadi pada saat login tadi sblum update harus dipastikan dulu bahwa ssession token dari 
si user harus sama utk itu kita interceptor taruh diheader JADI DIAMBIL dari STORAGE trus nilai token_sesion ditaruh diheader!
nilai authorizationya = jwt_sesion_token sbb liat dapa data repostiory di APiDelivery!


*/
