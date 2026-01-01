import axios from 'axios'

const apiKey = import.meta.env.VITE_SOME_KEY
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather'

const getCurrentWeather = (lat, lon) => {
    return axios.get(`${baseUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}`).then(response => response.data)
}

export default getCurrentWeather