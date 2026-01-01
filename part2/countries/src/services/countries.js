import axios from 'axios'
const allUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all'
const oneUrl = 'https://studies.cs.helsinki.fi/restcountries/api/name/'

const getAll = () => {
    return axios.get(allUrl).then(response => response.data)
}

const getOne = (name) => {
    return axios.get(`${oneUrl}${name}`).then(response => response.data)
}

export default { getAll, getOne}