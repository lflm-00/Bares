const bcrypt = require("bcrypt");
const userExtractor = require("../middlewar/userExtractor");
const usersRouter = require("express").Router();
const User = require("../models/User");
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");
const jwt = require('jsonwebtoken');

/** */

/*
 * Metodo para obtener todos los usuarios de la bd
 */
usersRouter.get("/", async (req, res) => {
  const users = await User.find({})
  res.json(users);
});

usersRouter.get("/:token", async (req, res) => {
  const { token } = req.params;
  try {
    let decodedToken = {}
    decodedToken = jwt.verify(token, process.env.SECRET)

    const user = await User.findById(decodedToken.id)
    res.json(user)

    
  } catch (err) {
    console.log(err.message);
  }
})

/*
 * Metodo para obtener todos los admins de la bd
 */
usersRouter.get("/allAdmins", userExtractor, async (req, res) => {
  const users = await User.find({ USER_ROLE: "admin" }).populate("notes", {
    content: 1,
    date: 1,
  });
  res.json(users);
});

/*
 * Metodo para filtrar la busqueda de usuarios por username
 */
usersRouter.get("/username/:username", (req, res, next) => {
  const { username } = req.params;
  User.find({ username: username })
    .populate("notes", {
      content: 1,
      date: 1,
    })
    .then((user) => {
      user ? res.json(user) : res.send("User not find");
    })
    .catch((err) => {
      next(err);
    });
});

usersRouter.get("/id/:id", async  (req, res , next) => {
  const { id } = req.params
  try {
    const user =  await User.findById(id);
    res.json(user);
  } catch (error) {
    next(error)
    console.log(error.message);
  }

})

/*
 * Metodo para crear un usuario
 */
usersRouter.post("/", async (req, res) => {
  try {
    const { body } = req;
    const { username, name, password, email } = body;
    const saltRound = 4; // nivel de dificultad para la encriptaciòn
    const passwordHash = await bcrypt.hash(password, saltRound); // Aquì estamnos encriptando la contraseña
    const user = new User({
      username,
      name,
      passwordHash, // La contraseña que esta llegando por el body queda en codigo Hash
      USER_ROLE: "usuario", // Usuario final que tendrà el rol Usuario
      email,
      avatar: "https://res.cloudinary.com/luis-and-emma-1851654/image/upload/v1629990322/gojgnfychbpzrhe7at2v.png",
      cloudinary_id: "gojgnfychbpzrhe7at2v",
      fechaCreacion: new Date()
    });
    const savedUser = await user.save();
    res.status(201).json(savedUser);

  } catch (error) {
    res.status(400).json(error.message);
  }
});

//userExtractor
usersRouter.put("/:Id", (req, res, next) => {
  const { Id } = req.params;
  console.log(Id);
  const { body } = req;

  const { name } = body;


  const newUser = {
    name: name,
  };
  console.log(newUser);
  User.findByIdAndUpdate(Id, newUser)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => next(error));
});

/*
 * metodo para subir una foto al cloudinary
 */

usersRouter.put(
  "/:id/upload",
  upload.single("image"),
  userExtractor,
  async (req, res, next) => {
    try {
      const { userId } = req;
      const user = await User.findById(userId);
      await cloudinary.uploader.destroy(user.cloudinary_id);
      const result = await cloudinary.uploader.upload(req.file.path);
      const newUser = {
        avatar: result.secure_url,
        cloudinary_id: result.public_id,
      };

      const savedUser = await User.findByIdAndUpdate(userId, newUser, {
        new: true,
      });
      res.status(201).json(savedUser);
    } catch (error) {
      console.log(error);
    }
  }
);


usersRouter.delete("/:id", (req, res) => {
  const { id } = req.params
  console.log(id);
  res.send("User find")

})
module.exports = usersRouter;


