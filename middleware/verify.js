import jwt from "jsonwebtoken"
import UserSession from "../models/userModel.js";

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'] || null;  
    const token = authHeader && authHeader.split(" ")[1]    

    const verifyToken = jwt.verify(token, 'session')

    const isExist = await UserSession.findById(verifyToken.id)

    if(!isExist) return res.json("Auauthorized Access")

    req.user = isExist;
    
    next()
};

export {verifyToken}