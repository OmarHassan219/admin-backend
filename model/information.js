const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const authSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    serviceAccount: {
      type: Object,
      required: true,
      unique: true,
    },
    firebaseConfig: {
      type: Object,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    databaseURL: {
      type: String,
      required: true,
      unique: true,
    },
    refreshToken: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Auth", authSchema);
