const mongoose = require('mongoose')
const supertest = require('supertest')

const { app , server } = require('../index')
const Note = require('../models/Note')

const api = supertest(app)
const initialNotes = [
    {
        content : 'learning full stack with midudev',
        date : new Date(),
        important : true ,
        creator : {
            name : 'Laura jimena',
            lastName : 'Beltran jimenez',
            age : 17
        }
    } ,
    {
        content : 'wathcing my first video for midudev',
        date : new Date(),
        important : true ,
        creator : {
            name : 'Luis Fernando',
            lastName : 'Lopez Medina',
            age : 20
        }
    } 
]

beforeEach( async () =>{
    await Note.deleteMany({})

    const nota1 = new Note(initialNotes[0])
    await nota1.save()

    const nota2 = new Note(initialNotes[1])
    await nota2.save()
})

test.skip('notes are returned as json' , async () =>{
   await api
      .get('/notes')
      .expect(200)
      .expect('Content-Type' , /application\/json/)
})

test.skip('there are two notes and no`t more' , async () =>{
    const response = await api.get('/notes')
    expect(response.body).toHaveLength(initialNotes.length)
})



afterAll(() =>{
    mongoose.connection.close();
    server.close();
})
