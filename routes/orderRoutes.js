const passport = require("../config/passport");
const orderController = require("../controllers/orderController");
const pasport = require("passport");

module.exports = (app) => {
  //pilihat order status =" PAID SHIPPED ON_WAY DELIVERED ""

  //get id_client & status
  app.get(
    "/api/orders/findByClientStatus/:id_client/:status",
    pasport.authenticate("jwt", { session: false }),
    orderController.getClientAndStatus
  );
  //get id_delivery *& status
  app.get(
    "/api/orders/findByDeliveryStatus/:id_delivery/:status",
    pasport.authenticate("jwt", { session: false }),
    orderController.getDeliveryAndStatus
  );

  //get status
  app.get(
    "/api/orders/findByStatus/:status",
    pasport.authenticate("jwt", { session: false }),
    orderController.getStatus
  );
  //app.post
  app.post(
    "/api/orders/create",
    pasport.authenticate("jwt", { session: false }),
    orderController.create
  );
};
