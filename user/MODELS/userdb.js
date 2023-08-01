const mongoose= require('mongoose')

const userSchema = new mongoose.Schema({
    Username:String,
    Email:String,
    Password:String,
    cart:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"productdb"
    }
    ],
    wishlist:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"productdb"
    }],
    order:[]


})

module.exports=mongoose.model('userdb',userSchema)