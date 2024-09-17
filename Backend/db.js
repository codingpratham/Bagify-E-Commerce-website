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

const AdminSchema=mongoose.Schema({
    email:String,
    password:String
})

const Admin=mongoose.model('Admin',AdminSchema)

const ProductSchema=mongoose.Schema({
    productName:String,
    productPrice:String,
    discountPrice:String,
    imageUrl:String
})

const Product=mongoose.model('Product',ProductSchema)




module.exports={User,Admin,Product}