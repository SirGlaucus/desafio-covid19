(() => {
    // ----------------------- Selectores
    
    const mostrarFormularioSelector = document.querySelector('#mostrar-formulario') // TODO: cambiar esto a un modal en lugar de div
    // Los selectores de los elementos del navbar (pagina de chile, iniciar y cerrar sesion)
    const loginSelector = document.querySelector('#iniciar-sesion')
    const logoutSelector = document.querySelector('#cerrar-sesion')
    const pageSituacionChileSelector = document.querySelector('#page-chile')

    // Selectores de las tablas y charts
    const tablaDatosSelector = document.querySelector('#bodyTabla')
    const formularioSelector = document.querySelector('#js-form')
    const tablaAlbumSelector = document.querySelector('#tabla-album')
    const chartPaginaPrincipalSelector = document.querySelector('#myChart') // La ubicacion que deseamos para nuestro chart de datos de todos los paises
    const modalChartSelector = document.querySelector('#myChartModal') // La ubicacion del chart para paises individuales en el modal
    const chartChileSelector = document.querySelector('#myChartChile') // La ubicacion de nuestro chart de Chile y nuestra segunda pagina


    // ----------------------- Evento de click en el navbar para mostrar el formulario
    loginSelector.addEventListener('click', () => {
        mostrarFormularioSelector.setAttribute("style", "display: d-block")
    })

    logoutSelector.addEventListener('click', () =>{ // Sirve para eliminar el token y llevar la pagina a su estado inicial
        localStorage.removeItem('jwt-token')

        logoutSelector.setAttribute("style", "display: none")  // Elementos del nav que se ocultan
        pageSituacionChileSelector.setAttribute("style", "display: none") // Elementos del nav que se ocultan

        
        loginSelector.setAttribute("style", "display: block") // Elemento del Nav que se muestra

        // Los siguientes elementos son las tablas y los charts que se ocultan al hacer log out - NOTA: ¿Seria mejor eliminar su contenido?
        tablaDatosSelector.setAttribute("style", "display: none")
        tablaAlbumSelector.setAttribute("style", "display: none")
        chartPaginaPrincipalSelector.setAttribute("style", "display: none")
        chartChileSelector.setAttribute("style", "display: none")
    })

    // ----------------------- Evento de submit en el formulario para obtener el JWT
    formularioSelector.addEventListener('submit', async (event) => {
        event.preventDefault() // Necesario para evitar que la pagina se recargue automaticamente
        const email = document.querySelector('#js-input-email').value
        const password = document.querySelector('#js-input-password').value
        const jwt = await postData(email, password) // Ejecutamos la funcion post Data que nos retorna el token. Enviamos como  parametros email y contraseña

        // Ocultamos el formulario y el boton de login
        loginSelector.setAttribute("style", "display: none")
        mostrarFormularioSelector.setAttribute("style", "display: none") 

        // Mostramos nuestro enlace en logout de nuestro nav, el enlace a la pagina de chile, nuestro chart y nuestra tabla
        logoutSelector.setAttribute("style", "display: block") // Nav logout
        pageSituacionChileSelector.setAttribute("style", "display: block") // Nav pagina chile
        chartPaginaPrincipalSelector.setAttribute("style", "display: block") // Chart principal (mayor a mil)
        tablaDatosSelector.setAttribute("style", "display: d-block") // Tabla de datos

        // Ejecucion de nuestras funciones para mostrar los datos
        getDatosTotales(jwt)
        getPaisesTabla(jwt)
    })

    // ----------------------- Funcion que nos retorna el JWT
    const postData = async (email, password) => {
        try {
            const response = await fetch('http://localhost:3000/api/login',
                {
                    method: 'POST',
                    body: JSON.stringify({ email: email, password: password })
                })

            const { token } = await response.json()
            localStorage.setItem('jwt-token', token) // Luego de generar el token lo guardamos en el locaStorage
            return token
        } catch (error) {
            console.log(`Error: ${error}`)
        }
    }

    // ----------------------- Funcion que con el JWT extrae los datos y pinta el chart principal
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
            }) // Luego de obtener los datos, utilizamos la funcion filter para obtener unicamente los paises con mas de 10mil casos activos
            // Luego creamos constantes que nos van a permitir devolver solo un tipo de propiedad como un array a nuestro chart
            const labelPaises = datosFiltrados.map(datos => datos.location)
            const dataChartActive = datosFiltrados.map(datos => datos.active)
            const dataChartConfirmed = datosFiltrados.map(datos => datos.confirmed)
            const dataChartRecovered = datosFiltrados.map(datos => datos.recovered)
            const dataChartDeaths = datosFiltrados.map(datos => datos.deaths)

            crearChart(labelPaises, dataChartActive, dataChartConfirmed, dataChartDeaths, dataChartRecovered, chartPaginaPrincipalSelector)
            // Desplegar la información de la API en un gráfico de barra que debe mostrar sólo los países con más de 10000 casos activos.

        } catch (error) {
            console.log(error)
        }
    }

    // continuacion punto 5: para obtener esta información debes llamar a la API
    // http://localhost:3000/api/countries/{country} al momento de levantar el modal.
    const imprimirDatosPais = async (e) => {
        const pais = e.target.dataset.nombre // El nombre se guardo como dataset al momento de crear la tabla 
        // y asignamos eso a una constante para especificar el pais en el fetch
        const jwt = localStorage.getItem('jwt-token') // Sacamos nuestro token del localStorage para luego hacer el fetch
        try {
            const response = await fetch(`http://localhost:3000/api/countries/${pais}`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${jwt}`
                    }
                })
            const { data } = await response.json()
            $('#exampleModal').modal('toggle') // Agrega la propiedad toggle a nuestro modal
            crearChart(data.location, data.active, data.confirmed, data.recovered, data.deaths, modalChartSelector) 
            // "crearChart()" Usa la funcion para crear el chart con los datos mandados como parametros
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
    } // Funcion para crear un td y agregarle un nodo de texto

    const crearTr = () => {
        return document.createElement("tr") 
    } // Funcion para crear un Tr, luego sera usado mas adelante para ingresarle los td


    const getPaisesTabla = async (jwt) => {
        try {
            tablaAlbumSelector.setAttribute("style", "display: d-block") // La tabla que estaba previamente oculta sera mostrada con los datos
            const response = await fetch(`http://localhost:3000/api/total`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${jwt}`
                    }
                })
            const { data } = await response.json()

            if (data) {
                // En data tenemos un array de objetos, utilizamos esto con un ciclo for para comenzar a crear las tablas por cada uno de esos datos
                for (let i = 0; i < data.length; i++) {
                    // Se utilizan nuestros funciones crearTd y crearTr, junto con la funcion appendChild, para crear la tabla
                    const tr = crearTr()
                    tr.appendChild(crearTd(data[i].location))
                    tr.appendChild(crearTd(data[i].confirmed))
                    tr.appendChild(crearTd(data[i].deaths))
                    tr.appendChild(crearTd(data[i].recovered))
                    tr.appendChild(crearTd(data[i].active))

                    const tdA = crearTd('')
                    const detallesEnlace = document.createElement('button')
                    detallesEnlace.dataset.nombre = data[i].location // Le agregamos a nuestro boton un dataset llamado nombre para guardar el string de location
                    detallesEnlace.addEventListener('click', imprimirDatosPais) // A cada boton le vamos a asignar el evento click y la funcion imprimirDatosPais
                    detallesEnlace.classList.add("btn", "btn-link")

                    const detallesEnlaceTexto = document.createTextNode('Ver detalles')
                    detallesEnlace.appendChild(detallesEnlaceTexto)

                    tdA.appendChild(detallesEnlace)
                    tr.appendChild(tdA)

                    tablaDatosSelector.appendChild(tr)
                }
                // Cada fila de la tabla debe incluir un link que diga "ver detalle", al hacer click levante un modal y
                // Muestre los casos activos, muertos, recuperados y confirmados en un gráfico
                // Desplegar toda la información de la API en una tabla.
            }
        } catch (error) {
            console.log(error)
        }
    }

    const crearChart = (labelPaises, dataChartActive, dataChartConfirmed, dataChartDeaths, dataChartRecovered, lugarImpresion) => {

        const isArray = Array.isArray(labelPaises) // Nos sirve para comprobar si tenemos un array o no
        // En el caso de que no sea un array, devolvemos el valor unico en un array
        // Esto nos permite reutilizar la tabla
        const labels = isArray ? labelPaises : [labelPaises]
        const dataActive = isArray ? dataChartActive : [dataChartActive]
        const dataConfirmed = isArray ? dataChartConfirmed : [dataChartConfirmed]
        const dataDeaths = isArray ? dataChartDeaths : [dataChartDeaths]
        const dataRecovered = isArray ? dataChartRecovered : [dataChartRecovered]

        // Configuracion del chart
        lugarImpresion.innerHTML = "" // Limpiamos el chart antes de crearlo
        const canvas = document.createElement('canvas')
        lugarImpresion.appendChild(canvas)
        const ctx = canvas.getContext('2d')
        const myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Activos',
                    data: dataActive,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }, {
                    label: 'Confirmados',
                    data: dataConfirmed,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)'
                    ,
                    borderWidth: 1
                }, {
                    label: 'Muertes',
                    data: dataDeaths,
                    backgroundColor: 'rgba(255, 206, 86, 0.2)',
                    borderColor: 'rgba(255, 206, 86, 1)',
                    borderWidth: 1
                }, {
                    label: 'Recuperados',
                    data: dataRecovered,
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

    // Si tenemos un token en nuestro local storage, ejecutamos nuestras funciones principales
    const autoIniciar = () => {
        jwt = localStorage.getItem('jwt-token')
        if (jwt) {
            getDatosTotales(jwt)
            getPaisesTabla(jwt)
            loginSelector.setAttribute("style", "display: none")
            logoutSelector.setAttribute("style", "display: block")
        }
        
    }
    autoIniciar()
    // Final funcion IIFE
})()