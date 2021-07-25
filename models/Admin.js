const uniqueValidator = require("mongoose-unique-validator");
const { Schema, model } = require("mongoose");

const adminSchema = new Schema({
  username: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  name: String,
  passwordHash: String,
  USER_ROLE: String,
});

adminSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;

    delete returnedObject.passwordHash;
  },
});
adminSchema.plugin(uniqueValidator);

const Admin = model("Admin" , adminSchema);

module.exports = Admin;