const express = require("express");
const router = express.Router();
const {
  AuthenticateUser,
  authorizePermission,
  authenticateUser,
} = require("../middleware/authentication");

const {
  createOrder,
  gerCurrentUserOrder,
  getAllOrders,
  getSingleOrder,
  updateOrder,
} = require("../controllers/orderController");

router
  .route("/")
  .post(authenticateUser, createOrder)
  .get(authenticateUser, authorizePermission("admin"), getAllOrders);

router.route("/showAllMyOrders").get(authenticateUser, gerCurrentUserOrder);

router
  .route("/:id")
  .get(authenticateUser, getSingleOrder)
  .patch(authenticateUser, updateOrder);
module.exports = router;
