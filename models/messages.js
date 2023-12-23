const mongoose=require('mongoose')


const messagesSchema=mongoose.Schema({
    conversationId :{type: String},
    senderId : {type: String},
    message: {type: String}
},{
    versionKey : false
})

const Messagesmodel = mongoose.model('messages',messagesSchema)

module.exports=Messagesmodel