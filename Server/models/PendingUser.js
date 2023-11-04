import mongoose from "mongoose";
const PendingUserSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

export default mongoose.model("PendingUser", PendingUserSchema);
