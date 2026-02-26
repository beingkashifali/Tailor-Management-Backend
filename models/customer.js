const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String, required: true },
    measurements: {
      teera: { type: String, required: true },
      arms: { type: String, required: true },
      length: { type: String, required: true },
      width: { type: String, required: true },
      collor: { type: String, required: true },
      shalwar: { type: String, required: true },
      moza: { type: String, required: true },
      customNotes: { type: String, required: true },
    },
    deliveryDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "sewed", "delivered"],
      default: "pending",
    },
    quantity: { type: Number, default: 1 },
    totalAmount: { type: Number, required: true },
    amountPaid: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const customerModel = mongoose.model("customer", customerSchema);

module.exports = customerModel;
