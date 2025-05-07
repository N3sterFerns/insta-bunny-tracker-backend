import cron from "node-cron"
import Follower from "../models/followerModel.js"
import UserSession from "../models/userModel.js"
import { scrapeFollowers } from "./scrapeFollowers.js"


cron.schedule("0 0 * * *", async ()=>{
    let usersList = await UserSession.find({})
    let currentFollowers;
    if(!usersList) return;

    for(let eachUser of usersList){        
        currentFollowers = await scrapeFollowers(eachUser.username, eachUser.sessionId)

        console.log(currentFollowers);

        const lastFollowersData = await Follower.findOne({userId: eachUser._id}).sort({ timestamp: -1 });

        const unFollowed = await lastFollowersData.followers.filter((follower)=> !currentFollowers.includes(follower));

        if(currentFollowers.length === lastFollowersData.followers.length) return console.log("Equal");
        

        await Follower.findOneAndUpdate({userId: eachUser._id}, {
            followers: currentFollowers,
            unFollowed: unFollowed
        })

    }
    
})



