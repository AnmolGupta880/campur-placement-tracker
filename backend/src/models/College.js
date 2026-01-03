import mongoose from "mongoose";

const collegeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    location: String,
  },
  { timestamps: true }
);

export default mongoose.model("College", collegeSchema);
