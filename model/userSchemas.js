import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  username: String,
  email: String,
  password: String,
  sentAlert: Boolean,
  btcVirtual: Object,
  ethVirtual: Object,
  bchVirtual: Object,
  dogeVirtual: Object,
});

const User = new model("User", userSchema);
export { User };
