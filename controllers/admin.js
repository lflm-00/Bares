const bcrypt = require("bcrypt");
const userExtractor = require("../middlewar/userExtractor");
const adminRouter = require("express").Router();
const Admin = require("../models/Admin");

/*
 * Metodo para obtener todos los admins de la bd
 */
adminRouter.get("/getAll",userExtractor ,async (req, res) => {
  const { userId } = req;
  console.log(userId)
  const admins = await Admin.find({});

  admins === null ? "not found" : res.json(admins);

  
});

adminRouter.post("/", userExtractor, async (req, res) => {
  const { userId } = req;
  const admin = await Admin.findById(userId);
  if (admin.USER_ROLE === "main_admin") {
    try {
      const { body } = req;
      const { username, name, password, email } = body; // Los parametros que recuperamos del body 
      const saltRound = 4; // nivel de dificultad para la encriptaciòn
      const passwordHash = await bcrypt.hash(password, saltRound); // Aquì estamnos encriptando la contraseña
      const admin = new Admin({
        username,
        name,
        passwordHash,
        USER_ROLE: "admin",
        email,
      });
      const savedAdmin = await admin.save();
      res.status(201).json(savedAdmin);
    } catch (error) {
      res.status(400).json(error);
    }
  } else {
      res.json(error)
  }
});

module.exports = adminRouter;
