const mongoose = require('mongoose')

const { MONGO_DB_URI , MONGO_DB_URI_TEST , NODE_ENV } = process.env
const connectionString = NODE_ENV === 'test'
    ? MONGO_DB_URI_TEST 
    : MONGO_DB_URI

// connection a mongodb
mongoose.connect(connectionString , {
    useNewUrlParser : true ,
    useUnifiedTopology : true ,
    useFindAndModify : false ,
    useCreateIndex : true
})
    .then(() => {
        console.log('database is connected');
    }).catch(err =>{
        console.log(err);
    })

process.on('uncaughtException', error =>{
    console.error(error);
    mongoose.disconnect(); 

})

