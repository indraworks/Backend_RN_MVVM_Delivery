const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const logger = require("morgan");
const cors = require("cors");
const passport = require("passport");
const multer = require("multer");

/*
 * IMPORTAR RUTAS
 */
//declare route in the app server!
const usersRoutes = require("./routes/userRoutes");
const categoriesRoutes = require("./routes/categoryRoutes");
const productsRoutes = require("./routes/productRoutes");
const addressRoutes = require("./routes/addressRoutes");
const orderRoutes = require("./routes/orderRoutes");

const port = process.env.PORT || 3000;

app.use(logger("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cors());
app.use(passport.initialize());
app.use(passport.session());

require("./config/passport")(passport);

app.disable("x-powered-by");

app.set("port", port);

const upload = multer({
  storage: multer.memoryStorage(),
});

/*
 * LLAMADO DE LAS RUTAS
 */
//ini import dari userRoute.js si app dan upload adalah argument
//dan type argument ini dideclare di parent di server.js bukan di routenya

usersRoutes(app, upload);
categoriesRoutes(app, upload);
productsRoutes(app, upload);
addressRoutes(app);
orderRoutes(app);

server.listen(5000, "192.168.1.9" || "localhost", function () {
  console.log("Aplicacion de NodeJS " + port + " Iniciada...");
});

// ERROR HANDLER
app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).send(err.stack);
});

app.get("/", (req, res) => {
  res.send("Ruta raiz del backend");
});

module.exports = {
  app: app,
  server: server,
};

// 200 - ES UN RESPUESTA EXITOSA
// 404 - SIGNIFICA QUE LA URL NO EXISTE
// 500 - ERROR INTERNO DEL SERVIDOR
