import { useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Home() {
    const APIkey = '7ab9ac7fe919a00b684ad176d6200fdc';
    const [input, setInput] = useState('');
    const [weather, setWeather] = useState(null);
    const [errorPopUp, setErrorPopUp] = useState('');

    const handleClick = () => {
        if (input.trim() !== '') {
            fetchCoordinates(input.trim());
        }
    };

    const fetchCoordinates = async (city) => {
        try {
            const response = await axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${APIkey}`);
            const data = response.data[0];

            if (data && data.name && city.toLowerCase() === data.name.toLowerCase()) {
                fetchWeather(data.lat, data.lon);
                setErrorPopUp('');
            } else {
                setErrorPopUp('City not found');
                setWeather(null);
            }
        } catch (error) {
            setWeather(null);
            console.error("Error fetching coordinates:", error);
        }
    };

    const fetchWeather = async (lat, lon) => {
        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}&units=metric`);
            setWeather(response.data);
        } catch (error) {
            console.error("Error fetching weather:", error);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow p-4">
                        <h1 className="text-center mb-4">Weather App</h1>
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
                                onClick={handleClick}
                            >
                                Search
                            </button>
                        </div>
                        {errorPopUp && <div className="alert alert-danger mt-3">{errorPopUp}</div>}
                        {weather && (
                            <div className="mt-3">
                                <h2>Weather in {weather.name}, {weather.sys.country}</h2>
                                <p>Temperature: {weather.main.temp}°C</p>
                                <p>Feels like: {weather.main.feels_like}°C</p>
                                <p>Weather: {weather.weather[0].description}</p>
                                <p>Humidity: {weather.main.humidity}%</p>
                                <p>Wind speed: {weather.wind.speed} m/s</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
