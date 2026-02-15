import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  destination: { 
    type: String, 
    required: true 
  },
  startDate: { 
    type: Date, 
    required: true 
  },
  endDate: { 
    type: Date, 
    required: true 
  },
  guests: { 
    type: Number, 
    required: true, 
    min: 1 
  },
  fullName: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true 
  },
  phone: { 
    type: String, 
    required: true 
  },
  requests: { 
    type: String,
    default: ""
  },
  status: { 
    type: String, 
    enum: ["Pending", "Confirmed", "Cancelled"], 
    default: "Pending" 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

export default mongoose.model("Booking", bookingSchema);