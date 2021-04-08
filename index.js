require('dotenv').config()
require('./mongo.js')

const express = require('express')
const handleErrors = require('./middlewar/handleErrors.js')
const notFound = require('./middlewar/notFound')
const app = express()
const usersRouter = require('./controllers/users')
const notesRouter = require('./controllers/notes')

app.use(express.json())


//changes in de index

app.get('/', (req , res) =>{
    res.send('Hello word')
})

// Routers
app.use('/api/users' , usersRouter)
app.use('/api/notes' , notesRouter)

//Midelwars
app.use(notFound)
app.use(handleErrors)

//Port or Running server
const PORT = process.env.PORT || 3001
const server = app.listen(PORT , () =>{
    console.log(`Server running on port ${PORT}`);
})

module.exports = { app , server }