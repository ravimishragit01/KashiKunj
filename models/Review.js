const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    guestName: { type: String, required: true },
    location: { type: String, default: "Guest" }, // e.g., "Delhi", "Mumbai"
    initial: { type: String }, // e.g., "R", "P"
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, required: true },
    isApproved: { type: Boolean, default: false }, // Set to false so you can approve them first
  },
  { timestamps: true },
);

// Auto-generate the avatar initial from the guest's name before saving
reviewSchema.pre("save", function (next) {
  if (!this.initial && this.guestName) {
    this.initial = this.guestName.charAt(0).toUpperCase();
  }
  next();
});

module.exports = mongoose.model("Review", reviewSchema);
