import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "uploads/feedback",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const uploadFeedback = multer({ storage });

export default uploadFeedback;
