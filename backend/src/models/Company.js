import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: String,
    role: String,
    ctc: String,
    eligibility: String,
    driveDate: Date,
    description: String,
    location: String,
    website: String,
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Company", companySchema);
