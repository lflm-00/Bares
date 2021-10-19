require("dotenv").config();
require("./mongo.js");

const express = require("express");
const handleErrors = require("./middlewar/handleErrors.js");
const notFound = require("./middlewar/notFound");
const app = express();
const usersRouter = require("./controllers/users");
const notesRouter = require("./controllers/notes");
const loginRouter = require("./controllers/login");
const adminRouter = require("./controllers/admin");
const barRouter = require("./controllers/bar");
const cors = require("cors");

app.use(express.json());
app.use(cors());

//changes in index
//changes in de index

app.get("/", (req, res) => {
  res.send("");
});
// Routers
app.use("/api/admin", adminRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use("/api/notes", notesRouter);
app.use("/api/bares" , barRouter );

//Midelwars
app.use(notFound);
app.use(handleErrors);

//Port or Running server
const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
module.exports = { app, server };
