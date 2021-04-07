require('dotenv').config()
require('./mongo.js')

const  json  = require('express')
const { request } = require('express')
const express = require('express')
const handleErrors = require('./middlewar/handleErrors.js')
const notFound = require('./middlewar/notFound')
const app = express()
const Note = require('./models/Note')
const usersRouter = require('./controllers/users')

app.use(express.json())




app.get('/', (req , res) =>{
    res.send('Hello word')
})

app.get('/api/notes' , (req , res ) => {
    Note.find({})
      .then(notes =>{
          res.json(notes);
      })
})

app.get('/api/notes/:id' , (req , res , next) => {
    const { id } = req.params
    Note.findById(id).then(note =>{
        if(note){
            res.json(note)    
        }else{
            res.send(`<h1>not found id ${id}</h1>`).end()
        }
    }).catch(err =>{
        next(err)
    })
    
})

app.put('/api/notes/:id' , (req , res , next) => {
    const { id } = req.params
    const note = req.body

    const newNoteInfo = {
        content : note.content , 
        important :  note.important  || false ,
        creator : {
            name  : note.creator.name ,
            lastName : note.creator.lastName ,
            age : note.creator.age > 0 ?   note.creator.age  : 'invalid age' 
        } 
    }
    Note.findByIdAndUpdate(id , newNoteInfo , { new : true })
      .then(result =>{
          res.json(result)
      })
})

app.delete('/api/notes/:id' , (req , res , next) => {
    const { id } = req.params

    Note.findByIdAndDelete(id)
      .then(() =>  res.status(204).end())
      .catch(error => next(error))
})

app.post('/api/notes', (req , res , next ) =>{
    const note = req.body
    if(!note.content) {
        return res.status(404).json({
            error : 'require "content" field is missing'
        })
    }
    const newNote = new Note({
        content : note.content , 
        important :  note.important  || false ,
        fecha : new Date(),
        creator : {
            name  : note.creator.name ,
            lastName : note.creator.lastName ,
            age : note.creator.age > 0 ?   note.creator.age  : 'invalid age' 
        }
    })
    newNote.save().then(savedNote =>{
        res.json(savedNote)
    }).catch(err => next(err))
   

})

app.use('/api/users' , usersRouter)

//Midelwars
app.use(notFound)
app.use(handleErrors)

//Port or Running server
const PORT = process.env.PORT || 3001
const server = app.listen(PORT , () =>{
    console.log(`Server running on port ${PORT}`);
})

module.exports = { app , server }