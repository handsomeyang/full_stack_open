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
        return <CountryProfile country={countries[0]} />
    }

    return null
}

const Country = ({name, show}) => <div>{name}
    <button onClick={show}>show</button>
</div>

const CountryProfile = ({country}) => (
    <>
        <h1>{country.name.common}</h1>
        {country.capital ? <div>Capital {country.capital.join(' ')}</div> : null}
        <div>Area {country.area}</div>

        <h2>Languages</h2>
        <ul>
            {Object.values(country.languages).map(language => (<li key={language}>{language}</li>))}
        </ul>

        <img src={country.flags.png} alt={`${country.name.common} national flag`} />
    </>
)


export default Countries