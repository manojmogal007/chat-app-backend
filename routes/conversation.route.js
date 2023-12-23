const express=require('express')
const {conversation,getconversation}=require('../controllers/conversation.controller')

const conversationRouter=express.Router()

conversationRouter.route('/create_conversations').post(conversation)
conversationRouter.route('/get_conversations/:userId').get(getconversation)



module.exports={conversationRouter}