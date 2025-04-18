require("dotenv").config();
const express=require("express");
const mongoose=require("mongoose");
const axios = require("axios");


const app=express();
app.use(express.json());

//connect to mongodb

mongoose.connect(process.env.MONGO_URI,{

    useNewUrlParser:true,
    useUnifiedTopology:true
});

//Booking Schema

const bookingSchema=new mongoose.Schema({

    userId: String,
    carId: String,
    startDate: Date,
    endDate: Date,
    status: {type: String, default: "cancelled" }

});


const Booking=mongoose.model("Booking", bookingSchema);


//API TESTING IN POSTMAN


//Create a Booking

app.post("/bookings", async(req,res)=> {

    const {userId, carId, startDate, endDate}=req.body;

    //Checking car availability

    const car = await axios.get(`http://car-service:3002/cars/${carId}`);

    if(!car.data.isAvailable)
    {
        return res.status(400).json({error: "Car is NOT available in database"});
    }


    //Checking user booking limit

    const user = await axios.get(`http://user-service:3001/users/${userId}`);

    if(user.data.activeBookings>=user.data.maxBookings)
    {
        return res.status(400).json({error: "User Active Booking limit is greater than maximum booking limit:3"})
    }

    //now create user booking

    
    const booking=new Booking(req.body);
    await booking.save();

    res.json(booking);



    //now update user's active booking count

      const updateCount = await axios.put(`http://user-service:3001/users/${userId}`, {

       activeBookings: user.data.activeBookings + 1

      });

    

    //and now mark user's car as unavailable as it has been booked now

    const markUnavailable = await axios.put(`http://car-service:3002/cars/${carId}`, {isAvailable: false});

    res.json(booking);


});


//Retrieve all bookings for a user


app.get("/bookings/:user_id", async(req,res)=>{

    const booking = await Booking.find({user_id:req.params.user_id});
    res.json(booking);

});


//Cancel a Booking

app.delete("/booking/:booking_id", async(req,res)=>{

    const booking = await Booking.findById(req.params.booking_id)

    if(!booking || booking.status === "cancelled")
    {
        return res.status(400).json({error: "Booking was not found or the booking has already been cancelled"});
    }

    //cancel booking and set status as cancelled
    booking.status = "cancelled";
    await booking.save();


    //User active booking count decrease: Update
    const user= await axios.get(`http://user-service:3001/users/${booking.userId}`, {isAvailable: true});

    const updateBookingCount = axios.put(`http://user-service:3001/users/${booking.userId}`, {
         activeBookings: user.data.activeBookings - 1
    });

    res.json({message: "Booking has been cancelled successfully"});

    //Car is now available
    const markAvailable = await axios.put(`http://car-service:3002/cars/${booking.carId}`, { 
    
        isAvailable:true
    
    });

    res.json({message: "Car is now available as booking has been cancelled"});



});


//Now start the server

const port=process.env.port || 3003;

app.listen(port, () => console.log(`Booking Service is running on PORT ${port} `));











































