import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["Bug Report", "Feature Request", "General Feedback"],
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    message: {
      type: String,
      required: true,
      maxlength: 250,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    screenshot: {
      mediaUrl: {
        type: String,
      },
      publicId: {
        type: String,
      },
      mediaType: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Feedback", feedbackSchema);
