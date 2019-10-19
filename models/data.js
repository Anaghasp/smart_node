const mongoose = require("mongoose");

const dataSchema = mongoose.Schema({
  name: String,
  type: {
    type: String,
    enum: ["Daily", "Weekly", "Monthly"],
    default: "Daily"
  },
  group: Number,
  records: JSON
});

module.exports = mongoose.model("Data", dataSchema);
