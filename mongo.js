const mongoose = require('mongoose')

const connectionString = process.env.MONGO_DB_URI

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

