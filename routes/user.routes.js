const express=require('express')
const {registeruser,userlogin,allusers} =require('../controllers/user.controllers')

const userRouter=express.Router()

userRouter.route('/register').post(registeruser)
userRouter.route('/login').post(userlogin)
userRouter.route('/allusers').get(allusers)

module.exports={userRouter}