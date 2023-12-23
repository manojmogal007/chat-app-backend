const Messagesmodel=require('../models/messages')
const Usermodel=require('../models/users')
const Conversationmodel=require('../models/conversation')


exports.storemessage=async(req,res)=>{
    const {senderId,conversationId,message,receiverId=''}=req.body
    // console.log(req.body)
    try{
        if(!senderId || !message){
            return res.status(200).json({'msg':'senderId and message is required'})
        }
        if(conversationId === 'new' && receiverId ){
            console.log('creating new conversation')
            const new_conversation=new Conversationmodel({members : [senderId,receiverId]})
            await new_conversation.save()
            const new_message=new Messagesmodel({conversationId:new_conversation._id,senderId,message})
            await new_message.save()
            // console.log('new concersation', new_conversation._id)
            return res.status(200).json({'msg':'message stored successfully'})
        }else if(!conversationId && !receiverId){
            return res.status(400).json({'msg':'All details required'})
        }
        const new_message=new Messagesmodel({senderId,conversationId,message})
        await new_message.save()
        res.status(200).json({'msg':'message stored successfully'})
    }catch(err){
        console.log(err)
        res.status(400).json({'msg':'Error'})
    }
}

exports.getmessages=async(req,res)=>{
    
    try{
        const {conversationId}=req.params
        const checkMessages=async(conversationId)=>{
        const messages=await Messagesmodel.find({conversationId})
            // console.log(messages)
            const messageuserdata= Promise.all(messages.map(async({senderId,message,_id})=>{
                const user=await Usermodel.findById(senderId);
                // console.log('user-->',user)
                return {user:{_id:user._id,name:user.name,email:user.email},message:message,_id}
            }))
            const usermessages=await messageuserdata
            res.status(200).json({'msg':'messages found',usermessages})
        }
        if(conversationId === 'new'){
            const checkconversation=await Conversationmodel.find({members : { $all :[req.query.senderId,req.query.receiverId]}})
            // console.log(req.query.senderId,req.query.receiverId)
            if(checkconversation.length>0){
                // console.log('checking')
                checkMessages(checkconversation[0]._id)
            }else{
                // console.log('empty')
                return res.status(200).json({'msg':'messages not found',usermessages:[]})
            }
        }else{
            checkMessages(conversationId)
        }
    }catch(err){
        console.log(err)
        res.status(400).json({'msg':'Error'})
    }
}




