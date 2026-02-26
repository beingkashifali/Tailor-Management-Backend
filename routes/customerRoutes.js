const express = require("express");
const {
  getCustomers,
  createCustomer,
  updateStatus,
  updateCustomerDetails,
  syncLifetimeSewed,
} = require("../controllers/Customer");
const protect = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/new-customer", protect, createCustomer);
router.get("/customer-data", protect, getCustomers);
router.patch("/update-customer-status/:id", protect, updateStatus);
router.put("/update-customer/:id", protect, updateCustomerDetails);
module.exports = router;
