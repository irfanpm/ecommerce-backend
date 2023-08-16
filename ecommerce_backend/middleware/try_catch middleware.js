module.exports = (callback)=>{
    return async (req,res,next)=>{
        try{
            await callback(req,res,next)
        }catch(error){
            res.status(500).json({message:error.message})
        }


    }
}