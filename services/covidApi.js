const axios = require('axios')
const COVIDAPI = 'https://covid2019-api.herokuapp.com'
const fs = require('fs');
const path = require('path')
function getJsonFile(name) {
    const rawdata = fs.readFileSync(name);
    const student = JSON.parse(rawdata);
    return student
}



class Covid19 {
    all() {
        // return axios.get(`${COVIDAPI}/v2/current`).then(r => r.data)
        return getJsonFile(path.join(__dirname, 'allPaises.json'))
    }
    countries(country) {
        /*return axios.get(`${COVIDAPI}/v2/country/${country}`)
            .then(r => r.data)
            .catch(e => console.log(e))*/
        const data = getJsonFile(path.join(__dirname, 'allPaises.json')).data.find((p) => p.location === country)
        return { data }
    }
    confirmed() {
        return axios.get(`${COVIDAPI}/timeseries/confirmed`).then(r => r.data)
    }
    deaths() {
        return axios.get(`${COVIDAPI}/timeseries/deaths`).then(r => r.data)
    }
    recovered() {
        return axios.get(`${COVIDAPI}/timeseries/recovered`).then(r => r.data)
    }

}
module.exports = {
    Covid19
}