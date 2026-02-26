const transporter = require("../config/nodemailer");
const customerModel = require("../models/customer");

// Create customers
const createCustomer = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      measurements,
      deliveryDate,
      status,
      quantity,
      totalAmount,
      amountPaid,
    } = req.body;

    const customer = await customerModel.create({
      shopId: req.user.shopId,
      name,
      email,
      phone,
      measurements,
      deliveryDate,
      status,
      quantity,
      totalAmount,
      amountPaid,
    });

    res.status(201).json({
      success: true,
      msg: "Customer created successfully",
      customer: customer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

// Get customers
const getCustomers = async (req, res) => {
  try {
    const customers = await customerModel.find({ shopId: req.user.shopId });
    res.json({ success: true, customers });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const customer = await customerModel.findOneAndUpdate(
      { _id: id, shopId: req.user.shopId },
      { status },
      { new: true },
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        msg: "Customer not found",
      });
    }

    if (status === "sewed" && customer.email) {
      const mailOptions = {
        from: process.env.SMTP_USER,
        to: customer.email,
        subject: "Your Clothes Are Ready for Collection",
        text: `
Dear Customer,

We are happy to inform you that your clothes have been successfully stitched and are now ready for collection.

🧵 Order Status: Completed
📅 Ready for Pickup: Today
🏪 Please visit our shop at your convenience to collect your order.

If you have any questions or need home delivery, feel free to contact us.

Thank you for trusting us with your tailoring needs.
We look forward to serving you again!

Warm regards,
Tariq Tailors Noorpur Pul
Contact Number: 0302-6802598
        `,
      };

      await transporter.sendMail(mailOptions);
    }

    return res.json({
      success: true,
      msg: "Status updated successfully",
      customer,
    });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

const updateCustomerDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Find the customer by ID and shopId, then update them
    const customer = await customerModel.findOneAndUpdate(
      { _id: id, shopId: req.user.shopId },
      { $set: updateData },
      { new: true },
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        msg: "Customer not found",
      });
    }

    return res.json({
      success: true,
      msg: "Customer details updated successfully",
      customer,
    });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

module.exports = {
  createCustomer,
  getCustomers,
  updateStatus,
  updateCustomerDetails,
};
