import sun from "../assets/sun.png1.png"
import Clock  from "./Clock"
import sunrise from "../assets/sunrise-white.png.jpg"
import sunset from "../assets/sunset-white.png.jpg"
import WeatherIconUrl from "../assets/sun.png.png"
import humidity from "../assets/humidity.png"
import Wind from "../assets/wind.png.png"

import pressure from "../assets/pressure.png"
import UV from "../assets/UV.png.png"
import ForeCast from "./ForeCast"
import { useEffect, useState, useCallback } from "react"
import axios from "axios"
import { toast } from "react-toastify"
const CityAndTime = ({ cityName, lat ,lon, setLat, setLon }) => {
     const [weatherData, setWeatherData] = useState(null)
     const [forecastData, setForecastDate] = useState(null)
     const [uvIndex, setUvIndex] = useState(null)
     const fetchData = useCallback(async () => {
        try {
            const encodedCity = encodeURIComponent(cityName)
            let url;

            if(encodedCity) {
                url = `https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&units=metrics&&appid=a21e38881424af168e7a910be766b6ef `
            } else if (lat && lon) {
                url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metrics&&appid=a21e38881424af168e7a910be766b6ef `
            } else {
                toast.error("Missing city name or coordinates")
                return;
            }

            const currentweather = await axios.get(url)


// Check if we have valid data before proceeding
    if (currentweather?.data?.coord) {
      const { coord } = currentweather.data

            setWeatherData(currentweather.data)
 
           
            setLat(coord.lat)
            setLon(coord.lon)

            const forecast = await axios.get(
                `https://api.openweathermap.org/data/2.5/forecast?lat=${coord.lat}&lon=${coord.lon}&units=metrics&&appid=a21e38881424af168e7a910be766b6ef`
            )
            setForecastDate(forecast.data)
            const uv = await axios.get(
                `https://api.openweathermap.org/data/2.5/uvi?lat=${coord.lat}&lon=${coord.lon}&appid=a21e38881424af168e7a910be766b6ef`
            )
            setUvIndex(uv.data.value)
        } else {
      toast.error("Invalid weather data received")
    }

        } catch (error) {
          console.error("Weather API Error:", error)
    toast.error(error.response?.data?.message || "Failed to fetch weather data")
        }
     }, [cityName, lat, lon, setLat, setLon])
    
     useEffect(() => {
        if (!cityName &&(!lat || !lon)) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords
                    setLat(latitude)
                    setLon(longitude)
                    fetchData(latitude, longitude)
                    
                },
                (error) => {
                    console.log("Geolocation error:", error)
                    toast.error("Location access denied. please enter a city manually.")
                }
            )
        } else {
            fetchData(lat, lon)
        }
     },[cityName, lat, lon, fetchData, setLat, setLon])

        if (!weatherData || !forecastData) {
            return <div className="flex items-center justify-center text-white text-2xl md:text-6xl">Loading...</div>
        }

        const { main, weather, sys, wind } = weatherData
        const { list } = forecastData

        const weatherIconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`


    return (
        
    <>
        <div className="flex flex-col xl:flex-row gap-4">
      { /* Left section: city and time   */}

          <div className="w-full xl:w-1/3 h-auto md:h-72 bg-[#050d1fde] shadow-2xl rounded-lg text-white p-4 flex flex-col justify-between items-center">
             <h1 className="text-2xl md:text-3xl font-bold ">
           {cityName || weatherData.name}
             </h1>
             <img src={sun} alt="weatherImage" className="w-24 select-none" />
             <Clock />
        </div>
        {  /*Right section: weather Details*/ }

    <div className='flex-grow h-auto md:h-72 bg-[#050e1fde] shadow-2xl rounded-lg text-white p-4 flex flex-col justify-around md:flex-row items-center md:items-stretch gap-4'>
        {/*temperature and sunrise and sunset*/}
        <div className="flex flex-col items-center justify-between xl:justify-center gap-6 md:gap-4">
            <h1 className="text05xl md:text-7xl font-bold">
              {main.temp}&#8451;
            </h1>
            <p className="text-center">
             Feels like: <span className='text-lg md:text-xl ml-2 font-bold'>{main.feels_like}&#8451;</span>
            </p>
            <div className="flex xl:flex-col md:flex-row items-center gap-4">
              <div className="flex items-center gap-2">
                    <img src={sunrise} alt='sunrise' 
                    className="h-8 md:h-10 select-none" />
                    <div className="text-center">
                     <h6>Sunrise</h6>
                   <p>{new Date(sys.sunrise * 1000).toLocaleTimeString()}AM</p>
                    </div>
                  
              </div>
              <div className="flex items-center gap-2">
                    <img src={sunset} alt='sunset' 
                    className="h-8 md:h-10 select-none" />
                    <div className="text-center">
                     <h6>Sunset</h6>
                    <p>{new Date(sys.sunset * 1000).toLocaleTimeString()}PM</p>
                    </div>
                  </div>
                </div>
              </div>
           { /* Weather details */}

           <div className="flex flex-col justify-centerb items-center">
            <img src={weatherIconUrl} alt={weather[0].description}  
            className="w-36 md:w-52 md:h-52 select-none" />
            <p className="font-bold text-xl md:text-3xl">
           {[weather[0].description]}
            </p>

           </div>
           { /* Additional weather information  */}

           <div className="md:grid md:grid-cols-2 flex flex-row justify-betweeen gap-4 md:p-4">
            <div className="flex flex-col items-center gap-2">
             <img src={humidity} alt='humidity' 
             className="h-8 md:h-10 select-none " />
              <p>{main.humidity}%</p>
             <h6>Humidity</h6>
            </div>

       
            <div className="flex flex-col items-center gap-2">
                
                <img src={wind } alt='wind' 
                className="h-8 md:h-10 select-none " />
                <p>{wind.speed} km/h</p>
                <h6>wind speed</h6>
            </div>
            <div className="flex flex-col items-center gap-2">
                
                <img src={pressure} alt='pressure' 
                className="h-8 md:h-10 select-none " />
                <p>{main.pressure}hPa</p>
                <h6>Pressure</h6>
            </div>
             <div className="flex flex-col items-center gap-2">
                
                <img src={UV} alt='UV' 
                className="h-8 md:h-10 select-none " />
                <p> {uvIndex !== null ? uvIndex : 'N/A'} </p>
                <h6>UV</h6>
             </div>

           </div>
         </div>
        </div>
     
        <ForeCast forecast={list} />
        </>
  )
}
 
export default CityAndTime