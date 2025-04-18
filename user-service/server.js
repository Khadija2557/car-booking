require("dotenv").config();
const express=require("express");
const mongoose=require("mongoose");

const app=express();
app.use(express.json());

//connect to mongodb

mongoose.connect(process.env.MONGO_URI,{

    useNewUrlParser:true,
    useUnifiedTopology:true
});

//User Schema

const userSchema=new mongoose.Schema({

    name: String,
    email: String,
    maxBookings: {type: Number, default:3},
    activeBookings: {type: Number, default:0}
});


const User=mongoose.model("User", userSchema);


//API TESTING IN POSTMAN


//Register user

app.post("/users", async(req,res)=> {

    const user=new User(req.body);
    await user.save();

    res.json(user);

});


//Retrieve user details

app.get("/users/:user_id", async(req,res)=>{

    const user = await User.findById(req.params.user_id);
    res.json(user); 

});


//Update user Booking Count


app.put("/users/:user_id", async(req,res)=>{

    const {activeBookings}=req.body;
    await User.findByIdAndUpdate(req.params.user_id, {activeBookings});

    res.json({message: "User Booking Count has been successfully Update!"});



});


//Now start the server

const port=process.env.port || 3001;

app.listen(port, () => console.log(`User Service is running on PORT ${port} `));

































































