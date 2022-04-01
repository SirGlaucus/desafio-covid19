const pageSituacionChileSelector = document.querySelector('#page-chile') // Selector para el elemento 'pagina de chile' del navbar
const tablaDatosSelector = document.querySelector('#bodyTabla') // Selector para pintar la tabla
const tablaAlbumSelector = document.querySelector('#tabla-album') // Selector para la tabla completa
const chartChileSelector = document.querySelector('#myChartChile') // La ubicaion que deseamos para nuestro chart de datos de Chile
const contenedorChartPrincipalSelector = document.querySelector('#contenedorMyChart') // Contenedor del chart principal

// Al cargar la pagina ocultamos automaticamente lo siguiente // req 4 
tablaDatosSelector.setAttribute('style', 'display: none')
tablaAlbumSelector.setAttribute('style', 'display: none')
contenedorChartPrincipalSelector.setAttribute('style', 'display: none')

// -----------------------  Hacemos fetch de los datos de los casos confirmados
const getChileConfirmed = async() => { //                                    req 5
        jwt = localStorage.getItem('jwt-token')
        try {
            const response = await fetch(`http://localhost:3000/api/confirmed`, {
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
    // -----------------------  Hacemos fetch de los datos de los casos de muertos
const getChileDeaths = async() => { //                                        req 5
        jwt = localStorage.getItem('jwt-token')
        try {
            const response = await fetch(`http://localhost:3000/api/deaths`, {
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
    // -----------------------  Hacemos fetch de los datos de los casos recuperados
const getChileRecovered = async() => { //                                    req 5
    jwt = localStorage.getItem('jwt-token')
    try {
        const response = await fetch(`http://localhost:3000/api/recovered`, {
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

// -----------------------  Nuestro funcion que crea nuestro nuevo Chart de linea unicamente con los datos de Chile
const crearTablaChile = (fechas, confirmados, muertos, recuperados) => {
    // Recibe los datos como parametros para ser utilizados en la tabla  // req 4
    const confirmed = confirmados
    const deaths = muertos
    const recovered = recuperados
    const dates = fechas

    chartChileSelector.setAttribute('style', 'display: block')
    const canvas = document.createElement('canvas')
    chartChileSelector.appendChild(canvas)
    const ctx = canvas.getContext('2d') //                                  req 6
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
                borderColor: 'rgba(54, 162, 235, 1)',
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

// ----------------------- Las funciones anteriores solo se ejecutan cuando tenemos un JWT
const autoIniciarChile = async() => {
    jwt = localStorage.getItem('jwt-token')
    if (jwt) {
        pageSituacionChileSelector.setAttribute('style', 'display: block') // Permite que se vea nuestro elemento del nav de 'Situacion Chile'
        chartChileSelector.setAttribute('style', 'display: block') // Permitimos que se vea nuestra nuevo Chart
        const confirmados = await getChileConfirmed()
        const muertos = await getChileDeaths()
        const recuperados = await getChileRecovered()

        // Luego de ejecutar el llamado a nuestras appis y guardar sus datos en una constante
        // Transformamos los datos, sacando solamente una propiedad y lo utilizamos para nuestra tabla
        const soloFechas = confirmados.map(datos => datos.date)
        const soloConfirmados = confirmados.map(datos => datos.total)
        const soloMuertos = muertos.map(datos => datos.total)
        const soloRecuperados = recuperados.map(datos => datos.total)
        crearTablaChile(soloFechas, soloConfirmados, soloMuertos, soloRecuperados)
    }
}
autoIniciarChile()