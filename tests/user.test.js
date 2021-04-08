const { app , server } = require('../index')
const bcrypt = require('bcrypt')
const User = require('../models/User')
//const supertest = require('supertest')
const mongoose = require('mongoose')
//const { json } = require('express')

const api = require('../tests/helpers')

describe.only('creating a new user' , () =>{
    beforeEach(async () =>{
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('passsword' , 1)
        const user = new User({ username : 'jimebeltran', name : 'jimena' , passwordHash })

        await user.save()
    })


    test('works as expected  creating a refresh user' ,async  () =>{
        const usersDB = await User.find({})
        const usersAtStart = usersDB.map(user => user.toJSON())

        const newUser = {
            name : 'luis' ,
            username : 'luisjddd' ,
            password : 'facebook'
        }

        await api
          .post('/api/users')
          .send(newUser)
          .expect(200)
          .expect('Content-Type' , /application\/json/)

        const usersDBAfter = await User.find({})

        const usersAtEnd = usersDBAfter.map(user => user.toJSON())

        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })
})

afterAll(() =>{
    mongoose.connection.close();
    server.close();
})