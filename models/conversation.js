const mongoose=require('mongoose')

const memberarray = [String,String]

const conversationSchema=mongoose.Schema({
    members :{type : memberarray, required:true}
},{
    versionKey : false
})

const Conversationmodel = mongoose.model('conversations',conversationSchema)

module.exports=Conversationmodel