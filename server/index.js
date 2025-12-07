import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import UserModel from "./Models/UserModel.js";
import PostModel from "./Models/PostModel.js";
import bcrypt from "bcrypt";
import dotenv from 'dotenv'
dotenv.config()

const app = express();
app.use(express.json());
app.use(cors());

//Database connection
//const connectString = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@postitcluster.f4gccvl.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true&w=majority&appName=PostITCluster`;

const constr =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@postitcluster.f4gccvl.mongodb.net/${process.env.DATABASE_NAME}?appName=PostITCluster`
mongoose.connect(constr);


app.listen(process.env.PORT, () => {
  console.log("You are connected");
});

//POST API-logoutBVXJCBJ
app.post("/logout", async (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
});
//POST API - register user
app.post("/registerUser", async (req, res) => {
    const { name, email, password } = req.body
    const hashpassword = await bcrypt.hash(password,10)
  try {
    const user = new UserModel({ name, email, password: hashpassword });
    await user.save();
    res.send({ user: user, msg: "Document saved successfully" });
  } catch (error) {
   
    res.status(500).json({ msg: "An unexpected error occurred" });
  }
});

//POST API - login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email: email });

    // User not found
    if (!user) {
      res.status(401).send({ msg: "Invalid email!" });
    } else {
      const passwordMatch = await bcrypt.compare(password, user.password);
      //password mismatch
      if (!passwordMatch) {
        res.status(401).send({ msg: "Incorrect password!" });
      } else {
        res.status(200).send({ user: user, msg: "Authentication is successfull" });
      }
    }
  } catch (error) {
    // Unexpected server errors!
    res.status(500).send({ msg: "An unexpected error occurred" });
  }
});


//POST API - save post
app.post("/savePost", async (req, res) => {
  const { postMsg, email } = req.body;
  try {
    const post = new PostModel({ postMsg, email });
    await post.save();
    res.send({ post: post, msg: "Post added" });
  } catch (error) {
    res.status(500).json({ msg: "An unexpected error occurred" });
  }
});

//GET API - getPost
app.get("/getPosts", async (req, res) => {
    try {
      // Fetch all posts from the "PostModel" collection, sorted by createdAt in descending order
      const posts = await PostModel.find({}).sort({ createdAt: -1 });
  
      const countPost = await PostModel.countDocuments({});
  
      res.send({ posts: posts, count: countPost });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "An error occurred" });
    }
  });
//PUT API - like post
app.put("/likePost", async (req, res) => {
  try {
    const { postId, userId } = req.body
    const postToUpdate = await PostModel.findOne({ _id: postId })
    if (!postToUpdate)
      return res.status(404).send({ msg: "post is not found" })
    
    const userIndex = postToUpdate.likes.users.indexOf(userId) 
    if (userIndex === -1) {
      //user not yet liked the post, so increase the count and add user id 
      const updatedPost = await PostModel.findOneAndUpdate(
        { _id: postId },
        {
          $inc: { "likes.count": 1 },
          $addToSet:{"likes.users":userId}
        },
        {new:true}
      )
      res.send({post:updatedPost,msg:"Post liked"})
    }
    else {
      //user liked the post already, so decrease the count and remove user id
       const updatedPost = await PostModel.findOneAndUpdate(
         { _id: postId },
         {
           $inc: { "likes.count": -1 },
           $pull: { "likes.users": userId },
         },
         { new: true }
       );
       res.send({ post: updatedPost, msg: "Post unliked" });

    }
   }
  catch (error) {
    console.log("Unexpected error occurred!")
  }
})