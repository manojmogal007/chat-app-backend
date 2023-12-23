const { reset } = require('nodemon');
const Usermodel=require('../models/users')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')


exports.registeruser=async(req,res)=>{
    const {name,email,password} = req.body

    try{
        bcrypt.hash(password, 8 ,async(err, hashedpassword) => {
            if(err){
                console.log(err)
                res.status(400).json({'msg':'Error'})
            }else{
                const new_user=new Usermodel({name,email,password:hashedpassword})
                await new_user.save()
                res.status(200).json({'msg':'user registered'})
            }
        });
    }catch(err){
        console.log(err)
        res.status(400).json({'meg':'Error'})
    }
}

exports.userlogin=async(req,res)=>{
    const {email,password}=req.body
    try{
        const check_user=await Usermodel.findOne({email})
        if(!check_user){
            res.status(200).json({'msg':'User not exist'})
        }else if(check_user){
            bcrypt.compare(password, check_user.password , function(err, result) {
                if(result){
                    const payload={
                        userid : check_user._id,
                        email : check_user.email
                    }
                    jwt.sign(payload, 'basic-chat-app', {expiresIn : 86400},async(err,token)=>{
                        await Usermodel.updateOne({_id : check_user._id},{
                            $set : {token}
                        })
                        check_user.save()
                        res.status(200).json({'msg':'Logged in',user:{_id:check_user._id,email:check_user.email,name:check_user.name},token})
                    });
                    // res.status(200).json({'msg':'Logged in',token,user:{_id:check_user._id,email:check_user.email,name:check_user.name}})
                }else{
                    console.log(err)
                    res.status(200).json({'msg':'Login failed'})
                }
            });
        }
    }catch(err){
        console.log(err)
        res.status(400).json({'meg':'unknown error occured'})  
    }
}

exports.allusers=async(req,res)=>{
    try{
        const users=await Usermodel.find()
        let newdata=users.map(({name,email,_id})=>{
            return {user:{name,email,receiverId:_id}}
        })
        res.status(200).json({'msg':'Users found',users:newdata})
    }catch(err){
        console.log(err)
        res.status(400).json({'msg':'Error'})
    }
}