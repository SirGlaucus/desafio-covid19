const botonPruebaSelector = document.querySelector('#prueba')
const tablaDatos = document.querySelector('#bodyTabla')
const formulario = document.querySelector('#js-form')
const tablaAlbumSelector = document.querySelector('#tabla-album')

formulario.addEventListener('submit', async (event) => {
    event.preventDefault()
    const email = document.querySelector('#js-input-email').value
    const password = document.querySelector('#js-input-password').value
    const jwt = await postData(email, password)
    getDatosTotales(jwt)
    getPaises(jwt)
})

const postData = async (email, password) => {
    try {
        const response = await fetch('http://localhost:3000/api/login',
            {
                method: 'POST',
                body: JSON.stringify({ email: email, password: password })
            })

        const { token } = await response.json()
        localStorage.setItem('jwt-token', token)
        return token
    } catch (error) {
        console.log(`Error: ${error}`)
    }
}

const getDatosTotales = async (jwt) => {
    try {
        const response = await fetch(`http://localhost:3000/api/total`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            })
        const { data } = await response.json()
        const datosFiltrados = data.filter(datosPaises => {
            return datosPaises.active >= 10000
        })
        console.log(datosFiltrados)
        /*datosFiltrados.forEach(datosPaises => {
            const casosActivos = datosPaises.active
            const casosConfirmados = datosPaises.confirmed
            const casosMuertos = datosPaises.deaths
            const casosRecuperados = datosPaises.recovered
            const nombrePais = datosPaises.location
            console.log(`${casosActivos} - ${casosConfirmados} - ${casosMuertos} - ${casosRecuperados} - ${nombrePais}`)
        })*/

        const labelPaises = datosFiltrados.map(datos => datos.location)
        const dataChartActive = datosFiltrados.map(datos => datos.active)
        const dataChartConfirmed = datosFiltrados.map(datos => datos.confirmed)
        const dataChartRecovered = datosFiltrados.map(datos => datos.recovered)
        const dataChartDeaths = datosFiltrados.map(datos => datos.deaths)
        console.log(labelPaises)
        const ctx = document.getElementById('myChart').getContext('2d');
        const myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labelPaises,
                datasets: [{
                    label: 'Activos',
                    data: dataChartActive,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 99, 132, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 99, 132, 1)'
                    ],
                    borderWidth: 1
                }, {
                    label: 'Confirmados',
                    data: dataChartConfirmed,
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(54, 162, 235, 0.2)'
                    ],
                    borderColor: [
                        'rgba(54, 162, 235, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(54, 162, 235, 1)'
                    ],
                    borderWidth: 1
                }, {
                    label: 'Muertes',
                    data: dataChartDeaths,
                    backgroundColor: [
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(255, 206, 86, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 206, 86, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(255, 206, 86, 1)'
                    ],
                    borderWidth: 1
                }, {
                    label: 'Recuperados',
                    data: dataChartRecovered,
                    backgroundColor: [
                        'rgba(46, 204, 113, 0.2)',
                        'rgba(46, 204, 113, 0.2)',
                        'rgba(46, 204, 113, 0.2)',
                        'rgba(46, 204, 113, 0.2)',
                        'rgba(46, 204, 113, 0.2)',
                        'rgba(46, 204, 113, 0.2)'
                    ],
                    borderColor: [
                        'rgba(147, 250, 165, 1)',
                        'rgba(147, 250, 165, 1)',
                        'rgba(147, 250, 165, 1)',
                        'rgba(147, 250, 165, 1)',
                        'rgba(147, 250, 165, 1)',
                        'rgba(147, 250, 165, 1)'
                    ],
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
        });
        myChart.render()
    } catch (error) {
        console.log(error)
    }
}

const getPaises = async (jwt) => {
    try {
        tablaAlbumSelector.setAttribute("style", "display: d-block")
        const response = await fetch(`http://localhost:3000/api/total`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            })
        const { data } = await response.json()
        if (data) {
            let rows = '';
            $.each(data, (i, row) => {
                rows += `<tr>
                            <td> ${row.location} </td>
                            <td> ${row.confirmed} </td>
                            <td> ${row.deaths} </td>
                            <td> ${row.recovered} </td>
                            <td> ${row.active} </td>
                        </tr>`
            })
          tablaDatos.innerHTML = rows
        }
    } catch (error) {
        console.log(error)
    }
}
// getPaises(localStorage.getItem('jwt-token'))
