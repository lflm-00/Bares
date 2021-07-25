const bcrypt = require("bcrypt");
const userExtractor = require("../middlewar/userExtractor");
const usersRouter = require("express").Router();
const User = require("../models/User");

/*
 * Metodo para obtener todos los usuarios de la bd
 */
usersRouter.get("/", async (req, res) => {
  const users = await User.find({}).populate("notes", {
    content: 1,
    date: 1,
  });
  res.json(users);
});

/*
 * Metodo para filtrar la busqueda de usuarios por username
 */
usersRouter.get("/:username", userExtractor, (req, res, next) => {
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
    });
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json(error);
  }
});

usersRouter.put("/", userExtractor, (req, res) => {
  const { userId } = req;
  const { body } = req;
  const { name } = body;

  const newUser = {
    name: name,
  };
  User.findByIdAndUpdate(userId, newUser)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => next(error));
});

module.exports = usersRouter;
