const {storemessage,getmessages}=require('../controllers/message.controllers')
const express=require('express')

const messageRouter=express.Router()

messageRouter.route('/store_msg').post(storemessage)
messageRouter.route('/:conversationId').get(getmessages)

module.exports={messageRouter}