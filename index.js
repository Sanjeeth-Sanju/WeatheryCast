import express from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();


const app = express();
const port = 3000;
const myOpenWeatherApiKey = process.env.API_KEY;

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/", (req,res)=>{
  res.render("index.ejs", {message: "Enter a location to get the latest weather update 🌍"});
});

app.post("/submit", async (req, res)=>{
   try{
   const userEnteredLocation = req.body.location;
   const geoCoordinates = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${userEnteredLocation}&appid=${myOpenWeatherApiKey}`);
   
   const userLat = geoCoordinates.data[0].lat;
   const userLon = geoCoordinates.data[0].lon; 

   const userWeather = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${userLat}&lon=${userLon}&units=metric&appid=${myOpenWeatherApiKey}`);

   const temperature = Math.round(userWeather.data.main.temp) + "°C";
   const description = userWeather.data.weather[0].description.replace(/\b\w/g, c => c.toUpperCase());
   const humidity = userWeather.data.main.humidity + "%";   
   const windSpeed = Math.round(userWeather.data.wind.speed) * (3.6) + "kph"; 
   const cloudiness = userWeather.data.clouds.all + "%";
   const name = userWeather.data.name;

   res.render("index.ejs",{
      temperature:temperature,
      description: description,
      humidity:humidity,
      windSpeed: windSpeed,
      cloudiness:cloudiness,
      name:name,   
   });
   
}catch(error){
    console.log("ERROR:", error.response?.data || error.message);
    res.render("index.ejs", {errorMessage: "⚠️ Unable to retrieve weather for that location. Please try another city.", emoji:""});
}
});


app.listen(port, ()=>{
   console.log(`Server runs succesfully on port ${port}`);
});
