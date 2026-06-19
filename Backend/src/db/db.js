const mongoose = require('mongoose')

async function connectDB(){

    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log('DB connected successfully')
    }catch(error){
        console.log('db cannot be connected:', error)
    }
}

module.exports = connectDB