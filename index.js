require('dotenv').config()
require('./mongo.js')

const  json  = require('express')
const { request } = require('express')
const express = require('express')
const app = express()
const Note = require('./models/Note')

app.use(express.json())


let notes = []

app.get('/', (req , res) =>{
    res.send('Hello word')
})

app.get('/notes' , (req , res ) => {
    Note.find({})
      .then(notes =>{
          res.json(notes);
      })
})

app.get('/notes/:id' , (req , res , next) => {
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

app.put('/notes/:id' , (req , res , next) => {
    const { id } = req.params
    const note = req.body

    const newNoteInfo = {
        content : note.content , 
        important :  note.important  || false ,
        creator : {
            name  : note.creator.name ,
            LastName : note.creator.LastName ,
            age : note.creator.age > 0 ?   note.creator.age  : 'invalid age' 
        } 
    }
    Note.findByIdAndUpdate(id , newNoteInfo)
      .then(result =>{
          res.json(result)
      })
})

app.delete('/notes/:id' , (req , res , next) => {
    const { id } = req.params

    Note.findByIdAndRemove(id).then(result =>{
        res.status(404).end()
    }).catch(error => next(error))
})

app.post('/notes', (req , res) =>{
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
            LastName : note.creator.LastName ,
            age : note.creator.age > 0 ?   note.creator.age  : 'invalid age' 
        }
    })
    newNote.save().then(savedNote =>{
        res.json(savedNote)
    })
   

})
const PORT = process.env.PORT

app.use((error , req , res , next) =>{
    console.error(error)

    if(error.name === 'CastError') {
        res.status(400).send({ error : 'id used is malformed'  })
    } else {
        res.status(500).end()
    }
})
app.listen(PORT , () =>{
    console.log(`Server running on port ${PORT}`);
})