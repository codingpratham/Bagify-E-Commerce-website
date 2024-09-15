const mongoose=require('mongoose')

mongoose.connect('mongodb+srv://bro123:pratham@pratham.j9fifsz.mongodb.net/')
.then(()=>{
    console.log('Connected to MongoDB')
})

const userSchema=new mongoose.Schema({
    fullname:String,
    email:String,
    password:String
})

const User=mongoose.model('User',userSchema)

module.exports={User}