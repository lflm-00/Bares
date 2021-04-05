const { Schema , model } = require('mongoose')
const noteSchema = new Schema({
    content : String ,
    date : Date ,
    important : Boolean ,
    creator : {
      name  : String ,
      LastName : String ,
      age : Number
  }
})
noteSchema.set('toJSON',{
    transform : (document , returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete  returnedObject.__v
    }

})

const Note = model('Note' , noteSchema)

/*Note.find({})
  .then(result => {
      console.log(result);
      mongoose.connection.close()
  })
*/
/*
const note = new Note({
    content : 'MondoBD is amazzing !',
    date :new Date() ,
    important : true
})

note.save()
  .then(result =>{
    console.log(result)
    mongoose.connection.close()
  })
  .catch(err =>{
    console.error(err)
  }) 
*/

module.exports = Note