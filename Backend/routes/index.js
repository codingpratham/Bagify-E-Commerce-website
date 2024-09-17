const express= require('express')
const userrouter=require('./user')
const adminRouter=require('./admin')
const router=express.Router()

router.use('/user',userrouter)
router.use('/admin',adminRouter)

module.exports =router