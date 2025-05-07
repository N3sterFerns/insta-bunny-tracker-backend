// import User from "../models/users.js"
// import jwt from "jsonwebtoken"

// const createUser = async (req, res) => {
//    try {
//         const {email, picture} = req.body?.user || req.body;        

//         if(!email || email.trim() === ""){
//             return res.json("Invalid Input")
//         }
        
//         let user = await User.findOne({email: email})

//         if(!user){
//             user = await User.create({
//                 email: email,
//                 image: picture
//             })

//             return res.status(201).json({user})
//         }

//         return res.status(200).json("User Already Exists")

//    } catch (error) {
//     console.log(error);
//    }
// };







// export { createUser};