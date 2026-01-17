
import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: String,
  description: String,
  address:String,
  mediaUrl: String,
  mediaType: String,
  publicId: String,
});

export default mongoose.model("Post", postSchema);