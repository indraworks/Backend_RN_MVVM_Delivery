const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

module.exports = {
  login(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    User.findByEmail(email, async (err, myUser) => {
      console.log("Error ", err);
      console.log("USUARIO ", myUser);

      if (err) {
        return res.status(501).json({
          success: false,
          message: "Hubo un error con el registro del usuario",
          error: err,
        });
      }

      if (!myUser) {
        return res.status(401).json({
          // EL CLIENTE NO TIENE AUTORIZACION PARTA REALIZAR ESTA PETICION (401)
          success: false,
          message: "El email no fue encontrado",
        });
      }

      const isPasswordValid = await bcrypt.compare(password, myUser.password);

      if (isPasswordValid) {
        const token = jwt.sign(
          { id: myUser.id, email: myUser.email },
          keys.secretOrKey,
          {}
        );

        const data = {
          id: myUser.id,
          name: myUser.name,
          lastname: myUser.lastname,
          email: myUser.email,
          phone: myUser.phone,
          image: myUser.image,
          session_token: `JWT ${token}`,
        };

        return res.status(201).json({
          success: true,
          message: "El usuario fue autenticado",
          data: data, // EL ID DEL NUEVO USUARIO QUE SE REGISTRO
        });
      } else {
        return res.status(401).json({
          // EL CLIENTE NO TIENE AUTORIZACION PARTA REALIZAR ESTA PETICION (401)
          success: false,
          message: "El password es incorrecto",
        });
      }
    });
  },
  async registerWithImage(req, res) {
    const user = JSON.parse(req.body.user); // CAPTURO LOS DATOS QUE ME ENVIE EL CLIENTE

    const files = req.files;

    if (files.length > 0) {
      const path = `image_${Date.now()}`;
      const url = await storage(files[0], path);
      console.log("path =", path);
      console.log("files[0] =", files[0]);

      if (url != undefined && url != null) {
        user.image = url;
      }
    }

    User.create(user, (err, data) => {
      if (err) {
        return res.status(501).json({
          success: false,
          message: "There was an error with the user registration",
          error: err,
        });
      }
      console.log("data user.Create =", `${data}`);
      user.id = `${data}`;
      const token = jwt.sign(
        { id: user.id, email: user.email },
        keys.secretOrKey
      );
      user.session_token = token;
      //ini jika user ter-create /register defaultnya user dicreate sbgai no.3 yatu client!
      //ini bad database user diolah diblakang manual masuk ke table2
      return res.status(201).json({
        success: true,
        message: "registration with role success",
        data: user,
      });

      // Role.create(user.id, 3, (err, data) => {
      //   if (err) {
      //     return res.status(500).json({
      //       success: false,
      //       error: err,
      //     });
      //   }
      //   return res.status(201).json({
      //     success: true,
      //     message: "registration with role success",
      //     data: user,
      //   });
      // });
    });
  },

  register(req, res) {
    const user = req.body; // CAPTURO LOS DATOS QUE ME ENVIE EL CLIENTE
    User.create(user, (err, data) => {
      if (err) {
        return res.status(501).json({
          success: false,
          message: "Hubo un error con el registro del usuario",
          error: err,
        });
      }

      return res.status(201).json({
        success: true,
        message: "El registro se realizo correctamente",
        data: data, // EL ID DEL NUEVO USUARIO QUE SE REGISTRO
      });
    });
  },
};
