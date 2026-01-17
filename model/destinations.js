import mongoose from "mongoose";

const destinationSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    address: String,

    name: {
      type: String,
      required: true,
      unique: true,
    },

    location: String,

    mapUrl: String,
    glance1: String,
    glance2: String,
    bttv: String,
    allowed: String,

    mediaUrl: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    mediaType: {
      type: String,
      required: true,
    },
    folder: String,
  },
  { timestamps: true }
);

export default mongoose.model("Destination", destinationSchema);
