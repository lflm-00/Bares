require('dotenv').config()
require('./mongo.js')

const  json  = require('express')
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

app.get('/notes/:id' , (req , res ) => {
    const id = Number(req.params.id)
    const note = notes.find(note => note.id === id)
    if(note){
        res.json(note)    
    }else{
        res.send(`<h1>not found id ${id}</h1>`).end()
    }
})
app.delete('/notes/:id' , (req , res ) => {
    const id = Number(req.params.id)
    notes = notes.filter(note => notes.id != id)
    res.send(notes)
    res.status(204).end()
})

app.post('/notes', (req , res) =>{
    const  age  = req.body.creator.age
    const  name = req.body.creator.name
    const note = req.body
    console.log(note)
    const ids = notes.map(note => note.id) // Max ids for notes
    const maxId = Math.max(...ids)
    const newNote = {
        id : maxId + 1,
        content : note.content , 
        important : typeof note.important != 'undefined' ? note.important :  false ,
        fecha : new Date().toISOString() ,
        creator : {
            name  : name ,
            LastName : note.creator.LastName ,
            age : age > 0 ?   age  : 'invalid age' 
        }
    }
    notes = [...notes , newNote]
    res.json(newNote)

})
const PORT = process.env.PORT

app.listen(PORT , () =>{
    console.log(`Server running on port ${PORT}`);
})