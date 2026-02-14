import mongoose from "mongoose";

const BusinessSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    instaLink: { type: String },
    googleReviewLink: { type: String },
    whatsappLink: { type: String },
    customLink: { type: String },
    logoBase64: { type: String },
    themeColor: { type: String, default: "#000000" },
    expiryDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Business = mongoose.models.Business || mongoose.model("Business", BusinessSchema);

export default Business;