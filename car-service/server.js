require("dotenv").config();
const express=require("express");
const mongoose=require("mongoose");

const app=express();
app.use(express.json());

//connect to mongodb

mongoose.connect(process.env.MONGO_URI ,{

    useNewUrlParser:true,
    useUnifiedTopology:true
});


const carSchema=new mongoose.Schema({

    model: String,
    location: String,
    isAvailable:{type:Boolean, default:true}
});


const Car=mongoose.model("Car", carSchema);


//API TESTING IN POSTMAN


//Ad a new Car

app.post("/cars", async(req,res)=> {

    const car=new Car(req.body);
    await car.save();

    res.json(car);

});


//Retrieve car details

app.get("/cars/:car_id", async(req,res)=>{

    const car = await Car.findById(req.params.car_id);
    res.json(car); 

});


//Update car's availability status


app.put("/cars/:car_id", async(req,res)=>{

    const {isAvailable}=req.body;
    await Car.findByIdAndUpdate(req.params.car_id, {isAvailable});

    res.json({message: "Car's availability status has been successfully Updated!"});



});


//Now start the server

const port=process.env.port || 3002;

app.listen(port, () => console.log(`Car Service is running on PORT ${port} `));























































