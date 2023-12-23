const Conversationmodel=require('../models/conversation')
const Usermodel=require('../models/users')



exports.conversation=async(req,res)=>{

    const {senderId,receiverId} =req.body
    try{
        const new_conversation=new Conversationmodel({members : [senderId,receiverId]})
        await new_conversation.save()
        res.status(200).json({'msg':'Conversation created'})
    }catch(err){
        console.log(err)
        res.status(400).json('Error')
    }
}

exports.getconversation=async(req,res)=>{
    const {userId} = req.params
    try{
       const conversations=await Conversationmodel.find({members : {$in : [userId]}}) 
       const conversationUserData = Promise.all(conversations.map(async (conversation) => {
        const receiverId = conversation.members.find((member) => member !== userId);
        const user = await Usermodel.findById(receiverId);
        return { user: { receiverId: user._id, email: user.email, name: user.name }, conversationId: conversation._id }
    }))
    res.status(200).json(await conversationUserData);
    }catch(err){
        console.log(err)
        res.status(400).json({'msg':'Error'})
    }
}

