const uniqueValidator = require("mongoose-unique-validator");
const { Schema, model } = require("mongoose");
const userSchema = new Schema({
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
  avatar: {
    type: String,
  },
  USER_ROLE: String,
  cloudinary_id: {
    type: String,
  },
  notes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Note",
    },
  ],
});

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;

    delete returnedObject.passwordHash;
  },
});

userSchema.plugin(uniqueValidator);

const User = model("User", userSchema);
module.exports = User;
