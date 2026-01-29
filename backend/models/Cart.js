const mongoose =require("mongoose")

const cartItemSchema=mongoose.Schema({
    product:{
        type:Schema.Types.ObjectId,ref:"Product",require:true
    },
    quantity:{
        type:Number,
        require:true
    }
})

const cartSchema=mongoose.Schema({
    user:{
        type:SchemaTypes.Types.ObjectId, ref:"User"
    },
    items:[cartItemSchema]
})

module.exports=mongoose.model("Cart",cartSchema)