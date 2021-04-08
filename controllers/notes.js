const notesRouter = require('express').Router();
const Note = require('../models/Note');

notesRouter.get('/' , (req , res ) => {
    Note.find({})
      .then(notes =>{
          res.json(notes);
      })
})

notesRouter.get('/:id' , (req , res , next) => {
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

notesRouter.post('/api/notes', (req , res , next ) =>{
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

notesRouter.put('/api/notes/:id' , (req , res , next) => {
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

notesRouter.delete('/api/notes/:id' , (req , res , next) => {
    const { id } = req.params

    Note.findByIdAndDelete(id)
      .then(() =>  res.status(204).end())
      .catch(error => next(error))
})

module.exports = notesRouter
