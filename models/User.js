const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const findOrCreate = require("mongoose-find-or-create");

const userSchema = mongoose.Schema({
  username: { type: String, unique: true },
  fullname: { type: String, unique: true, default: "" },
  email: { type: String },
  password: { type: String, default: "" },
  userImage: { type: String, default: "default.png" },
  facebook: { type: String, default: "" },
  facebookTokens: Array,
  google: { type: String, default: "" }
});

// Add findOrCreate plugin to Mongoose
userSchema.plugin(findOrCreate);

userSchema.methods.encryptPasword = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};
userSchema.methods.validUserPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
