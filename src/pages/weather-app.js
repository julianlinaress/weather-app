import { useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css'

export default function Home() {
    const APIkey = process.env.REACT_APP_API_KEY;
    const [input, setInput] = useState('');
    const [weather, setWeather] = useState(null);
    const [errorPopUp, setErrorPopUp] = useState('');
    const [iconPath, setIconPath] = useState('')

    const handleClick = () => {
        if (input.trim() !== '') {
            fetchWeather(input.trim());
        }
    };

   const fetchWeather = async (city) => {
        try {
            console.log(`Fetching weather from: https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}&units=metric `);
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}&units=metric`);
            console.log('Weather fetched:', response.data)
            setWeather(response.data);
            const id = response.data.weather[0].id;
            console.log('Weather id:', id)

            if (id >= 200 && id < 300) {
                setIconPath('/weather-icons/storm.png');
            } else if (id >= 300 && id < 400) {
                setIconPath('/weather-icons/rain.png');
            } else if (id >= 500 && id < 600) {
                setIconPath('/weather-icons/heavy-rain.png');
            } else if (id >= 600 && id < 700) {
                setIconPath('/weather-icons/snow.png');
            } else if (id === 800) {
                setIconPath('/weather-icons/sunny.png');
            } else if (id > 800 && id < 900) {
                setIconPath('/weather-icons/cloudy.png');
            } else {
                setIconPath('');
            }
                    
            
            setErrorPopUp('');
        } catch (error) {
            setErrorPopUp('City not found');
            setWeather(null);
            console.error("Error fetching weather:", error);
        }
    };

    return (
        <div className="main container-fluid bg-white md-auto rounded p-3 mt-3">
            <div className="input-group mb-3">
                <input
                    value={input}
                    type="text"
                    onChange={(e) => setInput(e.target.value)}
                    className="form-control"
                    placeholder="City"
                    aria-describedby="button-addon2"
                />
                <button
                    className="btn btn-outline-secondary"
                    type="button"
                    id="button-addon2"
                    onClick={handleClick}>
                    Search
                </button>
            </div>

            {errorPopUp && 
                <div className="alert alert-danger mb-0">{errorPopUp}</div>}
        
            {weather && 
                (
                    <div className="result container-fluid md-auto d-flex flex-column align-items-center p-0">
                        <h2>{weather.name}, {weather.sys.state} {weather.sys.country}</h2>

                        <p className="m-0">{weather.main.temp}°C</p>
                        <img src={iconPath} alt="..." className="img-fluid w-25"></img>
                        
                            <div className="container md-auto d-flex align-items-center mt-3">
                                <div className="img-container d-flex align-items-center gap-2 justify-content-center">
                                    <img src="/weather-icons/humidity.png" alt="humidity" className="img-fluid w-25"></img>
                                    <p className="m-0">{weather.main.humidity}%</p>
                                </div>
                                <div className="img-container d-flex align-items-center gap-2 justify-content-center">
                                    <img src="/weather-icons/wind.png" alt="humidity" className="img-fluid w-25"></img>
                                    <p className="m-0">{weather.wind.speed} m/s</p>
                                </div>
                            </div>

                    </div>


                    )
                }
        </div>
    );
}
