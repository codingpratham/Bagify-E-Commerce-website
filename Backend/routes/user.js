const express= require('express')
const zod=require('zod')
const jwt= require('jsonwebtoken')
const { User ,Admin} = require('../db')
const jwt_passcode=require('../passcode')
const router=express.Router()

const SignupBody=zod.object({
    fullname:zod.string(),
    email:zod.string().email(),
    password:zod.string().min(8)
})

router.post('/signup',async(req,res)=>{
    const {success}=SignupBody.safeParse(req.body)

    if(!success){
        return res.status(400).json({error:SignupBody.errors})
    }

    const existingUser=await User.findOne({
        email:req.body.email
    })

    if(existingUser){
        return res.status(411).json({error:'Email already exists'})
    }

    
    const user= await User.create({
        fullname:req.body.fullname,
        email:req.body.email,
        password:req.body.password
    })
    const admin= await Admin.create({
        userId:user._id,
        email:req.body.email
    })
    const userId=user._id

    const token=jwt.sign({userId},jwt_passcode)

    res.json({
        msg:"successfully signed"
        ,
        token:token
    })
})

const LoginBody=zod.object({
    email:zod.string().email(),
    password:zod.string().min(8)
})

router.post('/signin', async (req, res) => {
    // Validate the request body using Zod
    const { success, error } = LoginBody.safeParse(req.body);

    if (!success) {
        return res.status(400).json({ error });
    }

    // Find user by email and password
    const loggedUser = await User.findOne({
        email: req.body.email,
        password: req.body.password,
    });

    // If user is found, create a token and return it
    if (loggedUser) {
        const token = jwt.sign({ userId: loggedUser._id }, jwt_passcode);
        return res.json({
            msg: 'Successfully logged in',
            token: token,
        });
    }

    // If login credentials are incorrect, return 401
    return res.status(401).json({ error: 'Invalid email or password' });
});

module.exports=router