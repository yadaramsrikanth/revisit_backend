require('dotenv').config()
const express=require("express")
const app=express()
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const mongoose=require("mongoose")
const cors=require('cors')
let PORT=process.env.PORT
let mongo_url=process.env.MONGO_URL
app.listen(PORT,()=>console.log(`Server Running Successfully at ${PORT}`))
mongoose.connect(mongo_url).then(()=>console.log("DB Connected")).catch((e)=>console.log((e.message)))
app.use(express.json())
app.use(cors({origin:"*"}))
const {User,Product}=require("./model")
const {authenticate}=require("./authenticate")

//Register Route

app.post("/api/auth/signup",async(req,res)=>{
    const {username,email,password}=req.body
    try{
        const existinguser=await User.findOne({email})
        if(existinguser){
            return res.status(400).json({message:"Email already exists"})
        }
        const hashpassword=await bcrypt.hash(password,10)
        const newuser=new User({username,email,password:hashpassword})
        await newuser.save()
        return res.status(201).json({message:"User Registered Successfully",user:newuser})

    }catch(e){
        return res.status(500).json({message:"Server Error",error:e.message})
    }
})

//Login

app.post("/api/auth/login",async(req,res)=>{
    const {email,password}=req.body
    try{
        const user=await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"Invalid User"})
        }
        const ispasswordmatched=await bcrypt.compare(password,user.password)
        if(ispasswordmatched){
            const jwttoken=jwt.sign({userId:user._id,email},process.env.SECRET_TOKEN)
            return res.status(200).json({jwttoken,message:"Login successful"})
        }else{
            return res.status(400).json({message:"Invalid Password"})
        }
    
    }catch(e){
        return res.status(500).json({message:"server error",error:e.message})
    }
})

//GET REQUEST

app.get("/api/categories",authenticate,async(req,res)=>{
    try{
        const products=await Product.find()
        return res.json(products)

    }catch(e){
        return res.status(500).json({message:"server error"})
    }
})

//POST REQUEST

app.post("/api/categories",authenticate,async(req,res)=>{
    const {image,categoryname,count}=req.body
    try{
        const newpost=new Product({image,categoryname,count})
        const savedproduct=await newpost.save()
        return res.status(201).json({message:"Product is created successfully..",product:savedproduct})
    }catch(e){
        return res.status(500).json({message:"Post Creation failed",error:e.message})
    }
})