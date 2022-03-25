(() => {
    const tablaDatosSelector = document.querySelector('#bodyTabla')
    const formularioSelector = document.querySelector('#js-form')
    const tablaAlbumSelector = document.querySelector('#tabla-album')
    const loginSelector = document.querySelector('#iniciar-sesion')
    const mostrarFormularioSelector = document.querySelector('#mostrar-formulario')

    loginSelector.addEventListener('click', () => {
        mostrarFormularioSelector.setAttribute("style", "display: d-block")
    })

    formularioSelector.addEventListener('submit', async (event) => {
        event.preventDefault()
        const email = document.querySelector('#js-input-email').value
        const password = document.querySelector('#js-input-password').value
        const jwt = await postData(email, password)
        getDatosTotales(jwt)
        getPaisesTabla(jwt)
        mostrarFormularioSelector.setAttribute("style", "display: none")
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

    const getDatosTotales = async (jwt) => { // Consumir la API http://localhost:3000/api/total con JavaScript o jQuery.
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
            const labelPaises = datosFiltrados.map(datos => datos.location)
            const dataChartActive = datosFiltrados.map(datos => datos.active)
            const dataChartConfirmed = datosFiltrados.map(datos => datos.confirmed)
            const dataChartRecovered = datosFiltrados.map(datos => datos.recovered)
            const dataChartDeaths = datosFiltrados.map(datos => datos.deaths)
            const chartPaginaPrincipal = document.getElementById('myChart')
            crearChart(labelPaises, dataChartActive, dataChartConfirmed, dataChartDeaths, dataChartRecovered, chartPaginaPrincipal)
            // Desplegar la información de la API en un gráfico de barra que debe mostrar sólo los países con más de 10000 casos activos.
        } catch (error) {
            console.log(error)
        }
    }

    // continuacion punto 5: para obtener esta información debes llamar a la API
    // http://localhost:3000/api/countries/{country} al momento de levantar el modal.
    const imprimirDatosPais = async (e) => {
        const pais = e.target.dataset.nombre
        const jwt = e.target.dataset.jwt
        try {
            const response = await fetch(`http://localhost:3000/api/countries/${pais}`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${jwt}`
                    }
                })
            const { data } = await response.json()
            $('#exampleModal').modal('toggle')
            const modalChartSelector = document.querySelector('#myChartModal')
            crearChartModal(data.location, data.active, data.confirmed, data.recovered, data.deaths, modalChartSelector)
        }
        catch (error) {
            console.log(error)
        }
    }

    const crearTd = (texto) => {
        const text = document.createTextNode(texto)
        const td = document.createElement("td")
        td.appendChild(text)
        return td
    }

    const crearTr = () => {
        return document.createElement("tr")
    }


    const getPaisesTabla = async (jwt) => {
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
                for (let i = 0; i < data.length; i++) {
                    const tr = crearTr()
                    tr.appendChild(crearTd(data[i].location))
                    tr.appendChild(crearTd(data[i].confirmed))
                    tr.appendChild(crearTd(data[i].deaths))
                    tr.appendChild(crearTd(data[i].recovered))
                    tr.appendChild(crearTd(data[i].active))

                    const tdA = crearTd('')
                    const detallesEnlace = document.createElement('a')
                    detallesEnlace.dataset.nombre = data[i].location
                    detallesEnlace.dataset.jwt = jwt
                    detallesEnlace.addEventListener('click', imprimirDatosPais) // detallesEnlace.addEventListener('click', imprimirDatosPais(data[i].location, jwt))
                    detallesEnlace.setAttribute('href', '#')

                    const detallesEnlaceTexto = document.createTextNode('Ver detalles')
                    detallesEnlace.appendChild(detallesEnlaceTexto)

                    tdA.appendChild(detallesEnlace)
                    tr.appendChild(tdA)

                    tablaDatosSelector.appendChild(tr)
                }
                // <td><a href="#" onclick="imprimirDatosPais('${row.location}', '${jwt}')"> Ver Detalle </a></td>
                // Cada fila de la tabla debe incluir un link que diga "ver detalle", al hacer click levante un modal y m
                // uestre los casos activos, muertos, recuperados y confirmados en un gráfico
                // Desplegar toda la información de la API en una tabla.
            }
        } catch (error) {
            console.log(error)
        }
    }

    const crearChart = (labelPaises, dataChartActive, dataChartConfirmed, dataChartDeaths, dataChartRecovered, lugarImpresion) => {
        lugarImpresion.innerHTML = ""
        const canvas = document.createElement('canvas')
        lugarImpresion.appendChild(canvas)
        const ctx = canvas.getContext('2d')
        const myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labelPaises,
                datasets: [{
                    label: 'Activos',
                    data: dataChartActive,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }, {
                    label: 'Confirmados',
                    data: dataChartConfirmed,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)'
                    ,
                    borderWidth: 1
                }, {
                    label: 'Muertes',
                    data: dataChartDeaths,
                    backgroundColor: 'rgba(255, 206, 86, 0.2)',
                    borderColor: 'rgba(255, 206, 86, 1)',
                    borderWidth: 1
                }, {
                    label: 'Recuperados',
                    data: dataChartRecovered,
                    backgroundColor: 'rgba(46, 204, 113, 0.2)',
                    borderColor: 'rgba(147, 250, 165, 1)',
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

    const crearChartModal = (labelPaises, dataChartActive, dataChartConfirmed, dataChartDeaths, dataChartRecovered, lugarImpresion) => {
        lugarImpresion.innerHTML = ""
        const canvas = document.createElement('canvas')
        lugarImpresion.appendChild(canvas)
        const ctx = canvas.getContext('2d')
        const myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [labelPaises],
                datasets: [{
                    label: 'Activos',
                    data: [dataChartActive],
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }, {
                    label: 'Confirmados',
                    data: [dataChartConfirmed],
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)'
                    ,
                    borderWidth: 1
                }, {
                    label: 'Muertes',
                    data: [dataChartDeaths],
                    backgroundColor: 'rgba(255, 206, 86, 0.2)',
                    borderColor: 'rgba(255, 206, 86, 1)',
                    borderWidth: 1
                }, {
                    label: 'Recuperados',
                    data: [dataChartRecovered],
                    backgroundColor: 'rgba(46, 204, 113, 0.2)',
                    borderColor: 'rgba(147, 250, 165, 1)',
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

    // Final funcion IIFE
})()