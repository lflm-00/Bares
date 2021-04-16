const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/User')

usersRouter.get('/' , async ( req , res) =>{
    const users = await User.find({}).populate('notes',{
        content : 1 ,
        date : 1
    });
    res.json(users)
})

usersRouter.post('/' , async ( req , res )=> { 

    try {
    const { body } = req
    const { username , name , password } = body
    const saltRound = 4
    const passwordHash = await bcrypt.hash(password , saltRound)
    const user = new User({
        username , 
        name ,
        passwordHash
    })
    const savedUser = await user.save()
    res.status(201).json(savedUser)
    } catch (error) {
        
        res.status(400).json(error)
    }
    
})


module.exports = usersRouter