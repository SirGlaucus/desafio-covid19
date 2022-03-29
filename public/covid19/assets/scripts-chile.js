const pageSituacionChileSelector = document.querySelector('#page-chile')
const tablaDatosSelector = document.querySelector('#bodyTabla')
const tablaAlbumSelector = document.querySelector('#tabla-album')
const chartPaginaPrincipalSelector = document.querySelector('#myChart') // La ubicaion que deseamos para nuestro chart de datos de todos los paises

const chartChileSelector = document.querySelector('#myChartChile')

tablaDatosSelector.setAttribute("style", "display: none")
tablaAlbumSelector.setAttribute("style", "display: none")
chartPaginaPrincipalSelector.setAttribute("style", "display: none")

const getChileConfirmed = async () => {
    jwt = localStorage.getItem('jwt-token')
    try {
        const response = await fetch(`http://localhost:3000/api/confirmed`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            })
        const { data } = await response.json()
        return data
    } catch (error) {
        console.log(error)
    }
}

const getChileDeaths = async () => {
    jwt = localStorage.getItem('jwt-token')
    try {
        const response = await fetch(`http://localhost:3000/api/deaths`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            })
        const { data } = await response.json()
        return data
    } catch (error) {
        console.log(error)
    }
}

const getChileRecovered = async () => {
    jwt = localStorage.getItem('jwt-token')
    try {
        const response = await fetch(`http://localhost:3000/api/recovered`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            })
        const { data } = await response.json()
        return data
    } catch (error) {
        console.log(error)
    }
}


const crearTablaChile = (fechas, confirmados, muertos, recuperados) => {
    const confirmed = confirmados
    const deaths = muertos
    const recovered = recuperados
    const dates = fechas

    chartChileSelector.innerHTML = ""
    const canvas = document.createElement('canvas')
    chartChileSelector.appendChild(canvas)
    const ctx = canvas.getContext('2d')
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Confirmados',
                data: confirmed,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }, {
                label: 'Muertos',
                data: deaths,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)'
                ,
                borderWidth: 1
            }, {
                label: 'Recuperados',
                data: recovered,
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                borderColor: 'rgba(255, 206, 86, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    })
    myChart.render()
}

const autoIniciarChile = async () => {
    jwt = localStorage.getItem('jwt-token')
    if (jwt) {
        pageSituacionChileSelector.setAttribute("style", "display: block")
        const confirmados = await getChileConfirmed(jwt)
        const muertos = await getChileDeaths(jwt)
        const recuperados = await getChileRecovered(jwt)

        const soloFechas = confirmados.map(datos => datos.date)
        const soloConfirmados = confirmados.map(datos => datos.total)
        const soloMuertos = muertos.map(datos => datos.total)
        const soloRecuperados = recuperados.map(datos => datos.total)
        crearTablaChile(soloFechas, soloConfirmados, soloMuertos, soloRecuperados)
    }
}
autoIniciarChile()