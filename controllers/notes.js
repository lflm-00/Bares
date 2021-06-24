const userExtractor = require('../middlewar/userExtractor')
const notesRouter = require('express').Router();
const Note = require('../models/Note');
const User = require('../models/User');

notesRouter.get('/' , async (req , res ) => {
    const notes = await Note.find({}).populate('user',{
        username : 1 ,
        name : 1
    })
    res.json(notes)

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

notesRouter.post('/', userExtractor ,async (req , res , next ) =>{
    const { content,
            important = false
        } = req.body

   // sacar userid de request
const { userId } = req

    const user = await User.findById(userId)
    console.log(user);
    if(!content) {
        return res.status(404).json({
            error : 'require "content" field is missing'
        })
    }
    const newNote = new Note({
        content , 
        important ,
        date : new Date(),
        user : user._id
    })

    try {
        const savedNote = await newNote.save()
        user.notes = user.notes.concat(savedNote._id)
        await user.save()

        res.json(savedNote)
    } catch (error) {
        next(error)
    }
    
   

})

notesRouter.put('/api/notes/:id' , userExtractor ,(req , res , next) => {
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

notesRouter.delete('/api/notes/:id' , userExtractor ,async (req , res , next) => {
    const { id } = req.params

    Note.findByIdAndDelete(id)
      .then(() =>  res.status(204).end())
      .catch(error => next(error))
})

module.exports = notesRouter
