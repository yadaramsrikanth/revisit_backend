const mongoose=require("mongoose")

const userSchema=mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
})

const User=mongoose.model("User",userSchema)

const productsSchema=mongoose.Schema({
    image:{
        type:String,
        required:true
    },
    categoryname:{
        type:String,
        required:true,
    },
    count:{
        type:Number,
        required:true
    }

})

const Product=mongoose.model("Product",productsSchema)
module.exports={User,Product}