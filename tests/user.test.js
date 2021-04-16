const {  server } = require('../index')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const mongoose = require('mongoose')
const {api, getUsers} = require('../tests/helpers')

describe.only('creating a new user' , () =>{
    beforeEach(async () =>{
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('passsword' , 1)
        const user = new User({ username : 'lflm00', name : 'luigui' , passwordHash })

        await user.save()
    })

    test('works as expected  creating a refresh user' ,async  () =>{
        
        const usersAtStart = await getUsers()
        const newUser = {
            name : 'luis' ,
            username : 'luisjddd' ,
            password : 'facebook'
        }

        await api
          .post('/api/users')
          .send(newUser)
          .expect(201)
          .expect('Content-Type' , /application\/json/)

        const usersAtEnd = await getUsers()

        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    test('creations fails with proper statuscode and message if username is al ready' , async ()=>{
        const usersAtStart = await getUsers();
        const newUser = {
            username : 'lflm00' ,
            name : 'luigui',
            password : 'luisdev'
        }
        const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type' , /application\/json/)

        expect(result.body.errors.username.message).toContain('`username` to be unique')
        const usersAtEnd = await getUsers();
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    afterAll(() =>{
        mongoose.connection.close();
        server.close();
    }) 
})

