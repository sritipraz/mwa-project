const mongoose = require("mongoose");
const AppointmentSchema = mongoose.Schema({
  user_id: { type: String, required: true },
  user_name: { type: String },
  user_email: { type: String },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true }
});
const VehicleSchema = mongoose.Schema({
  type: { type: String, required: true },
  maker: { type: String, required: true },
  make: { type: Number, required: true },
  model: { type: String, required: true },
  seaters: { type: Number, required: true },
  description: { type: String, required: true },
  features: [{ type: String }],
  appointments: [AppointmentSchema],
  images: [{ type: String }],
});
const CompanySchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: Array, required: true },
    address: {
      city: { type: String },
      state: { type: String },
      zip: { type: String },
    },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    website: { type: String },
    description: { type: String },
    vehicles: [VehicleSchema]
  },
  { timestamps: true }
);
module.exports = mongoose.model("Companies", CompanySchema);
