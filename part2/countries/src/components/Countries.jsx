import {useState, useEffect} from 'react'
import getCurrentWeather from '../services/weather'

const Countries = ({countries, showOf}) => {
    if (countries.length > 10) {
        return <>Too many matches, specify another filter</>
    } else if (countries.length > 1) {
        return (
            <>
                {countries.map(country => <Country name={country.name.common} key={country.name.common}
                                                   show={() => showOf(country.name.common)}/>)}
            </>
        )
    } else if (countries.length === 1) {
        return <CountryProfile country={countries[0]}/>
    }

    return null
}

const Country = ({name, show}) => <div>{name}
    <button onClick={show}>show</button>
</div>

const CountryProfile = ({country}) => {
    const [weather, setWeather] = useState(null)

    useEffect(() => {
        if (country.capital && country.capitalInfo && country.capitalInfo.latlng) {
            getCurrentWeather(country.capitalInfo.latlng[0], country.capitalInfo.latlng[1])
                .then(returnedWeather => {
                    setWeather(returnedWeather)
                })
        }
    }, [])

    return (
        <>
            <h1>{country.name.common}</h1>
            {country.capital && <div>Capital {country.capital.join(' ')}</div>}
            <div>Area {country.area}</div>

            <h2>Languages</h2>
            <ul>
                {Object.values(country.languages).map(language => (<li key={language}>{language}</li>))}
            </ul>

            <img src={country.flags.png} alt={`${country.name.common} flag`}/>

            {weather && (
                <>
                    <h2>Weather in {country.capital}</h2>
                    <div>Temperature {(weather.main.temp - 273.15).toFixed(2)} Celsius</div>
                    <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                         alt={weather.weather[0].description}/>
                    <div>Wind {weather.wind.speed} m/s</div>
                </>
            )}
        </>
    )
}


export default Countries