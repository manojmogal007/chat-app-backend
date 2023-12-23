const express=require('express')
const cors=require('cors')
const mongoose=require('mongoose')
const {userRouter}=require('./routes/user.routes')
const {messageRouter}= require('./routes/message.route')
const {conversationRouter}=require('./routes/conversation.route')
const Usermodel=require('./models/users')
const io=require('socket.io')(8989,{
  cors:{
    origin:'*'
  }
})

const Port=4050


const app=express();


app.use(cors())
app.use(express.json())
// app.use(express.urlencoded({extended : false}))

// Socket.io
let users=[]
io.on('connection',socket=>{
  console.log('user connected',socket.id)
  socket.on('addUser', userId =>{
    const isUserExist=users.find(user=>user.userId===userId)
    if(!isUserExist){
      const new_user={userId,socketId:socket.id}
      users.push(new_user)
      io.emit('getUsers',users)
    }
  });

  socket.on('sendMessage',async ({conversationId,message,senderId,receiverId})=>{
    const receiver = users.find(user => user.userId === receiverId);
    const sender = users.find(user => user.userId === senderId);
    const user=await Usermodel.findById(senderId)
    if(receiver){
      io.to(receiver?.socketId).to(sender?.socketId).emit('getMessage',{
        senderId,receiverId,conversationId,message,user:{_id:user._id,name:user.name,email:user.email}
      })
    }else{
      io.to(sender.socketId).emit('getMessage',{
        senderId,message,conversationId,receiverId,user:{_id:user._id,name:user.name,email:user.email}
      })
    }
  })

  // socket.on('startTyping', () => {
  //   io.emit('typing', { userId: socket.id, isTyping: true });
  // });

  // socket.on('stopTyping', () => {
  //   io.emit('typing', { userId: socket.id, isTyping: false });
  // });
  // socket.on('disconnect', () => {
  //   io.emit('typing', { userId: socket.id, isTyping: false });
  //   console.log('User disconnected:', socket.id);
  // });

  socket.on('disconnect',()=>{
    users=users.filter(user=>user.socketId !== socket.id)
    io.emit('getUsers',users)
  })
})


app.use('/api/user',userRouter)
app.use('/api/conversations',conversationRouter)
app.use('/api/messages',messageRouter)



app.listen(Port,()=>{
  mongoose.connect('mongodb+srv://manojpatil:manojpatil@cluster0.ufvtcw8.mongodb.net/?retryWrites=true&w=majority')
  .then(()=>console.log('connected to db'))
  .catch(()=>console.log('connection error'))
  console.log(`Server is running on port ${Port}`)
})