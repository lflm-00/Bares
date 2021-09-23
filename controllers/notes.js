const userExtractor = require("../middlewar/userExtractor");
const notesRouter = require("express").Router();
const Note = require("../models/Note");
const User = require("../models/User");

/*
 * Controlador para buscar todas las notas sin tener usuario en sesion
 */
notesRouter.get("/", async (req, res) => {
  const notes = await Note.find({}).populate("user", {
    username: 1,
    name: 1,
  });
  res.json(notes);
});

/*
 * Controlador para filtrar las notas por usuario en sesiòn
 */
notesRouter.get("/myNotes", userExtractor, async (req, res, next) => {
  const { userId } = req;
  const array = [];
  try {
    const user = await User.findById(userId);
    for (notes of user.notes) {
      const noteId = await Note.findById(notes);
      array.push(noteId);
    }
    res.json(array);
  } catch (error) {
    next(error);
  }
});

/*
 * Controlador para filtrar una nota por fecha inicio hasta fecha fin
userExtractor
 */
notesRouter.get("/date",  async (req, res, next) => {
  const {inicio , fin } = req.params;
  console.log(inicio , fin);
  const { start, end } = req.body;
  const { userId } = req;
  const array = [];
  try {
    const user = await User.findById(userId);
    for (notes of user.notes) {
      const noteId = await Note.find({
        $and: [
          { _id: notes },
          { date: { $gte: start } },
          { date: { $lte: end } },
        ],
      });
      array.push(noteId);
    }
    array.length == 0 ? res.Json("<h1> not found</h1>") : res.json(array);
    // res.json(array);
  } catch (error) {
    next(error);
  }
});

/*
 * Controlador para filtrar una nota por fecha id
 */
notesRouter.get("/:id", (req, res, next) => {
  const { id } = req.params;
  Note.findById(id)
    .then((note) => {
      if (note) {
        res.json(note);
      } else {
        res.json(`<h1>not found id ${id}</h1>`).end();
      }
    })
    .catch((err) => {
      next(err);
    });
});

notesRouter.post("/", userExtractor, async (req, res, next) => {
  const { content, important = false } = req.body;

  // sacar userid de request
  const { userId } = req;
  const user = await User.findById(userId);
  if (!content) {
    return res.status(404).json({
      error: 'require "content" field is missing',
    });
  }
  const newNote = new Note({
    content,
    important,
    date: new Date(),
    user: user._id,
  });

  try {
    const savedNote = await newNote.save();
    user.notes = user.notes.concat(savedNote._id);
    await user.save();

    res.json(savedNote);
  } catch (error) {
    next(error);
  }
});

notesRouter.put("/:id", userExtractor, (req, res, next) => {
  const { id } = req.params;
  const note = req.body;

  const newNoteInfo = {
    content: note.content,
    important: note.important || false,
  };
  Note.findByIdAndUpdate(id, newNoteInfo)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => next(error));
});

notesRouter.delete("/:id", userExtractor, async (req, res, next) => {
  const { id } = req.params;

  Note.findByIdAndDelete(id)
    .then(() => res.status(204).end())
    .catch((error) => next(error));
});

module.exports = notesRouter;
