const uniqueValidator = require("mongoose-unique-validator");
const { Schema, model } = require("mongoose");

const barSchema = new Schema({
    nombreBar: {
        type: String,
        unique: true,
      },
      celular: {
        type: String,
        unique: true,
      },
    direccion : {
        lat : String ,
        long : String
    },
    estado : Boolean ,
    descripcion : String ,
    like : String ,
    email: {
        type: String,
        unique: true,
      },
    USER_ROLE: String,
    avatar: {
        type: String,
      },
      cloudinary_id: {
        type: String,
      },
    fechaCreacion : String ,
    facebook : String ,
    instagram : String
})

barSchema.set("toJSON" ,{
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject._id;
        delete returnedObject.__v;
    
        delete returnedObject.passwordHash;
      },
});

barSchema.plugin(uniqueValidator);

const Bar = model("Bar", barSchema);
module.exports = Bar;