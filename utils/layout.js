export const layoutFn = async(req,res,cb)=>{
    try{
        await cb()
    }catch(err){
        return res.status(500).json({success:false,message:'internal server error',error:err.message});
    }
}