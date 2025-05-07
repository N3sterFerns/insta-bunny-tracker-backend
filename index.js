import express from "express"
import cors from "cors"
import dotenv from 'dotenv';
dotenv.config();
import { connectDB } from "./db/dbConnect.js";
// import userRouter from "./routes/userRoute.js"
import puppeteer from "puppeteer-extra"
// import StealthPlugin  from "puppeteer-extra-plugin-stealth"
import instaRouter from "./routes/instagramRoute.js"
import cookieParser from "cookie-parser";
import "./utils/followersTracker.js"

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}))




app.use(cors({
    origin: "https://insta-bunny-tracker.netlify.app",
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(cookieParser())
// puppeteer.use(StealthPlugin())

// Basic route
app.get('/', (req, res) => {
    res.send('Welcome to the Instagram Tracker API!');
});

// app.use("/api/users", userRouter)
app.use("/api/insta", instaRouter)


// Start the server
app.listen(process.env.PORT || 8080, () => {
    connectDB()
    console.log(`Server is running on http://localhost:8080`);
});