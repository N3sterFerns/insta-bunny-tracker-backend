// import User from "../models/users.js"
import jwt from "jsonwebtoken"
import { sessionVerification } from "../utils/verifySession.js";
import UserSession from "../models/userModel.js";
import { scrapeFollowers } from "../utils/scrapeFollowers.js";
import Follower from "../models/followerModel.js";

const addUserSession = async (req, res) => {
   // i need to add the username and the session id and also need to validate the session id

   res.setHeader("Access-Control-Allow-Credentials", "true");
   res.setHeader("Access-Control-Allow-Origin", "https://insta-bunny-tracker.netlify.app");
   res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
   res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");

   // ✅ Handle preflight OPTIONS request
   if (req.method === "OPTIONS") {
      return res.status(200).end();
   }

   try {
      const { username, sessionId} = req.body;
      
      console.log(username, sessionId);
      

      const {valid} = await sessionVerification(sessionId);

      if(!valid) return res.status(500).json({success: false, message: "Session Invalid"})

      let instaSession = await UserSession.findOne({username: username, sessionId: sessionId})

      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader("Access-Control-Allow-Origin", "https://insta-bunny-tracker.netlify.app");
      res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
      
      // let sessionToken;
      if(!instaSession){
         console.log("created a user");
         
         let user = await UserSession.create({
            username: username,
            sessionId: sessionId,
         })
         let sessionToken = jwt.sign({id: user._id}, "session")

         return res.status(201).json({success: true, message: "Session Created", token: sessionToken})
      }
      
      return res.status(200).json({success: true, message: "Session Exists"})

   } catch (error) {
      console.log(error);
   }
};


const getTotalFollowers = async (req, res) => {
   const {username, sessionId, _id} = req.user;

   try {
      let currentUsersFollowers = await Follower.findOne({userId: _id});    
      
      let totalFollowers = currentUsersFollowers?.followers.length !== 0 ? currentUsersFollowers?.followers.length : 0;
      let totalUnFollowed = currentUsersFollowers?.unFollowed.length !== 0 ? currentUsersFollowers?.unFollowed.length : 0;

      if(currentUsersFollowers) return res.status(200).json({message: "Followers Fetched Successfully", totalFollowers: totalFollowers, totalUnfollowed: totalUnFollowed, unFollowed: currentUsersFollowers.unFollowed, status: true})

      const usernamesFetched = await scrapeFollowers(username, sessionId);

      if(!usernamesFetched) return res.status(500).json({message: "No Followers Found", status: false})

      await Follower.create({
         userId: _id,
         followers: usernamesFetched
      })

      currentUsersFollowers = await Follower.findOne({userId: _id});

      return res.status(200).json({message: "Followers Fetched Successfully", totalFollowers: totalFollowers, totalUnfollowed: totalUnFollowed, unFollowed: currentUsersFollowers.unFollowed, status: true})

   } catch (error) {
      console.log(error);
      return res.status(500).json({message: "Something went wrong", status: false})
   }
 
};


const deleteFollower = async (req, res) => {
   const {_id} = req.user;
   const {username} = req.body;

   try {
      const totalFollowers = await Follower.findOne({userId: _id})
   
      const updatedUnfollowed  = await totalFollowers.unFollowed.filter((unfollow)=> unfollow !== username)
   
      await Follower.updateOne(
         { userId: _id },
         { $set: { unFollowed: updatedUnfollowed } }
      );
   
      return res.status(200).json({message: "Successfully Deleted", status: true})
   } catch (error) {
      return res.status(500).json({message: "Something went wrong 1", status: false})
   }
};

const getUserSession = async (req, res)=>{
   const {_id} = req.user;

   try {
      let sessionUser = await UserSession.findById(_id)

      return res.status(200).json({user: sessionUser, message: "User Details Available"})

   } catch (error) {
      return res.status(500).json({message: "Something went wrong"})
   }

}

const editUserSession = async (req, res)=>{
   const {_id} = req.user;
   const {username, sessionId} = req.body;

   try {
      const {valid} = await sessionVerification(sessionId);

      if(!valid) return res.status(500).json({success: false, message: "Session Invalid"})

      let sessionUserEdit = await UserSession.findById(_id)

      if (!sessionUserEdit) {
         return res.status(404).json({ success: false, message: "User session not found" });
      }

      sessionUserEdit.username = username
      sessionUserEdit.sessionId = sessionId

      await sessionUserEdit.save()

      return res.status(200).json({success: true, message: "User Details Updated"})


   } catch (error) {
      return res.status(500).json({message: "Something went wrong"})
   }

}

const deleteAllData = async (req, res)=>{
   const {_id} = req.user;
   try {
      
      let user = await UserSession.findById(_id)

      await Follower.deleteOne({userId: user._id})

      await UserSession.findByIdAndDelete(_id)

      return res.status(200).json({success: true, message: "User Data Deleted"})


   } catch (error) {
      return res.status(500).json({message: "Something went wrong"})
   }

}




export { getTotalFollowers, deleteFollower, addUserSession, getUserSession, editUserSession, deleteAllData};