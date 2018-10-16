const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const clubNames = new Schema({
  name: { type: String, default: "" },
  country: { type: String, default: "" },
  image: { type: String, default: "default.png" },
  fans: [
    {
      // username: { type: String, default: "" },
      // email: { type: String, default: "" }
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ]
});

module.exports = mongoose.model("Club", clubNames);
