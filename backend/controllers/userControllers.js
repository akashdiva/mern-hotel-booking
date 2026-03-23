import jwt from "jsonwebtoken"

const adminLogin =async(req,res)=>{
    try{
        const {username,password} =req.body

        if(username ===process.env.ADMIN_USERNAME && password == process.env.ADMIN_PASSWORD){
               const token =jwt.sign(username+password,process.env.JWT_SECRET)
               res.json({success:true,token})
        }else{
            res.json({success:false,message:"Invalid login details"})
        }
    }

    catch(error){
        console.log();
        res.json({success:false,message:"Error loggin in admin"})

    }
}

export {adminLogin}